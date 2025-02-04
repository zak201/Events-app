'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationPage({ params }) {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch(`/api/reservations?eventId=${params.id}&email=${session?.user?.email}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        // Prendre la réservation la plus récente
        setReservation(data[0]);
      } catch (error) {
        setError('Erreur lors de la récupération de la réservation');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchReservation();
    }
  }, [params.id, session?.user?.email]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!reservation) return <div>Réservation non trouvée</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Réservation confirmée !
        </h1>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 text-left">
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {reservation.eventId.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {format(new Date(reservation.eventId.date), 'PPP à HH:mm', { locale: fr })}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {reservation.eventId.location}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Réservé pour :</span>{' '}
                {reservation.firstName} {reservation.lastName}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Email :</span> {reservation.email}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Nombre de places :</span> {reservation.seats}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link href="/" className="btn btn-primary">
            Retour à l'accueil
          </Link>
          <Link href={`/events/${params.id}`} className="btn btn-secondary">
            Voir l'événement
          </Link>
        </div>
      </div>
    </div>
  );
} 