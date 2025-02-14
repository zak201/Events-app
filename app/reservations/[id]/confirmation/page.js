import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import { notFound, redirect } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default async function ReservationConfirmationPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/login');
  }

  await dbConnect();
  const reservation = await Reservation.findById(params.id)
    .populate('eventId')
    .lean();

  if (!reservation || reservation.userId.toString() !== session.user.id) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Réservation confirmée !</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Votre réservation a été enregistrée avec succès
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
            <h2 className="text-xl font-semibold mb-4">Détails de la réservation</h2>
            <div className="space-y-2">
              <p><strong>Numéro de réservation :</strong> {reservation._id}</p>
              <p><strong>Événement :</strong> {reservation.eventId.title}</p>
              <p><strong>Date :</strong> {format(new Date(reservation.eventId.date), 'PPP à HH:mm', { locale: fr })}</p>
              <p><strong>Lieu :</strong> {reservation.eventId.location}</p>
              <p><strong>Nombre de places :</strong> {reservation.seats}</p>
            </div>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 py-4">
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <div className="space-y-2">
              <p><strong>Nom :</strong> {reservation.lastName}</p>
              <p><strong>Prénom :</strong> {reservation.firstName}</p>
              <p><strong>Email :</strong> {reservation.email}</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Un email de confirmation a été envoyé à votre adresse email.
              Veuillez le conserver précieusement.
            </p>

            <div className="flex gap-4 justify-center">
              <Link 
                href="/dashboard/reservations" 
                className="btn btn-secondary"
              >
                Mes réservations
              </Link>
              <Link 
                href="/" 
                className="btn btn-primary"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 