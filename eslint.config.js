import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import typescript from 'typescript-eslint';

import plugin from './dist/index.js';

export default typescript.config([
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
]);
