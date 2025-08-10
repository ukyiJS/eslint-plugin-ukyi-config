import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

import plugin from './dist/index.js';

export default ts.config(
  globalIgnores([
    'dist/**',
    'coverage/**',
    'node_modules/**',
  ]),
  plugin.configs.format,
  plugin.configs.import,
  plugin.configs.javascript,
  plugin.configs.typescript,
  plugin.configs.react,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
);
