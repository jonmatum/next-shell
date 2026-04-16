import * as React from 'react';

import { cn } from '@/core/cn';

export interface TopBarProps extends Omit<React.ComponentProps<'header'>, 'children'> {
  /**
   * Left-anchored slot — typically the brand + breadcrumb.
   */
  readonly left?: React.ReactNode;
  /**
   * Center slot — typically a search input or `CommandBar` trigger.
   * Stretches to fill available horizontal space between `left` and
   * `right`.
   */
  readonly center?: React.ReactNode;
  /**
   * Right-anchored slot — typically the theme toggle, user menu,
   * notifications, etc.
   */
  readonly right?: React.ReactNode;
  /**
   * Sticky positioning at the top of the viewport. Defaults to `true`.
   * Set `false` if the consumer wants to control positioning externally
   * (e.g. from within a scroll container).
   */
  readonly sticky?: boolean;
}

/**
 * App-shell top bar. Renders a `<header>` with three anchored slots:
 * `left` (brand), `center` (search), and `right` (user/theme/menu).
 *
 * Stateless and RSC-safe — the interactive islands (theme toggle, user
 * menu, ⌘K trigger) are rendered as children. Token-driven styling
 * (`bg-background`, `border-border`) keeps the bar consistent across
 * both themes without any raw color literals.
 *
 * Pairs with `ContentContainer` + `Sidebar` (4d) + `AppShell` (4f) to
 * form the complete chrome.
 */
function TopBar({ className, left, center, right, sticky = true, ...props }: TopBarProps) {
  const hasCenter = center !== undefined && center !== null;
  const hasLeft = left !== undefined && left !== null;
  const hasRight = right !== undefined && right !== null;

  return (
    <header
      data-slot="topbar"
      className={cn(
        'bg-background border-border flex h-14 items-center gap-4 border-b px-4 sm:px-6 lg:px-8',
        sticky && 'sticky top-0 z-40',
        className,
      )}
      {...props}
    >
      {hasLeft ? (
        <div data-slot="topbar-left" className="flex min-w-0 shrink-0 items-center gap-2">
          {left}
        </div>
      ) : null}
      {hasCenter ? (
        <div data-slot="topbar-center" className="flex min-w-0 flex-1 items-center justify-center">
          {center}
        </div>
      ) : (
        <div aria-hidden className="flex-1" />
      )}
      {hasRight ? (
        <div data-slot="topbar-right" className="flex min-w-0 shrink-0 items-center gap-2">
          {right}
        </div>
      ) : null}
    </header>
  );
}

export { TopBar };
