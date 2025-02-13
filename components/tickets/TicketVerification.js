'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Calendar, MapPin, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TicketVerification({ reservation }) {
  const [isValidated, setIsValidated] = useState(false);
  const [error, setError] = useState('');

  const validateTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${reservation._id}/validate`, {
        method: 'POST'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setIsValidated(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="text-center mb-8">
              {isValidated ? (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              ) : error ? (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              ) : null}

              <h1 className="text-2xl font-bold mb-2">
                {isValidated 
                  ? 'Billet validé !'
                  : error 
                    ? 'Erreur de validation'
                    : 'Vérification du billet'
                }
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {reservation.eventId.title}
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(reservation.eventId.date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-5 h-5" />
                    <span>{reservation.eventId.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <User className="w-5 h-5" />
                    <span>{reservation.userId.name}</span>
                  </div>
                </div>
              </div>

              {!isValidated && !error && (
                <button
                  onClick={validateTicket}
                  className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Valider le billet
                </button>
              )}

              {error && (
                <p className="text-center text-red-500">
                  {error}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 