import eslintConfig from '@meyfa/eslint-config'

export default [
  ...eslintConfig,
  {
    ignores: ['build']
  }
]