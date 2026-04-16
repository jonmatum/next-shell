'use client';

import { useTheme as useNextTheme } from 'next-themes';

/**
 * All theme values the provider understands. `"system"` defers to the user's
 * OS-level `prefers-color-scheme` preference.
 */
export type ThemeValue = 'light' | 'dark' | 'system';

/**
 * Resolved theme — always concrete (`"light"` or `"dark"`), even when the
 * active preference is `"system"`.
 */
export type ResolvedTheme = Exclude<ThemeValue, 'system'>;

export interface UseThemeResult {
  /** The user's explicit preference, or `undefined` during SSR/first paint. */
  readonly theme: ThemeValue | undefined;
  /** Change the theme and persist it to storage (localStorage by default). */
  readonly setTheme: (theme: ThemeValue) => void;
  /** The concrete theme applied right now (resolves `"system"`). */
  readonly resolvedTheme: ResolvedTheme | undefined;
  /** The current OS-level theme preference, when known. */
  readonly systemTheme: ResolvedTheme | undefined;
  /** Available theme values (always `['light', 'dark', 'system']`). */
  readonly themes: readonly ThemeValue[];
}

/**
 * Typed wrapper around `next-themes`'s `useTheme`.
 *
 * `next-themes` types `theme`, `setTheme`, etc. as `string` so they can
 * support arbitrary custom themes. next-shell only ships `"light"`,
 * `"dark"`, and `"system"`, so we narrow the return type here for better
 * autocomplete in consumer components.
 */
export function useTheme(): UseThemeResult {
  const next = useNextTheme();
  return {
    theme: next.theme as ThemeValue | undefined,
    setTheme: next.setTheme as (theme: ThemeValue) => void,
    resolvedTheme: next.resolvedTheme as ResolvedTheme | undefined,
    systemTheme: next.systemTheme as ResolvedTheme | undefined,
    themes: (next.themes ?? ['light', 'dark', 'system']) as readonly ThemeValue[],
  };
}
