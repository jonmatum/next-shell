/**
 * NavConfig — the single source of truth that drives sidebar, breadcrumbs,
 * and command-bar entries.
 *
 * Usage:
 * ```ts
 * const nav: NavConfig = [
 *   { id: 'dashboard', label: 'Dashboard', href: '/', icon: <HomeIcon /> },
 *   { id: 'settings', label: 'Settings', href: '/settings',
 *     requires: 'admin', children: [
 *       { id: 'profile', label: 'Profile', href: '/settings/profile' },
 *     ],
 *   },
 * ];
 * const { items } = buildNav({ config: nav, pathname: '/settings/profile' });
 * ```
 */

import type * as React from 'react';

/* ────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Active-state matching strategy for a nav item.
 * - `"exact"` — href must equal pathname exactly.
 * - `"prefix"` — pathname must start with href.
 * - `RegExp` — applied against pathname.
 *
 * Defaults to `"prefix"` so nested pages remain highlighted.
 */
export type NavMatcher = 'exact' | 'prefix' | RegExp;

/**
 * A single node in the navigation tree. Supports arbitrary nesting; the
 * sidebar collapses sub-trees at the first level, breadcrumbs trace the
 * path from root to the active leaf, and CommandBar surfaces leaf nodes
 * as searchable palette actions.
 */
export interface NavItem {
  /** Stable identifier — used as React key and CommandBar action id. */
  readonly id: string;
  /** Display label. */
  readonly label: string;
  /** Navigation target. Omit for group headings that have no own href. */
  readonly href?: string;
  /** Leading icon — rendered in sidebars and command bar. */
  readonly icon?: React.ReactNode;
  /** Badge text or count rendered in the sidebar menu button. */
  readonly badge?: string | number;
  /** Child items. Rendered as a collapsible sub-menu in the sidebar. */
  readonly children?: NavItem[];
  /**
   * Permission key(s) required to show this item. Omitted from the tree
   * when the consumer's `permissions` array does not include all keys.
   */
  readonly requires?: string | ReadonlyArray<string>;
  /**
   * How pathname matching is performed to determine active state.
   * Defaults to `"prefix"`.
   */
  readonly matcher?: NavMatcher;
  /** Additional keywords surfaced during command-bar fuzzy search. */
  readonly keywords?: ReadonlyArray<string>;
  /** Render the item in a disabled (non-clickable) state. */
  readonly disabled?: boolean;
}

/** Top-level config — an ordered list of root nav items. */
export type NavConfig = ReadonlyArray<NavItem>;

/* ────────────────────────────────────────────────────────────────────────
 * Resolved types (output of buildNav)
 * ──────────────────────────────────────────────────────────────────────── */

export interface ResolvedNavItem extends NavItem {
  /** Whether this item (or any descendant) matches the current pathname. */
  readonly active: boolean;
  /** Recursively resolved children (permission-filtered + active-marked). */
  readonly children?: ResolvedNavItem[];
}

export interface BuildNavResult {
  /** Fully resolved nav tree (permission-filtered, active-marked). */
  readonly items: ResolvedNavItem[];
  /**
   * The path from root → … → current active leaf, in order.
   * Empty when nothing is active. Used by `<Breadcrumbs>`.
   */
  readonly breadcrumbs: ResolvedNavItem[];
}

/* ────────────────────────────────────────────────────────────────────────
 * Active matching
 * ──────────────────────────────────────────────────────────────────────── */

function isActive(item: NavItem, pathname: string): boolean {
  if (!item.href) return false;
  const matcher = item.matcher ?? 'prefix';
  if (matcher === 'exact') return item.href === pathname;
  if (matcher === 'prefix') return pathname === item.href || pathname.startsWith(item.href + '/');
  return matcher.test(pathname);
}

/* ────────────────────────────────────────────────────────────────────────
 * Permission gating
 * ──────────────────────────────────────────────────────────────────────── */

function hasPermission(item: NavItem, permissions: ReadonlyArray<string>): boolean {
  if (!item.requires) return true;
  const required = Array.isArray(item.requires) ? item.requires : [item.requires];
  return (required as string[]).every((p) => permissions.includes(p));
}

/* ────────────────────────────────────────────────────────────────────────
 * Core builder
 * ──────────────────────────────────────────────────────────────────────── */

function resolveItem(
  item: NavItem,
  pathname: string,
  permissions: ReadonlyArray<string>,
): ResolvedNavItem | null {
  if (!hasPermission(item, permissions)) return null;

  const resolvedChildren = item.children
    ? (item.children
        .map((child) => resolveItem(child, pathname, permissions))
        .filter(Boolean) as ResolvedNavItem[])
    : undefined;

  const selfActive = isActive(item, pathname);
  const childActive = resolvedChildren?.some((c) => c.active) ?? false;

  return {
    ...item,
    active: selfActive || childActive,
    children: resolvedChildren?.length ? resolvedChildren : undefined,
  };
}

function collectBreadcrumbs(
  items: ResolvedNavItem[],
  path: ResolvedNavItem[] = [],
): ResolvedNavItem[] {
  for (const item of items) {
    if (item.active) {
      const trail = [...path, item];
      if (item.children) {
        const deeper = collectBreadcrumbs(item.children, trail);
        if (deeper.length > trail.length) return deeper;
      }
      return trail;
    }
  }
  return [];
}

export interface BuildNavOptions {
  readonly config: NavConfig;
  /** Current route pathname. Defaults to `"/"`. */
  readonly pathname?: string;
  /**
   * Permission keys the current user holds. Items with a `requires` field
   * are filtered out when any required key is missing.
   */
  readonly permissions?: ReadonlyArray<string>;
}

/**
 * Resolve a `NavConfig` into an active-marked, permission-filtered tree
 * plus a breadcrumb trail for the current pathname.
 */
export function buildNav({
  config,
  pathname = '/',
  permissions = [],
}: BuildNavOptions): BuildNavResult {
  const items = config
    .map((item) => resolveItem(item, pathname, permissions))
    .filter(Boolean) as ResolvedNavItem[];

  const breadcrumbs = collectBreadcrumbs(items);

  return { items, breadcrumbs };
}
