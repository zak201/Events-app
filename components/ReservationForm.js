'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema } from '@/lib/validations/reservation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ReservationForm({ event, userSession }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      firstName: userSession?.user?.name?.split(' ')[0] || '',
      lastName: userSession?.user?.name?.split(' ')[1] || '',
      email: userSession?.user?.email || '',
      seats: 1,
      eventId: event.id,
      userId: userSession?.user?.id
    }
  });

  const seats = watch('seats');
  const totalPrice = seats * (event.price || 0);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      router.push(`/reservations/${result._id}/confirmation`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Récapitulatif de l'événement</h2>
        <div className="space-y-2">
          <p><strong>Événement :</strong> {event.title}</p>
          <p><strong>Date :</strong> {format(new Date(event.date), 'PPP à HH:mm', { locale: fr })}</p>
          <p><strong>Lieu :</strong> {event.location}</p>
          <p><strong>Places disponibles :</strong> {event.capacity - event.reservedSeats}</p>
          {event.price > 0 && <p><strong>Prix unitaire :</strong> {event.price}€</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Prénom</label>
            <input
              type="text"
              className="input"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <label className="label">Nom</label>
            <input
              type="text"
              className="input"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="label">Nombre de places</label>
          <input
            type="number"
            className="input"
            min="1"
            max={event.capacity - event.reservedSeats}
            {...register('seats', { valueAsNumber: true })}
          />
          {errors.seats && (
            <p className="text-red-500 text-sm mt-1">{errors.seats.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          {event.price > 0 && (
            <div className="text-lg font-semibold">
              Total : {totalPrice}€
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Réservation en cours...' : 'Confirmer la réservation'}
          </button>
        </div>
      </form>
    </div>
  );
} 