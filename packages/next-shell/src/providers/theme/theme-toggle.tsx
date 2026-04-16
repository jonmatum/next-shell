'use client';

import type { ButtonHTMLAttributes } from 'react';
import { useTheme } from './use-theme.js';
import type { ThemeValue } from './use-theme.js';

const THEME_ORDER: readonly ThemeValue[] = ['light', 'dark', 'system'];

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

function nextTheme(current: ThemeValue): ThemeValue {
  const index = THEME_ORDER.indexOf(current);
  return THEME_ORDER[(index + 1) % THEME_ORDER.length] ?? 'system';
}

const DEFAULT_LABELS: Record<ThemeValue, string> = {
  light: 'Switch to dark theme',
  dark: 'Switch to system theme',
  system: 'Switch to light theme',
};

export interface ThemeToggleProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /**
   * Custom accessible labels keyed by current theme. The label describes
   * what clicking the button will *do* — i.e. the theme it transitions to.
   */
  readonly labels?: Partial<Record<ThemeValue, string>>;
}

/**
 * Icon button that cycles light → dark → system → light.
 *
 * Styling uses only semantic tokens (`text-foreground`, `bg-accent`,
 * `ring-ring`, etc.). Has zero dependency on Phase 3 primitives so it can
 * be used anywhere without pulling DropdownMenu into the bundle.
 *
 * For a menu-based variant (light / dark / system as discrete items), see
 * `ThemeToggleDropdown` — added in Phase 3f once the DropdownMenu primitive
 * became available.
 */
export function ThemeToggle({ labels, className, onClick, ...rest }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const current = theme ?? 'system';
  const resolved = resolvedTheme ?? 'light';
  const target = nextTheme(current);
  const label = labels?.[current] ?? DEFAULT_LABELS[current];

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-theme-value={current}
      data-resolved-theme={resolved}
      onClick={(event) => {
        setTheme(target);
        onClick?.(event);
      }}
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-md',
        'text-foreground hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
        'duration-fast ease-standard transition-colors',
        className,
      )}
      {...rest}
    >
      <ThemeIcon theme={current} />
    </button>
  );
}

function ThemeIcon({ theme }: { readonly theme: ThemeValue }) {
  const commonProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (theme === 'light') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    );
  }

  if (theme === 'dark') {
    return (
      <svg {...commonProps}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    );
  }

  // system
  return (
    <svg {...commonProps}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}
