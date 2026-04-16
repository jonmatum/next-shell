'use client';

import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * `useIsMobile()` — reports whether the viewport is below the mobile
 * breakpoint (767px and below). Subscribes to `matchMedia` so it updates
 * live as the viewport resizes.
 *
 * Returns `false` during SSR (and during the very first client render
 * before the effect runs) to keep the server-rendered HTML deterministic.
 * For a stable first-paint sidebar state, persist the cookie via
 * `@jonmatum/next-shell/layout/server`'s `getSidebarStateFromCookies`
 * and pass it as `defaultOpen` to `SidebarProvider`.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return Boolean(isMobile);
}
