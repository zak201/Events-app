'use client';

import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

export default function TicketSelection({ event, value, onChange, onNext }) {
  const availableSeats = event.capacity - event.reservedSeats;
  
  const increment = () => {
    if (value < availableSeats && value < 10) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sélectionnez vos billets</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Billet standard</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Accès à l'événement
            </p>
          </div>
          <div className="font-semibold text-xl">
            {event.price}€
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {availableSeats} places disponibles
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={decrement}
              disabled={value <= 1}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="w-8 text-center font-semibold">
              {value}
            </span>
            
            <button
              onClick={increment}
              disabled={value >= availableSeats || value >= 10}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <motion.button
        onClick={onNext}
        className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        Continuer
      </motion.button>
    </div>
  );
} 