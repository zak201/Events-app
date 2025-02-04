'use client';

import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import CreateEventModal from './CreateEventModal';
import { useSession } from 'next-auth/react';
import { fetchEvents } from '@/lib/api';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await fetchEvents();
      console.log('Événements chargés:', data);
      setEvents(data);
    } catch (error) {
      console.error('Erreur chargement événements:', error);
      setError('Erreur lors du chargement des événements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Événements à venir</h2>
        {session?.user?.role === 'organisateur' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
          >
            Créer un événement
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Aucun événement à venir
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard
              key={event._id}
              event={event}
            />
          ))}
        </div>
      )}

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
} 