import eslintConfig from '@meyfa/eslint-config'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import { fixupPluginRules } from '@eslint/compat'

export default [
  ...eslintConfig,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    ignores: ['build']
  },
  {
    plugins: {
      'react-hooks': fixupPluginRules(pluginReactHooks)
    },

    settings: {
      react: {
        version: 'detect'
      }
    },

    rules: {
      ...pluginReactHooks.configs.recommended.rules,

      'import/extensions': ['error', 'never', { json: 'always' }],

      'react/no-typos': ['error'],
      'react/style-prop-object': ['warn'],
      'react/jsx-pascal-case': ['warn', {
        allowAllCaps: true,
        ignore: []
      }],

      'react/void-dom-elements-no-children': ['error'],
      'react/no-unstable-nested-components': ['error'],
      'react/prop-types': ['error', {
        ignore: ['children']
      }],

      // disable in favor of @stylistic
      'jsx-quotes': 'off',
      'react/jsx-indent': 'off',
      'react/jsx-indent-props': 'off',
      'react/jsx-first-prop-new-line': 'off',
      'react/jsx-max-props-per-line': 'off',
      'react/jsx-props-no-multi-spaces': 'off',
      'react/jsx-tag-spacing': 'off',
      'react/jsx-wrap-multilines': 'off',

      // not supported by older Chrome versions
      'unicorn/prefer-at': 'off'
    }
  }
]
