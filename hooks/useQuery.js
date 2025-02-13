'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const cache = new Map();

export function useQuery(key, fetcher, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    staleTime = 60000, // 1 minute
    retry = 3,
    onSuccess,
    onError
  } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Vérifier le cache
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < staleTime) {
          setData(cached.data);
          setLoading(false);
          return;
        }

        let attempts = 0;
        let lastError;

        while (attempts < retry) {
          try {
            const result = await fetcher();
            
            // Mettre en cache
            cache.set(key, {
              data: result,
              timestamp: Date.now()
            });

            setData(result);
            setError(null);
            onSuccess?.(result);
            break;
          } catch (err) {
            lastError = err;
            attempts++;
            if (attempts === retry) {
              throw err;
            }
            // Attendre avant de réessayer
            await new Promise(r => setTimeout(r, 1000 * attempts));
          }
        }
      } catch (err) {
        setError(err);
        onError?.(err);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetcher, staleTime, retry, onSuccess, onError]);

  return { data, error, loading };
} 