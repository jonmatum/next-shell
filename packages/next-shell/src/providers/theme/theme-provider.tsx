'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps as NextThemeProviderProps } from 'next-themes';
import { brandOverridesCss } from '../../tokens/index.js';
import type { BrandOverrides } from '../../tokens/index.js';

/**
 * Props for the next-shell ThemeProvider.
 *
 * Extends `next-themes`'s own props but pins sensible defaults so consumers
 * don't have to configure them every time. The key defaults are:
 *
 *   - `attribute="data-theme"`  — matches `[data-theme="dark"]` in `tokens.css`
 *   - `defaultTheme="system"`   — honor the OS preference on first visit
 *   - `enableSystem`            — watch prefers-color-scheme media query
 *   - `disableTransitionOnChange` — suppress a brief transition flash when
 *                                   flipping theme, keeps the swap crisp
 *
 * Consumers can still override any of these by passing the prop explicitly.
 *
 * The `brand` prop lets an app override any token value per theme without
 * forking the package — overrides are injected as a `<style>` tag inside
 * the provider tree.
 */
export interface ThemeProviderProps extends Omit<NextThemeProviderProps, 'attribute' | 'value'> {
  /**
   * Brand token overrides. Values apply to `:root` / `[data-theme="light"]`
   * from the `light` key and `[data-theme="dark"]` from the `dark` key.
   */
  readonly brand?: BrandOverrides;
}

/**
 * Root-level theme provider for next-shell consumers. Wraps `next-themes`
 * with defaults tuned for this design system and an optional brand override
 * API.
 *
 * Typical usage in a Next.js 15 App Router `app/layout.tsx`:
 *
 * ```tsx
 * import { ThemeProvider } from '@jonmatum/next-shell/providers';
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <body>
 *         <ThemeProvider>{children}</ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  brand,
  children,
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = true,
  ...rest
}: ThemeProviderProps) {
  const brandCss = brand ? brandOverridesCss(brand) : '';

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...rest}
    >
      {brandCss ? (
        <style data-next-shell-brand="" dangerouslySetInnerHTML={{ __html: brandCss }} />
      ) : null}
      {children}
    </NextThemesProvider>
  );
}
