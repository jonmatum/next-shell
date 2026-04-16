/**
 * @jonmatum/next-shell
 *
 * Reusable Next.js app shell built on shadcn/ui primitives with a strict
 * semantic-token design system.
 *
 * Prefer subpath imports (`@jonmatum/next-shell/layout`, `/primitives`, etc.)
 * for optimal tree-shaking. This root entry re-exports the most common surface.
 */

export * from './core/index.js';
export { packageVersion } from './core/version.js';
export { tokenSchemaVersion } from './tokens/index.js';
