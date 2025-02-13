import { LRUCache } from 'lru-cache';

export const dateCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 // 1 minute
});

export function getCachedDate(key) {
  return dateCache.get(key);
}

export function setCachedDate(key, value) {
  dateCache.set(key, value);
} 