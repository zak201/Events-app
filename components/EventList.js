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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();

  const loadEvents = async (filters = {}) => {
    try {
      setIsLoading(true);
      const response = await fetchEvents(filters);
      const eventsData = Array.isArray(response) ? response : response?.events || [];
      setEvents(eventsData);
    } catch (err) {
      console.error('Erreur chargement événements:', err);
      setError(err.message || 'Erreur lors du chargement des événements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSearch = (filters) => {
    loadEvents(filters);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8">
      <EventSearch onSearch={handleSearch} />

      {session?.user?.role === 'organisateur' && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
          >
            Créer un événement
          </button>
        </div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {events.map(event => (
          <EventCard
            key={event._id}
            event={event}
            onDelete={() => {
              setEvents(events.filter(e => e._id !== event._id));
            }}
          />
        ))}
      </motion.div>

      {events.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Aucun événement disponible
          </p>
        </div>
      )}

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreated={() => {
          setIsCreateModalOpen(false);
          loadEvents();
        }}
      />
    </div>
  );
} 