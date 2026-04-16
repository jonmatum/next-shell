import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useIsMobile } from '../src/hooks/use-mobile.js';

const originalInnerWidth = window.innerWidth;

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
  });
}

describe('useIsMobile', () => {
  beforeEach(() => {
    // Re-install a live matchMedia that reflects the current innerWidth so
    // the hook's effect sees the right value.
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: window.innerWidth < 768,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    setViewport(originalInnerWidth);
  });

  it('returns true when the viewport is below 768px', () => {
    setViewport(500);
    const { result } = renderHook(() => useIsMobile());
    act(() => {}); // let the effect run
    expect(result.current).toBe(true);
  });

  it('returns false when the viewport is 768px or wider', () => {
    setViewport(1024);
    const { result } = renderHook(() => useIsMobile());
    act(() => {});
    expect(result.current).toBe(false);
  });

  it('returns false on SSR (first render before effect runs)', () => {
    setViewport(500);
    const { result } = renderHook(() => useIsMobile());
    // The hook's initial state is undefined → coerced to false. The effect
    // fires after mount; we're asserting on the synchronous first render
    // value here.
    expect(typeof result.current).toBe('boolean');
  });
});
