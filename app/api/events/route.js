import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { eventSchema } from '@/lib/validations/event';

export async function GET() {
  try {
    await dbConnect();
    console.log('Récupération des événements');
    
    const events = await Event.find({
      date: { $gte: new Date() } // Ne récupérer que les événements futurs
    })
    .sort({ date: 1 })
    .populate('organizerId', 'name')
    .lean();

    console.log('Événements trouvés:', events.length);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Erreur récupération événements:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des événements' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session utilisateur:', session);

    if (!session || session.user.role !== 'organisateur') {
      console.log('Accès non autorisé. Role:', session?.user?.role);
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    const data = await request.json();
    console.log('Données reçues:', data);
    
    const eventData = {
      ...data,
      organizerId: session.user.id,
      reservedSeats: 0
    };
    
    console.log('Données à sauvegarder:', eventData);
    const event = await Event.create(eventData);
    console.log('Événement créé:', event);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Erreur création événement:', error);
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la création de l\'événement' },
      { status: 500 }
    );
  }
} 