import { describe, expect, it } from 'vitest';

import { formatDate, formatRelativeTime } from '../src/formatters/date.js';
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatFileSize,
  formatDuration,
} from '../src/formatters/number.js';
import {
  truncate,
  pluralize,
  toTitleCase,
  toKebabCase,
  slugify,
} from '../src/formatters/string.js';

/* ── formatDate ──────────────────────────────────────────────────────────── */

describe('formatDate', () => {
  const d = new Date('2026-04-16T12:00:00Z');

  it('returns a string', () => {
    expect(typeof formatDate(d, { locale: 'en-US' })).toBe('string');
  });

  it('accepts a timestamp', () => {
    expect(typeof formatDate(d.getTime(), { locale: 'en-US' })).toBe('string');
  });

  it('accepts an ISO string', () => {
    expect(typeof formatDate('2026-04-16', { locale: 'en-US' })).toBe('string');
  });

  it('respects dateStyle option', () => {
    const short = formatDate(d, { dateStyle: 'short', locale: 'en-US' });
    const long = formatDate(d, { dateStyle: 'long', locale: 'en-US' });
    expect(short.length).toBeLessThan(long.length);
  });
});

/* ── formatRelativeTime ──────────────────────────────────────────────────── */

describe('formatRelativeTime', () => {
  const now = new Date('2026-04-16T12:00:00Z');

  it('returns "now" / "0 seconds ago" for same time', () => {
    const result = formatRelativeTime(now, { now, locale: 'en' });
    expect(result).toBeTruthy();
  });

  it('returns past for earlier date', () => {
    const past = new Date(now.getTime() - 3 * 24 * 3600 * 1000);
    const result = formatRelativeTime(past, { now, locale: 'en' });
    expect(result).toMatch(/3 days ago/i);
  });

  it('returns future for later date', () => {
    const future = new Date(now.getTime() + 2 * 3600 * 1000);
    const result = formatRelativeTime(future, { now, locale: 'en' });
    expect(result).toMatch(/in 2 hours/i);
  });

  it('handles years', () => {
    const past = new Date(now.getTime() - 2 * 365 * 24 * 3600 * 1000);
    const result = formatRelativeTime(past, { now, locale: 'en' });
    expect(result).toMatch(/2 years ago/i);
  });
});

/* ── formatNumber ────────────────────────────────────────────────────────── */

describe('formatNumber', () => {
  it('formats with grouping by default', () => {
    const result = formatNumber(1234567, { locale: 'en-US' });
    expect(result).toContain(',');
  });

  it('formats zero', () => {
    expect(formatNumber(0, { locale: 'en-US' })).toBe('0');
  });

  it('respects maximumFractionDigits', () => {
    const result = formatNumber(1.23456, { maximumFractionDigits: 2, locale: 'en-US' });
    expect(result).toBe('1.23');
  });
});

/* ── formatCurrency ──────────────────────────────────────────────────────── */

describe('formatCurrency', () => {
  it('includes currency symbol', () => {
    const result = formatCurrency(9.99, 'USD', { locale: 'en-US' });
    expect(result).toContain('$');
    expect(result).toContain('9.99');
  });
});

/* ── formatPercent ───────────────────────────────────────────────────────── */

describe('formatPercent', () => {
  it('formats 0.75 as 75%', () => {
    const result = formatPercent(0.75, { locale: 'en-US' });
    expect(result).toContain('75');
    expect(result).toContain('%');
  });

  it('formats 1 as 100%', () => {
    const result = formatPercent(1, { locale: 'en-US' });
    expect(result).toContain('100');
  });
});

/* ── formatFileSize ──────────────────────────────────────────────────────── */

describe('formatFileSize', () => {
  it('formats 0 as "0 B"', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('formats bytes', () => {
    expect(formatFileSize(512)).toContain('B');
  });

  it('formats kilobytes', () => {
    const result = formatFileSize(1536);
    expect(result).toContain('KB');
  });

  it('formats megabytes', () => {
    const result = formatFileSize(1_048_576);
    expect(result).toContain('MB');
  });

  it('formats gigabytes', () => {
    const result = formatFileSize(1_073_741_824);
    expect(result).toContain('GB');
  });
});

/* ── formatDuration ──────────────────────────────────────────────────────── */

describe('formatDuration', () => {
  it('formats milliseconds to 0 sec', () => {
    expect(formatDuration(0)).toBe('0 sec');
  });

  it('formats seconds', () => {
    expect(formatDuration(45_000)).toBe('45 seconds');
  });

  it('formats hours and minutes', () => {
    const result = formatDuration(7_383_000);
    expect(result).toMatch(/2 hours/i);
    expect(result).toMatch(/3 minutes/i);
  });

  it('respects parts=1', () => {
    const result = formatDuration(7_383_000, { parts: 1 });
    expect(result).toMatch(/2 hours/i);
    expect(result).not.toContain(',');
  });
});

/* ── truncate ────────────────────────────────────────────────────────────── */

describe('truncate', () => {
  it('returns string as-is when short enough', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('truncates and appends suffix', () => {
    expect(truncate('Hello, world!', 8)).toBe('Hello, …');
  });

  it('supports custom suffix', () => {
    expect(truncate('Hello, world!', 10, '...')).toBe('Hello, ...');
  });
});

/* ── pluralize ───────────────────────────────────────────────────────────── */

describe('pluralize', () => {
  it('uses singular for count=1', () => {
    expect(pluralize(1, 'item')).toBe('1 item');
  });

  it('uses plural for count≠1', () => {
    expect(pluralize(3, 'item')).toBe('3 items');
  });

  it('uses explicit plural', () => {
    expect(pluralize(2, 'goose', 'geese')).toBe('2 geese');
  });

  it('handles zero', () => {
    expect(pluralize(0, 'item')).toBe('0 items');
  });
});

/* ── toTitleCase ─────────────────────────────────────────────────────────── */

describe('toTitleCase', () => {
  it('capitalises each word', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('lowercases rest of word', () => {
    expect(toTitleCase('hELLO wORLD')).toBe('Hello World');
  });
});

/* ── toKebabCase ─────────────────────────────────────────────────────────── */

describe('toKebabCase', () => {
  it('converts camelCase', () => {
    expect(toKebabCase('HelloWorld')).toBe('hello-world');
  });

  it('converts spaces', () => {
    expect(toKebabCase('my string')).toBe('my-string');
  });
});

/* ── slugify ─────────────────────────────────────────────────────────────── */

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('strips accents', () => {
    expect(slugify('café')).toBe('cafe');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a  b')).toBe('a-b');
  });
});
