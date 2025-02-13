'use client';

import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

export default function ReservationSummary({ event, reservationData }) {
  const total = event.price * reservationData.tickets;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">
        Résumé de votre réservation
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h4 className="font-medium">{event.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(event.date)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">{event.price}€ × {reservationData.tickets}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {reservationData.tickets} billet{reservationData.tickets > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total</span>
          <span>{total}€</span>
        </div>
      </div>
    </motion.div>
  );
} 