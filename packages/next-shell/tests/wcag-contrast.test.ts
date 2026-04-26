/**
 * WCAG AA contrast-ratio verification for every semantic foreground/background
 * token pair in tokens.css.
 *
 * The conversion pipeline:
 *   OKLCH → OKLab → linear LMS (cube) → linear sRGB → gamma sRGB → WCAG luminance
 *
 * Runs in CI so regressions in token lightness are caught before merge.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOKENS_CSS = readFileSync(resolve(HERE, '../src/styles/tokens.css'), 'utf8');

// ─── OKLCH → sRGB conversion ────────────────────────────────────────────────

/** OKLCH → OKLab: L stays, a = C·cos(H°), b = C·sin(H°) */
function oklchToOklab(L: number, C: number, H: number) {
  const hRad = (H * Math.PI) / 180;
  return { L, a: C * Math.cos(hRad), b: C * Math.sin(hRad) };
}

/**
 * OKLab → linear sRGB via Ottosson's inverse matrices.
 *
 * OKLab → LMS (cube-root) → LMS (cube) → linear sRGB
 */
function oklabToLinearRGB(L: number, a: number, b: number) {
  // OKLab → cube-root LMS
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  // Cube to recover linear LMS
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // Linear LMS → linear sRGB
  return {
    R: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    G: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    B: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

/** Linear sRGB → gamma-encoded sRGB (0–1) */
function linearToSrgb(c: number): number {
  const clamped = Math.max(0, c);
  if (clamped <= 0.0031308) return 12.92 * clamped;
  return 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

/** Gamma-encoded sRGB (0–1) → linear for luminance */
function srgbToLinear(c: number): number {
  if (c <= 0.04045) return c / 12.92;
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Full pipeline: OKLCH → sRGB (each channel clamped to 0–1) */
function oklchToSrgb(L: number, C: number, H: number) {
  const lab = oklchToOklab(L, C, H);
  const lin = oklabToLinearRGB(lab.L, lab.a, lab.b);
  return {
    r: Math.max(0, Math.min(1, linearToSrgb(lin.R))),
    g: Math.max(0, Math.min(1, linearToSrgb(lin.G))),
    b: Math.max(0, Math.min(1, linearToSrgb(lin.B))),
  };
}

/** WCAG 2.1 relative luminance */
function wcagLuminance(r: number, g: number, b: number): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** WCAG contrast ratio (always >= 1) */
function contrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── CSS parsing ─────────────────────────────────────────────────────────────

interface OklchValue {
  L: number;
  C: number;
  H: number;
}

/** Extract the content between the first `{` and its matching `}` after startIdx */
function extractBlock(css: string, startIdx: number): string {
  const braceIdx = css.indexOf('{', startIdx);
  if (braceIdx === -1) return '';
  let depth = 1;
  let i = braceIdx + 1;
  const chars: string[] = [];
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++;
    if (css[i] === '}') depth--;
    if (depth > 0) chars.push(css[i]!);
    i++;
  }
  return chars.join('');
}

/** Parse `--name: oklch(L C H);` declarations (skip alpha variants like overlays/shadows) */
function parseOklchTokens(block: string): Record<string, OklchValue> {
  const tokens: Record<string, OklchValue> = {};
  const re = /--([\w-]+):\s*oklch\((\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    tokens[m[1]!] = { L: parseFloat(m[2]!), C: parseFloat(m[3]!), H: parseFloat(m[4]!) };
  }
  return tokens;
}

const lightBlock = extractBlock(TOKENS_CSS, TOKENS_CSS.indexOf(':root,'));
const darkBlock = extractBlock(TOKENS_CSS, TOKENS_CSS.indexOf("[data-theme='dark']"));

const lightTokens = parseOklchTokens(lightBlock);
const darkTokens = parseOklchTokens(darkBlock);

// ─── Pair definitions ────────────────────────────────────────────────────────

const PAIRS: Array<[fg: string, bg: string]> = [
  ['foreground', 'background'],
  ['primary-foreground', 'primary'],
  ['destructive-foreground', 'destructive'],
  ['success-foreground', 'success'],
  ['warning-foreground', 'warning'],
  ['info-foreground', 'info'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'card'],
  ['muted-foreground', 'muted'],
  ['card-foreground', 'card'],
  ['popover-foreground', 'popover'],
  ['accent-foreground', 'accent'],
  ['secondary-foreground', 'secondary'],
  ['sidebar-foreground', 'sidebar'],
  ['sidebar-accent-foreground', 'sidebar-accent'],
];

const AA_NORMAL_TEXT = 4.5;

// ─── Helper: compute ratio for an OKLCH pair ────────────────────────────────

function ratioForPair(
  tokens: Record<string, OklchValue>,
  fgName: string,
  bgName: string,
): number | null {
  const fg = tokens[fgName];
  const bg = tokens[bgName];
  if (!fg || !bg) return null;

  const fgSrgb = oklchToSrgb(fg.L, fg.C, fg.H);
  const bgSrgb = oklchToSrgb(bg.L, bg.C, bg.H);
  const fgLum = wcagLuminance(fgSrgb.r, fgSrgb.g, fgSrgb.b);
  const bgLum = wcagLuminance(bgSrgb.r, bgSrgb.g, bgSrgb.b);
  return contrastRatio(fgLum, bgLum);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('WCAG AA contrast — light theme', () => {
  for (const [fgName, bgName] of PAIRS) {
    if (!lightTokens[fgName] || !lightTokens[bgName]) continue;
    it(`${fgName} on ${bgName} ≥ ${AA_NORMAL_TEXT}:1`, () => {
      const ratio = ratioForPair(lightTokens, fgName, bgName)!;
      expect(ratio).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    });
  }
});

describe('WCAG AA contrast — dark theme', () => {
  for (const [fgName, bgName] of PAIRS) {
    if (!darkTokens[fgName] || !darkTokens[bgName]) continue;
    it(`${fgName} on ${bgName} ≥ ${AA_NORMAL_TEXT}:1`, () => {
      const ratio = ratioForPair(darkTokens, fgName, bgName)!;
      expect(ratio).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    });
  }
});

describe('OKLCH → sRGB conversion sanity checks', () => {
  it('pure black (L=0) produces 0,0,0', () => {
    const { r, g, b } = oklchToSrgb(0, 0, 0);
    expect(r).toBeCloseTo(0, 3);
    expect(g).toBeCloseTo(0, 3);
    expect(b).toBeCloseTo(0, 3);
  });

  it('pure white (L=1, C=0) produces 1,1,1', () => {
    const { r, g, b } = oklchToSrgb(1, 0, 0);
    expect(r).toBeCloseTo(1, 2);
    expect(g).toBeCloseTo(1, 2);
    expect(b).toBeCloseTo(1, 2);
  });

  it('WCAG luminance of white ≈ 1', () => {
    expect(wcagLuminance(1, 1, 1)).toBeCloseTo(1, 3);
  });

  it('WCAG luminance of black = 0', () => {
    expect(wcagLuminance(0, 0, 0)).toBe(0);
  });

  it('contrast ratio of white on black = 21:1', () => {
    expect(contrastRatio(1, 0)).toBeCloseTo(21, 1);
  });
});
