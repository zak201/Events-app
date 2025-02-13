import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

export async function middleware(request) {
  // Vérifier le rate limiting
  const limiter = await rateLimit(request);
  if (!limiter.success) {
    return new NextResponse(JSON.stringify({
      error: 'Too many requests'
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': limiter.retryAfter
      }
    });
  }

  const response = NextResponse.next();

  // Ajouter les en-têtes CORS
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Ajouter les en-têtes de cache pour les requêtes GET
  if (request.method === 'GET') {
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  }

  return response;
}

export const config = {
  matcher: '/api/:path*'
}; 