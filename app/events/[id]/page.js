import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import EventDetail from '@/components/EventDetail';

export async function generateMetadata({ params }) {
  await dbConnect();
  const event = await Event.findById(params.id).populate('organizerId', 'name');
  return {
    title: `${event.title} | Event Booking`,
    description: event.description
  };
}

export default async function EventPage({ params }) {
  await dbConnect();
  const event = await Event.findById(params.id)
    .populate('organizerId', 'name')
    .lean();

  if (!event) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-500">
          Événement non trouvé
        </h1>
      </div>
    );
  }

  return <EventDetail event={event} />;
} 