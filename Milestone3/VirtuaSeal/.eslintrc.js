module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint', 'import', 'vue'],

  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],

  rules: {
    'max-len': ['error', { code: 140 }],
    'no-multiple-empty-lines': ['error', { max: 3, maxEOF: 1 }],
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: false },
    ],
    curly: ['error', 'multi-line'],
    'func-call-spacing': 'off',
    'no-restricted-syntax': 'off',
    'import/no-unresolved': 0,
    'import/no-commonjs': 2,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'off',
        tsx: 'never',
        mjs: 'never',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
  },
};
