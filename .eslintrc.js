module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    semi: ['error', 'never'],
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'space-before-function-paren': [2, { anonymous: 'always', named: 'always', asyncArrow: 'always' }],
    'no-await-in-loop': ['off'],
  },
}
