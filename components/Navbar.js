'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, User, LogOut } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

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
          <div className="flex items-center space-x-4">
            {/* Thème */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Menu utilisateur */}
            {session?.user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="hidden sm:block">{session.user.name}</span>
                  <User className="w-5 h-5" />
                </button>

                {/* Menu déroulant utilisateur */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-[60]">
                    {/* Profil utilisateur */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <User className="w-10 h-10 p-2 bg-gray-100 dark:bg-gray-700 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {session.user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {session.user.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {session.user.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Liens du menu */}
                    <Link
                      href="/dashboard/reservations"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Mes réservations</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="btn btn-primary"
              >
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