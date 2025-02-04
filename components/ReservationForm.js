'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ReservationForm({ eventId, userEmail, userName }) {
  const [event, setEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: userName?.split(' ')[0] || '',
      lastName: userName?.split(' ')[1] || '',
      email: userEmail || '',
      seats: '1'
    }
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setEvent(data);
      } catch (error) {
        setError('Erreur lors de la récupération de l\'événement');
        console.error(error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          eventId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      router.push(`/events/${eventId}/confirmation`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return <div>Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Réserver pour {event.title}
        </h2>

        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <p className="font-semibold">Date</p>
              <p>{format(new Date(event.date), 'PPP à HH:mm', { locale: fr })}</p>
            </div>
            <div>
              <p className="font-semibold">Lieu</p>
              <p>{event.location}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 
                         text-red-600 dark:text-red-200 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input
                {...register('firstName', { required: 'Le prénom est requis' })}
                className="form-input"
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="form-error">{errors.firstName.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                {...register('lastName', { required: 'Le nom est requis' })}
                className="form-input"
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="form-error">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              {...register('email', { required: 'L\'email est requis' })}
              className="form-input"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de places</label>
            <input
              type="number"
              {...register('seats', {
                required: 'Le nombre de places est requis',
                min: { value: 1, message: 'Minimum 1 place' }
              })}
              className="form-input"
              disabled={isSubmitting}
            />
            {errors.seats && (
              <p className="form-error">{errors.seats.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Retour
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Réservation en cours...' : 'Confirmer la réservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 