'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, MapPin, Users } from 'lucide-react';
import ReservationPDF from './ReservationPDF';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reservations/my-reservations');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des réservations');
        }
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchReservations();
    }
  }, [session]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!reservations || reservations.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Vous n'avez pas encore de réservations.
      </p>
    );
  }

  const handleCancelReservation = async (reservationId) => {
    try {
      if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
        return;
      }

      const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: 'POST'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Mise à jour de l'UI après succès
      setReservations(prevReservations =>
        prevReservations.map(reservation =>
          reservation._id === reservationId
            ? { ...reservation, status: 'cancelled' }
            : reservation
        )
      );
      toast.success('Réservation annulée avec succès');
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'annulation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {reservations?.map((reservation) => (
        <div
          key={reservation._id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {reservation.eventId.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(reservation.eventId.date), 'PPP à HH:mm', { locale: fr })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{reservation.eventId.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{reservation.seats} place(s)</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(reservation.status)}`}>
                {getStatusText(reservation.status)}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Réservé pour</p>
                  <p className="font-medium">
                    {reservation.firstName} {reservation.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reservation.email}
                  </p>
                </div>
                <div className="flex justify-end items-center gap-4">
                  <ReservationPDF 
                    reservation={reservation} 
                    event={reservation.eventId} 
                  />
                  {reservation.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelReservation(reservation._id)}
                      className="btn btn-danger"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 