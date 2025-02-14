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

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'EventBooking',
  description: 'Réservez vos places pour les meilleurs concerts, festivals et spectacles',
  keywords: 'événements, concerts, festivals, spectacles, réservation, billets',
  authors: [{ name: 'EventBooking' }],
  creator: 'EventBooking',
  publisher: 'EventBooking',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  markPerformance(PERFORMANCE_MARKS.APP_START);

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
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