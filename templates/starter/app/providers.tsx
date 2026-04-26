'use client';

import type { ReactNode } from 'react';
import { AppProviders } from '@jonmatum/next-shell/providers';
import { AuthProvider } from '@jonmatum/next-shell/auth';
import { createMockAuthAdapter } from '@jonmatum/next-shell/auth/mock';

/**
 * Mock auth adapter for prototyping.
 * Replace with `createNextAuthAdapter()` from `@jonmatum/next-shell/auth/nextauth`
 * when you're ready to integrate a real identity provider.
 */
const authAdapter = createMockAuthAdapter({
  user: {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    roles: ['admin'],
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProviders themeProps={{ defaultTheme: 'system' }}>
      <AuthProvider adapter={authAdapter}>{children}</AuthProvider>
    </AppProviders>
  );
}
