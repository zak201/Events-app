'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import DeleteEventButton from './DeleteEventButton';
import { useState } from 'react';
import EditEventModal from './EditEventModal';
import { CalendarIcon, MapPinIcon, UsersIcon, InfoIcon } from 'lucide-react';
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

  const isOwner = session?.user?.id === event.organizerId?.toString();
  const isFullyBooked = event.reservedSeats >= event.capacity;
  const isEventPassed = new Date(event.date) < new Date();

  // Animation pour l'entrée des cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // S'assurer que l'ID est au bon format
  const eventId = event._id?.toString();

  const handleReserveClick = () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/events/${eventId}/reserve`);
    } else {
      router.push(`/events/${eventId}/reserve`);
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    router.refresh();
  };

  return (
    <>
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
              <span>{format(new Date(event.date), 'PPP à HH:mm', { locale: fr })}</span>
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

          {/* Conteneur des boutons avec espacement et tailles uniformes */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Link 
              href={`/events/${eventId}`}
              className="btn btn-secondary flex items-center justify-center gap-2 h-10 px-4"
            >
              <InfoIcon className="w-4 h-4" />
              <span>Détails</span>
            </Link>

            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn btn-secondary flex items-center justify-center gap-2 h-10 px-4"
                >
                  Modifier
                </button>
                <DeleteEventButton 
                  eventId={eventId} 
                  onDelete={() => router.refresh()}
                  className="btn btn-danger flex items-center justify-center gap-2 h-10 px-4"
                />
              </>
            )}

            {!isOwner && (
              <button
                onClick={handleReserveClick}
                disabled={isFullyBooked || isEventPassed}
                className={`btn ${
                  isFullyBooked || isEventPassed
                    ? 'btn-disabled'
                    : 'btn-primary'
                } col-span-2 flex items-center justify-center h-10 px-4`}
              >
                {isFullyBooked 
                  ? 'Complet' 
                  : isEventPassed 
                    ? 'Terminé' 
                    : 'Réserver'}
              </button>
            )}
          </div>
        </div>

        {/* Modal de modification */}
        {isEditModalOpen && (
          <EditEventModal
            event={event}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEventUpdated={() => {
              setIsEditModalOpen(false);
              router.refresh();
            }}
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
    </>
  );
};

export default EventCard; 