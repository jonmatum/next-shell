#!/usr/bin/env node
/* eslint-disable next-shell/no-raw-colors -- This module generates OKLCH color values by design. */

/**
 * @jonmatum/next-shell — theme generator CLI
 *
 * Takes a brand hex color and generates a complete BrandOverrides object + CSS
 * file. Uses the existing `hexToOklch()` utility for color conversion, then
 * derives a full semantic palette via hue rotation and lightness shifts.
 *
 * Usage:
 *   next-shell-theme --color '#10b981'
 *   next-shell-theme --color '#10b981' --name my-brand --format both
 *
 * Options:
 *   --color   Required. Brand hex color (3- or 6-digit, with or without #).
 *   --name    Optional. Theme name used in output filenames. Defaults to "custom".
 *   --format  Optional. Output format: "css", "json", or "both". Defaults to "both".
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hexToOklch, brandOverridesCss, type BrandOverrides } from '../tokens/index.js';

/* ────────────────────────────────────────────────────────────────────────
 * OKLCH parsing and formatting helpers
 * ──────────────────────────────────────────────────────────────────────── */

export interface OklchComponents {
  L: number;
  C: number;
  H: number;
}

/**
 * Parse an OKLCH CSS string like `oklch(0.627 0.194 163.1)` into numeric
 * components. L is 0-1, C is a positive decimal, H is degrees [0, 360).
 */
export function parseOklch(oklchStr: string): OklchComponents {
  const match = oklchStr.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) {
    throw new Error(`parseOklch: invalid OKLCH string "${oklchStr}"`);
  }
  return {
    L: parseFloat(match[1]!),
    C: parseFloat(match[2]!),
    H: parseFloat(match[3]!),
  };
}

/**
 * Format OKLCH components back into a CSS string. Matches the precision
 * used by `hexToOklch`: L to 3 decimals, C to 3 decimals, H to 1 decimal.
 */
export function formatOklch(components: OklchComponents): string {
  return `oklch(${components.L.toFixed(3)} ${components.C.toFixed(3)} ${components.H.toFixed(1)})`;
}

/**
 * Clamp a number between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Normalize a hue to the [0, 360) range.
 */
function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

/* ────────────────────────────────────────────────────────────────────────
 * OKLCH → sRGB → WCAG luminance (correct pipeline)
 * ──────────────────────────────────────────────────────────────────────── */

/** OKLCH → OKLab: L stays, a = C*cos(H in rad), b = C*sin(H in rad) */
function oklchToOklab(L: number, C: number, H: number) {
  const hRad = (H * Math.PI) / 180;
  return { L, a: C * Math.cos(hRad), b: C * Math.sin(hRad) };
}

/** OKLab → linear sRGB via Ottosson inverse matrices */
function oklabToLinearRGB(L: number, a: number, b: number) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  return {
    R: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    G: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    B: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

/** Linear sRGB → gamma-encoded sRGB */
function linearToSrgb(c: number): number {
  const v = Math.max(0, c);
  if (v <= 0.0031308) return 12.92 * v;
  return 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

/** Gamma-encoded sRGB → linear for WCAG */
function srgbToLinear(c: number): number {
  if (c <= 0.04045) return c / 12.92;
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

/** WCAG 2.1 relative luminance from OKLCH components */
function oklchLuminance(L: number, C: number, H: number): number {
  const lab = oklchToOklab(L, C, H);
  const lin = oklabToLinearRGB(lab.L, lab.a, lab.b);
  const r = Math.max(0, Math.min(1, linearToSrgb(lin.R)));
  const g = Math.max(0, Math.min(1, linearToSrgb(lin.G)));
  const b = Math.max(0, Math.min(1, linearToSrgb(lin.B)));
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** WCAG contrast ratio */
function wcagContrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Binary search for OKLCH L that achieves the target WCAG luminance,
 * keeping C and H constant.
 */
function findLForLuminance(C: number, H: number, targetLum: number): number {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    const lum = oklchLuminance(mid, C, H);
    if (lum < targetLum) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Ensure a background OKLCH color has at least `minRatio`:1 contrast
 * against a given foreground. Adjusts L (darkens) if needed.
 */
function ensureContrast(bg: OklchComponents, fgLum: number, minRatio: number): OklchComponents {
  const bgLum = oklchLuminance(bg.L, bg.C, bg.H);
  const ratio = wcagContrastRatio(fgLum, bgLum);
  if (ratio >= minRatio) return bg;

  // fg is lighter → darken bg: fgLum+0.05 >= minRatio*(bgLum+0.05)
  // bgLum <= (fgLum+0.05)/minRatio - 0.05
  if (fgLum >= bgLum) {
    const maxBgLum = (fgLum + 0.05) / minRatio - 0.05;
    const newL = findLForLuminance(bg.C, bg.H, Math.max(0, maxBgLum));
    return { L: Math.round(newL * 1000) / 1000, C: bg.C, H: bg.H };
  }
  // fg is darker → lighten bg
  const minBgLum = minRatio * (fgLum + 0.05) - 0.05;
  const newL = findLForLuminance(bg.C, bg.H, Math.min(1, minBgLum));
  return { L: Math.round(newL * 1000) / 1000, C: bg.C, H: bg.H };
}

/* ────────────────────────────────────────────────────────────────────────
 * Palette derivation — generate a complete theme from a single brand color
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Derive a complete BrandOverrides from a single hex brand color.
 *
 * The algorithm:
 * - primary: the input color (light: as-is or clamped; dark: lightened)
 * - primary-foreground: white for dark primaries, near-black for light
 * - accent: same hue, reduced chroma, shifted lightness
 * - accent-foreground: contrasting text for accent surface
 * - destructive: hue rotated toward red (~25°), similar L/C
 * - destructive-foreground: white
 * - ring: same as primary
 * - chart-1..5: hue rotations at 0°, 72°, 144°, 216°, 288°
 */
export function generateTheme(hex: string): BrandOverrides {
  const oklchStr = hexToOklch(hex);
  const base = parseOklch(oklchStr);

  return {
    light: generateLightPalette(base),
    dark: generateDarkPalette(base),
  };
}

function generateLightPalette(base: OklchComponents): NonNullable<BrandOverrides['light']> {
  const { C, H } = base;
  const primaryC = clamp(C, 0.05, 0.25);

  // White foreground luminance (oklch 0.985 0 0)
  const whiteFgLum = oklchLuminance(0.985, 0, 0);

  // Start with a reasonable L, then use ensureContrast to guarantee WCAG AA.
  const primaryInitial: OklchComponents = { L: clamp(base.L, 0.35, 0.55), C: primaryC, H };
  const primary = ensureContrast(primaryInitial, whiteFgLum, 4.6);

  const destructiveH = 25;
  const destructiveC = clamp(primaryC * 1.2, 0.15, 0.245);
  const destructiveInitial: OklchComponents = { L: 0.5, C: destructiveC, H: destructiveH };
  const destructive = ensureContrast(destructiveInitial, whiteFgLum, 4.6);

  return {
    primary: formatOklch(primary),
    'primary-foreground': 'oklch(0.985 0 0)',
    accent: formatOklch({ L: 0.95, C: clamp(primaryC * 0.15, 0.005, 0.03), H }),
    'accent-foreground': formatOklch({ L: 0.25, C: clamp(primaryC * 0.25, 0.01, 0.06), H }),
    destructive: formatOklch(destructive),
    'destructive-foreground': 'oklch(0.985 0 0)',
    ring: formatOklch(primary),
    'chart-1': formatOklch({ L: primary.L, C: primaryC, H: normalizeHue(H) }),
    'chart-2': formatOklch({
      L: clamp(primary.L + 0.1, 0.45, 0.75),
      C: clamp(primaryC * 0.85, 0.04, 0.2),
      H: normalizeHue(H + 72),
    }),
    'chart-3': formatOklch({
      L: clamp(primary.L - 0.1, 0.35, 0.6),
      C: clamp(primaryC * 0.75, 0.04, 0.2),
      H: normalizeHue(H + 144),
    }),
    'chart-4': formatOklch({
      L: clamp(primary.L + 0.15, 0.5, 0.8),
      C: clamp(primaryC * 0.8, 0.04, 0.2),
      H: normalizeHue(H + 216),
    }),
    'chart-5': formatOklch({
      L: clamp(primary.L + 0.05, 0.45, 0.7),
      C: clamp(primaryC * 0.7, 0.04, 0.2),
      H: normalizeHue(H + 288),
    }),
  };
}

function generateDarkPalette(base: OklchComponents): NonNullable<BrandOverrides['dark']> {
  const { C, H } = base;
  const primaryC = clamp(C, 0.05, 0.25);

  // Dark mode foreground luminances
  const darkPrimaryFg: OklchComponents = { L: 0.13, C: 0.02, H };
  const darkPrimaryFgLum = oklchLuminance(darkPrimaryFg.L, darkPrimaryFg.C, darkPrimaryFg.H);

  // Start with lightened L, then ensure contrast with dark fg.
  const primaryInitial: OklchComponents = {
    L: clamp(base.L + 0.15, 0.7, 0.85),
    C: primaryC,
    H,
  };
  const primary = ensureContrast(primaryInitial, darkPrimaryFgLum, 4.6);

  const destructiveH = 22;
  const destructiveC = clamp(primaryC * 1.0, 0.12, 0.191);
  const darkDestructiveFg: OklchComponents = { L: 0.13, C: 0.02, H: destructiveH };
  const darkDestructiveFgLum = oklchLuminance(
    darkDestructiveFg.L,
    darkDestructiveFg.C,
    darkDestructiveFg.H,
  );
  const destructiveInitial: OklchComponents = { L: 0.75, C: destructiveC, H: destructiveH };
  const destructive = ensureContrast(destructiveInitial, darkDestructiveFgLum, 4.6);

  return {
    primary: formatOklch(primary),
    'primary-foreground': formatOklch(darkPrimaryFg),
    accent: formatOklch({ L: 0.2, C: clamp(primaryC * 0.18, 0.005, 0.04), H }),
    'accent-foreground': formatOklch({ L: 0.92, C: clamp(primaryC * 0.12, 0.005, 0.03), H }),
    destructive: formatOklch(destructive),
    'destructive-foreground': formatOklch(darkDestructiveFg),
    ring: formatOklch(primary),
    'chart-1': formatOklch({ L: primary.L, C: primaryC, H: normalizeHue(H) }),
    'chart-2': formatOklch({
      L: clamp(primary.L + 0.05, 0.7, 0.85),
      C: clamp(primaryC * 0.8, 0.04, 0.18),
      H: normalizeHue(H + 72),
    }),
    'chart-3': formatOklch({
      L: clamp(primary.L - 0.15, 0.5, 0.7),
      C: clamp(primaryC * 0.7, 0.04, 0.18),
      H: normalizeHue(H + 144),
    }),
    'chart-4': formatOklch({
      L: clamp(primary.L + 0.1, 0.75, 0.9),
      C: clamp(primaryC * 0.75, 0.04, 0.18),
      H: normalizeHue(H + 216),
    }),
    'chart-5': formatOklch({
      L: clamp(primary.L + 0.02, 0.65, 0.8),
      C: clamp(primaryC * 0.65, 0.04, 0.18),
      H: normalizeHue(H + 288),
    }),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * CSS output — generates a standalone CSS file like the preset files
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Build a CSS preset file from a BrandOverrides and a theme name.
 */
export function generateCss(overrides: BrandOverrides, name: string): string {
  const header = [
    '/*!',
    ` * @jonmatum/next-shell — ${name} color palette (auto-generated)`,
    ' *',
    ' * Import after the base preset:',
    ' *',
    ' *   @import "@jonmatum/next-shell/styles/preset.css";',
    ` *   @import "./${name}.css";`,
    ' */',
    '',
  ].join('\n');

  return header + brandOverridesCss(overrides) + '\n';
}

/* ────────────────────────────────────────────────────────────────────────
 * CLI argument parsing and main
 * ──────────────────────────────────────────────────────────────────────── */

export interface CliOptions {
  color: string;
  name: string;
  format: 'css' | 'json' | 'both';
}

/**
 * Parse CLI arguments from argv. Expects `--color`, `--name`, `--format`.
 * Throws on missing required `--color`.
 */
export function parseArgs(argv: string[]): CliOptions {
  let color: string | undefined;
  let name = 'custom';
  let format: 'css' | 'json' | 'both' = 'both';

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--color' && i + 1 < argv.length) {
      color = argv[++i]!;
    } else if (arg === '--name' && i + 1 < argv.length) {
      name = argv[++i]!;
    } else if (arg === '--format' && i + 1 < argv.length) {
      const val = argv[++i]!;
      if (val !== 'css' && val !== 'json' && val !== 'both') {
        throw new Error(`Invalid --format "${val}". Expected "css", "json", or "both".`);
      }
      format = val;
    }
  }

  if (!color) {
    throw new Error(
      'Missing required --color argument.\n' +
        "Usage: next-shell-theme --color '#10b981' [--name my-brand] [--format css|json|both]",
    );
  }

  return { color, name, format };
}

/**
 * Main entry point for the CLI. Returns the generated BrandOverrides and
 * CSS string (for testability), and optionally writes files to disk.
 */
export function main(
  argv: string[],
  options: { writeToDisk?: boolean; cwd?: string } = {},
): { overrides: BrandOverrides; css: string } {
  const { writeToDisk = true, cwd = process.cwd() } = options;
  const opts = parseArgs(argv);

  const overrides = generateTheme(opts.color);
  const css = generateCss(overrides, opts.name);

  if (writeToDisk) {
    if (opts.format === 'css' || opts.format === 'both') {
      const cssPath = resolve(cwd, `${opts.name}.css`);
      writeFileSync(cssPath, css, 'utf8');
      console.log(`✓ CSS written to ${cssPath}`);
    }
    if (opts.format === 'json' || opts.format === 'both') {
      const jsonPath = resolve(cwd, `${opts.name}.json`);
      writeFileSync(jsonPath, JSON.stringify(overrides, null, 2) + '\n', 'utf8');
      console.log(`✓ JSON written to ${jsonPath}`);
    }
  }

  return { overrides, css };
}

/* ────────────────────────────────────────────────────────────────────────
 * Run when invoked as a script
 * ──────────────────────────────────────────────────────────────────────── */

// Only execute when run directly (not when imported as a module).
// Node populates `process.argv` as [node, script, ...args].
const isDirectRun =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  (process.argv[1].endsWith('generate-theme.js') || process.argv[1].endsWith('generate-theme.cjs'));

if (isDirectRun) {
  try {
    main(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}
