'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, User, LogOut, Calendar } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);
  const { data: session, status } = useSession();

  // Fermer le menu au clic à l'extérieur
  useOnClickOutside(menuRef, () => setIsMenuOpen(false));
  useOnClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  // Éviter le rendu des icônes pendant le chargement
  if (status === 'loading') {
    return <div className="h-16"></div>; // Placeholder pendant le chargement
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et navigation principale */}
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">EventBooking</span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {session?.user && (
              <>
                {session.user.role === 'organisateur' && (
                  <Link href="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <Link href="/auth/login" className="btn btn-primary">
                Connexion
              </Link>
            )}

            {/* Menu mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-800 shadow-lg z-40" ref={menuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {session?.user && (
              <>
                {session.user.role === 'organisateur' && (
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 