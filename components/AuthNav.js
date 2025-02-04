'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AuthNav() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center space-x-4">
      {session ? (
        <>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {session.user.name}
          </span>
          <button
            onClick={() => signOut()}
            className="btn btn-secondary"
          >
            Se déconnecter
          </button>
        </>
      ) : (
        <>
          <Link href="/auth/login" className="btn btn-primary">
            Se connecter
          </Link>
          <Link href="/auth/register" className="btn btn-secondary">
            S'inscrire
          </Link>
        </>
      )}
    </div>
  );
} 