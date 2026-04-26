import { describe, expect, it } from 'vitest';
import {
  generateTheme,
  generateCss,
  parseOklch,
  formatOklch,
  parseArgs,
  main,
} from '../src/cli/generate-theme.js';

/* ────────────────────────────────────────────────────────────────────────
 * OKLCH helpers
 * ──────────────────────────────────────────────────────────────────────── */

describe('parseOklch', () => {
  it('parses a valid OKLCH string', () => {
    const result = parseOklch('oklch(0.696 0.149 162.5)');
    expect(result).toEqual({ L: 0.696, C: 0.149, H: 162.5 });
  });

  it('throws on invalid input', () => {
    expect(() => parseOklch('rgb(255, 0, 0)')).toThrow('invalid OKLCH');
    expect(() => parseOklch('')).toThrow('invalid OKLCH');
  });
});

describe('formatOklch', () => {
  it('formats components to CSS string', () => {
    const result = formatOklch({ L: 0.696, C: 0.149, H: 162.5 });
    expect(result).toBe('oklch(0.696 0.149 162.5)');
  });

  it('rounds to correct precision', () => {
    const result = formatOklch({ L: 0.6963, C: 0.14856, H: 162.49 });
    expect(result).toBe('oklch(0.696 0.149 162.5)');
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * Theme generation — valid OKLCH from hex
 * ──────────────────────────────────────────────────────────────────────── */

describe('generateTheme', () => {
  const OKLCH_RE = /^oklch\(\d+(?:\.\d+)? \d+(?:\.\d+)? \d+(?:\.\d+)?\)$/;

  describe('generates valid OKLCH values from hex input', () => {
    const testCases: [string, string][] = [
      ['#10b981', 'emerald'],
      ['#3b82f6', 'blue'],
      ['#ef4444', 'red'],
      ['#8b5cf6', 'violet'],
      ['#f97316', 'orange'],
    ];

    for (const [hex, label] of testCases) {
      it(`${label} (${hex})`, () => {
        const theme = generateTheme(hex);

        // All light values must be valid OKLCH
        for (const [key, value] of Object.entries(theme.light!)) {
          expect(value, `light.${key}`).toMatch(OKLCH_RE);
        }

        // All dark values must be valid OKLCH
        for (const [key, value] of Object.entries(theme.dark!)) {
          expect(value, `dark.${key}`).toMatch(OKLCH_RE);
        }
      });
    }
  });

  describe('produces both light and dark variants', () => {
    it('has light and dark keys', () => {
      const theme = generateTheme('#10b981');
      expect(theme.light).toBeDefined();
      expect(theme.dark).toBeDefined();
    });

    it('light and dark each have all required tokens', () => {
      const theme = generateTheme('#10b981');
      const requiredTokens = [
        'primary',
        'primary-foreground',
        'accent',
        'accent-foreground',
        'destructive',
        'destructive-foreground',
        'ring',
        'chart-1',
        'chart-2',
        'chart-3',
        'chart-4',
        'chart-5',
      ];

      const lightKeys = Object.keys(theme.light!);
      const darkKeys = Object.keys(theme.dark!);

      for (const token of requiredTokens) {
        expect(lightKeys, `light missing ${token}`).toContain(token);
        expect(darkKeys, `dark missing ${token}`).toContain(token);
      }
    });

    it('dark primary is lighter than light primary', () => {
      const theme = generateTheme('#10b981');
      const lightPrimary = parseOklch(theme.light!.primary!);
      const darkPrimary = parseOklch(theme.dark!.primary!);
      expect(darkPrimary.L).toBeGreaterThan(lightPrimary.L);
    });
  });

  describe('foreground/background WCAG AA contrast', () => {
    /**
     * Correct OKLCH → sRGB → WCAG 2.1 relative luminance pipeline.
     */
    function oklchLuminance(L: number, C: number, H: number): number {
      const hRad = (H * Math.PI) / 180;
      const a = C * Math.cos(hRad);
      const b = C * Math.sin(hRad);
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.291485548 * b;
      const l = l_ * l_ * l_;
      const m = m_ * m_ * m_;
      const s = s_ * s_ * s_;
      const R = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
      const G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
      const B = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
      function toSrgb(c: number) {
        const v = Math.max(0, c);
        return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
      }
      function toLin(c: number) {
        const v = Math.max(0, Math.min(1, c));
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * toLin(toSrgb(R)) + 0.7152 * toLin(toSrgb(G)) + 0.0722 * toLin(toSrgb(B));
    }

    /**
     * WCAG 2.x contrast ratio between two relative luminance values.
     */
    function contrastRatio(y1: number, y2: number): number {
      const lighter = Math.max(y1, y2);
      const darker = Math.min(y1, y2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Check WCAG AA contrast (>= 4.5:1) for a bg/fg OKLCH pair.
     * Uses correct OKLCH → sRGB → WCAG luminance pipeline.
     */
    function checkContrast(bgStr: string, fgStr: string): number {
      const bg = parseOklch(bgStr);
      const fg = parseOklch(fgStr);
      const bgY = oklchLuminance(bg.L, bg.C, bg.H);
      const fgY = oklchLuminance(fg.L, fg.C, fg.H);
      return contrastRatio(bgY, fgY);
    }

    const contrastPairs: [string, string][] = [
      ['primary', 'primary-foreground'],
      ['accent', 'accent-foreground'],
      ['destructive', 'destructive-foreground'],
    ];

    const hexColors = ['#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#f97316'];

    for (const hex of hexColors) {
      describe(`contrast for ${hex}`, () => {
        const theme = generateTheme(hex);

        for (const [bgToken, fgToken] of contrastPairs) {
          it(`light: ${bgToken} / ${fgToken} >= 4.5:1`, () => {
            const ratio = checkContrast(
              theme.light![bgToken as keyof typeof theme.light]!,
              theme.light![fgToken as keyof typeof theme.light]!,
            );
            expect(ratio).toBeGreaterThanOrEqual(4.5);
          });

          it(`dark: ${bgToken} / ${fgToken} >= 4.5:1`, () => {
            const ratio = checkContrast(
              theme.dark![bgToken as keyof typeof theme.dark]!,
              theme.dark![fgToken as keyof typeof theme.dark]!,
            );
            expect(ratio).toBeGreaterThanOrEqual(4.5);
          });
        }
      });
    }
  });

  describe('handles 3-digit and 6-digit hex', () => {
    it('3-digit hex (#f00)', () => {
      const theme = generateTheme('#f00');
      expect(theme.light).toBeDefined();
      expect(theme.dark).toBeDefined();
      expect(theme.light!.primary).toMatch(/^oklch\(/);
    });

    it('6-digit hex (#ff0000)', () => {
      const theme = generateTheme('#ff0000');
      expect(theme.light).toBeDefined();
      expect(theme.dark).toBeDefined();
      expect(theme.light!.primary).toMatch(/^oklch\(/);
    });

    it('3-digit and 6-digit equivalent produce same result', () => {
      const theme3 = generateTheme('#f00');
      const theme6 = generateTheme('#ff0000');
      expect(theme3.light!.primary).toBe(theme6.light!.primary);
      expect(theme3.dark!.primary).toBe(theme6.dark!.primary);
    });

    it('hex without # prefix', () => {
      const withHash = generateTheme('#10b981');
      const withoutHash = generateTheme('10b981');
      expect(withHash.light!.primary).toBe(withoutHash.light!.primary);
    });
  });

  describe('throws on invalid input', () => {
    it('throws on empty string', () => {
      expect(() => generateTheme('')).toThrow();
    });

    it('throws on non-hex string', () => {
      expect(() => generateTheme('not-a-color')).toThrow();
    });

    it('throws on invalid hex length', () => {
      expect(() => generateTheme('#1234')).toThrow();
    });

    it('throws on non-hex characters', () => {
      expect(() => generateTheme('#gggggg')).toThrow();
    });
  });

  describe('hue rotation for chart colors', () => {
    it('chart colors span distinct hues', () => {
      const theme = generateTheme('#10b981');
      const charts = [
        theme.light!['chart-1']!,
        theme.light!['chart-2']!,
        theme.light!['chart-3']!,
        theme.light!['chart-4']!,
        theme.light!['chart-5']!,
      ];

      const hues = charts.map((c) => parseOklch(c).H);

      // All 5 hues should be distinct (at least 30° apart on average)
      for (let i = 0; i < hues.length; i++) {
        for (let j = i + 1; j < hues.length; j++) {
          const diff = Math.abs(hues[i]! - hues[j]!);
          const angularDiff = Math.min(diff, 360 - diff);
          expect(angularDiff).toBeGreaterThan(20);
        }
      }
    });
  });

  describe('destructive hue points toward red', () => {
    it('light destructive hue is near 25°', () => {
      const theme = generateTheme('#10b981');
      const destructive = parseOklch(theme.light!.destructive!);
      expect(destructive.H).toBeGreaterThanOrEqual(20);
      expect(destructive.H).toBeLessThanOrEqual(30);
    });

    it('dark destructive hue is near 22°', () => {
      const theme = generateTheme('#10b981');
      const destructive = parseOklch(theme.dark!.destructive!);
      expect(destructive.H).toBeGreaterThanOrEqual(18);
      expect(destructive.H).toBeLessThanOrEqual(26);
    });
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * CSS generation
 * ──────────────────────────────────────────────────────────────────────── */

describe('generateCss', () => {
  it('produces valid CSS with light and dark blocks', () => {
    const theme = generateTheme('#10b981');
    const css = generateCss(theme, 'test-brand');

    expect(css).toContain(":root, [data-theme='light']");
    expect(css).toContain("[data-theme='dark']");
    expect(css).toContain('--primary:');
    expect(css).toContain('--chart-5:');
  });

  it('includes the theme name in the header comment', () => {
    const theme = generateTheme('#10b981');
    const css = generateCss(theme, 'emerald-brand');
    expect(css).toContain('emerald-brand');
  });

  it('all values in the CSS are OKLCH', () => {
    const theme = generateTheme('#3b82f6');
    const css = generateCss(theme, 'blue');

    const valueLines = css
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('/*') || trimmed.startsWith('*')) return false;
        return trimmed.startsWith('--') && trimmed.includes(':');
      })
      .map((line) => line.trim());

    for (const line of valueLines) {
      expect(line).toMatch(/oklch\(/);
    }
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * CLI argument parsing
 * ──────────────────────────────────────────────────────────────────────── */

describe('parseArgs', () => {
  it('parses --color', () => {
    const opts = parseArgs(['--color', '#10b981']);
    expect(opts.color).toBe('#10b981');
    expect(opts.name).toBe('custom');
    expect(opts.format).toBe('both');
  });

  it('parses --name', () => {
    const opts = parseArgs(['--color', '#10b981', '--name', 'emerald']);
    expect(opts.name).toBe('emerald');
  });

  it('parses --format css', () => {
    const opts = parseArgs(['--color', '#10b981', '--format', 'css']);
    expect(opts.format).toBe('css');
  });

  it('parses --format json', () => {
    const opts = parseArgs(['--color', '#10b981', '--format', 'json']);
    expect(opts.format).toBe('json');
  });

  it('throws on missing --color', () => {
    expect(() => parseArgs([])).toThrow('Missing required --color');
  });

  it('throws on invalid --format', () => {
    expect(() => parseArgs(['--color', '#fff', '--format', 'xml'])).toThrow('Invalid --format');
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * main() integration — runs without writing to disk
 * ──────────────────────────────────────────────────────────────────────── */

describe('main', () => {
  it('returns overrides and css when writeToDisk is false', () => {
    const result = main(['--color', '#10b981', '--name', 'test'], { writeToDisk: false });
    expect(result.overrides).toBeDefined();
    expect(result.overrides.light).toBeDefined();
    expect(result.overrides.dark).toBeDefined();
    expect(result.css).toContain('--primary:');
  });

  it('works with all formats without disk writes', () => {
    for (const format of ['css', 'json', 'both'] as const) {
      const result = main(['--color', '#3b82f6', '--format', format], { writeToDisk: false });
      expect(result.overrides.light!.primary).toMatch(/^oklch\(/);
    }
  });
});
