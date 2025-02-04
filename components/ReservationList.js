'use client';

import { useEffect, useState } from 'react';
import { fetchUserReservations } from '@/lib/api';
import ReservationCard from './ReservationCard';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchUserReservations();
      setReservations(data);
    } catch (error) {
      setError('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (reservations.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">
          Vous n'avez pas encore de réservations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map(reservation => (
        <ReservationCard
          key={reservation._id}
          reservation={reservation}
          onCancelled={loadReservations}
        />
      ))}
    </div>
  );
} 