import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ReservationList from '@/components/ReservationList';

export const metadata = {
  title: 'Mes Réservations | Event Booking',
  description: 'Gérez vos réservations',
};

export default async function ReservationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mes Réservations</h1>
      <ReservationList />
    </div>
  );
} 