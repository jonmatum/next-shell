import { defineConfig } from 'vitest/config';

export default defineConfig({
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
