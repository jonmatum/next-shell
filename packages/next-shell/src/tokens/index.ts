/**
 * @jonmatum/next-shell — semantic token contract (TypeScript view)
 *
 * The canonical values live in `src/styles/tokens.css` as CSS custom
 * properties. This module mirrors the contract at the type level so
 * consumers get:
 *   - Literal-union types for every token name (autocomplete + safety)
 *   - A small set of helpers for building brand overrides and inline styles
 *
 * The Tailwind v4 preset at `@jonmatum/next-shell/styles/preset.css` maps
 * every token below to a Tailwind theme key, so a token named `primary`
 * surfaces as `bg-primary`, `text-primary-foreground`, etc.
 *
 * See the Phase 1 issue (#2) for the specification this implements.
 */

/**
 * Version of the token contract. Bump on breaking changes (renamed or
 * removed tokens). Consumers may assert the version at runtime.
 */
export const tokenSchemaVersion = '1.0.0' as const;

/* ────────────────────────────────────────────────────────────────────────
 * Color tokens
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Every semantic color token. Order mirrors `tokens.css` for readability.
 * Each token pairs with a `-foreground` variant where relevant; the
 * foreground is the color to use for text/icons placed on that surface.
 */
export const colorTokens = [
  'background',
  'foreground',

  'surface',
  'surface-foreground',

  'card',
  'card-foreground',

  'popover',
  'popover-foreground',

  'muted',
  'muted-foreground',

  'accent',
  'accent-foreground',

  'primary',
  'primary-foreground',

  'secondary',
  'secondary-foreground',

  'destructive',
  'destructive-foreground',

  'success',
  'success-foreground',

  'warning',
  'warning-foreground',

  'info',
  'info-foreground',

  'border',
  'input',
  'ring',

  'overlay',

  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',

  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
] as const;

export type ColorToken = (typeof colorTokens)[number];

/* ────────────────────────────────────────────────────────────────────────
 * Radius tokens
 * ──────────────────────────────────────────────────────────────────────── */

export const radiusTokens = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;
export type RadiusToken = (typeof radiusTokens)[number];

/* ────────────────────────────────────────────────────────────────────────
 * Typography tokens
 * ──────────────────────────────────────────────────────────────────────── */

export const fontFamilyTokens = ['sans', 'mono', 'display'] as const;
export type FontFamilyToken = (typeof fontFamilyTokens)[number];

export const textSizeTokens = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const;
export type TextSizeToken = (typeof textSizeTokens)[number];

export const leadingTokens = ['tight', 'snug', 'normal', 'relaxed', 'loose'] as const;
export type LeadingToken = (typeof leadingTokens)[number];

export const trackingTokens = ['tight', 'normal', 'wide', 'wider', 'widest'] as const;
export type TrackingToken = (typeof trackingTokens)[number];

/* ────────────────────────────────────────────────────────────────────────
 * Motion tokens
 * ──────────────────────────────────────────────────────────────────────── */

export const durationTokens = ['instant', 'fast', 'normal', 'slow', 'slowest'] as const;
export type DurationToken = (typeof durationTokens)[number];

export const easingTokens = ['standard', 'emphasized', 'decelerate', 'accelerate'] as const;
export type EasingToken = (typeof easingTokens)[number];

/* ────────────────────────────────────────────────────────────────────────
 * Elevation tokens
 * ──────────────────────────────────────────────────────────────────────── */

export const shadowTokens = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export type ShadowToken = (typeof shadowTokens)[number];

/* ────────────────────────────────────────────────────────────────────────
 * Density tokens
 * ──────────────────────────────────────────────────────────────────────── */

export const densityTokens = ['pad-x', 'pad-y', 'gap', 'row-height'] as const;
export type DensityToken = (typeof densityTokens)[number];

/* ────────────────────────────────────────────────────────────────────────
 * Brand overrides
 *
 * Consumer apps can override any token value per theme. The helpers below
 * return `React.CSSProperties`-shaped objects (flat `--var` keys) that can
 * be applied with a `style` prop or rendered as CSS via `brandOverridesCss`.
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Partial token values to override. Use `light` for the default theme,
 * `dark` for the `[data-theme="dark"]` override, and the top-level `radius`
 * scalar if you only want to tweak the base radius.
 */
export interface BrandOverrides {
  /** Overrides applied to `:root` / `[data-theme="light"]`. */
  readonly light?: Partial<Record<ColorToken, string>>;
  /** Overrides applied to `[data-theme="dark"]`. */
  readonly dark?: Partial<Record<ColorToken, string>>;
  /**
   * Base radius value (e.g. `"0.5rem"`). Cascades to every `--radius-*`
   * token since they are expressed as `calc(var(--radius) ± N)`.
   */
  readonly radius?: string;
  /** Primary font family. */
  readonly fontSans?: string;
  /** Monospace font family. */
  readonly fontMono?: string;
  /** Display (headings) font family. */
  readonly fontDisplay?: string;
}

/**
 * Build an inline `style`-compatible object of CSS custom properties for the
 * `:root` selector. Intended for SSR-safe brand application — apply it to
 * the top-level `<html>` or a wrapping element.
 */
export function buildRootOverrides(overrides: BrandOverrides): Record<string, string> {
  const style: Record<string, string> = {};

  if (overrides.radius !== undefined) {
    style['--radius'] = overrides.radius;
  }
  if (overrides.fontSans !== undefined) {
    style['--font-sans'] = overrides.fontSans;
  }
  if (overrides.fontMono !== undefined) {
    style['--font-mono'] = overrides.fontMono;
  }
  if (overrides.fontDisplay !== undefined) {
    style['--font-display'] = overrides.fontDisplay;
  }

  for (const [token, value] of Object.entries(overrides.light ?? {})) {
    if (value !== undefined) {
      style[`--${token}`] = value;
    }
  }

  return style;
}

/**
 * Build a CSS rule string that scopes overrides to both themes. Use when
 * an inline `style` prop is not available (e.g. inject into a `<style>`
 * tag on the server).
 */
export function brandOverridesCss(overrides: BrandOverrides): string {
  const rootLines: string[] = [];

  if (overrides.radius !== undefined) {
    rootLines.push(`--radius: ${overrides.radius};`);
  }
  if (overrides.fontSans !== undefined) {
    rootLines.push(`--font-sans: ${overrides.fontSans};`);
  }
  if (overrides.fontMono !== undefined) {
    rootLines.push(`--font-mono: ${overrides.fontMono};`);
  }
  if (overrides.fontDisplay !== undefined) {
    rootLines.push(`--font-display: ${overrides.fontDisplay};`);
  }
  for (const [token, value] of Object.entries(overrides.light ?? {})) {
    if (value !== undefined) {
      rootLines.push(`--${token}: ${value};`);
    }
  }

  const darkLines: string[] = [];
  for (const [token, value] of Object.entries(overrides.dark ?? {})) {
    if (value !== undefined) {
      darkLines.push(`--${token}: ${value};`);
    }
  }

  const chunks: string[] = [];
  if (rootLines.length > 0) {
    chunks.push(`:root, [data-theme='light'] {\n  ${rootLines.join('\n  ')}\n}`);
  }
  if (darkLines.length > 0) {
    chunks.push(`[data-theme='dark'] {\n  ${darkLines.join('\n  ')}\n}`);
  }
  return chunks.join('\n\n');
}

/**
 * Return the CSS variable reference for a token, e.g. `var(--primary)`.
 * Useful when writing inline styles or CSS-in-JS without risking typos.
 */
export function cssVar(
  token: ColorToken | `radius-${RadiusToken}` | `shadow-${ShadowToken}`,
): string {
  return `var(--${token})`;
}

export { hexToOklch } from './hex-to-oklch.js';

export {
  neutralPreset,
  greenPreset,
  orangePreset,
  redPreset,
  violetPreset,
  presetPalettes,
  type PresetPaletteName,
} from './presets.js';
