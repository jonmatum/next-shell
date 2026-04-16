import * as React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/primitives/breadcrumb';

import type { NavConfig } from './nav-config.js';
import { buildNav } from './nav-config.js';
import type { ResolvedNavItem } from './nav-config.js';

export interface BreadcrumbsProps extends Omit<
  React.ComponentProps<typeof Breadcrumb>,
  'children'
> {
  /**
   * Nav config to derive the trail from. Pass the same config used by
   * `<SidebarNav>` so breadcrumbs stay in sync automatically.
   */
  readonly config: NavConfig;
  /**
   * Current pathname. Must match the format used in `NavItem.href` values.
   */
  readonly pathname: string;
  /**
   * Permission keys the current user holds — must match what was passed to
   * `buildNav` so permission-gated items are excluded from the trail.
   */
  readonly permissions?: ReadonlyArray<string>;
  /**
   * Render a link for each ancestor item. Defaults to a plain `<a>` tag;
   * pass a Next.js `<Link>` component via `asChild` or override this to
   * render custom link elements.
   */
  readonly renderLink?: (item: ResolvedNavItem, children: React.ReactNode) => React.ReactNode;
}

/**
 * Derives a breadcrumb trail from a `NavConfig` + current pathname.
 * No state required — re-derive on every render (fast, pure).
 *
 * ```tsx
 * <Breadcrumbs config={NAV} pathname={pathname} />
 * ```
 */
export function Breadcrumbs({
  config,
  pathname,
  permissions = [],
  renderLink,
  ...props
}: BreadcrumbsProps) {
  const { breadcrumbs } = buildNav({ config, pathname, permissions });

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.id}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild={Boolean(renderLink || crumb.href)}>
                    {renderLink ? (
                      renderLink(crumb, crumb.label)
                    ) : crumb.href ? (
                      <a href={crumb.href}>{crumb.label}</a>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
