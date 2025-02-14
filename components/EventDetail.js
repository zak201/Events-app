'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users, Share2, Heart } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import ReservationModal from './ReservationModal';
import { useRouter } from 'next/navigation';

export default function EventDetail({ event, userSession }) {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const availableSeats = event?.capacity - (event?.reservedSeats || 0);
  
  const isOrganizer = userSession?.user?.id === event?.organizerId?.id;

  const isEventPassed = new Date(event.date) < new Date();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erreur lors du partage:', error);
      }
    }
  };

  const handleReserveClick = () => {
    if (!userSession) {
      router.push(`/auth/login?callbackUrl=/events/${event.id}/reserve`);
    } else {
      router.push(`/events/${event.id}/reserve`);
    }
  };

  if (!event) {
    return <div>Événement non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Image de l'événement */}
        <div className="relative h-64 w-full mb-6">
          <Image
            src={event.imageUrl || '/images/default-event.jpg'}
            alt={event.title}
            fill
            className="object-cover rounded-lg"
            onError={(e) => {
              e.target.src = '/images/default-event.jpg';
            }}
          />
        </div>

        {/* Contenu de l'événement */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Share2 className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isLiked ? 'text-red-500' : ''
                }`}
              >
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Informations de l'événement */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span>{availableSeats} places disponibles</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {event.description}
          </p>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            {!isOrganizer && !isEventPassed && (
              <button
                onClick={handleReserveClick}
                disabled={availableSeats === 0 || isEventPassed}
                className="btn btn-primary w-full md:w-auto"
              >
                {isEventPassed ? 'Événement passé' : 
                 availableSeats > 0 ? 'Réserver' : 'Complet'}
              </button>
            )}
            {isOrganizer && (
              <Link href={`/events/${event.id}/edit`} className="btn btn-secondary flex-1">
                Modifier
              </Link>
            )}
          </div>
        </div>

        {/* Informations sur l'organisateur */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Organisateur</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary-700 dark:text-primary-300">
                {event.organizerId?.name?.charAt(0) || 'O'}
              </span>
            </div>
            <div>
              <p className="font-semibold">
                {event.organizerId?.name || 'Organisateur inconnu'}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {event.organizerId?.email || ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        event={event}
      />
    </div>
  );
} 