'use client';

import type { ComponentProps } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/primitives/dropdown-menu';

import { useTheme } from './use-theme.js';
import type { ThemeValue } from './use-theme.js';

const ITEMS: ReadonlyArray<{ readonly value: ThemeValue; readonly label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const ICONS: Record<ThemeValue, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export interface ThemeToggleDropdownProps extends Omit<ComponentProps<typeof Button>, 'children'> {
  /**
   * Accessible label applied to the trigger button. Describes the overall
   * purpose, not the current theme. Defaults to `"Theme"`.
   */
  readonly label?: string;
  /**
   * Optional per-item label overrides (e.g. for i18n).
   * Defaults: `"Light"`, `"Dark"`, `"System"`.
   */
  readonly itemLabels?: Partial<Record<ThemeValue, string>>;
}

/**
 * Dropdown variant of `ThemeToggle`. Renders a Button trigger that opens a
 * menu with three discrete items: Light, Dark, System. The current theme
 * is marked with `aria-current="true"` and the `data-theme-item` attribute.
 *
 * Unlocked by the DropdownMenu primitive vendored in Phase 3c (#21).
 *
 * Styled exclusively through semantic tokens via the Button primitive;
 * `no-raw-colors` lint passes.
 */
export function ThemeToggleDropdown({
  label = 'Theme',
  itemLabels,
  variant = 'ghost',
  size = 'icon',
  ...rest
}: ThemeToggleDropdownProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const current = theme ?? 'system';
  const resolved = resolvedTheme ?? 'light';
  const TriggerIcon = ICONS[current];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          aria-label={label}
          data-theme-value={current}
          data-resolved-theme={resolved}
          suppressHydrationWarning
          {...rest}
        >
          <TriggerIcon aria-hidden className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ITEMS.map(({ value, label: defaultLabel }) => {
          const Icon = ICONS[value];
          const itemLabel = itemLabels?.[value] ?? defaultLabel;
          return (
            <DropdownMenuItem
              key={value}
              data-theme-item={value}
              aria-current={current === value ? 'true' : undefined}
              onClick={() => setTheme(value)}
            >
              <Icon aria-hidden className="size-4" />
              {itemLabel}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
