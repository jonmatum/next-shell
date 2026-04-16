'use client';

import * as React from 'react';
import { SearchIcon } from 'lucide-react';

import { cn } from '@/core/cn';
import { Button } from '@/primitives/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/primitives/command';
import { useCommandBarContext } from './command-bar-context.js';
import type { CommandAction } from './command-bar-context.js';

// Re-export everything from context so the public API stays on one import path.
export { CommandBarProvider, useCommandBar, useCommandBarActions } from './command-bar-context.js';
export type { CommandAction, CommandBarProviderProps } from './command-bar-context.js';

/* ────────────────────────────────────────────────────────────────────────
 * Dialog
 * ──────────────────────────────────────────────────────────────────────── */

export interface CommandBarProps {
  /** Label announced to screen readers on the dialog. */
  readonly title?: string;
  /** Description for screen readers. */
  readonly description?: string;
  /** Placeholder for the search input. */
  readonly placeholder?: string;
  /** Content rendered when there are zero matches. */
  readonly emptyState?: React.ReactNode;
}

/**
 * The ⌘K palette. Renders nothing when closed; mounts inside a Radix
 * portal via `CommandDialog` when open. Composes the registered actions,
 * grouped by `action.group`, sorted by `action.priority`.
 */
export function CommandBar({
  title = 'Command palette',
  description = 'Search for an action or navigate.',
  placeholder = 'Type a command or search…',
  emptyState = 'No matching actions.',
}: CommandBarProps = {}) {
  const { open, setOpen, actions } = useCommandBarContext();

  const grouped = React.useMemo(() => {
    const byGroup = new Map<string, CommandAction[]>();
    const NO_GROUP = '__ungrouped__';
    for (const action of actions) {
      const key = action.group ?? NO_GROUP;
      const list = byGroup.get(key) ?? [];
      list.push(action);
      byGroup.set(key, list);
    }
    for (const list of byGroup.values()) {
      list.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    }
    // Ungrouped first, then groups alphabetically.
    const groups: Array<{ readonly name: string | null; readonly items: CommandAction[] }> = [];
    if (byGroup.has(NO_GROUP)) {
      groups.push({ name: null, items: byGroup.get(NO_GROUP)! });
      byGroup.delete(NO_GROUP);
    }
    const sortedKeys = [...byGroup.keys()].sort();
    for (const key of sortedKeys) {
      groups.push({ name: key, items: byGroup.get(key)! });
    }
    return groups;
  }, [actions]);

  const onSelect = React.useCallback(
    (action: CommandAction) => {
      let preventClose = false;
      const syntheticEvent = {
        preventDefault: () => {
          preventClose = true;
        },
      };
      void action.perform(syntheticEvent);
      if (!preventClose) {
        setOpen(false);
      }
    },
    [setOpen],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title={title} description={description}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyState}</CommandEmpty>
        {grouped.map((group, index) => (
          <React.Fragment key={group.name ?? `__ungrouped__:${index}`}>
            {index > 0 ? <CommandSeparator /> : null}
            <CommandGroup heading={group.name ?? undefined}>
              {group.items.map((action) => (
                <CommandItem
                  key={action.id}
                  value={[action.label, ...(action.keywords ?? [])].join(' ')}
                  disabled={action.disabled}
                  onSelect={() => onSelect(action)}
                >
                  {action.icon}
                  <span>{action.label}</span>
                  {action.shortcut !== undefined ? (
                    <CommandShortcut>{action.shortcut}</CommandShortcut>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Trigger
 * ──────────────────────────────────────────────────────────────────────── */

export interface CommandBarTriggerProps extends Omit<
  React.ComponentProps<typeof Button>,
  'children' | 'onClick'
> {
  /**
   * Display label. Defaults to `"Search…"`. Rendered alongside a search
   * icon and the keyboard-shortcut hint.
   */
  readonly label?: string;
  /** Override the shortcut hint text. Defaults to `"⌘K"`. */
  readonly shortcut?: string;
}

/**
 * Button-shaped trigger for the command bar — drop into a `TopBar`
 * `center` slot. Opens the palette on click; the shortcut hint is
 * display-only (the real shortcut is bound by `CommandBarProvider`).
 */
export function CommandBarTrigger({
  label = 'Search…',
  shortcut = '⌘K',
  className,
  variant = 'outline',
  ...props
}: CommandBarTriggerProps) {
  const { toggle } = useCommandBarContext();
  return (
    <Button
      type="button"
      variant={variant}
      data-slot="command-bar-trigger"
      className={cn(
        'text-muted-foreground hover:text-foreground h-9 w-full max-w-sm justify-between gap-2 font-normal',
        className,
      )}
      onClick={toggle}
      {...props}
    >
      <span className="flex items-center gap-2">
        <SearchIcon aria-hidden className="size-4" />
        {label}
      </span>
      <kbd className="bg-muted text-muted-foreground pointer-events-none hidden rounded px-1.5 py-0.5 text-xs font-medium sm:inline-flex">
        {shortcut}
      </kbd>
    </Button>
  );
}
