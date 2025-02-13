import { rateLimit } from '@/lib/rateLimit';
import { validateInput } from '@/lib/validation';
import { AppError } from '@/lib/error';

export async function securityMiddleware(req, res) {
  try {
    // Rate limiting par IP
    const limiter = await rateLimit(req);
    if (!limiter.success) {
      throw new AppError('Too many requests', 429);
    }

    // Validation des entrées
    const validationResult = validateInput(req.body);
    if (!validationResult.success) {
      throw new AppError('Invalid input', 400, validationResult.errors);
    }

    // Headers de sécurité
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Content-Security-Policy': "default-src 'self'",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };

    Object.entries(securityHeaders).forEach(([header, value]) => {
      res.setHeader(header, value);
    });

  } catch (error) {
    throw error;
  }
} 