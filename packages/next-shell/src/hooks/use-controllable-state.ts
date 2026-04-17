'use client';

import * as React from 'react';

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

type Updater<T> = T | ((prev: T | undefined) => T);

export interface UseControllableStateOptions<T> {
  /** The controlled value. When defined the component is controlled. */
  readonly prop?: T;
  /** Initial value for the uncontrolled case. */
  readonly defaultProp?: T;
  /** Called whenever the value changes (controlled or not). */
  readonly onChange?: (value: T) => void;
}

/**
 * Radix-style controlled/uncontrolled state primitive.
 *
 * ```tsx
 * const [open, setOpen] = useControllableState({
 *   prop: props.open,
 *   defaultProp: props.defaultOpen,
 *   onChange: props.onOpenChange,
 * });
 * ```
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateOptions<T>): [T | undefined, (updater: Updater<T>) => void] {
  const [uncontrolled, setUncontrolled] = React.useState<T | undefined>(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolled;

  const onChangeRef = React.useRef(onChange);
  useIsomorphicLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback(
    (updater: Updater<T>) => {
      const next =
        typeof updater === 'function' ? (updater as (p: T | undefined) => T)(value) : updater;
      if (!isControlled) setUncontrolled(next);
      onChangeRef.current?.(next);
    },
    [isControlled, value],
  );

  return [value, setValue];
}
