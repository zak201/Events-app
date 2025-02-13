import { Suspense } from 'react';
import HomeClient from '@/components/HomeClient';
import Loading from '@/components/Loading';

// Les métadonnées peuvent être exportées ici car c'est un composant serveur
export const metadata = {
  title: 'EventBooking',
  description: 'Plateforme de réservation d\'événements'
};

// Composant serveur par défaut
export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeClient />
    </Suspense>
  );
} 