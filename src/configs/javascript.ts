import js from '@eslint/js';

import type { Linter } from 'eslint';

export const javascriptConfig: Linter.Config[] = [
  js.configs.recommended,
  {
    name: 'ukyi-config/javascript',
    files: ['**/*.{js,mjs,cjs,jsx}'],
    rules: {
      /* 항상 ===, !== 사용 (==, != 금지) */
      eqeqeq: ['warn', 'always'],

      /* console 사용은 경고 */
      'no-console': 'warn',

      /* debugger 문 경고 */
      'no-debugger': 'warn',

      /* 빈 블록 금지 (단, catch 블록은 허용) */
      'no-empty': ['warn', {
        allowEmptyCatch: true,
      }],

      /* if 문에서 return 후 else 금지 → early return 유도 */
      'no-else-return': ['error', {
        allowElseIf: false,
      }],

      /* return await 금지 (불필요한 경우만) */
      'no-return-await': 'error',

      /* 자기 자신에 대한 할당 금지 */
      'no-self-assign': ['error', {
        props: true,
      }],

      /* javascript: URL 사용 금지 */
      'no-script-url': 'error',

      /* 자기 자신과의 비교 금지 (e.g. if (x === x)) */
      'no-self-compare': 'error',

      /* 외로운 if 문 금지 (else와 합치거나 return으로 처리) */
      'no-lonely-if': 'error',

      /* 화살표 함수에서 블록이 필요 없는 경우 생략 (e.g. () => value) */
      'arrow-body-style': ['error', 'as-needed'],

      /* 객체 정의 시 shorthand 사용 권장 (e.g. { foo } 대신 { foo: foo }) */
      'object-shorthand': ['error', 'always'],

      /* 체이닝 호출 시 줄바꿈 일관성 유지 */
      'newline-per-chained-call': ['error', {
        ignoreChainWithDepth: 2,
      }],

      /* let → const로 변환 가능한 경우 const 사용 경고 */
      'prefer-const': ['warn', {
        destructuring: 'all',
      }],

      /* 구조분해 할당 권장 */
      'prefer-destructuring': ['error', {
        VariableDeclarator: {
          array: true,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      }, {
        enforceForRenamedProperties: false,
      }],

      /* Object.assign 대신 spread 문법 권장 */
      'prefer-object-spread': 'error',

      /* Math.pow 대신 ** 연산자 사용 */
      'prefer-exponentiation-operator': 'error',

      /* 문자열 연결 대신 템플릿 리터럴 사용 */
      'prefer-template': 'error',
    },
  },
];

export default javascriptConfig;
