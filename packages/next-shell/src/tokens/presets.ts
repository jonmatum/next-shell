/**
 * @jonmatum/next-shell — preset color palettes as BrandOverrides objects
 *
 * Each palette provides complete light + dark OKLCH token overrides for
 * primary, accent, destructive, ring, and chart colors. These are the
 * TypeScript counterparts of the CSS files in `src/styles/presets/`.
 *
 * Usage:
 * ```ts
 * import { greenPreset } from '@jonmatum/next-shell/tokens';
 * import { brandOverridesCss } from '@jonmatum/next-shell/tokens';
 *
 * const css = brandOverridesCss(greenPreset);
 * ```
 */

import type { BrandOverrides } from './index.js';

/* ────────────────────────────────────────────────────────────────────────
 * Neutral — gray/slate tones with minimal chroma
 * ──────────────────────────────────────────────────────────────────────── */

export const neutralPreset: BrandOverrides = {
  light: {
    primary: 'oklch(0.35 0.005 265)',
    'primary-foreground': 'oklch(0.985 0 0)',
    accent: 'oklch(0.94 0.003 265)',
    'accent-foreground': 'oklch(0.25 0.005 265)',
    destructive: 'oklch(0.577 0.245 27.325)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: 'oklch(0.35 0.005 265)',
    'chart-1': 'oklch(0.55 0.01 265)',
    'chart-2': 'oklch(0.65 0.01 265)',
    'chart-3': 'oklch(0.45 0.01 265)',
    'chart-4': 'oklch(0.75 0.01 265)',
    'chart-5': 'oklch(0.35 0.01 265)',
  },
  dark: {
    primary: 'oklch(0.75 0.005 265)',
    'primary-foreground': 'oklch(0.13 0.005 265)',
    accent: 'oklch(0.22 0.005 265)',
    'accent-foreground': 'oklch(0.92 0.003 265)',
    destructive: 'oklch(0.704 0.191 22.216)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: 'oklch(0.75 0.005 265)',
    'chart-1': 'oklch(0.75 0.01 265)',
    'chart-2': 'oklch(0.65 0.01 265)',
    'chart-3': 'oklch(0.55 0.01 265)',
    'chart-4': 'oklch(0.85 0.01 265)',
    'chart-5': 'oklch(0.45 0.01 265)',
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────
 * Green — emerald/green tones centered on hue 155
 * ──────────────────────────────────────────────────────────────────────── */

export const greenPreset: BrandOverrides = {
  light: {
    primary: 'oklch(0.55 0.17 155)',
    'primary-foreground': 'oklch(0.985 0 0)',
    accent: 'oklch(0.95 0.025 155)',
    'accent-foreground': 'oklch(0.25 0.04 155)',
    destructive: 'oklch(0.577 0.245 27.325)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: 'oklch(0.55 0.17 155)',
    'chart-1': 'oklch(0.55 0.17 155)',
    'chart-2': 'oklch(0.65 0.14 170)',
    'chart-3': 'oklch(0.45 0.12 140)',
    'chart-4': 'oklch(0.72 0.15 162)',
    'chart-5': 'oklch(0.58 0.13 185)',
  },
  dark: {
    primary: 'oklch(0.65 0.18 155)',
    'primary-foreground': 'oklch(0.985 0 0)',
    accent: 'oklch(0.2 0.03 155)',
    'accent-foreground': 'oklch(0.92 0.02 155)',
    destructive: 'oklch(0.704 0.191 22.216)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: 'oklch(0.65 0.18 155)',
    'chart-1': 'oklch(0.65 0.18 155)',
    'chart-2': 'oklch(0.72 0.14 170)',
    'chart-3': 'oklch(0.55 0.12 140)',
    'chart-4': 'oklch(0.8 0.13 162)',
    'chart-5': 'oklch(0.68 0.13 185)',
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────
 * Orange — amber/orange tones centered on hue 55
 * ──────────────────────────────────────────────────────────────────────── */

export const orangePreset: BrandOverrides = {
  light: {
    primary: 'oklch(0.65 0.18 55)',
    'primary-foreground': 'oklch(0.985 0 0)',
    accent: 'oklch(0.95 0.025 65)',
    'accent-foreground': 'oklch(0.3 0.06 55)',
    destructive: 'oklch(0.577 0.245 27.325)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: 'oklch(0.65 0.18 55)',
    'chart-1': 'oklch(0.65 0.18 55)',
    'chart-2': 'oklch(0.72 0.15 75)',
    'chart-3': 'oklch(0.55 0.16 40)',
    'chart-4': 'oklch(0.78 0.14 85)',
    'chart-5': 'oklch(0.6 0.13 30)',
  },
  dark: {
    primary: 'oklch(0.72 0.17 55)',
    'primary-foreground': 'oklch(0.16 0.025 55)',
    accent: 'oklch(0.22 0.03 55)',
    'accent-foreground': 'oklch(0.92 0.02 65)',
    destructive: 'oklch(0.704 0.191 22.216)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: 'oklch(0.72 0.17 55)',
    'chart-1': 'oklch(0.72 0.17 55)',
    'chart-2': 'oklch(0.78 0.14 75)',
    'chart-3': 'oklch(0.62 0.15 40)',
    'chart-4': 'oklch(0.83 0.12 85)',
    'chart-5': 'oklch(0.68 0.13 30)',
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────
 * Red — rose/red tones centered on hue 15
 * ──────────────────────────────────────────────────────────────────────── */

export const redPreset: BrandOverrides = {
  light: {
    primary: 'oklch(0.55 0.22 15)',
    'primary-foreground': 'oklch(0.985 0 0)',
    accent: 'oklch(0.95 0.02 15)',
    'accent-foreground': 'oklch(0.3 0.06 15)',
    destructive: 'oklch(0.45 0.25 30)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: 'oklch(0.55 0.22 15)',
    'chart-1': 'oklch(0.55 0.22 15)',
    'chart-2': 'oklch(0.65 0.17 355)',
    'chart-3': 'oklch(0.5 0.18 30)',
    'chart-4': 'oklch(0.7 0.15 340)',
    'chart-5': 'oklch(0.6 0.14 45)',
  },
  dark: {
    primary: 'oklch(0.65 0.21 15)',
    'primary-foreground': 'oklch(0.985 0 0)',
    accent: 'oklch(0.2 0.035 15)',
    'accent-foreground': 'oklch(0.92 0.02 15)',
    destructive: 'oklch(0.55 0.23 30)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: 'oklch(0.65 0.21 15)',
    'chart-1': 'oklch(0.65 0.21 15)',
    'chart-2': 'oklch(0.72 0.16 355)',
    'chart-3': 'oklch(0.58 0.17 30)',
    'chart-4': 'oklch(0.78 0.13 340)',
    'chart-5': 'oklch(0.68 0.13 45)',
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────
 * Violet — purple/violet tones centered on hue 295
 * ──────────────────────────────────────────────────────────────────────── */

export const violetPreset: BrandOverrides = {
  light: {
    primary: 'oklch(0.5 0.2 295)',
    'primary-foreground': 'oklch(0.985 0 0)',
    accent: 'oklch(0.95 0.02 295)',
    'accent-foreground': 'oklch(0.25 0.05 295)',
    destructive: 'oklch(0.577 0.245 27.325)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: 'oklch(0.5 0.2 295)',
    'chart-1': 'oklch(0.5 0.2 295)',
    'chart-2': 'oklch(0.6 0.17 275)',
    'chart-3': 'oklch(0.45 0.16 315)',
    'chart-4': 'oklch(0.68 0.15 260)',
    'chart-5': 'oklch(0.55 0.14 330)',
  },
  dark: {
    primary: 'oklch(0.65 0.2 295)',
    'primary-foreground': 'oklch(0.985 0 0)',
    accent: 'oklch(0.2 0.035 295)',
    'accent-foreground': 'oklch(0.92 0.02 295)',
    destructive: 'oklch(0.704 0.191 22.216)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: 'oklch(0.65 0.2 295)',
    'chart-1': 'oklch(0.65 0.2 295)',
    'chart-2': 'oklch(0.72 0.16 275)',
    'chart-3': 'oklch(0.55 0.15 315)',
    'chart-4': 'oklch(0.78 0.14 260)',
    'chart-5': 'oklch(0.62 0.13 330)',
  },
} as const;

/**
 * All preset palettes keyed by name. Useful for dynamic palette selection.
 */
export const presetPalettes = {
  neutral: neutralPreset,
  green: greenPreset,
  orange: orangePreset,
  red: redPreset,
  violet: violetPreset,
} as const;

export type PresetPaletteName = keyof typeof presetPalettes;
