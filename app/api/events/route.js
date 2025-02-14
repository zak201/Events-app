import { withApiHandler } from '@/lib/api/withHandler';
import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { eventSchema } from '@/lib/validations/event';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

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
    if (!session?.user?.role === 'organisateur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
    const validatedData = eventSchema.parse(body);

    const event = new Event({
      ...validatedData,
      organizerId: session.user.id,
      reservedSeats: 0
    });

    await event.save();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la création de l\'événement' },
      { status: 500 }
    );
  }
} 