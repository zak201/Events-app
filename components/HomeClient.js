'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import EventList from './EventList';

export default function HomeClient() {
  const [searchQuery, setSearchQuery] = useState('');

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
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-search"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
            </div>
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