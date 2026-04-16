import { describe, expect, it } from 'vitest';
import { cn } from '../src/core/cn.js';

describe('cn()', () => {
  it('joins simple string classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values', () => {
    const truthy = true;
    const falsy = false;
    expect(cn('foo', falsy && 'bar', truthy && 'keep', null, undefined, '', 'baz')).toBe(
      'foo keep baz',
    );
  });

  it('supports object syntax with boolean keys', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('supports array syntax and nested arrays', () => {
    expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
  });

  it('merges conflicting Tailwind utilities — later wins', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
    expect(cn('bg-primary', 'bg-destructive')).toBe('bg-destructive');
  });

  it('preserves non-conflicting utilities across merges', () => {
    expect(cn('px-4 py-2', 'px-8')).toBe('py-2 px-8');
  });

  it('handles an empty invocation', () => {
    expect(cn()).toBe('');
  });

  it('respects semantic-token utilities introduced by the preset', () => {
    // Sanity: tailwind-merge must treat our custom `bg-*` tokens as colors
    // so conflicts resolve correctly.
    expect(cn('bg-card', 'bg-popover')).toBe('bg-popover');
    expect(cn('ring-ring', 'ring-destructive')).toBe('ring-destructive');
  });
});
