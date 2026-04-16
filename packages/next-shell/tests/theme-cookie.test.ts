import { describe, expect, it } from 'vitest';
import {
  buildThemeCookieHeader,
  getThemeFromCookies,
  isThemeValue,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
} from '../src/providers/theme/theme-cookie.js';

function makeCookies(store: Record<string, string>) {
  return {
    get(name: string) {
      const value = store[name];
      return value === undefined ? undefined : { value };
    },
  };
}

describe('theme cookie — isThemeValue', () => {
  it.each(['light', 'dark', 'system'])('accepts %s as a valid theme', (value) => {
    expect(isThemeValue(value)).toBe(true);
  });

  it.each(['', 'sepia', 'auto', 42, null, undefined, {}])('rejects %p', (value) => {
    expect(isThemeValue(value)).toBe(false);
  });
});

describe('theme cookie — getThemeFromCookies', () => {
  it('returns the stored value when a valid cookie is present', () => {
    expect(getThemeFromCookies(makeCookies({ [THEME_COOKIE_NAME]: 'dark' }))).toBe('dark');
  });

  it('returns null when the cookie is missing', () => {
    expect(getThemeFromCookies(makeCookies({}))).toBeNull();
  });

  it('returns null when the cookie contains an unknown value', () => {
    expect(getThemeFromCookies(makeCookies({ [THEME_COOKIE_NAME]: 'sepia' }))).toBeNull();
  });
});

describe('theme cookie — buildThemeCookieHeader', () => {
  it('builds a Set-Cookie header with the expected attributes', () => {
    const header = buildThemeCookieHeader('dark');
    expect(header).toContain(`${THEME_COOKIE_NAME}=dark`);
    expect(header).toContain(`Max-Age=${THEME_COOKIE_MAX_AGE}`);
    expect(header).toContain('Path=/');
    expect(header).toContain('SameSite=Lax');
  });

  it('sets Max-Age to one year', () => {
    expect(THEME_COOKIE_MAX_AGE).toBe(60 * 60 * 24 * 365);
  });
});
