'use client';

import * as React from 'react';

export interface HotkeyOptions {
  /** Require the Meta (⌘ / Windows) key. */
  readonly meta?: boolean;
  /** Require the Ctrl key. */
  readonly ctrl?: boolean;
  /** Require the Shift key. */
  readonly shift?: boolean;
  /** Require the Alt / Option key. */
  readonly alt?: boolean;
  /** Call `event.preventDefault()` when the hotkey fires. Default: `true`. */
  readonly preventDefault?: boolean;
  /** Element to attach the listener to. Defaults to `window`. */
  readonly target?: EventTarget | null;
  /** When `false` the listener is not attached. Useful for conditional hotkeys. */
  readonly enabled?: boolean;
}

/**
 * Register a keyboard shortcut. The handler is stable (wrapped in a ref)
 * so it does not cause the listener to be re-registered on every render.
 *
 * ```ts
 * useHotkey('k', openCommandBar, { meta: true });
 * ```
 */
export function useHotkey(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {},
): void {
  const {
    meta = false,
    ctrl = false,
    shift = false,
    alt = false,
    preventDefault = true,
    target,
    enabled = true,
  } = options;

  const handlerRef = React.useRef(handler);
  React.useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  React.useEffect(() => {
    if (!enabled) return undefined;
    const el: EventTarget = target ?? window;

    const onKeyDown = (e: Event) => {
      const event = e as KeyboardEvent;
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (meta && !event.metaKey) return;
      if (ctrl && !event.ctrlKey) return;
      if (shift && !event.shiftKey) return;
      if (alt && !event.altKey) return;
      if (preventDefault) event.preventDefault();
      handlerRef.current(event);
    };

    el.addEventListener('keydown', onKeyDown);
    return () => el.removeEventListener('keydown', onKeyDown);
  }, [key, meta, ctrl, shift, alt, preventDefault, target, enabled]);
}
