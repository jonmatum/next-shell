'use client';

import * as React from 'react';

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 * Avoids the SSR warning while keeping layout-timing semantics where it matters.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
