import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import ReservationList from '@/components/ReservationList';
import { redirect } from 'next/navigation';

export default async function ReservationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  await dbConnect();
  
  const reservations = await Reservation.find({ userId: session.user.id })
    .populate('eventId')
    .sort({ createdAt: -1 })
    .lean();

  const serializedReservations = reservations.map(reservation => ({
    ...reservation,
    _id: reservation._id.toString(),
    userId: reservation.userId.toString(),
    eventId: reservation.eventId ? {
      ...reservation.eventId,
      _id: reservation.eventId._id?.toString(),
      organizerId: reservation.eventId.organizerId?.toString()
    } : null,
    createdAt: reservation.createdAt?.toISOString(),
    updatedAt: reservation.updatedAt?.toISOString(),
    validatedAt: reservation.validatedAt?.toISOString()
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes réservations</h1>
      <ReservationList reservations={serializedReservations} />
    </div>
  );
} 