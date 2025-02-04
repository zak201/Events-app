'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cancelReservation } from '@/lib/api';

export default function ReservationCard({ reservation, onCancelled }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const event = reservation.eventId;

  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      await cancelReservation(reservation._id);
      toast.success('Réservation annulée avec succès');
      onCancelled();
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'annulation');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <p className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {formatDate(event.date)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {event.location}
            </p>
            <p className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {reservation.seats} {reservation.seats > 1 ? 'places' : 'place'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm ${
            reservation.status === 'confirmed'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {reservation.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
          </span>

          {reservation.status === 'confirmed' && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="block mt-4 text-red-600 hover:text-red-500 disabled:opacity-50"
            >
              {isCancelling ? 'Annulation...' : 'Annuler'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 