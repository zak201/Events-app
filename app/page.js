import { Suspense } from 'react';
import EventList from '@/components/EventList';
import Loading from '@/components/Loading';

export const metadata = {
  title: 'Accueil | Event Booking',
  description: 'Découvrez et réservez vos événements',
};

export default function HomePage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Découvrez nos événements
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Réservez vos places pour les meilleurs événements
        </p>
      </header>

      <Suspense fallback={<Loading />}>
        <EventList />
      </Suspense>
    </div>
  );
} 