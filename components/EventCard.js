'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import DeleteEventButton from './DeleteEventButton';
import { useState } from 'react';
import EditEventModal from './EditEventModal';
import { CalendarIcon, MapPinIcon, UsersIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import ReservationModal from './ReservationModal';
import { useRouter } from 'next/navigation';
import LoginPromptModal from './LoginPromptModal';

const EventCard = ({ event }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const isOrganizer = session?.user?.role === 'organisateur';
  const isFullyBooked = event.reservedSeats >= event.capacity;

  // Animation pour l'entrée des cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleReserveClick = () => {
    if (!session) {
      setIsLoginPromptOpen(true);
    } else {
      setIsReservationModalOpen(true);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Image de couverture avec effet de zoom au hover */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={event.imageUrl || '/images/default-event.jpg'}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Contenu de la carte */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            <span>
              {event.capacity - event.reservedSeats} places disponibles
            </span>
          </div>
        </div>

        {/* Bouton Réserver */}
        <button
          onClick={handleReserveClick}
          disabled={isFullyBooked}
          className={`btn w-full ${
            isFullyBooked 
              ? 'btn-disabled' 
              : 'btn-primary'
          }`}
        >
          {isFullyBooked ? 'Complet' : 'Réserver'}
        </button>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
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

      {isLoginPromptOpen && (
        <LoginPromptModal
          isOpen={isLoginPromptOpen}
          onClose={() => setIsLoginPromptOpen(false)}
          onLogin={() => router.push('/auth/login')}
          onSignup={() => router.push('/auth/register')}
        />
      )}
    </motion.div>
  );
};

export default EventCard; 