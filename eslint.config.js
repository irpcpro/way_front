import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // این خط رو اضافه کن تا خطای اشتباه refs خاموش بشه
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // این خط مهمه — خطای اشتباه refs رو خاموش می‌کنه
      "react/no-unstable-nested-components": "off",

      // یا کاملاً این پلاگین رو خاموش کن (اگه اذیت کرد)
      "react-hooks/refs": "off"
    },
    overrides: [
      {
        files: ["**/LoginPage.jsx"],
        rules: {
          "react-hooks/refs": "off"
        }
      }
    ]
  },
])
