'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, MapPin, Users, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReservationModal from './ReservationModal';

export default function EventDetail({ event }) {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const { data: session } = useSession();

  const availableSeats = event.capacity - event.reservedSeats;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src={event.imageUrl || 'https://placehold.co/800x400/1a1a1a/ffffff?text=Événement'}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {event.title}
          </h1>

          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {format(new Date(event.date), 'PPP à HH:mm', { locale: fr })}
            </p>

            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {event.location}
            </p>

            <p className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {availableSeats} places disponibles
            </p>

            <p className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Organisé par {event.organizerId.name}
            </p>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Description
              </h2>
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href="/"
              className="btn btn-secondary"
            >
              Retour
            </Link>

            {session && availableSeats > 0 && session.user.id !== event.organizerId._id && (
              <button
                onClick={() => setIsReservationModalOpen(true)}
                className="btn btn-primary"
              >
                Réserver
              </button>
            )}

            {!session && (
              <Link
                href="/auth/login"
                className="btn btn-primary"
              >
                Se connecter pour réserver
              </Link>
            )}
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