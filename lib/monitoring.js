import { captureException } from '@sentry/nextjs';

export const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
  },
  
  error: (error, meta = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      message: error.message,
      stack: error.stack,
      ...meta
    }));
    
    if (process.env.NODE_ENV === 'production') {
      captureException(error, { extra: meta });
    }
  },
  
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...meta }));
  }
};

export const metrics = {
  increment: (name, value = 1, tags = {}) => {
    if (process.env.NODE_ENV === 'production') {
      // Envoyer à un service de métriques
    }
  },
  
  timing: (name, value, tags = {}) => {
    if (process.env.NODE_ENV === 'production') {
      // Envoyer à un service de métriques
    }
  }
}; 