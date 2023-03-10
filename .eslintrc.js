module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: ['jsdoc'],
  extends: [
    'eslint:recommended',
    'eslint-config-prettier',
    'plugin:jsdoc/recommended',
  ],
  ignorePatterns: ['lib/**/*.js.', 'lib/*.js'],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2],
    semi: [2, 'always'],
    'no-unused-vars': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
    'jsdoc/require-description-complete-sentence': 2,
    'jsdoc/require-hyphen-before-param-description': 2,
    'jsdoc/check-alignment': 2, // Recommended
    'jsdoc/check-examples': 'off',
    'jsdoc/check-indentation': 2,
    'jsdoc/check-param-names': 2, // Recommended
    'jsdoc/check-syntax': 2,
    'jsdoc/check-tag-names': 2, // Recommended
    'jsdoc/check-types': 2, // Recommended
    'jsdoc/implements-on-classes': 2, // Recommended
    'jsdoc/match-description': 2,
    'jsdoc/newline-after-description': 2, // Recommended
    'jsdoc/no-types': 2,
    'jsdoc/no-undefined-types': 2, // Recommended
    'jsdoc/require-description': 2,
    'jsdoc/require-example': 0,
    'jsdoc/require-jsdoc': 2, // Recommended
    'jsdoc/require-param': 0,
    'jsdoc/require-param-description': 0,
    'jsdoc/require-param-name': 2, // Recommended
    'jsdoc/require-param-type': 0, // Recommended
    'jsdoc/require-returns': 0,
    'jsdoc/require-returns-check': 2, // Recommended
    'jsdoc/require-returns-description': 2, // Recommended
    'jsdoc/require-returns-type': 'off', // Recommended
    'jsdoc/valid-types': 2, // Recommended
  },
};
