/**
 * Size-limit configuration for @jonmatum/next-shell.
 *
 * Run with: pnpm size
 * CI runs this after the build step to catch bundle regressions.
 *
 * @see https://github.com/ai/size-limit
 */
module.exports = [
  {
    path: 'dist/primitives/index.js',
    limit: '80 KB',
  },
  {
    path: 'dist/layout/index.js',
    limit: '40 KB',
  },
  {
    path: 'dist/providers/index.js',
    limit: '20 KB',
  },
  {
    path: 'dist/auth/index.js',
    limit: '10 KB',
  },
  {
    path: 'dist/hooks/index.js',
    limit: '10 KB',
  },
  {
    path: 'dist/formatters/index.js',
    limit: '10 KB',
  },
  {
    path: 'dist/tokens/index.js',
    limit: '5 KB',
  },
];
