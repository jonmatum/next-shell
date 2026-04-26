'use client';

import { AspectRatio as AspectRatioPrimitive } from 'radix-ui';

/** Accessible aspect ratio container built on Radix UI. @see https://ui.shadcn.com/docs/components/aspect-ratio */
function AspectRatio({ ...props }: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
