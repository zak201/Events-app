'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema } from '@/lib/validations/user';
import { updateProfile } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function ProfileForm({ user }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updateProfile(data);
      toast.success('Profil mis à jour');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="label">Nom</label>
        <input
          {...register('name')}
          type="text"
          className="input"
        />
        {errors.name && (
          <p className="error">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="label">Email</label>
        <input
          {...register('email')}
          type="email"
          className="input"
        />
        {errors.email && (
          <p className="error">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
      </button>
    </form>
  );
} 