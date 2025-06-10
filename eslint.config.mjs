import antfu from '@antfu/eslint-config'
// import tailwind from 'eslint-plugin-tailwindcss'

export default antfu({
  react: true,
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  ignores: ['**/**.gen.*', '**/uswds/**'],
  rules: {
    'perfectionist/sort-imports': ['error', {
      type: 'natural',
    }],
    'no-console': 'warn',
  },
},
  // ...tailwind.configs['flat/recommended'], // Not compatible with Tailwind v4
)
