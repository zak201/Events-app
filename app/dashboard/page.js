'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
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

    fetchEvents();
  }, [session, status, router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setEvents(data.events);
    } catch (error) {
      setError('Erreur lors de la récupération des événements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Événement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Lieu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Réservations
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(event.date), 'PPP', { locale: fr })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                      <Users className="h-4 w-4 mr-2" />
                      0 réservations
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/events/${event._id}`)}
                      className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 mr-4"
                    >
                      Voir
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/events/${event._id}/reservations`)}
                      className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400"
                    >
                      Gérer les réservations
                    </button>
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