'use client';

import type { ReactNode } from 'react';
import { AppProviders } from '@jonmatum/next-shell/providers';
import { AuthProvider } from '@jonmatum/next-shell/auth';
import { createMockAuthAdapter } from '@jonmatum/next-shell/auth/mock';

const authAdapter = createMockAuthAdapter({
  user: {
    id: '1',
    name: 'Carlos Rivera',
    email: 'carlos@constructpro.com',
    roles: ['admin', 'manager'],
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProviders themeProps={{ defaultTheme: 'system', enableSystem: true }}>
      <AuthProvider adapter={authAdapter}>{children}</AuthProvider>
    </AppProviders>
  );
}
