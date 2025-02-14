'use client';

import { useState, useRef } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, LogOut, User } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export default function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const isOrganizer = user?.role === 'organisateur';

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <span className="text-sm font-medium">{user?.name}</span>
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{user?.role}</p>
            </div>

            <div className="py-1">
              <Link
                href="/reservations"
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <Calendar className="w-4 h-4" />
                <span>Mes réservations</span>
              </Link>

              {isOrganizer && (
                <Link
                  href="/dashboard/events"
                  className="menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Mes événements</span>
                </Link>
              )}

              <button
                onClick={() => signOut()}
                className="menu-item text-red-600 dark:text-red-400 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 