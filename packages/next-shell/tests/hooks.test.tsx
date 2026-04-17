import * as React from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDisclosure } from '../src/hooks/use-disclosure.js';
import { useDebouncedValue } from '../src/hooks/use-debounced-value.js';
import { useDebouncedCallback } from '../src/hooks/use-debounced-callback.js';
import { useMounted } from '../src/hooks/use-mounted.js';
import { useLocalStorage } from '../src/hooks/use-local-storage.js';
import { useSessionStorage } from '../src/hooks/use-session-storage.js';
import { useControllableState } from '../src/hooks/use-controllable-state.js';
import { useHotkey } from '../src/hooks/use-hotkey.js';
import { useCopyToClipboard } from '../src/hooks/use-copy-to-clipboard.js';

/* ── useDisclosure ─────────────────────────────────────────────────────── */

describe('useDisclosure', () => {
  it('defaults to closed', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it('opens with initialOpen=true', () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('open() sets isOpen to true', () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
  });

  it('close() sets isOpen to false', () => {
    const { result } = renderHook(() => useDisclosure(true));
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('toggle() flips isOpen', () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('onOpenChange sets value directly', () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.onOpenChange(true));
    expect(result.current.isOpen).toBe(true);
  });
});

/* ── useDebouncedValue ─────────────────────────────────────────────────── */

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('updates after delay', () => {
    const { result, rerender } = renderHook(({ val }) => useDebouncedValue(val, 300), {
      initialProps: { val: 'a' },
    });
    rerender({ val: 'b' });
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('b');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(({ val }) => useDebouncedValue(val, 300), {
      initialProps: { val: 'a' },
    });
    rerender({ val: 'b' });
    act(() => vi.advanceTimersByTime(100));
    rerender({ val: 'c' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('c');
  });
});

/* ── useDebouncedCallback ──────────────────────────────────────────────── */

describe('useDebouncedCallback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('does not call immediately', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));
    act(() => result.current('x'));
    expect(fn).not.toHaveBeenCalled();
  });

  it('calls after delay', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));
    act(() => result.current('x'));
    act(() => vi.advanceTimersByTime(200));
    expect(fn).toHaveBeenCalledWith('x');
  });

  it('only calls once for rapid invocations', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));
    act(() => {
      result.current('a');
      result.current('b');
      result.current('c');
    });
    act(() => vi.advanceTimersByTime(200));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });
});

/* ── useMounted ───────────────────────────────────────────────────────── */

describe('useMounted', () => {
  it('returns true after mounting', () => {
    function Probe() {
      const mounted = useMounted();
      return <span data-testid="val">{mounted ? 'yes' : 'no'}</span>;
    }
    render(<Probe />);
    expect(screen.getByTestId('val')).toHaveTextContent('yes');
  });
});

/* ── useLocalStorage ──────────────────────────────────────────────────── */

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns initialValue when key is absent', () => {
    const { result } = renderHook(() => useLocalStorage('key', 42));
    expect(result.current[0]).toBe(42);
  });

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('theme', 'light'));
    act(() => result.current[1]('dark'));
    expect(localStorage.getItem('theme')).toBe('"dark"');
    expect(result.current[0]).toBe('dark');
  });

  it('supports functional updater', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    act(() => result.current[1]((prev) => prev + 1));
    expect(result.current[0]).toBe(1);
  });

  it('removeValue resets to initial', () => {
    const { result } = renderHook(() => useLocalStorage('x', 'init'));
    act(() => result.current[1]('changed'));
    act(() => result.current[2]());
    expect(result.current[0]).toBe('init');
    expect(localStorage.getItem('x')).toBeNull();
  });
});

/* ── useSessionStorage ────────────────────────────────────────────────── */

describe('useSessionStorage', () => {
  beforeEach(() => sessionStorage.clear());

  it('returns initialValue when key is absent', () => {
    const { result } = renderHook(() => useSessionStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('persists value to sessionStorage', () => {
    const { result } = renderHook(() => useSessionStorage('sid', 'abc'));
    act(() => result.current[1]('xyz'));
    expect(sessionStorage.getItem('sid')).toBe('"xyz"');
  });
});

/* ── useControllableState ─────────────────────────────────────────────── */

describe('useControllableState', () => {
  it('uses defaultProp as initial uncontrolled value', () => {
    const { result } = renderHook(() => useControllableState({ defaultProp: 'hello' }));
    expect(result.current[0]).toBe('hello');
  });

  it('updates uncontrolled value', () => {
    const { result } = renderHook(() => useControllableState({ defaultProp: 0 }));
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
  });

  it('uses prop as controlled value', () => {
    const { result } = renderHook(() => useControllableState({ prop: 'controlled' }));
    expect(result.current[0]).toBe('controlled');
  });

  it('calls onChange when value changes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultProp: 0, onChange }));
    act(() => result.current[1](99));
    expect(onChange).toHaveBeenCalledWith(99);
  });

  it('supports functional updater', () => {
    const { result } = renderHook(() => useControllableState({ defaultProp: 10 }));
    act(() => result.current[1]((prev) => (prev ?? 0) + 1));
    expect(result.current[0]).toBe(11);
  });
});

/* ── useHotkey ────────────────────────────────────────────────────────── */

describe('useHotkey', () => {
  it('calls handler when key matches', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    function Probe() {
      useHotkey('k', handler, { preventDefault: false });
      return <div />;
    }
    render(<Probe />);
    await user.keyboard('k');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler for wrong key', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    function Probe() {
      useHotkey('k', handler, { preventDefault: false });
      return <div />;
    }
    render(<Probe />);
    await user.keyboard('j');
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not attach when enabled=false', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    function Probe() {
      useHotkey('k', handler, { enabled: false, preventDefault: false });
      return <div />;
    }
    render(<Probe />);
    await user.keyboard('k');
    expect(handler).not.toHaveBeenCalled();
  });
});

/* ── useCopyToClipboard ───────────────────────────────────────────────── */

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
  });
  afterEach(() => vi.useRealTimers());

  it('copies text and sets isCopied', async () => {
    const { result } = renderHook(() => useCopyToClipboard(1000));
    await act(async () => {
      await result.current.copy('hello');
    });
    expect(result.current.isCopied).toBe(true);
    expect(result.current.copiedValue).toBe('hello');
  });

  it('resets isCopied after resetMs', async () => {
    const { result } = renderHook(() => useCopyToClipboard(500));
    await act(async () => {
      await result.current.copy('test');
    });
    expect(result.current.isCopied).toBe(true);
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.isCopied).toBe(false);
  });
});
