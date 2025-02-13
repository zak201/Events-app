'use client';

import { useSession } from 'next-auth/react';

export function AuthGuard({ children, requiredRole }) {
  const { data: session, status } = useSession();

  // Ajouter des logs pour déboguer
  console.log('AuthGuard - Session:', session);
  console.log('AuthGuard - Required role:', requiredRole);
  console.log('AuthGuard - User role:', session?.user?.role);

  if (status === 'loading') {
    return <div>Chargement...</div>;
  }

  if (!session || (requiredRole && session.user.role !== requiredRole)) {
    return null;
  }

  return children;
} 