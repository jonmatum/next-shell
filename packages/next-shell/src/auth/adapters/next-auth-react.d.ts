/**
 * Minimal ambient declarations for `next-auth/react`.
 * next-auth is an optional peer dependency — these declarations keep
 * TypeScript happy without installing the package. Consumers who import
 * `@jonmatum/next-shell/auth/nextauth` must install `next-auth >= 5`.
 */
declare module 'next-auth/react' {
  export function useSession(): {
    data: unknown;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };
  export function signIn(provider?: string, options?: Record<string, unknown>): Promise<unknown>;
  export function signOut(options?: Record<string, unknown>): Promise<unknown>;
}
