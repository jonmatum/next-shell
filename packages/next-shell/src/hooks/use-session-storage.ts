'use client';

import * as React from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

/**
 * SSR-safe `sessionStorage` hook. Same API as `useLocalStorage` but backed
 * by `sessionStorage` (cleared when the tab closes).
 */
export function useSessionStorage<T>(key: string, initialValue: T): [T, SetValue<T>, () => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.sessionStorage.getItem(key);
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
          window.sessionStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // ignore
        }
        return resolved;
      });
    },
    [key],
  );

  const removeValue = React.useCallback(() => {
    setStoredValue(initialValue);
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
