import plugin from './dist/index.js';
import tseslint from 'typescript-eslint';

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
  ...plugin.configs.react,
  {
    files: ['**/*.{ts,cts,mts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 프로젝트 특정 오버라이드
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
];