import { defineConfig } from 'tsup';
import { cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'core/index': 'src/core/index.ts',
    'layout/index': 'src/layout/index.ts',
    'primitives/index': 'src/primitives/index.ts',
    'providers/index': 'src/providers/index.ts',
    'auth/index': 'src/auth/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'tailwind-preset/index': 'src/tailwind-preset/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: 'es2022',
  external: ['react', 'react-dom', 'next', 'tailwindcss'],
  async onSuccess() {
    // Copy static CSS assets into dist/styles/.
    if (existsSync('src/styles')) {
      await cp('src/styles', 'dist/styles', { recursive: true });
    }
  },
});
