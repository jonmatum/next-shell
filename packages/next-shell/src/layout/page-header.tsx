import * as React from 'react';

import { cn } from '@/core/cn';

export interface PageHeaderProps extends Omit<React.ComponentProps<'header'>, 'title'> {
  /**
   * Required page title. Rendered as `<h1>` with the semantic typography
   * scale — override the heading level via `headingAs` if the page needs
   * a different document outline.
   */
  readonly title: React.ReactNode;
  /** Optional short description rendered under the title. */
  readonly description?: React.ReactNode;
  /**
   * Optional breadcrumb / eyebrow slot rendered **above** the title
   * (e.g. a `<Breadcrumb>` from `@jonmatum/next-shell/primitives`).
   */
  readonly breadcrumb?: React.ReactNode;
  /**
   * Optional action slot rendered to the right of the title on desktop,
   * stacked below on mobile (e.g. a "Create" button or a button group).
   */
  readonly actions?: React.ReactNode;
  /** Heading level used for the title. Defaults to `"h1"`. */
  readonly headingAs?: 'h1' | 'h2' | 'h3';
}

/**
 * Standardized page-level heading block. Title is required; everything
 * else is an optional slot. Stateless and server-renderable — safe to
 * use directly in a Next.js Server Component.
 */
function PageHeader({
  className,
  title,
  description,
  breadcrumb,
  actions,
  headingAs: HeadingTag = 'h1',
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        'border-border flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-2">
        {breadcrumb !== undefined && breadcrumb !== null ? (
          <div data-slot="page-header-breadcrumb" className="text-muted-foreground text-sm">
            {breadcrumb}
          </div>
        ) : null}
        <HeadingTag
          data-slot="page-header-title"
          className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {title}
        </HeadingTag>
        {description !== undefined && description !== null ? (
          <p
            data-slot="page-header-description"
            className="text-muted-foreground max-w-prose text-sm sm:text-base"
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions !== undefined && actions !== null ? (
        <div data-slot="page-header-actions" className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

export { PageHeader };
