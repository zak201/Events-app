import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import EventDetail from '@/components/EventDetail';
import Loading from '@/components/Loading';

export async function generateMetadata({ params }) {
  await dbConnect();
  const event = await Event.findById(params.id).populate('organizerId', 'name');
  
  return {
    title: `${event.title} | Events-app`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      images: [event.imageUrl || '/images/default-event.jpg'],
    },
  };
}

export default async function EventPage({ params }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const event = await Event.findById(params.id)
    .populate('organizerId', 'name email')
    .lean();

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Événement non trouvé
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            L'événement que vous recherchez n'existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <EventDetail event={event} userSession={session} />
    </Suspense>
  );
} 