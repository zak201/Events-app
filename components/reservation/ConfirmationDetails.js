'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Users, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import QRCode from 'react-qr-code';
import { toast } from 'react-hot-toast';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ConfirmationDetails({ event, reservation }) {
  const downloadTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${reservation._id}/download`);
      if (!response.ok) throw new Error('Erreur lors du téléchargement');

      // Créer un blob à partir de la réponse
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien temporaire pour le téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `billet-${reservation._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Erreur lors du téléchargement du billet');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <motion.div 
        className="max-w-4xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {/* En-tête de confirmation */}
        <motion.div 
          variants={fadeIn}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Réservation confirmée !
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Un email de confirmation a été envoyé à {reservation.email}
          </p>
        </motion.div>

        {/* Détails de la réservation */}
        <motion.div 
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="relative h-48">
            <Image
              src={event.imageUrl || '/images/default-event.jpg'}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Users className="w-5 h-5" />
                  <span>{reservation.seats} place{reservation.seats > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <QRCode
                  value={`${process.env.NEXT_PUBLIC_APP_URL}/verify-ticket/${reservation._id}`}
                  size={128}
                  className="dark:bg-white p-2 rounded"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          variants={fadeIn}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={downloadTicket}
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Télécharger le billet
          </button>

          <Link
            href="/"
            className="btn btn-secondary"
          >
            Retour à l'accueil
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
} 