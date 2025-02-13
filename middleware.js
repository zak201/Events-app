import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Fonction pour vérifier si la route nécessite une authentification
function requiresAuth(req) {
  const { pathname, method } = req.nextUrl;
  
  // Routes qui nécessitent une authentification
  const protectedRoutes = [
    // POST /api/events (création d'événement) nécessite auth + rôle organisateur
    { path: '/api/events', methods: ['POST', 'PUT', 'DELETE'] },
    // Toutes les routes de réservation nécessitent auth
    { path: '/api/bookings', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
    // Routes du dashboard nécessitent auth + rôle organisateur
    { path: '/dashboard', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
  ];

  return protectedRoutes.some(route => 
    pathname.startsWith(route.path) && 
    (route.methods ? route.methods.includes(method) : true)
  );
}

export default withAuth(
  function middleware(req) {
    // Si la route ne nécessite pas d'authentification, on laisse passer
    if (!requiresAuth(req)) {
      return NextResponse.next();
    }

    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const method = req.method;

    // Protection des routes organisateur
    if (path.startsWith('/dashboard') && token?.role !== 'organisateur') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Protection des API de création/modification d'événements
    if (path.startsWith('/api/events') && ['POST', 'PUT', 'DELETE'].includes(method)) {
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
      authorized: ({ req, token }) => {
        // Si la route ne nécessite pas d'authentification, on autorise
        if (!requiresAuth(req)) {
          return true;
        }
        // Sinon on vérifie le token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/events/:path*',
    '/api/bookings/:path*'
  ]
}; 