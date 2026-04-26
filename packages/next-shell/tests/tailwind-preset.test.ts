import { describe, expect, it } from 'vitest';

import { preset, presetCssImportPath, tokensCssImportPath } from '../src/tailwind-preset/index.js';
import type { PresetDescriptor } from '../src/tailwind-preset/index.js';
import { colorTokens, radiusTokens, tokenSchemaVersion } from '../src/tokens/index.js';

describe('tailwind-preset — export surface', () => {
  it('exports presetCssImportPath as the correct package path', () => {
    expect(presetCssImportPath).toBe('@jonmatum/next-shell/styles/preset.css');
  });

  it('exports tokensCssImportPath as the correct package path', () => {
    expect(tokensCssImportPath).toBe('@jonmatum/next-shell/styles/tokens.css');
  });

  it('exports a preset object that satisfies PresetDescriptor', () => {
    const descriptor: PresetDescriptor = preset;
    expect(descriptor).toBeDefined();
    expect(typeof descriptor.version).toBe('string');
    expect(Array.isArray(descriptor.colors)).toBe(true);
    expect(Array.isArray(descriptor.radii)).toBe(true);
    expect(descriptor.cssImports).toBeDefined();
  });

  it('preset.version matches the tokenSchemaVersion', () => {
    expect(preset.version).toBe(tokenSchemaVersion);
  });

  it('preset.colors matches the colorTokens array', () => {
    expect(preset.colors).toBe(colorTokens);
    expect(preset.colors.length).toBeGreaterThan(0);
  });

  it('preset.radii matches the radiusTokens array', () => {
    expect(preset.radii).toBe(radiusTokens);
    expect(preset.radii.length).toBeGreaterThan(0);
  });

  it('preset.cssImports references the correct paths', () => {
    expect(preset.cssImports.preset).toBe(presetCssImportPath);
    expect(preset.cssImports.tokensOnly).toBe(tokensCssImportPath);
  });

  it('default export is the same preset object', async () => {
    const mod = await import('../src/tailwind-preset/index.js');
    expect(mod.default).toBe(preset);
  });
});
