'use client';

import * as React from 'react';

import type { AuthAdapter } from './auth-types.js';

export type { AuthAdapter };

const AuthContext = React.createContext<AuthAdapter | null>(null);

export interface AuthProviderProps {
  readonly children: React.ReactNode;
  readonly adapter: AuthAdapter;
}

export function AuthProvider({ children, adapter }: AuthProviderProps) {
  return <AuthContext.Provider value={adapter}>{children}</AuthContext.Provider>;
}

export function useAuthAdapter(): AuthAdapter {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      '[next-shell] useAuthAdapter must be called inside <AuthProvider>. ' +
        'Wrap your app with <AuthProvider adapter={...}>.',
    );
  }
  return ctx;
}
