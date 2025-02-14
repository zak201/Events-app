'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/EventCard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function MyEventsPage() {
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

    fetchMyEvents();
  }, [session, status, router]);

  const fetchMyEvents = async () => {
    try {
      const response = await fetch('/api/events/my-events');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setEvents(data);
    } catch (error) {
      setError('Erreur lors de la récupération de vos événements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes événements</h1>
      
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard
              key={event._id}
              event={event}
              onDelete={fetchMyEvents}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Vous n'avez pas encore créé d'événements.
        </p>
      )}
    </div>
  );
} 