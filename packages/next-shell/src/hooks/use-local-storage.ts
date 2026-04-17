'use client';

import * as React from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

/**
 * SSR-safe `localStorage` hook. Returns `[storedValue, setValue, removeValue]`.
 * On the server and on first render the `initialValue` is used to avoid
 * hydration mismatches.
 *
 * ```ts
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'system');
 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>, () => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue: SetValue<T> = React.useCallback(
    (value) => {
      setStoredValue((prev) => {
        const resolved = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Quota exceeded or private-mode restriction — silently ignore.
        }
        return resolved;
      });
    },
    [key],
  );

  const removeValue = React.useCallback(() => {
    setStoredValue(initialValue);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
