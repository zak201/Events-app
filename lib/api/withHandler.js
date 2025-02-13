import { AppError } from '@/lib/error';
import { rateLimit } from '@/lib/rateLimit';
import { measurePerformance } from '@/lib/metrics';

export function withApiHandler(handler, options = {}) {
  return async function wrappedHandler(req, res) {
    const startTime = Date.now();

    try {
      // Vérifier le rate limiting
      if (options.rateLimit !== false) {
        const limiter = await rateLimit(req);
        if (!limiter.success) {
          throw new AppError('Too many requests', 429);
        }
      }

      // Valider la méthode HTTP
      if (options.methods && !options.methods.includes(req.method)) {
        throw new AppError(`Method ${req.method} not allowed`, 405);
      }

      // Exécuter le handler
      const result = await handler(req, res);

      // Mesurer la performance
      const duration = Date.now() - startTime;
      console.log(`API ${req.url} took ${duration}ms`);

      return result;
    } catch (error) {
      const errorResponse = handleError(error);
      return Response.json(
        { message: errorResponse.message, errors: errorResponse.errors },
        { status: errorResponse.status }
      );
    }
  };
} 