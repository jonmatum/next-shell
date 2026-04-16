'use client';

import * as React from 'react';
import { ChevronRightIcon } from 'lucide-react';

import { cn } from '@/core/cn';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/primitives/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './sidebar.js';
import type { ResolvedNavItem } from './nav-config.js';

/* ────────────────────────────────────────────────────────────────────────
 * Sub-item (one nesting level)
 * ──────────────────────────────────────────────────────────────────────── */

function NavSubItem({
  item,
  onNavigate,
}: {
  item: ResolvedNavItem;
  onNavigate?: (item: ResolvedNavItem) => void;
}) {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild={Boolean(item.href && !onNavigate)}
        isActive={item.active}
        aria-disabled={item.disabled}
        data-slot="nav-sub-item"
        data-nav-id={item.id}
        onClick={onNavigate ? () => onNavigate(item) : undefined}
      >
        {item.href && !onNavigate ? (
          <a href={item.href}>
            {item.icon}
            <span>{item.label}</span>
          </a>
        ) : (
          <>
            {item.icon}
            <span>{item.label}</span>
          </>
        )}
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Top-level item (collapsible when it has children)
 * ──────────────────────────────────────────────────────────────────────── */

function NavTopItem({
  item,
  onNavigate,
}: {
  item: ResolvedNavItem;
  onNavigate?: (item: ResolvedNavItem) => void;
}) {
  const hasChildren = Boolean(item.children?.length);

  if (hasChildren) {
    return (
      <Collapsible asChild defaultOpen={item.active} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.label}
              isActive={item.active}
              disabled={item.disabled}
              data-slot="nav-item"
              data-nav-id={item.id}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
              <ChevronRightIcon
                className={cn(
                  'ml-auto size-4 transition-transform duration-200',
                  'group-data-[state=open]/collapsible:rotate-90',
                )}
                aria-hidden
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children!.map((child) => (
                <NavSubItem key={child.id} item={child} onNavigate={onNavigate} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild={Boolean(item.href && !onNavigate)}
        tooltip={item.label}
        isActive={item.active}
        disabled={item.disabled}
        data-slot="nav-item"
        data-nav-id={item.id}
        onClick={onNavigate ? () => onNavigate(item) : undefined}
      >
        {item.href && !onNavigate ? (
          <a href={item.href}>
            {item.icon}
            <span>{item.label}</span>
            {item.badge !== undefined && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
          </a>
        ) : (
          <>
            {item.icon}
            <span>{item.label}</span>
            {item.badge !== undefined && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
          </>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Public component
 * ──────────────────────────────────────────────────────────────────────── */

export interface SidebarNavProps {
  /**
   * Resolved nav items from `buildNav()`. Pass the full tree — the component
   * handles nested collapsible groups.
   */
  readonly items: ReadonlyArray<ResolvedNavItem>;
  /**
   * Optional label rendered as a `SidebarGroupLabel` above the menu.
   * Omit for an unlabelled group.
   */
  readonly label?: string;
  /**
   * Override the default anchor-tag navigation. Useful with client-side
   * routers (e.g. `router.push` in Next.js App Router).
   */
  readonly onNavigate?: (item: ResolvedNavItem) => void;
  readonly className?: string;
}

/**
 * Renders a resolved `NavConfig` tree as a collapsible sidebar menu.
 * Compose inside a shadcn `<Sidebar>` element.
 *
 * ```tsx
 * const { items } = buildNav({ config: NAV, pathname });
 * <Sidebar>
 *   <SidebarContent>
 *     <SidebarNav items={items} label="Main" />
 *   </SidebarContent>
 * </Sidebar>
 * ```
 */
export function SidebarNav({ items, label, onNavigate, className }: SidebarNavProps) {
  return (
    <SidebarGroup className={className}>
      {label ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : null}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <NavTopItem key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
