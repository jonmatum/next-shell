import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  brandOverridesCss,
  buildRootOverrides,
  colorTokens,
  cssVar,
  densityTokens,
  durationTokens,
  easingTokens,
  fontFamilyTokens,
  leadingTokens,
  radiusTokens,
  shadowTokens,
  textSizeTokens,
  tokenSchemaVersion,
  trackingTokens,
} from '../src/tokens/index.js';

const HERE = dirname(fileURLToPath(import.meta.url));

const TOKENS_CSS = readFileSync(resolve(HERE, '../src/styles/tokens.css'), 'utf8');
const PRESET_CSS = readFileSync(resolve(HERE, '../src/styles/preset.css'), 'utf8');

describe('token contract — metadata', () => {
  it('exposes a token schema version', () => {
    expect(tokenSchemaVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe('token contract — every declared token exists in tokens.css', () => {
  const expectations: Array<[string, readonly string[], (name: string) => string]> = [
    ['color', colorTokens, (n) => `--${n}:`],
    ['radius', radiusTokens, (n) => `--radius-${n}:`],
    ['font-family', fontFamilyTokens, (n) => `--font-${n}:`],
    ['text-size', textSizeTokens, (n) => `--text-${n}:`],
    ['leading', leadingTokens, (n) => `--leading-${n}:`],
    ['tracking', trackingTokens, (n) => `--tracking-${n}:`],
    ['duration', durationTokens, (n) => `--duration-${n}:`],
    ['easing', easingTokens, (n) => `--ease-${n}:`],
    ['shadow', shadowTokens, (n) => `--shadow-${n}:`],
    ['density', densityTokens, (n) => `--density-${n}:`],
  ];

  for (const [category, tokens, toDecl] of expectations) {
    it(`every ${category} token is declared`, () => {
      const missing = tokens.filter((t) => !TOKENS_CSS.includes(toDecl(t)));
      expect(missing).toEqual([]);
    });
  }
});

describe('token contract — dark theme parity', () => {
  // Dark theme must override every COLOR token. Non-color tokens may inherit.
  it('every color token is re-declared inside [data-theme="dark"]', () => {
    const darkBlockMatch = TOKENS_CSS.match(/\[data-theme='dark'\]\s*\{([\s\S]*?)\n\}/);
    expect(darkBlockMatch).not.toBeNull();
    const darkBlock = darkBlockMatch![1] ?? '';
    const missing = colorTokens.filter((t) => !darkBlock.includes(`--${t}:`));
    expect(missing).toEqual([]);
  });
});

describe('Tailwind preset — every token is mapped', () => {
  it('every color token is mapped to a --color-* @theme key', () => {
    const missing = colorTokens.filter((t) => !PRESET_CSS.includes(`--color-${t}: var(--${t});`));
    expect(missing).toEqual([]);
  });

  it('every radius token is mapped to a --radius-* @theme key', () => {
    const missing = radiusTokens.filter(
      (t) => !PRESET_CSS.includes(`--radius-${t}: var(--radius-${t});`),
    );
    expect(missing).toEqual([]);
  });
});

describe('buildRootOverrides', () => {
  it('emits CSS custom property keys for provided overrides', () => {
    const style = buildRootOverrides({
      radius: '0.5rem',
      fontSans: 'Inter, sans-serif',
      light: { primary: 'oklch(0.6 0.2 258)', 'primary-foreground': 'oklch(1 0 0)' },
    });
    expect(style).toEqual({
      '--radius': '0.5rem',
      '--font-sans': 'Inter, sans-serif',
      '--primary': 'oklch(0.6 0.2 258)',
      '--primary-foreground': 'oklch(1 0 0)',
    });
  });

  it('returns an empty object when nothing is provided', () => {
    expect(buildRootOverrides({})).toEqual({});
  });
});

describe('brandOverridesCss', () => {
  it('scopes light overrides to :root and dark overrides to [data-theme="dark"]', () => {
    const css = brandOverridesCss({
      light: { primary: 'oklch(0.6 0.2 258)' },
      dark: { primary: 'oklch(0.75 0.15 258)' },
    });
    expect(css).toContain(":root, [data-theme='light']");
    expect(css).toContain('--primary: oklch(0.6 0.2 258);');
    expect(css).toContain("[data-theme='dark']");
    expect(css).toContain('--primary: oklch(0.75 0.15 258);');
  });

  it('returns an empty string when nothing is provided', () => {
    expect(brandOverridesCss({})).toBe('');
  });
});

describe('cssVar helper', () => {
  it('returns a var() reference for a color token', () => {
    expect(cssVar('primary')).toBe('var(--primary)');
  });

  it('returns a var() reference for a radius token', () => {
    expect(cssVar('radius-lg')).toBe('var(--radius-lg)');
  });

  it('returns a var() reference for a shadow token', () => {
    expect(cssVar('shadow-md')).toBe('var(--shadow-md)');
  });
});
