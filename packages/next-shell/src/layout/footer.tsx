import * as React from 'react';

import { cn } from '@/core/cn';

export type FooterProps = React.ComponentProps<'footer'>;

/**
 * App-shell footer slot. Thin wrapper around `<footer>` with the token
 * border + muted-foreground text color applied by default. Stateless and
 * server-renderable.
 */
function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn(
        'border-border text-muted-foreground mt-auto flex flex-col gap-3 border-t px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8',
        className,
      )}
      {...props}
    />
  );
}

export { Footer };
