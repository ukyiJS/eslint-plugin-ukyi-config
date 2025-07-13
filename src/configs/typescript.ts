import type { Linter } from 'eslint';
import ts from 'typescript-eslint';

export const typescriptConfig: Linter.Config[] = [
  ...(ts.configs.recommended as Linter.Config[]),
  {
    name: 'ukyi-config/typescript',
    files: ['**/*.{ts,cts,mts,tsx}'],
    rules: {
      /* 빈 객체 타입 선언 허용 (type A = {}) */
      '@typescript-eslint/no-empty-object-type': 'off',

      /* 빈 함수 허용 대상 제한 (e.g. 생성자, 메서드는 허용) */
      '@typescript-eslint/no-empty-function': ['error', {
        allow: ['functions', 'arrowFunctions', 'constructors', 'methods'],
      }],

      /* any 사용 제한 (가능하면 unknown으로 대체, rest parameter는 예외 허용) */
      '@typescript-eslint/no-explicit-any': ['error', {
        fixToUnknown: true,
        ignoreRestArgs: true,
      }],

      /* 타입 import 시 항상 `import type` 형태 사용 */
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
      }],

      /* 배열 타입은 T[] 형태로 통일 */
      '@typescript-eslint/array-type': 'error',

      /* 인덱스 타입은 Record<string, T> 또는 { [key: string]: T } 중 하나로 통일 */
      '@typescript-eslint/consistent-indexed-object-style': 'error',

      /* 타입 정의는 interface를 기본으로 사용 (type X = ... 금지) */
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      /* 멤버 정렬 순서 통일 (interface/class 내부 필드 정렬) */
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'signature',
            'static-field',
            'static-method',
            'field',
            'constructor',
            'method',
          ],
        },
      ],

      /* method 형태 시그니처만 허용 (e.g. `fn(): void` 형태, 속성 방식 금지) */
      '@typescript-eslint/method-signature-style': ['error', 'method'],

      /* !! 같은 non-null 단언 조합 사용 금지 (혼동 유발) */
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',

      /* 유니언 타입 구성 요소는 정렬된 순서로 작성 (e.g. string | number | undefined) */
      '@typescript-eslint/sort-type-constituents': 'error',

      /* 사용되지 않는 변수 경고 (단, _로 시작하는 변수는 무시) */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: ['**/*.d.ts'],
    rules: {
      /* d.ts에서는 interface/type 혼용 허용 (명세 정의 유연성 확보) */
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
];
