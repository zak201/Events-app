'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/lib/validations/user';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'utilisateur'
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'inscription');
      }

      router.push('/auth/login');
      toast.success('Compte créé avec succès');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
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
          placeholder="Votre nom"
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
          placeholder="votre@email.com"
        />
        {errors.email && (
          <p className="error">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="label">Mot de passe</label>
        <input
          {...register('password')}
          type="password"
          className="input"
        />
        {errors.password && (
          <p className="error">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="label">Type de compte</label>
        <select
          {...register('role')}
          className="input w-full"
          defaultValue="utilisateur"
        >
          <option value="utilisateur">Utilisateur</option>
          <option value="organisateur">Organisateur</option>
        </select>
        {errors.role && (
          <p className="error">{errors.role.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? 'Inscription...' : 'S\'inscrire'}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Déjà un compte ?{' '}
        <Link
          href="/auth/login"
          className="text-primary-600 hover:text-primary-500"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
} 