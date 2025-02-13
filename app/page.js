import { Suspense } from 'react';
import EventList from '@/components/EventList';
import Loading from '@/components/Loading';

export const metadata = {
  title: 'Event Booking App',
  description: 'Plateforme de réservation d\'événements'
};

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Découvrez des événements incroyables
          </h1>
          <p className="text-xl mb-8">
            Réservez vos places pour les meilleurs concerts, festivals et spectacles
          </p>
        </div>
      </div>

      {/* Liste des événements */}
      <section className="container mx-auto px-4 py-8">
        <Suspense fallback={<Loading />}>
          <EventList />
        </Suspense>
      </section>
    </div>
  );
} 