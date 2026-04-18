'use client';

import './globals.css';
import { InternalServerError } from '@jonmatum/next-shell/layout';
import { Button } from '@jonmatum/next-shell/primitives';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="antialiased">
        <InternalServerError
          description="An unexpected error occurred."
          action={<Button onClick={reset}>Try again</Button>}
        />
      </body>
    </html>
  );
}
