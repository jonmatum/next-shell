import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/core/cn';

/**
 * Max-width + horizontal-padding tiers for the main content column.
 *
 * Density-aware padding (CSS variables from the Phase 1 tokens) will land
 * with the AppShell in 4f, where consumers can switch density per-page.
 * Until then these tiers use Tailwind's fixed spacing scale, which
 * resolves through our semantic-token preset anyway.
 */
const contentContainerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[96rem]',
      full: 'max-w-none',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

export interface ContentContainerProps
  extends React.ComponentProps<'div'>, VariantProps<typeof contentContainerVariants> {
  /**
   * Render as a different element via Radix-style `asChild` is not supported
   * here — use the `as` prop for a plain semantic-HTML override.
   */
  readonly as?: 'div' | 'section' | 'main' | 'article';
}

/**
 * Max-width content column for a page body. Centers itself and applies
 * responsive horizontal padding. Renders as a `<div>` by default; use
 * `as="main"` for a Next.js App Router page to get the RSC-friendly
 * main-landmark.
 */
function ContentContainer({ className, size = 'lg', as = 'div', ...props }: ContentContainerProps) {
  const Tag = as;
  return (
    <Tag
      data-slot="content-container"
      data-size={size ?? undefined}
      className={cn(contentContainerVariants({ size }), className)}
      {...props}
    />
  );
}

export { ContentContainer, contentContainerVariants };
