'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function ErrorBoundary({
  error,
  reset,
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error.message || 'Désolé, quelque chose s\'est mal passé.'}
        </p>
        <button
          onClick={reset}
          className="btn btn-primary"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
} 