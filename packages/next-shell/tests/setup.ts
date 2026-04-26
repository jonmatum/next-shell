import '@testing-library/jest-dom/vitest';
import { expect, vi } from 'vitest';
import * as vitestAxeMatchers from 'vitest-axe/matchers';

// Register vitest-axe matchers (toHaveNoViolations) globally.
// The vitest-axe/extend-expect entry point is empty in 0.1.0 + Vitest 4,
// so we extend manually.
expect.extend(vitestAxeMatchers);

// jsdom doesn't implement `matchMedia`, which next-themes uses to watch the
// `prefers-color-scheme` media query. Provide a minimal stub that reports
// the OS theme as light by default. Tests that need dark OS preference can
// override `window.matchMedia` per-test.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// jsdom doesn't implement `ResizeObserver`, which several Radix primitives
// rely on (Slider, Popover, ScrollArea, …). Stub to a no-op so component
// render doesn't throw `ReferenceError: ResizeObserver is not defined`.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

// jsdom doesn't implement `Element.prototype.scrollIntoView`, which cmdk
// calls to keep the active CommandItem in view. Stub to a no-op.
if (typeof Element !== 'undefined' && typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = function scrollIntoView(): void {
    /* no-op in jsdom */
  };
}

// jsdom doesn't implement `HTMLCanvasElement.prototype.getContext`, which
// axe-core uses for icon-ligature detection in its color-contrast rule.
// Stub to a no-op that returns null (no 2D context) to suppress the error.
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function getContext() {
    return null;
  } as typeof HTMLCanvasElement.prototype.getContext;
}

// jsdom doesn't implement `IntersectionObserver`, which embla-carousel
// uses to track which slides are in view. Stub to a no-op class.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}
