'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            EventBooking
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <Link href="/auth/login" className="btn btn-primary">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 