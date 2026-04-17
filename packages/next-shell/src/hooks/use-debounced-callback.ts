'use client';

import * as React from 'react';

/**
 * Returns a debounced version of `callback` that fires only after
 * `delayMs` milliseconds have elapsed since the last invocation.
 * The returned function is stable across renders.
 *
 * ```ts
 * const saveDebounced = useDebouncedCallback(save, 500);
 * ```
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  const callbackRef = React.useRef(callback);
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const debounced = React.useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
    },
    [delayMs],
  );

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  return debounced;
}
