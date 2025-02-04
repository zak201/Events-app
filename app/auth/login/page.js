'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError('Une erreur est survenue');
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">
            Connexion
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 
                         text-red-600 dark:text-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>

        <p className="text-center">
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="text-primary-600 hover:text-primary-500">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
} 