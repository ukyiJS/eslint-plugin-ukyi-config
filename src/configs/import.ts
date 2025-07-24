import importPlugin from 'eslint-plugin-import';

import type { Linter } from 'eslint';

export const importConfig: Linter.Config[] = [
  {
    name: 'ukyi-config/import',
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...importPlugin.flatConfigs.recommended.rules,

      /* 모듈 해석 규칙 비활성화 */
      'import/no-unresolved': 'off',

      /* 기본 export가 있는데 named export를 default처럼 사용하는 경우 경고 */
      'import/no-named-as-default': 'warn',

      /* default export의 멤버에 named 접근하는 경우 경고 */
      'import/no-named-as-default-member': 'warn',

      /* 동일한 모듈 중복 import 금지 */
      'import/no-duplicates': 'error',

      /* import 순서 및 그룹핑 정렬 */
      'import/order': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '~/**',
            group: 'internal',
            position: 'before',
          },
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      }],
      /* import는 항상 파일의 맨 위에 위치 */
      'import/first': 'error',

      /* import 블록 뒤에 정확히 한 줄 공백만 허용 */
      'import/newline-after-import': ['error', {
        count: 1,
        exactCount: true,
      }],

      /* 순환 참조 최대 3단계까지 허용, 초과 시 오류 */
      'import/no-cycle': ['error', {
        maxDepth: 3,
      }],

      /* 불필요한 상대 경로 (./, ../) 금지 */
      'import/no-useless-path-segments': 'error',

      /* 사용되지 않는 모듈 경고 */
      'import/no-unused-modules': 'warn',

      /* 익명 default export 금지 */
      'import/no-anonymous-default-export': ['error', {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowLiteral: false,
        allowObject: false,
      }],

      /* CommonJS require() 사용 금지 (ES 모듈 환경) */
      'import/no-commonjs': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
];
