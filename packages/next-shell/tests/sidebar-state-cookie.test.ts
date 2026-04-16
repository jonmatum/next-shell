import { describe, expect, it } from 'vitest';
import {
  SIDEBAR_STATE_COOKIE_MAX_AGE,
  SIDEBAR_STATE_COOKIE_NAME,
  buildSidebarStateCookieHeader,
  getSidebarStateFromCookies,
  isSidebarState,
  type SidebarState,
} from '../src/layout/sidebar-state-cookie.js';

function mockCookies(entries: Record<string, string>) {
  return {
    get(name: string) {
      return entries[name] !== undefined ? { value: entries[name]! } : undefined;
    },
  };
}

describe('sidebar-state cookie — metadata', () => {
  it('exposes a stable cookie name', () => {
    expect(SIDEBAR_STATE_COOKIE_NAME).toBe('next-shell-sidebar-state');
  });

  it('exposes a one-year max-age in seconds', () => {
    expect(SIDEBAR_STATE_COOKIE_MAX_AGE).toBe(60 * 60 * 24 * 365);
  });
});

describe('isSidebarState', () => {
  it('accepts the two canonical values', () => {
    expect(isSidebarState('open')).toBe(true);
    expect(isSidebarState('closed')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isSidebarState('OPEN')).toBe(false);
    expect(isSidebarState('collapsed')).toBe(false);
    expect(isSidebarState('')).toBe(false);
    expect(isSidebarState(null)).toBe(false);
    expect(isSidebarState(undefined)).toBe(false);
    expect(isSidebarState(0)).toBe(false);
    expect(isSidebarState(true)).toBe(false);
  });
});

describe('getSidebarStateFromCookies', () => {
  it('returns the value when the cookie is "open"', () => {
    expect(getSidebarStateFromCookies(mockCookies({ 'next-shell-sidebar-state': 'open' }))).toBe(
      'open',
    );
  });

  it('returns the value when the cookie is "closed"', () => {
    expect(getSidebarStateFromCookies(mockCookies({ 'next-shell-sidebar-state': 'closed' }))).toBe(
      'closed',
    );
  });

  it('returns null when the cookie is missing', () => {
    expect(getSidebarStateFromCookies(mockCookies({}))).toBeNull();
  });

  it('returns null when the cookie contains an unknown value', () => {
    expect(
      getSidebarStateFromCookies(mockCookies({ 'next-shell-sidebar-state': 'bogus' })),
    ).toBeNull();
  });

  it('ignores other cookies', () => {
    expect(
      getSidebarStateFromCookies(
        mockCookies({
          'next-shell-theme': 'dark',
          some: 'other',
        }),
      ),
    ).toBeNull();
  });
});

describe('buildSidebarStateCookieHeader', () => {
  it('emits a well-formed Set-Cookie value for "open"', () => {
    const header = buildSidebarStateCookieHeader('open');
    expect(header).toContain('next-shell-sidebar-state=open');
    expect(header).toContain(`Max-Age=${SIDEBAR_STATE_COOKIE_MAX_AGE}`);
    expect(header).toContain('Path=/');
    expect(header).toContain('SameSite=Lax');
  });

  it('emits a well-formed Set-Cookie value for "closed"', () => {
    expect(buildSidebarStateCookieHeader('closed')).toContain('next-shell-sidebar-state=closed');
  });

  it('accepts the full SidebarState union without narrowing loss', () => {
    const states: SidebarState[] = ['open', 'closed'];
    for (const state of states) {
      expect(buildSidebarStateCookieHeader(state)).toMatch(/^next-shell-sidebar-state=/);
    }
  });
});
