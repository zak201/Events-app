import { withApiHandler } from '@/lib/api/withHandler';
import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { eventSchema } from '@/lib/validations/event';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { uploadImage } from '@/lib/uploadImage';

// Fonction utilitaire pour sérialiser les documents MongoDB
function serializeDocument(doc) {
  const serialized = JSON.parse(JSON.stringify(doc));
  if (serialized._id) {
    serialized.id = serialized._id.toString();
    delete serialized._id;
  }
  return serialized;
}

export async function GET() {
  try {
    await dbConnect();
    
    const events = await Event.find({})
      .sort({ date: 1 })
      .populate('organizerId', 'name email')
      .lean();
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des événements' },
      { status: 500 }
    );
  }
}

// Configuration pour le parsing du multipart/form-data
export const config = {
  api: {
    bodyParser: false
  }
};

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'organisateur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const formData = await request.formData();
    let imageUrl = null;

    // Gestion de l'upload d'image
    const imageFile = formData.get('image');
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error('Erreur upload image:', error);
        return NextResponse.json(
          { message: 'Erreur lors de l\'upload de l\'image' },
          { status: 400 }
        );
      }
    }

    const eventData = {
      title: formData.get('title'),
      date: formData.get('date'),
      location: formData.get('location'),
      capacity: parseInt(formData.get('capacity')),
      description: formData.get('description'),
      imageUrl,
      organizerId: session.user.id,
      reservedSeats: 0
    };

    const event = await Event.create(eventData);

    return NextResponse.json(event);
  } catch (error) {
    console.error('Erreur création événement:', error);
    return NextResponse.json(
      { message: `Erreur lors de la création: ${error.message}` },
      { status: 500 }
    );
  }
} 