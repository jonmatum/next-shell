import Link from 'next/link';
import { NotFound } from '@jonmatum/next-shell/layout/server';
import { Button } from '@jonmatum/next-shell/primitives';

export default function NotFoundPage() {
  return (
    <NotFound
      description="The page you are looking for does not exist."
      action={
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      }
    />
  );
}
