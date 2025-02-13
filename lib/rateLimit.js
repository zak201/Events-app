import LRUCache from 'lru-cache';

const ratelimitCache = new LRUCache({
  max: 500,
  ttl: 60000 // 1 minute
});

export async function rateLimit(request, options = {}) {
  const {
    limit = 60, // requêtes par minute
    windowMs = 60000, // 1 minute
    keyGenerator = (req) => req.ip || 'anonymous'
  } = options;

  const key = keyGenerator(request);
  const tokenCount = ratelimitCache.get(key) || 0;

  if (tokenCount >= limit) {
    return {
      success: false,
      retryAfter: Math.ceil((windowMs - (Date.now() % windowMs)) / 1000)
    };
  }

  ratelimitCache.set(key, tokenCount + 1);

  return { success: true };
} 