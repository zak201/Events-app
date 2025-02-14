import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import { notFound, redirect } from 'next/navigation';
import StripeWrapper from '@/components/StripeWrapper';
import { Types } from 'mongoose';

export default async function ReservePage({ params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect(`/auth/login?callbackUrl=/events/${params.id}/reserve`);
  }

  await dbConnect();

  // Vérifier si l'ID est valide
  if (!Types.ObjectId.isValid(params.id)) {
    notFound();
  }

  const event = await Event.findById(params.id)
    .populate('organizerId', 'name email')
    .lean();

  if (!event) {
    notFound();
  }

  // Vérifier si l'événement est complet ou passé
  const isFullyBooked = event.reservedSeats >= event.capacity;
  const isEventPassed = new Date(event.date) < new Date();

  if (isFullyBooked || isEventPassed) {
    redirect(`/events/${params.id}`);
  }

  const serializedEvent = {
    ...event,
    _id: event._id.toString(),
    id: event._id.toString(),
    organizerId: {
      ...event.organizerId,
      _id: event.organizerId._id.toString(),
      id: event.organizerId._id.toString()
    }
  };

  return (
    <div className="container mx-auto py-8">
      <StripeWrapper event={serializedEvent} userSession={session} />
    </div>
  );
} 