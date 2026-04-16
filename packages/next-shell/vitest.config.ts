import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const HERE = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Mirror the `@/*` → `src/*` alias declared in tsconfig.json so Vitest
  // can resolve shadcn-style absolute imports (`@/core/cn`, `@/primitives`,
  // …) that tsc + tsup handle via tsconfig paths.
  resolve: {
    alias: {
      '@': resolve(HERE, 'src'),
    },
  },
  esbuild: {
    // tsconfig keeps `jsx: "preserve"` so tsup/Next can handle the pass-through,
    // but Vitest needs the automatic runtime so tests don't require a manual
    // `import React`.
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/index.ts'],
    },
  },
});
