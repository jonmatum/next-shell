import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    template: '%s | next-shell',
    default: 'next-shell',
  },
  description:
    'Reusable Next.js app shell built on shadcn/ui primitives with a strict semantic-token design system.',
};
