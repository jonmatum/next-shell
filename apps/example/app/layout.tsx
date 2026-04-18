import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ variable: '--font-sans', subsets: ['latin'] });
const bigblue = localFont({
  src: '../public/fonts/BigBlueTerminal.woff2',
  variable: '--font-terminal',
  display: 'swap',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'next-shell Example',
  description: 'Living reference implementation for @jonmatum/next-shell',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${bigblue.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
