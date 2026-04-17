'use client';

/**
 * Hooks subpath — client-only surface.
 *
 * Subpath: `@jonmatum/next-shell/hooks`
 */

// ── Layout / device ────────────────────────────────────────────────────────
export { useIsMobile } from './use-mobile.js';
export { useMediaQuery } from './use-media-query.js';
export { useBreakpoint } from './use-breakpoint.js';
export type { Breakpoint, UseBreakpointResult } from './use-breakpoint.js';

// ── Lifecycle ──────────────────────────────────────────────────────────────
export { useMounted } from './use-mounted.js';
export { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

// ── State primitives ───────────────────────────────────────────────────────
export { useDisclosure } from './use-disclosure.js';
export type { UseDisclosureResult } from './use-disclosure.js';

export { useControllableState } from './use-controllable-state.js';
export type { UseControllableStateOptions } from './use-controllable-state.js';

// ── Storage ────────────────────────────────────────────────────────────────
export { useLocalStorage } from './use-local-storage.js';
export { useSessionStorage } from './use-session-storage.js';

// ── Async / effects ────────────────────────────────────────────────────────
export { useCopyToClipboard } from './use-copy-to-clipboard.js';
export type { UseCopyToClipboardResult } from './use-copy-to-clipboard.js';

export { useDebouncedValue } from './use-debounced-value.js';
export { useDebouncedCallback } from './use-debounced-callback.js';

// ── Keyboard ───────────────────────────────────────────────────────────────
export { useHotkey } from './use-hotkey.js';
export type { HotkeyOptions } from './use-hotkey.js';

// ── i18n / locale ─────────────────────────────────────────────────────────
export { useLocale } from './use-locale.js';
