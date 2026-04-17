// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import nextShellPlugin from 'eslint-plugin-next-shell';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/.source/**',
      '**/coverage/**',
      '**/*.min.js',
      '**/next-env.d.ts',
      'pnpm-lock.yaml',
      '.claude/skills/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2023,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'next-shell': nextShellPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',

      // Enforce the semantic-token-only policy everywhere.
      'next-shell/no-raw-colors': 'error',
    },
  },

  // The ESLint plugin itself is plain JS — relax TS rules for it.
  {
    files: ['tools/eslint-plugin-next-shell/**/*.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Test files may occasionally reference raw colors in assertions.
  {
    files: ['**/*.test.{ts,tsx,js,jsx}', '**/tests/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'next-shell/no-raw-colors': 'off',
    },
  },

  prettierConfig,
];
