import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ErrorMonitor from '@/components/common/ErrorMonitor';
import PerformanceMetrics from '@/components/common/PerformanceMetrics';
import FontLoader from '@/components/common/FontLoader';
import { markPerformance, PERFORMANCE_MARKS } from '@/lib/metrics';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Event Booking App',
    template: '%s | Event Booking'
  },
  description: 'Plateforme de réservation d\'événements',
};

export default function RootLayout({ children }) {
  markPerformance(PERFORMANCE_MARKS.APP_START);

  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <Suspense fallback={null}>
          <ErrorMonitor />
          <FontLoader />
          <PerformanceMetrics />
        </Suspense>

        <Providers>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>

        <Toaster position="bottom-right" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
} 