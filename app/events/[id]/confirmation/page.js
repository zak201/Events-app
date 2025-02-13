import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import Reservation from '@/models/Reservation';
import ConfirmationDetails from '@/components/reservation/ConfirmationDetails';
import Loading from '@/components/Loading';
import { redirect } from 'next/navigation';

export default async function ConfirmationPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/login');
  }

  await dbConnect();
  const event = await Event.findById(params.id).lean();
  const reservation = await Reservation.findOne({
    eventId: params.id,
    userId: session.user.id,
    status: 'confirmed'
  })
  .sort({ createdAt: -1 })
  .lean();

  if (!event || !reservation) {
    redirect('/');
  }

  return (
    <Suspense fallback={<Loading />}>
      <ConfirmationDetails 
        event={event}
        reservation={reservation}
      />
    </Suspense>
  );
} 