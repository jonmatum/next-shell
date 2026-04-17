'use client';

import * as React from 'react';

/**
 * Returns `true` after the component first mounts (client-only). Safe to
 * use for conditional rendering that must be skipped during SSR.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
