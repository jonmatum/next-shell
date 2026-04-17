'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface QueryProviderProps {
  readonly children: React.ReactNode;
  /**
   * Bring your own `QueryClient`. When omitted a client is created once
   * per component mount with sensible defaults:
   * - `staleTime: 60_000` — data stays fresh for 1 min before refetching
   * - `retry: 1` — one automatic retry on network failure
   * - `refetchOnWindowFocus: false` — avoids surprise refetches in dev
   */
  readonly client?: QueryClient;
}

function makeDefaultClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Wraps the subtree with TanStack Query v5's `QueryClientProvider`.
 * Accepts an optional pre-constructed `client` for SSR hydration scenarios
 * (e.g. Next.js 15 server-component pre-fetching with `HydrationBoundary`).
 */
export function QueryProvider({ children, client }: QueryProviderProps) {
  const [queryClient] = React.useState(client ?? makeDefaultClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
