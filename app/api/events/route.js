import { withApiHandler } from '@/lib/api/withHandler';
import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
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

export const GET = withApiHandler(async (request) => {
  try {
    await dbConnect();
    
    // Récupérer les paramètres de recherche
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const date = searchParams.get('date');

    // Construire la requête
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: searchDate,
        $lt: nextDay
      };
    }

    // Exécuter la requête
    const events = await Event.find(query)
      .sort({ date: 1 })
      .lean()
      .exec();

    // Sérialiser les documents
    const serializedEvents = events.map(event => ({
      ...event,
      id: event._id.toString(),
      _id: event._id.toString()
    }));

    return NextResponse.json(serializedEvents);
  } catch (error) {
    console.error('Erreur recherche événements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche des événements' },
      { status: 500 }
    );
  }
});

// Configuration pour le parsing du multipart/form-data
export const config = {
  api: {
    bodyParser: false
  }
};

export const POST = withApiHandler(async (request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    const formData = await request.formData();
    
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
}); 