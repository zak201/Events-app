import { LRUCache } from 'lru-cache';

// Créer un cache centralisé réutilisable
/**
 * Configuration du cache global
 * @type {import('lru-cache').LRUCache}
 */
export const globalCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5,
  updateAgeOnGet: true,
  allowStale: true
});

// Exporter des fonctions utilitaires
export function getCached(key) {
  return globalCache.get(key);
}

export function setCached(key, value) {
  globalCache.set(key, value);
}

/**
 * Récupère une donnée du cache avec retry
 * @template T
 * @param {string} key - Clé du cache
 * @param {() => Promise<T>} fetcher - Fonction pour récupérer les données
 * @param {object} options - Options
 * @returns {Promise<T>}
 */
export async function getCachedData(key, fetcher, options = {}) {
  const {
    retries = 3,
    retryDelay = 1000,
    staleWhileRevalidate = true
  } = options;

  // Vérifier le cache
  const cached = globalCache.get(key);
  if (cached && !globalCache.isStale(key)) {
    return cached;
  }

  // Si staleWhileRevalidate est activé, retourner les données périmées
  if (staleWhileRevalidate && cached) {
    revalidateData(key, fetcher, options);
    return cached;
  }

  return retryOperation(() => fetchAndCache(key, fetcher), {
    retries,
    retryDelay
  });
}

async function revalidateData(key, fetcher, options) {
  try {
    const fresh = await fetcher();
    globalCache.set(key, fresh);
  } catch (error) {
    console.error('Revalidation failed:', error);
  }
}

async function retryOperation(operation, { retries, retryDelay }) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      await new Promise(r => setTimeout(r, retryDelay * (attempt + 1)));
    }
  }
  throw lastError;
}

export function invalidateCache(key) {
  if (key) {
    globalCache.delete(key);
  } else {
    globalCache.clear();
  }
}

export function warmupCache(key, data) {
  globalCache.set(key, data);
} 