import plugin from './dist/index.js';

export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
    ],
  },
  ...plugin.configs.format,
  ...plugin.configs.import,
  ...plugin.configs.javascript,
  ...plugin.configs.typescript,
  ...plugin.configs.react
];