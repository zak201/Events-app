import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Nom trop court'),
  role: z.enum(['utilisateur', 'organisateur']),
}); 