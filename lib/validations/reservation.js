import { z } from 'zod';

export const reservationSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  seats: z.number()
    .min(1, 'Minimum 1 place')
    .max(10, 'Maximum 10 places par réservation'),
  eventId: z.string(),
  userId: z.string()
});

export const updateReservationSchema = z.object({
  status: z.enum(['confirmed', 'cancelled']),
}); 