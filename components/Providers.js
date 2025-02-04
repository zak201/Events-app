'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
} 