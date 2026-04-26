module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', '@tanstack/query', 'import'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@features/*/*', 'src/features/*/*'],
            message:
              'Import from the feature barrel (index.ts) instead of reaching into its internals.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['src/features/**/*.ts', 'src/features/**/*.tsx'],
      rules: {
        'import/no-internal-modules': [
          'error',
          {
            forbid: [
              '../{history,repos,search}/**',
              '../../{history,repos,search}/**',
            ],
          },
        ],
      },
    },
    {
      files: ['metro.config.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
};
