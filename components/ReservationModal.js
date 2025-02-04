'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema } from '@/lib/validations/reservation';
import { createReservation } from '@/lib/api';
import Modal from './Modal';
import { toast } from 'react-hot-toast';

export default function ReservationModal({ isOpen, onClose, event }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      eventId: event?._id,
      seats: 1
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await createReservation(data);
      reset();
      onClose();
      toast.success('Réservation effectuée avec succès');
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSeats = event ? event.capacity - event.reservedSeats : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Réserver des places">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Nombre de places</label>
          <input
            {...register('seats', { valueAsNumber: true })}
            type="number"
            min="1"
            max={availableSeats}
            className="input"
          />
          {errors.seats && (
            <p className="error">{errors.seats.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Places disponibles : {availableSeats}
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Réservation...' : 'Réserver'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 