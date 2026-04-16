import { describe, expect, it } from 'vitest';
import { packageVersion } from '../src/core/version.js';
import { tokenSchemaVersion } from '../src/tokens/index.js';

describe('@jonmatum/next-shell — smoke', () => {
  it('exports a package version string', () => {
    expect(typeof packageVersion).toBe('string');
    expect(packageVersion.length).toBeGreaterThan(0);
  });

  it('exports a token schema version string', () => {
    expect(typeof tokenSchemaVersion).toBe('string');
    expect(tokenSchemaVersion.length).toBeGreaterThan(0);
  });
});
