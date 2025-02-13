import { LRUCache } from 'lru-cache';

const ratelimitCache = new LRUCache({
  max: 500,
  ttl: 60000 // 1 minute
});

export async function rateLimit(request) {
  const key = request.ip || 'anonymous';
  const tokenCount = ratelimitCache.get(key) || 0;

  if (tokenCount >= 60) {
    return { success: false };
  }

  ratelimitCache.set(key, tokenCount + 1);
  return { success: true };
} 