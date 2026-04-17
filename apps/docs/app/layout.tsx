import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { RootProvider } from 'fumadocs-ui/provider';
import './globals.css';

const inter = Inter({ variable: '--font-sans', subsets: ['latin'] });
const jetbrains = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'] });
const bigblue = localFont({
  src: [
    { path: '../public/fonts/BigBlueTerminal.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/BigBlueTerminal.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-terminal',
  display: 'swap',
});

export const viewport: Viewport = {
  // eslint-disable-next-line next-shell/no-raw-colors -- viewport meta, not rendered UI
  themeColor: '#0b0f14',
  colorScheme: 'dark',
};

export const metadata = {
  title: {
    template: '%s | next-shell',
    default: 'next-shell',
  },
  description:
    'Reusable Next.js app shell built on shadcn/ui primitives with a strict semantic-token design system.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrains.variable} ${bigblue.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <RootProvider theme={{ forcedTheme: 'dark', enableSystem: false }}>{children}</RootProvider>
      </body>
    </html>
  );
}
