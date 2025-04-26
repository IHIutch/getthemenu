import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  rules: {
    'no-console': 'warn',
    'no-alert': 'warn',
    'node/prefer-global/process': 'off',
    'perfectionist/sort-imports': 'warn',
  },
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
})
