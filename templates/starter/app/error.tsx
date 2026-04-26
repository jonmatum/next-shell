'use client';

import { ErrorPage } from '@jonmatum/next-shell/layout';
import { Button } from '@jonmatum/next-shell/primitives';

export default function RootError({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorPage
      statusCode={500}
      title="Something went wrong"
      description="An unexpected error occurred."
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
