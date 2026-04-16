/**
 * `cn()` — the conventional className helper used by every shadcn/ui primitive
 * in this package.
 *
 * Accepts anything `clsx` accepts (strings, arrays, objects with boolean
 * keys, conditional ternaries, etc.), then runs the result through
 * `tailwind-merge` to resolve conflicting Tailwind utilities (e.g.
 * `cn('px-4', 'px-2')` → `'px-2'`, because the later value wins for the
 * same utility group).
 *
 * Exported from `@jonmatum/next-shell/core` and re-exported at the root.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
