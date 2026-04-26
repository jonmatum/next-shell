import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  greenPreset,
  neutralPreset,
  orangePreset,
  presetPalettes,
  redPreset,
  violetPreset,
} from '../src/tokens/index.js';
import type { BrandOverrides } from '../src/tokens/index.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const PRESETS_DIR = resolve(HERE, '../src/styles/presets');

const PALETTE_NAMES = ['neutral', 'green', 'orange', 'red', 'violet'] as const;

/** Tokens that every preset CSS file must override in both :root and dark blocks. */
const EXPECTED_TOKENS = [
  '--primary',
  '--primary-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--ring',
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
];

describe('preset CSS files — existence', () => {
  for (const name of PALETTE_NAMES) {
    it(`${name}.css exists`, () => {
      const filePath = resolve(PRESETS_DIR, `${name}.css`);
      expect(existsSync(filePath)).toBe(true);
    });
  }
});

describe('preset CSS files — token coverage', () => {
  for (const name of PALETTE_NAMES) {
    describe(name, () => {
      const filePath = resolve(PRESETS_DIR, `${name}.css`);
      const css = readFileSync(filePath, 'utf8');

      // Extract the light block (:root / [data-theme='light'])
      const lightMatch = css.match(/:root[\s\S]*?\{([\s\S]*?)\}/);
      const lightBlock = lightMatch?.[1] ?? '';

      // Extract the dark block ([data-theme='dark'])
      const darkMatch = css.match(/\[data-theme='dark'\]\s*\{([\s\S]*?)\}/);
      const darkBlock = darkMatch?.[1] ?? '';

      it('has a light theme block with all expected tokens', () => {
        const missing = EXPECTED_TOKENS.filter((t) => !lightBlock.includes(`${t}:`));
        expect(missing).toEqual([]);
      });

      it('has a dark theme block with all expected tokens', () => {
        const missing = EXPECTED_TOKENS.filter((t) => !darkBlock.includes(`${t}:`));
        expect(missing).toEqual([]);
      });

      it('uses OKLCH values exclusively', () => {
        // Every CSS custom-property declaration line should contain oklch(
        const valueLines = css
          .split('\n')
          .filter((line) => {
            const trimmed = line.trim();
            // Skip comment lines (/* … */ and * … in multi-line comments)
            if (trimmed.startsWith('/*') || trimmed.startsWith('*')) return false;
            // Must be a custom-property declaration
            return trimmed.startsWith('--') && trimmed.includes(':');
          })
          .map((line) => line.trim());

        for (const line of valueLines) {
          expect(line).toMatch(/oklch\(/);
        }
      });
    });
  }
});

describe('preset TS objects — structure', () => {
  const presets: Record<string, BrandOverrides> = {
    neutral: neutralPreset,
    green: greenPreset,
    orange: orangePreset,
    red: redPreset,
    violet: violetPreset,
  };

  for (const [name, preset] of Object.entries(presets)) {
    describe(name, () => {
      it('has light overrides', () => {
        expect(preset.light).toBeDefined();
      });

      it('has dark overrides', () => {
        expect(preset.dark).toBeDefined();
      });

      it('light overrides include primary, accent, and chart tokens', () => {
        const keys = Object.keys(preset.light ?? {});
        expect(keys).toContain('primary');
        expect(keys).toContain('primary-foreground');
        expect(keys).toContain('accent');
        expect(keys).toContain('accent-foreground');
        expect(keys).toContain('chart-1');
        expect(keys).toContain('chart-2');
        expect(keys).toContain('chart-3');
        expect(keys).toContain('chart-4');
        expect(keys).toContain('chart-5');
      });

      it('dark overrides include primary, accent, and chart tokens', () => {
        const keys = Object.keys(preset.dark ?? {});
        expect(keys).toContain('primary');
        expect(keys).toContain('primary-foreground');
        expect(keys).toContain('accent');
        expect(keys).toContain('accent-foreground');
        expect(keys).toContain('chart-1');
        expect(keys).toContain('chart-2');
        expect(keys).toContain('chart-3');
        expect(keys).toContain('chart-4');
        expect(keys).toContain('chart-5');
      });

      it('all values are OKLCH strings', () => {
        const allValues = [
          ...Object.values(preset.light ?? {}),
          ...Object.values(preset.dark ?? {}),
        ];
        for (const value of allValues) {
          expect(value).toMatch(/^oklch\(/);
        }
      });
    });
  }
});

describe('presetPalettes map', () => {
  it('contains all 5 palettes', () => {
    expect(Object.keys(presetPalettes).sort()).toEqual([...PALETTE_NAMES].sort());
  });

  it('each entry matches the named export', () => {
    expect(presetPalettes.neutral).toBe(neutralPreset);
    expect(presetPalettes.green).toBe(greenPreset);
    expect(presetPalettes.orange).toBe(orangePreset);
    expect(presetPalettes.red).toBe(redPreset);
    expect(presetPalettes.violet).toBe(violetPreset);
  });
});

describe('CSS ↔ TS parity', () => {
  for (const name of PALETTE_NAMES) {
    it(`${name} CSS and TS preset have matching light primary values`, () => {
      const filePath = resolve(PRESETS_DIR, `${name}.css`);
      const css = readFileSync(filePath, 'utf8');
      const preset = presetPalettes[name];

      // Extract the primary value from the light block in CSS
      const lightMatch = css.match(/:root[\s\S]*?\{([\s\S]*?)\}/);
      const lightBlock = lightMatch?.[1] ?? '';
      const primaryMatch = lightBlock.match(/--primary:\s*([^;]+);/);
      const cssPrimary = primaryMatch?.[1]?.trim();

      expect(cssPrimary).toBe(preset.light?.primary);
    });
  }
});
