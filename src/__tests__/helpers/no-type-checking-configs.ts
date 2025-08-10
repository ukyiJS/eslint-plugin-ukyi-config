import * as ts from 'typescript-eslint';

import { formatConfig } from '../../configs/format';
import { importConfig } from '../../configs/import';
import { javascriptConfig } from '../../configs/javascript';
import { reactConfig } from '../../configs/react';
import { typescriptConfig } from '../../configs/typescript';

import type { Linter } from 'eslint';

// 테스트용 TypeScript 설정 (project 설정 제거)
export const typescriptConfigForTest: Linter.Config[] = [
  ...(ts.configs.recommended as Linter.Config[]),
  {
    name: 'ukyi-config/typescript-test',
    files: ['**/*.{ts,cts,mts,tsx}'],
    languageOptions: {
      parser: ts.parser as Linter.Parser,
      parserOptions: {
        // project 설정을 제거하여 type-aware linting 비활성화
        // 테스트에서는 타입 정보가 필요 없음
      },
    },
    rules: {
      ...typescriptConfig.find(c => c.name === 'ukyi-config/typescript')?.rules,
      // 타입 정보가 필요한 규칙들 비활성화
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
];

// 편의를 위한 config 조합
export const testConfigs = {
  format: formatConfig,
  javascript: javascriptConfig,
  typescript: typescriptConfigForTest,
  react: reactConfig,
  import: importConfig,
  recommended: [...formatConfig, ...javascriptConfig, ...typescriptConfigForTest],
};
