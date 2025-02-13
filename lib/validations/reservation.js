import { z } from 'zod';

export const reservationSchema = z.object({
  eventId: z.string(),
  seats: z.number().min(1),
  userDetails: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
  }),
  paymentIntentId: z.string().optional()
});

export const updateReservationSchema = z.object({
  status: z.enum(['confirmed', 'cancelled']),
}); 