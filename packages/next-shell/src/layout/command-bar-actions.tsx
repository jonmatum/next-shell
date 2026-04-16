'use client';

import * as React from 'react';

import { useCommandBarActions } from './command-bar.js';
import type { NavConfig, ResolvedNavItem } from './nav-config.js';
import { buildNav } from './nav-config.js';

/* ────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────── */

function collectLeaves(
  items: ReadonlyArray<ResolvedNavItem>,
  groupLabel: string | null = null,
): Array<{ item: ResolvedNavItem; group: string | null }> {
  const leaves: Array<{ item: ResolvedNavItem; group: string | null }> = [];
  for (const item of items) {
    if (item.children?.length) {
      // Use this item's label as the group heading for its children.
      leaves.push(...collectLeaves(item.children, item.label));
    } else if (item.href) {
      leaves.push({ item, group: groupLabel });
    }
  }
  return leaves;
}

/* ────────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────────── */

export interface CommandBarActionsProps {
  /**
   * Nav config to surface as command-bar actions. Pass the same config
   * used by `<SidebarNav>` so the palette stays in sync.
   */
  readonly config: NavConfig;
  /**
   * Current pathname — active items can be styled differently in the bar
   * (currently forwarded as metadata only; visual treatment is up to the
   * theme).
   */
  readonly pathname?: string;
  /**
   * Permission keys. Items requiring permissions the user doesn't have are
   * excluded from the palette.
   */
  readonly permissions?: ReadonlyArray<string>;
  /**
   * Called when a nav action is selected in the command bar. Receives the
   * resolved `NavItem`. Default: navigate to `item.href` via `window.location`.
   */
  readonly onNavigate?: (item: ResolvedNavItem) => void;
}

/**
 * Registers nav items from a `NavConfig` as command-bar actions. Mount
 * inside a `CommandBarProvider` (e.g. via `<AppShell commandBar>`).
 *
 * Renders nothing — side-effect only.
 *
 * ```tsx
 * <AppShell commandBar>
 *   <CommandBarActions config={NAV} pathname={pathname} />
 *   {children}
 * </AppShell>
 * ```
 */
export function CommandBarActions({
  config,
  pathname = '/',
  permissions = [],
  onNavigate,
}: CommandBarActionsProps) {
  const { items } = buildNav({ config, pathname, permissions });
  const leaves = collectLeaves(items);

  const actions = React.useMemo(
    () =>
      leaves.map(({ item, group }) => ({
        id: `nav:${item.id}`,
        label: item.label,
        group: group ?? 'Navigation',
        icon: item.icon,
        keywords: item.keywords ? [...item.keywords] : undefined,
        disabled: item.disabled,
        perform: () => {
          if (onNavigate) {
            onNavigate(item);
          } else if (item.href) {
            window.location.href = item.href;
          }
        },
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leaves.length, pathname, permissions.join(',')],
  );

  useCommandBarActions(actions);

  return null;
}
