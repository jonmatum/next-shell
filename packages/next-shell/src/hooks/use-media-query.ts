'use client';

import * as React from 'react';

/**
 * Returns whether a CSS media query matches. SSR-safe: returns `false`
 * on the server and on first render to avoid hydration mismatches.
 *
 * ```ts
 * const isLarge = useMediaQuery('(min-width: 1024px)');
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
