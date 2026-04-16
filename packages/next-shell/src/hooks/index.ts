/**
 * Cross-cutting hooks.
 *
 * Subpath: `@jonmatum/next-shell/hooks`
 *
 * Currently exposes `useIsMobile` (populated in Phase 4d to back the
 * Sidebar's mobile-drawer mode). The broader Phase 8 surface
 * (`useBreakpoint`, `useDisclosure`, `useLocalStorage`, etc.) lands
 * separately.
 */

export { useIsMobile } from './use-mobile.js';
