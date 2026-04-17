'use client';

import * as React from 'react';
import { Toaster } from 'sonner';

export interface ToastProviderProps {
  readonly children: React.ReactNode;
  /**
   * Visual position of the toast stack.
   * @default "bottom-right"
   */
  readonly position?: React.ComponentProps<typeof Toaster>['position'];
  /**
   * Pass-through props forwarded to Sonner's `<Toaster>` element.
   * Use to override duration, richColors, expand, etc.
   */
  readonly toasterProps?: Omit<React.ComponentProps<typeof Toaster>, 'position'>;
}

/**
 * Mounts Sonner's `<Toaster>` once for the app. The Toaster is themed
 * via the `theme` prop read from `next-themes` automatically when
 * `ThemeProvider` is an ancestor.
 *
 * Trigger toasts anywhere with Sonner's `toast()` import:
 * ```ts
 * import { toast } from 'sonner';
 * toast.success('Saved!');
 * ```
 */
export function ToastProvider({
  children,
  position = 'bottom-right',
  toasterProps,
}: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster position={position} {...toasterProps} />
    </>
  );
}
