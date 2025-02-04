'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Mail, User, Calendar, MapPin } from 'lucide-react';

export default function EventReservationsPage({ params }) {
  const [event, setEvent] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'organisateur') {
      router.push('/');
      return;
    }

    fetchEventAndReservations();
  }, [session, status, router, params.id]);

  const fetchEventAndReservations = async () => {
    try {
      // Récupérer les détails de l'événement
      const eventResponse = await fetch(`/api/events/${params.id}`);
      const eventData = await eventResponse.json();
      
      if (!eventResponse.ok) throw new Error(eventData.message);
      setEvent(eventData);

      // Récupérer les réservations
      const reservationsResponse = await fetch(`/api/reservations?eventId=${params.id}`);
      const reservationsData = await reservationsResponse.json();
      
      if (!reservationsResponse.ok) throw new Error(reservationsData.message);
      setReservations(reservationsData);
    } catch (error) {
      setError('Erreur lors de la récupération des données');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Mettre à jour la liste des réservations
      setReservations(reservations.map(reservation => 
        reservation._id === reservationId 
          ? { ...reservation, status: newStatus }
          : reservation
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}/export`);
      if (!response.ok) throw new Error('Erreur lors de l\'export');

      // Créer un blob à partir de la réponse
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien temporaire pour le téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservations-${event.title}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!event) return <div>Événement non trouvé</div>;

  const totalReservations = reservations.length;
  const totalSeats = reservations.reduce((acc, res) => acc + res.seats, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="btn btn-secondary mb-4"
        >
          Retour au tableau de bord
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {event.title}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {format(new Date(event.date), 'PPP à HH:mm', { locale: fr })}
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              {event.location}
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              {totalReservations} réservations ({totalSeats} places)
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Réservations pour {event.title}
          </h1>
          <button
            onClick={handleExport}
            className="btn btn-secondary"
          >
            Exporter en CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Places
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reservations.map((reservation) => (
                <tr key={reservation._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {reservation.firstName} {reservation.lastName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {reservation.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {reservation.seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        reservation.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                    >
                      {reservation.status === 'confirmed' ? 'Confirmée' :
                       reservation.status === 'cancelled' ? 'Annulée' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {reservation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateReservationStatus(reservation._id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => updateReservationStatus(reservation._id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Refuser
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 