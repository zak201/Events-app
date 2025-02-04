import { z } from 'zod';

export const reservationSchema = z.object({
  eventId: z.string().min(1, 'L\'événement est requis'),
  seats: z.number().min(1, 'Minimum 1 place').max(10, 'Maximum 10 places'),
});

export const updateReservationSchema = z.object({
  status: z.enum(['confirmed', 'cancelled']),
}); 