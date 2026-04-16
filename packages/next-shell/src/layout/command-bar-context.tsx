'use client';

import * as React from 'react';

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

export type ActionGetter = () => ReadonlyArray<CommandAction>;

export interface CommandBarContextValue {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly toggle: () => void;
  readonly actions: ReadonlyArray<CommandAction>;
  readonly register: (getActions: ActionGetter) => () => void;
}

export const CommandBarContext = React.createContext<CommandBarContextValue | null>(null);

export function useCommandBarContext(): CommandBarContextValue {
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
 * mounted. The action list is read via a ref so it stays current on every
 * re-render without re-registering — the effect runs once per mount.
 */
export function useCommandBarActions(actions: ReadonlyArray<CommandAction>): void {
  const { register } = useCommandBarContext();
  const actionsRef = React.useRef(actions);
  actionsRef.current = actions;
  React.useEffect(() => {
    return register(() => actionsRef.current);
  }, [register]);
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
  // Stable toggle for the keyboard listener — avoids re-registering the
  // window event listener on every open/close cycle.
  const toggleRef = React.useRef(toggle);
  React.useLayoutEffect(() => {
    toggleRef.current = toggle;
  });

  // Registry: Map<bucketId, ActionGetter>. Storing getters (not snapshots)
  // means the flattened list always reflects the caller's latest ref value
  // without re-registering on every render.
  const bucketsRef = React.useRef(new Map<number, ActionGetter>());
  const nextBucketId = React.useRef(0);
  const [actionsVersion, setActionsVersion] = React.useState(0);

  const register = React.useCallback((getActions: ActionGetter) => {
    const id = nextBucketId.current++;
    bucketsRef.current.set(id, getActions);
    setActionsVersion((v) => v + 1);
    return () => {
      bucketsRef.current.delete(id);
      setActionsVersion((v) => v + 1);
    };
  }, []);

  const actions = React.useMemo<ReadonlyArray<CommandAction>>(() => {
    const flat: CommandAction[] = [];
    const seen = new Set<string>();
    for (const getActions of bucketsRef.current.values()) {
      for (const action of getActions()) {
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

  // Keyboard shortcut — depends only on `shortcut` so the listener is
  // registered once and never re-added on open/close cycles.
  React.useEffect(() => {
    if (shortcut === null) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === shortcut.toLowerCase() && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shortcut]);

  const value = React.useMemo<CommandBarContextValue>(
    () => ({ open, setOpen, toggle, actions, register }),
    [open, setOpen, toggle, actions, register],
  );

  return <CommandBarContext.Provider value={value}>{children}</CommandBarContext.Provider>;
}
