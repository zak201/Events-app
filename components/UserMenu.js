'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, Calendar, Settings } from 'lucide-react';

export default function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <User size={20} />
        <span>{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1">
          <Link
            href="/profile"
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} />
            <span>Profil</span>
          </Link>

          <Link
            href="/reservations"
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            <Calendar size={16} />
            <span>Mes réservations</span>
          </Link>

          <button
            onClick={() => signOut()}
            className="menu-item text-red-600 dark:text-red-400"
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      )}
    </div>
  );
} 