import { describe, expect, it } from 'vitest';

import { preset, presetCssImportPath, tokensCssImportPath } from '../src/tailwind-preset/index.js';
import { colorTokens, radiusTokens, tokenSchemaVersion } from '../src/tokens/index.js';
import defaultExport from '../src/tailwind-preset/index.js';

describe('tailwind-preset', () => {
  it('exports presetCssImportPath as a package path', () => {
    expect(presetCssImportPath).toBe('@jonmatum/next-shell/styles/preset.css');
  });

  it('exports tokensCssImportPath as a package path', () => {
    expect(tokensCssImportPath).toBe('@jonmatum/next-shell/styles/tokens.css');
  });

  it('preset.version matches tokenSchemaVersion', () => {
    expect(preset.version).toBe(tokenSchemaVersion);
  });

  it('preset.colors references colorTokens', () => {
    expect(preset.colors).toBe(colorTokens);
    expect(preset.colors.length).toBeGreaterThan(0);
  });

  it('preset.radii references radiusTokens', () => {
    expect(preset.radii).toBe(radiusTokens);
    expect(preset.radii.length).toBeGreaterThan(0);
  });

  it('preset.cssImports matches named exports', () => {
    expect(preset.cssImports.preset).toBe(presetCssImportPath);
    expect(preset.cssImports.tokensOnly).toBe(tokensCssImportPath);
  });

  it('default export is the same as named preset', () => {
    expect(defaultExport).toBe(preset);
  });
});
