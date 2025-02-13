'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userDetailsSchema = z.object({
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide')
});

export default function UserDetails({ value, onChange, onNext, onBack }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: value
  });

  const onSubmit = (data) => {
    onChange(data);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Vos coordonnées</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Prénom
            </label>
            <input
              {...register('firstName')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nom
            </label>
            <input
              {...register('lastName')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Téléphone
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <motion.button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            Retour
          </motion.button>

          <motion.button
            type="submit"
            className="flex-1 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            Continuer
          </motion.button>
        </div>
      </form>
    </div>
  );
} 