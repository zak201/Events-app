'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import CreateEventModal from './CreateEventModal';
import { useSession } from 'next-auth/react';
import { fetchEvents } from '@/lib/api';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

export default function EventList({ searchQuery = '' }) {
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

  // Filtrer les événements en fonction de la recherche
  const filteredEvents = events.filter(event => {
    const searchTerms = searchQuery.toLowerCase().trim();
    if (!searchTerms) return true;

    return (
      event.title.toLowerCase().includes(searchTerms) ||
      event.description.toLowerCase().includes(searchTerms) ||
      event.location.toLowerCase().includes(searchTerms) ||
      event.category?.toLowerCase().includes(searchTerms)
    );
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4">
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

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EventCard
                event={event}
                isOrganizer={session?.user?.role === 'organisateur'}
                onDelete={loadEvents}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery 
              ? `Aucun événement ne correspond à "${searchQuery}"`
              : "Aucun événement disponible pour le moment."}
          </p>
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