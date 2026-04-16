import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

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
