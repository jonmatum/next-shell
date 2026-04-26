/**
 * Size-limit configuration for @jonmatum/next-shell.
 *
 * Run with: pnpm size
 * CI runs this after the build step to catch bundle regressions.
 *
 * Limits are set ~20% above current measured sizes to catch regressions
 * without false positives on minor additions.
 *
 * @see https://github.com/ai/size-limit
 */
module.exports = [
  {
    path: 'dist/primitives/index.js',
    limit: '230 KB',
  },
  {
    path: 'dist/layout/index.js',
    limit: '55 KB',
  },
  {
    path: 'dist/providers/index.js',
    limit: '65 KB',
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
