import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from '@jonmatum/next-shell/providers';
import { AuthProvider } from '@jonmatum/next-shell/auth';
import { createMockAuthAdapter } from '@jonmatum/next-shell/auth/mock';
import './globals.css';

export const metadata: Metadata = {
  title: 'next-shell Example',
  description: 'Living reference implementation for @jonmatum/next-shell',
};

const authAdapter = createMockAuthAdapter({
  user: { id: '1', name: 'Demo User', email: 'demo@example.com', roles: ['admin'] },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders themeProps={{ defaultTheme: 'system', enableSystem: true }}>
          <AuthProvider adapter={authAdapter}>{children}</AuthProvider>
        </AppProviders>
      </body>
    </html>
  );
}
