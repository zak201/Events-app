'use client';

import { useEffect } from 'react';

export default function ErrorMonitor() {
  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error('Error caught by monitor:', error, errorInfo);
      
      // Envoyer l'erreur à votre service de monitoring
      // Par exemple Sentry, LogRocket, etc.
      if (process.env.NODE_ENV === 'production') {
        // sendErrorToMonitoring(error, errorInfo);
      }
    };

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
} 