'use client';

import { useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import DatePicker from './DatePicker';

export default function EventSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSearch === 'function') {
      onSearch({
        search: searchTerm,
        date: selectedDate
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un événement..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="w-48">
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            placeholderText="Date"
            isClearable
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
} 