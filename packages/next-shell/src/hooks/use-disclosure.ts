'use client';

import * as React from 'react';

export interface UseDisclosureResult {
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
  /** Pass directly to controlled components: `<Dialog open={...} onOpenChange={...}>` */
  readonly onOpenChange: (open: boolean) => void;
}

/**
 * Open / close / toggle primitive. Works as a controlled or uncontrolled
 * state holder for dialogs, drawers, popovers, etc.
 *
 * ```ts
 * const { isOpen, open, close, toggle, onOpenChange } = useDisclosure();
 * ```
 */
export function useDisclosure(initialOpen = false): UseDisclosureResult {
  const [isOpen, setIsOpen] = React.useState(initialOpen);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle, onOpenChange: setIsOpen };
}
