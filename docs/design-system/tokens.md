# Design tokens

`@jonmatum/next-shell` ships a **semantic token contract** implemented as CSS custom properties in [`packages/next-shell/src/styles/tokens.css`](../../packages/next-shell/src/styles/tokens.css) and mirrored for type safety in [`packages/next-shell/src/tokens/index.ts`](../../packages/next-shell/src/tokens/index.ts).

Every component in the package references **only** these tokens. The rule is enforced in CI by `next-shell/no-raw-colors`.

> Current schema version: **1.0.0**

## How to adopt

### With Tailwind v4 (recommended)

```css
/* app/globals.css */
@import 'tailwindcss';
@import '@jonmatum/next-shell/styles/preset.css';
```

That single preset import:

1. Loads the tokens at `:root` and `[data-theme="dark"]`.
2. Maps every token to a Tailwind `@theme` key so utilities like `bg-background`, `text-foreground`, `border-border`, `rounded-lg`, `shadow-md`, `duration-normal`, `ease-standard` work everywhere — no `tailwind.config.js` required.

### Without Tailwind

```css
@import '@jonmatum/next-shell/styles/tokens.css';
```

You can then use the tokens directly in CSS:

```css
.card {
  background: var(--surface);
  color: var(--surface-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

## Token categories

### 1. Color (semantic, not hue-based)

Expressed in **OKLCH** for perceptual uniformity and wider gamut.

| Token                                    | Purpose                              |
| ---------------------------------------- | ------------------------------------ |
| `background` / `foreground`              | Page background + default text       |
| `surface` / `surface-foreground`         | Cards, popovers, elevated containers |
| `muted` / `muted-foreground`             | Subdued surfaces + secondary text    |
| `accent` / `accent-foreground`           | Hover / active / subtle highlight    |
| `primary` / `primary-foreground`         | Brand color + text on brand          |
| `secondary` / `secondary-foreground`     | Secondary action                     |
| `destructive` / `destructive-foreground` | Errors, destructive actions          |
| `success` / `success-foreground`         | Success feedback                     |
| `warning` / `warning-foreground`         | Cautionary feedback                  |
| `info` / `info-foreground`               | Neutral informational feedback       |
| `border`                                 | Default border color                 |
| `input`                                  | Form field border / surface          |
| `ring`                                   | Focus ring                           |
| `sidebar-*` (8 tokens)                   | Dedicated sidebar surface / nav      |
| `chart-1` … `chart-5`                    | Categorical chart hues               |

Each token has a matching Tailwind utility under the same name: `bg-primary`, `text-primary-foreground`, `border-destructive`, `ring-ring`, and so on.

### 2. Radius

Scale is driven by a single `--radius` base so brand overrides only need to change one variable.

| Token         | Value                       |
| ------------- | --------------------------- |
| `radius-xs`   | `calc(var(--radius) - 6px)` |
| `radius-sm`   | `calc(var(--radius) - 4px)` |
| `radius-md`   | `calc(var(--radius) - 2px)` |
| `radius-lg`   | `var(--radius)`             |
| `radius-xl`   | `calc(var(--radius) + 4px)` |
| `radius-2xl`  | `calc(var(--radius) + 8px)` |
| `radius-full` | `9999px`                    |

Base: `--radius: 0.625rem` (10px).

### 3. Typography

**Families:** `font-sans`, `font-mono`, `font-display`

**Fluid type scale** (uses `clamp()`): `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`.

**Leading:** `leading-tight`, `leading-snug`, `leading-normal`, `leading-relaxed`, `leading-loose`

**Tracking:** `tracking-tight`, `tracking-normal`, `tracking-wide`, `tracking-wider`

### 4. Motion

**Durations:** `duration-instant` (0ms), `duration-fast` (150ms), `duration-normal` (250ms), `duration-slow` (400ms), `duration-slowest` (600ms)

**Easings:**

| Token             | Curve                        | Use                                 |
| ----------------- | ---------------------------- | ----------------------------------- |
| `ease-standard`   | `cubic-bezier(0.2, 0, 0, 1)` | Default — most transitions          |
| `ease-emphasized` | `cubic-bezier(0.3, 0, 0, 1)` | Large / attention-grabbing movement |
| `ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Element entering the screen         |
| `ease-accelerate` | `cubic-bezier(0.3, 0, 1, 1)` | Element leaving the screen          |

### 5. Elevation

`shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`

Each scale has separate values tuned for light and dark themes — darker surfaces need higher alpha to remain visible.

### 6. Density

Designed for components that want to offer compact / comfortable / spacious variants without hardcoding padding.

| Token                | Default  | Typical use         |
| -------------------- | -------- | ------------------- |
| `density-pad-x`      | `1rem`   | Horizontal padding  |
| `density-pad-y`      | `0.5rem` | Vertical padding    |
| `density-gap`        | `0.5rem` | Flex / grid gap     |
| `density-row-height` | `2.5rem` | Row height (tables) |

## Brand overrides

The whole system is driven by CSS variables, so brand customization is a matter of re-declaring the ones you care about. Two helpers are available:

### `buildRootOverrides(overrides)`

Returns a `React.CSSProperties`-compatible object for a `style` prop:

```tsx
import { buildRootOverrides } from '@jonmatum/next-shell/tokens';

const brand = buildRootOverrides({
  radius: '0.5rem',
  fontSans: 'Inter, sans-serif',
  light: {
    primary: 'oklch(0.55 0.18 280)',
    'primary-foreground': 'oklch(0.985 0 0)',
  },
});

<html style={brand}>{...}</html>;
```

### `brandOverridesCss(overrides)`

Returns a ready-to-inject CSS string that scopes light and dark overrides to their respective selectors:

```tsx
import { brandOverridesCss } from '@jonmatum/next-shell/tokens';

const css = brandOverridesCss({
  light: { primary: 'oklch(0.55 0.18 280)' },
  dark: { primary: 'oklch(0.75 0.15 280)' },
});

// Render in a <style> tag in the document head.
```

## Enforcement

The `next-shell/no-raw-colors` ESLint rule flags any of the following in component source:

- Hex literals (`#abc`, `#abcdef`, `#abcdef12`)
- Raw CSS color functions (`rgb()`, `rgba()`, `hsl()`, `hsla()`, `oklch()`, `oklab()`, `color()`, `color-mix()`)
- Tailwind palette utilities (`bg-red-500`, `text-slate-700`, …)
- Tailwind black/white utilities (`bg-white`, `text-black`, …)

Token definition files (`src/tokens/`, `tokens.css`, `tailwind-preset/`) are exempt — they're where the mapping to real colors lives.
