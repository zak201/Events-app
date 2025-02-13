'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import EventSearch from './EventSearch';
import CreateEventModal from './CreateEventModal';
import { useSession } from 'next-auth/react';
import { fetchEvents } from '@/lib/api';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur de chargement:', err);
      setError('Impossible de charger les événements. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <EventSearch onSearch={loadEvents} />

      {session?.user?.role === 'organisateur' && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
          >
            Créer un événement
          </button>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {events.map(event => (
          <EventCard
            key={event._id}
            event={event}
            isOrganizer={session?.user?.role === 'organisateur'}
            onDelete={loadEvents}
          />
        ))}
      </motion.div>

      {events.length === 0 && !isLoading && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun événement disponible pour le moment</p>
        </div>
      )}

      {isCreateModalOpen && (
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onEventCreated={() => {
            setIsCreateModalOpen(false);
            loadEvents();
          }}
        />
      )}
    </div>
  );
} 