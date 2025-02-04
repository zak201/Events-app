'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function DatePicker({ selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="input flex items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {selected ? (
          format(selected, 'PPP', { locale: fr })
        ) : (
          <span className="text-gray-500">Sélectionner une date</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onSelect(date);
              setIsOpen(false);
            }}
            locale={fr}
            className="dark:text-white"
          />
        </div>
      )}
    </div>
  );
} 