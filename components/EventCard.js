'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import DeleteEventButton from './DeleteEventButton';
import { useState } from 'react';
import EditEventModal from './EditEventModal';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import ReservationModal from './ReservationModal';

export default function EventCard({ event }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const { data: session } = useSession();

  const isOrganizer = session?.user?.role === 'organisateur';
  const isFullyBooked = event.reservedSeats >= event.capacity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        <Image
          src={event.imageUrl || '/images/default-event.jpg'}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          {formatDate(event.date)}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {event.location}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {event.reservedSeats} / {event.capacity} places
          </span>

          {!isOrganizer && session && (
            <button
              onClick={() => setIsReservationModalOpen(true)}
              disabled={isFullyBooked}
              className={`btn ${
                isFullyBooked 
                  ? 'btn-disabled' 
                  : 'btn-primary hover:btn-primary-dark'
              }`}
            >
              {isFullyBooked ? 'Complet' : 'Réserver'}
            </button>
          )}

          {!session && (
            <Link href="/auth/login" className="btn btn-primary">
              Se connecter pour réserver
            </Link>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href={`/events/${event._id}`}
          className="btn btn-secondary"
        >
          Voir plus
        </Link>
        
        {isOrganizer && (
          <div className="space-x-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="btn btn-secondary"
            >
              Modifier
            </button>
            <DeleteEventButton
              eventId={event._id}
              onDelete={() => window.location.reload()}
            />
          </div>
        )}
      </div>

      {isOrganizer && (
        <EditEventModal
          event={event}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEventUpdated={() => window.location.reload()}
        />
      )}

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        event={event}
      />
    </motion.div>
  );
} 