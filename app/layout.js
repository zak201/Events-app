import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Event Booking App',
  description: 'Plateforme de réservation d\'événements',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
} 