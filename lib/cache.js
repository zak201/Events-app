import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500, // Nombre maximum d'éléments en cache
  ttl: 1000 * 60 * 5, // Durée de vie de 5 minutes
  updateAgeOnGet: true, // Met à jour l'âge lors de l'accès
});

export async function getCachedData(key, fetcher) {
  const cached = cache.get(key);
  if (cached) return cached;

  const data = await fetcher();
  cache.set(key, data);
  return data;
}

export function invalidateCache(key) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

export function warmupCache(key, data) {
  cache.set(key, data);
} 