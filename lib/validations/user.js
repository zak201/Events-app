import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
});

export const userSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z.string()
    .email('Email invalide')
    .toLowerCase(),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['utilisateur', 'organisateur'])
}); 