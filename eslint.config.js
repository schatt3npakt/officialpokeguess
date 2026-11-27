import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['node_modules/', 'www/precache-manifest.js'] },
  js.configs.recommended,
  {
    files: ['www/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.browser }
    }
  },
  {
    files: ['www/service-worker.js'],
    languageOptions: {
      sourceType: 'script',
      globals: { ...globals.serviceworker }
    }
  },
  {
    files: ['tools/**/*.mjs', 'test/**/*.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.node }
    }
  },
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
      // Bare npm specifiers must never reach the browser bundle-free code.
      'no-restricted-imports': [
        'error',
        { patterns: [{ regex: '^[^./]', message: 'Use relative imports only - www/ has no bundler.' }] }
      ]
    }
  },
  {
    files: ['tools/**/*.mjs', 'test/**/*.js', 'eslint.config.js'],
    rules: { 'no-restricted-imports': 'off' }
  }
]
