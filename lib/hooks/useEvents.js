'use client';

import { useState, useEffect } from 'react';
import { fetchEvents } from '@/lib/api';

// Hook personnalisé pour la gestion des événements
export function useEvents(page = 1, filters = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchEvents(page, filters);
        setEvents(data.events || []);
        setTotalPages(data.totalPages || 0);
        setError(null);
      } catch (err) {
        setError(err.message);
        setEvents([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [page, JSON.stringify(filters)]);

  return {
    events,
    loading,
    error,
    totalPages,
  };
} 