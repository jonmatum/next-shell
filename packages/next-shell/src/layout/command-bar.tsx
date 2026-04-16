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

/* ────────────────────────────────────────────────────────────────────────
 * Action contract
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * A single action surfaced in the command bar.
 *
 * Actions are registered imperatively via `useCommandBarActions` — any
 * component in the tree below a `CommandBarProvider` can contribute. The
 * bar filters and groups them; `perform()` is invoked when an item is
 * selected, and the dialog closes automatically unless the action calls
 * `event.preventDefault()` on the provided event.
 */
export interface CommandAction {
  /** Stable identifier. Used as React key + duplicate-registration guard. */
  readonly id: string;
  /** Group heading label. Actions without a group render at the top. */
  readonly group?: string;
  /** Visible label (first-class search term). */
  readonly label: string;
  /** Additional keywords to match against during search. */
  readonly keywords?: ReadonlyArray<string>;
  /** Optional leading icon. */
  readonly icon?: React.ReactNode;
  /** Display-only shortcut hint (e.g. `"⌘S"`). Not wired as a real listener. */
  readonly shortcut?: string;
  /** Optional ordering within the group. Lower = earlier. */
  readonly priority?: number;
  /** Whether the item is disabled. */
  readonly disabled?: boolean;
  /**
   * Invoked when the item is selected. The command bar closes afterwards;
   * call `event.preventDefault()` on the passed event to keep it open
   * (e.g. for multi-step flows).
   */
  readonly perform: (event: { preventDefault: () => void }) => void | Promise<void>;
}

/* ────────────────────────────────────────────────────────────────────────
 * Context + registry
 * ──────────────────────────────────────────────────────────────────────── */

interface CommandBarContextValue {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly toggle: () => void;
  readonly actions: ReadonlyArray<CommandAction>;
  readonly register: (actions: ReadonlyArray<CommandAction>) => () => void;
}

const CommandBarContext = React.createContext<CommandBarContextValue | null>(null);

function useCommandBarContext(): CommandBarContextValue {
  const ctx = React.useContext(CommandBarContext);
  if (!ctx) {
    throw new Error('CommandBar components must be used within a <CommandBarProvider>.');
  }
  return ctx;
}

/**
 * Read the open / toggle surface of the command bar. Throws when used
 * outside a `CommandBarProvider` so misuse fails loudly.
 */
export function useCommandBar(): {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly toggle: () => void;
} {
  const { open, setOpen, toggle } = useCommandBarContext();
  return { open, setOpen, toggle };
}

/**
 * Register a batch of actions for as long as the calling component is
 * mounted. Actions are re-registered whenever the array's reference
 * changes — wrap in `React.useMemo` with a stable dependency list if you
 * need to avoid thrashing.
 */
export function useCommandBarActions(actions: ReadonlyArray<CommandAction>): void {
  const { register } = useCommandBarContext();
  React.useEffect(() => {
    return register(actions);
  }, [register, actions]);
}

/* ────────────────────────────────────────────────────────────────────────
 * Provider
 * ──────────────────────────────────────────────────────────────────────── */

export interface CommandBarProviderProps {
  readonly children: React.ReactNode;
  /**
   * Controlled open state. Uncontrolled when omitted.
   */
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  /**
   * Keyboard shortcut that toggles the bar. Defaults to `'k'` — fires on
   * either `⌘K` (mac) or `Ctrl+K` (other). Set `null` to disable.
   */
  readonly shortcut?: string | null;
}

/**
 * Root provider for the command-bar subsystem. Wrap the app (or a
 * subtree) so descendants can register actions via
 * `useCommandBarActions` and toggle the bar via `useCommandBar`.
 */
export function CommandBarProvider({
  children,
  open: openProp,
  onOpenChange,
  shortcut = 'k',
}: CommandBarProviderProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (openProp === undefined) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [openProp, onOpenChange],
  );

  const toggle = React.useCallback(() => setOpen(!open), [open, setOpen]);

  // Registry: Map<bucketId, Action[]>. Each call to `register` occupies
  // one bucket keyed by an auto-incrementing id; return value unregisters.
  const bucketsRef = React.useRef(new Map<number, ReadonlyArray<CommandAction>>());
  const nextBucketId = React.useRef(0);
  const [actionsVersion, setActionsVersion] = React.useState(0);

  const register = React.useCallback((actions: ReadonlyArray<CommandAction>) => {
    const id = nextBucketId.current++;
    bucketsRef.current.set(id, actions);
    setActionsVersion((v) => v + 1);
    return () => {
      bucketsRef.current.delete(id);
      setActionsVersion((v) => v + 1);
    };
  }, []);

  const actions = React.useMemo<ReadonlyArray<CommandAction>>(() => {
    const flat: CommandAction[] = [];
    const seen = new Set<string>();
    for (const bucket of bucketsRef.current.values()) {
      for (const action of bucket) {
        if (!seen.has(action.id)) {
          seen.add(action.id);
          flat.push(action);
        }
      }
    }
    return flat;
    // actionsVersion intentionally included as dep — bucketsRef is mutable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionsVersion]);

  // Keyboard shortcut.
  React.useEffect(() => {
    if (shortcut === null) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === shortcut.toLowerCase() && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shortcut, toggle]);

  const value = React.useMemo<CommandBarContextValue>(
    () => ({ open, setOpen, toggle, actions, register }),
    [open, setOpen, toggle, actions, register],
  );

  return <CommandBarContext.Provider value={value}>{children}</CommandBarContext.Provider>;
}

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
