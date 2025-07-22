import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'arrow-spacing': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/**',
      'build/',
      '*.min.js',
      'package-lock.json',
      'providers/*/data.json',
      'schema/*.json',
      '.husky/',
    ],
  },
];
