"use client";

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Use state to prevent the QueryClient from being created and re-rendered on every render
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Optional: Configure how long data should be considered "fresh"
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optional: Add Devtools for debugging, only visible in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}