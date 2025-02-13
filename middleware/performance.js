import { NextResponse } from 'next/server';

export async function middleware(request) {
  const response = NextResponse.next();

  // Ajouter les en-têtes de cache
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  
  // Activer la compression Brotli/Gzip
  response.headers.set('Content-Encoding', 'br');

  // Activer les prefetch hints
  response.headers.set(
    'Link',
    '</fonts/Inter-Regular.ttf>; rel=prefetch, </fonts/Inter-Medium.ttf>; rel=prefetch'
  );

  return response;
}

export const config = {
  matcher: [
    '/fonts/:path*',
    '/images/:path*',
    '/_next/static/:path*'
  ]
}; 