import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Middleware de vérification de propriété
async function verifyEventOwnership(eventId, userId) {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Événement non trouvé');
  }
  
  if (event.organizerId.toString() !== userId) {
    throw new Error('Non autorisé - vous n\'êtes pas l\'organisateur de cet événement');
  }
  
  return event;
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const event = await Event.findById(params.id)
      .populate('organizerId', 'name email')
      .lean();

    if (!event) {
      return NextResponse.json(
        { message: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de l\'événement' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'organisateur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Récupérer l'événement et vérifier la propriété
    const event = await Event.findById(params.id);
    
    if (!event) {
      return NextResponse.json(
        { message: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est le propriétaire
    if (event.organizerId.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Non autorisé - vous n\'êtes pas l\'organisateur de cet événement' },
        { status: 403 }
      );
    }
    
    // Supprimer l'événement
    await Event.findByIdAndDelete(params.id);
    
    return NextResponse.json({ 
      success: true,
      message: 'Événement supprimé avec succès' 
    });
  } catch (error) {
    console.error('Erreur suppression événement:', error);
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'organisateur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Vérifier la propriété de l'événement
    await verifyEventOwnership(params.id, session.user.id);
    
    const data = await request.json();
    const event = await Event.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la mise à jour' },
      { status: error.message.includes('Non autorisé') ? 403 : 500 }
    );
  }
} 