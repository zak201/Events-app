import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères'),
  date: z.string()
    .transform(str => new Date(str))
    .refine(date => date > new Date(), 'La date doit être dans le futur'),
  location: z.string()
    .min(2, 'Le lieu doit contenir au moins 2 caractères'),
  imageUrl: z.string().optional(),
  capacity: z.coerce.number()
    .min(1, 'La capacité minimum est de 1 personne')
    .max(1000, 'La capacité maximum est de 1000 personnes'),
  organizerId: z.string().optional(),
  reservedSeats: z.number().default(0)
});

export const updateEventSchema = eventSchema.partial(); 