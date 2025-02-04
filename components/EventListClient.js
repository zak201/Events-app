'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import EventCard from './EventCard';
import CreateEventModal from './CreateEventModal';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import Pagination from './Pagination';
import { useEvents } from '@/lib/hooks/useEvents';

export default function EventListClient() {
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();
  const { events, loading, error, totalPages } = useEvents(page);

  const isOrganizer = session?.user?.role === 'organisateur';

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {isOrganizer && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
          >
            Créer un événement
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard
            key={event._id}
            event={event}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {isOrganizer && (
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
} 