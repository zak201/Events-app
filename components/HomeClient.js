'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import EventList from './EventList';
import { useRouter, useSearchParams } from 'next/navigation';

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Mettre à jour l'URL avec le terme de recherche
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="/images/hero-bg.jpg"
            alt="Hero background"
            fill
            priority
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="heading-1"
          >
            Découvrez des événements incroyables
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Réservez vos places pour les meilleurs concerts, festivals et spectacles
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-xl mx-auto"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-search pr-12"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
                disabled={isSearching}
              >
                <Search className="h-6 w-6" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Liste des événements */}
      <section className="container mx-auto px-4 mt-16">
        <EventList searchQuery={searchQuery} />
      </section>
    </div>
  );
} 