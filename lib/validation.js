import { z } from 'zod';

const commonValidations = {
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe trop court'),
  name: z.string().min(2, 'Nom trop court').max(50, 'Nom trop long')
};

export const schemas = {
  login: z.object({
    email: commonValidations.email,
    password: commonValidations.password
  }),
  
  register: z.object({
    name: commonValidations.name,
    email: commonValidations.email,
    password: commonValidations.password,
    role: z.enum(['user', 'organizer'])
  }),
  
  event: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10),
    date: z.string().transform(str => new Date(str)),
    location: z.string().min(2),
    capacity: z.number().min(1).max(1000)
  })
};

export function validateInput(data, schema) {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      errors: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    };
  }
} 