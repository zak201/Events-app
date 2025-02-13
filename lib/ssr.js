import { headers } from 'next/headers';
import { getCachedData } from '@/lib/cache';

export async function withSSR(handler, options = {}) {
  const {
    revalidate = false,
    cacheKey,
    headers: customHeaders = {}
  } = options;

  return async function wrappedHandler(context) {
    try {
      // Vérifier si on peut utiliser le cache
      if (cacheKey && !revalidate) {
        const cachedData = await getCachedData(cacheKey, () => handler(context));
        if (cachedData) return cachedData;
      }

      // Exécuter le handler
      const data = await handler(context);

      // Ajouter les en-têtes de cache
      if (!revalidate) {
        context.res?.setHeader('Cache-Control', 's-maxage=31536000');
      }

      // Ajouter les en-têtes personnalisés
      Object.entries(customHeaders).forEach(([key, value]) => {
        context.res?.setHeader(key, value);
      });

      return data;
    } catch (error) {
      console.error('SSR Error:', error);
      throw error;
    }
  };
}

export function getRequestMetadata() {
  const headersList = headers();
  return {
    userAgent: headersList.get('user-agent'),
    acceptLanguage: headersList.get('accept-language'),
    host: headersList.get('host'),
    protocol: headersList.get('x-forwarded-proto'),
  };
} 