'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations/auth';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await signIn('credentials', {
        ...data,
        redirect: false
      });

      if (result.error) {
        toast.error('Email ou mot de passe incorrect');
        return;
      }

      router.push('/');
      toast.success('Connexion réussie');
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div className="flex items-center justify-between">
        <Link
          href="/auth/register"
          className="text-sm text-primary-600 hover:text-primary-500"
        >
          Créer un compte
        </Link>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-500"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
} 