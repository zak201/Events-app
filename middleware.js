import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protection des routes organisateur
    if (path.startsWith('/dashboard') && token?.role !== 'organisateur') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Protection des API
    if (path.startsWith('/api/events') && req.method === 'POST') {
      if (token?.role !== 'organisateur') {
        return new NextResponse(
          JSON.stringify({ error: 'Accès non autorisé' }),
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/api/events/:path*']
}; 