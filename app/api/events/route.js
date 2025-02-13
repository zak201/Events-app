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

export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'organisateur') {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 403 }
    );
  }
  
  try {
    await dbConnect();
    const formData = await req.formData();
    
    const eventData = {
      title: formData.get('title'),
      date: formData.get('date'),
      location: formData.get('location'),
      capacity: Number(formData.get('capacity')),
      description: formData.get('description'),
      organizerId: session.user.id,
      reservedSeats: 0
    };

    const image = formData.get('image');
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }

      const uniqueFilename = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      
      await writeFile(filePath, buffer);
      eventData.imageUrl = `/uploads/${uniqueFilename}`;
    }

    const validatedData = eventSchema.parse(eventData);
    const event = await Event.create(validatedData);

    // Sérialiser le document avant de le renvoyer
    const serializedEvent = serializeDocument(event.toObject());

    return NextResponse.json(serializedEvent, { status: 201 });
  } catch (error) {
    console.error('Erreur création événement:', error);
    return NextResponse.json(
      { 
        message: 'Erreur lors de la création de l\'événement',
        details: error.issues || error.message
      },
      { status: 400 }
    );
  }
} 