import { defineConfig } from 'tsup';
import { cp, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

/**
 * Entry paths whose bundled output must be client-only (RSC `'use client'`
 * directive prepended). Listed relative to `dist/`, without the extension.
 *
 * tsup/esbuild strips `'use client'` directives from non-entry source files
 * when bundling, so we re-add them to these specific entry outputs after
 * the build completes.
 */
const CLIENT_ENTRIES = [
  'providers/index',
  'primitives/index',
  'layout/index',
  'hooks/index',
] as const;

async function prependUseClient(path: string) {
  if (!existsSync(path)) return;
  const body = await readFile(path, 'utf8');
  if (body.startsWith("'use client'") || body.startsWith('"use client"')) return;
  await writeFile(path, `'use client';\n${body}`, 'utf8');
}

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'core/index': 'src/core/index.ts',
    'layout/index': 'src/layout/index.ts',
    'layout/server/index': 'src/layout/server/index.ts',
    'primitives/index': 'src/primitives/index.ts',
    'providers/index': 'src/providers/index.ts',
    'providers/server/index': 'src/providers/server/index.ts',
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

    // Re-apply `'use client'` to bundled client entries so Next.js RSC
    // correctly treats them as client modules.
    for (const entry of CLIENT_ENTRIES) {
      await prependUseClient(`dist/${entry}.js`);
      await prependUseClient(`dist/${entry}.cjs`);
    }
  },
});
