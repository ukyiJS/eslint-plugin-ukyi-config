import plugin from './dist/index.js';
import ts from 'typescript-eslint';
import { globalIgnores } from 'eslint/config'
import globals from 'globals'

export default ts.config([
  globalIgnores(['dist/**', 'coverage/**', 'node_modules/**', '*.config.js', '*.config.ts', '*.config.mjs']),
  {
    files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.tsx', "**/*.cts", "**/*.mts"],
    extends: [
      plugin.configs.format,
      plugin.configs.import,
      plugin.configs.javascript,
      plugin.configs.typescript,
      plugin.configs.react
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);