import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import Event from '@/models/Event';
import TicketVerification from '@/components/tickets/TicketVerification';
import Loading from '@/components/Loading';
import { redirect } from 'next/navigation';

export default async function VerifyTicketPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role === 'organisateur') {
    redirect('/auth/login');
  }

  await dbConnect();
  const reservation = await Reservation.findById(params.id)
    .populate('eventId')
    .populate('userId', 'name email')
    .lean();

  if (!reservation) {
    redirect('/404');
  }

  return (
    <Suspense fallback={<Loading />}>
      <TicketVerification reservation={reservation} />
    </Suspense>
  );
} 