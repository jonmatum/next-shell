/**
 * SSR helpers for TanStack Query + Next.js 15 server components.
 *
 * Pattern:
 * ```tsx
 * // app/page.tsx (server component)
 * import { makeServerQueryClient } from '@jonmatum/next-shell/providers';
 * import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
 *
 * export default async function Page() {
 *   const queryClient = makeServerQueryClient();
 *   await queryClient.prefetchQuery({ queryKey: ['todos'], queryFn: fetchTodos });
 *   return (
 *     <HydrationBoundary state={dehydrate(queryClient)}>
 *       <ClientPage />
 *     </HydrationBoundary>
 *   );
 * }
 * ```
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create a fresh `QueryClient` configured for server-side use:
 * - `staleTime: Infinity` — pre-fetched data is never re-fetched in the
 *   same request
 * - `retry: false` — server errors should surface immediately
 */
export function makeServerQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      },
    },
  });
}
