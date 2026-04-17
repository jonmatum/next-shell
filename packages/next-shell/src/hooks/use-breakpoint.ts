'use client';

import { useMediaQuery } from './use-media-query.js';

/** Tailwind v4 default breakpoints. */
const BREAKPOINTS = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export interface UseBreakpointResult {
  /** Whether the viewport is ≥ 640 px. */
  readonly isSm: boolean;
  /** Whether the viewport is ≥ 768 px. */
  readonly isMd: boolean;
  /** Whether the viewport is ≥ 1024 px. */
  readonly isLg: boolean;
  /** Whether the viewport is ≥ 1280 px. */
  readonly isXl: boolean;
  /** Whether the viewport is ≥ 1536 px. */
  readonly is2xl: boolean;
  /**
   * The largest active breakpoint, or `null` on SSR / below `sm`.
   * Useful for switch-style logic.
   */
  readonly current: Breakpoint | null;
}

export function useBreakpoint(): UseBreakpointResult {
  const isSm = useMediaQuery(BREAKPOINTS.sm);
  const isMd = useMediaQuery(BREAKPOINTS.md);
  const isLg = useMediaQuery(BREAKPOINTS.lg);
  const isXl = useMediaQuery(BREAKPOINTS.xl);
  const is2xl = useMediaQuery(BREAKPOINTS['2xl']);

  let current: Breakpoint | null = null;
  if (is2xl) current = '2xl';
  else if (isXl) current = 'xl';
  else if (isLg) current = 'lg';
  else if (isMd) current = 'md';
  else if (isSm) current = 'sm';

  return { isSm, isMd, isLg, isXl, is2xl, current };
}
