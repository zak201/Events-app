import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import EventDetail from '@/components/EventDetail';
import Loading from '@/components/Loading';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';

export async function generateMetadata({ params }) {
  try {
    await dbConnect();
    
    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return {
        title: 'Événement non trouvé | Events App',
      };
    }

    const event = await Event.findById(params.id).lean();
    
    if (!event) {
      return {
        title: 'Événement non trouvé | Events App',
      };
    }

    return {
      title: `${event.title} | Events App`,
    };
  } catch (error) {
    console.error('Erreur metadata:', error);
    return {
      title: 'Événement | Events App',
    };
  }
}

export default async function EventPage({ params }) {
  try {
    await dbConnect();
    
    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      notFound();
    }

    // Ajouter populate pour récupérer les infos de l'organisateur
    const event = await Event.findById(params.id)
      .populate({
        path: 'organizerId',
        select: 'name email role'
      })
      .lean();

    if (!event) {
      notFound();
    }

    const session = await getServerSession(authOptions);

    // Sérialiser l'événement avec les infos de l'organisateur
    const serializedEvent = {
      ...event,
      _id: event._id.toString(),
      id: event._id.toString(),
      organizerId: event.organizerId ? {
        ...event.organizerId,
        _id: event.organizerId._id.toString(),
        id: event.organizerId._id.toString()
      } : null,
      createdAt: event.createdAt?.toISOString(),
      updatedAt: event.updatedAt?.toISOString(),
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <EventDetail event={serializedEvent} userSession={session} />
      </div>
    );
  } catch (error) {
    console.error('Erreur page événement:', error);
    notFound();
  }
} 