/**
 * @jonmatum/next-shell — Tailwind v4 preset (JS/TS surface)
 *
 * Tailwind v4 uses a CSS-based config via the `@theme` directive, so the
 * primary way to adopt this preset is a CSS `@import`:
 *
 *   @import "tailwindcss";
 *   @import "@jonmatum/next-shell/styles/preset.css";
 *
 * This TypeScript module exists for:
 *   1. Consumers who want to resolve the preset path programmatically (e.g.
 *      to inline the CSS into a build artifact).
 *   2. Documenting the public token surface with types.
 *   3. Future v3 compatibility helpers.
 *
 * See the Phase 1 issue (#2) for the specification.
 */

import { colorTokens, radiusTokens, tokenSchemaVersion } from '../tokens/index.js';
import type { ColorToken, RadiusToken } from '../tokens/index.js';

/**
 * Public import path for the Tailwind v4 preset CSS. Resolvable by any
 * modern bundler or Node.js ESM loader via the package `exports` map.
 */
export const presetCssImportPath = '@jonmatum/next-shell/styles/preset.css' as const;

/**
 * Public import path for the semantic-token CSS only (no Tailwind theme
 * mapping). Useful for consumers who don't use Tailwind.
 */
export const tokensCssImportPath = '@jonmatum/next-shell/styles/tokens.css' as const;

/**
 * Minimal typed description of the preset's public surface. Handy for
 * generating docs or validating overrides.
 */
export interface PresetDescriptor {
  readonly version: typeof tokenSchemaVersion;
  readonly colors: readonly ColorToken[];
  readonly radii: readonly RadiusToken[];
  readonly cssImports: {
    readonly preset: typeof presetCssImportPath;
    readonly tokensOnly: typeof tokensCssImportPath;
  };
}

export const preset: PresetDescriptor = {
  version: tokenSchemaVersion,
  colors: colorTokens,
  radii: radiusTokens,
  cssImports: {
    preset: presetCssImportPath,
    tokensOnly: tokensCssImportPath,
  },
};

export default preset;
