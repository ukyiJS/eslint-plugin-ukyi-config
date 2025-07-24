import stylistic from '@stylistic/eslint-plugin';

import type { Linter } from 'eslint';

export const formatConfig: Linter.Config[] = [
  {
    name: 'ukyi-config/format',
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      ...stylistic.configs.customize({ semi: true }).rules,

      /* 화살표 함수 매개변수 괄호는 필요한 경우만 허용 */
      '@stylistic/arrow-parens': ['error', 'as-needed'],

      /* . 연산자는 다음 줄이 아닌 속성 앞에 위치 */
      '@stylistic/dot-location': ['error', 'property'],

      /* 함수 인자 줄바꿈은 일관되게 */
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],

      /* 이항 연산자 줄바꿈 시 들여쓰기 적용 */
      '@stylistic/indent-binary-ops': ['error', 2],

      /* 최대 줄 길이 제한 없음 */
      '@stylistic/max-len': 'off',

      /* 타입 선언의 구분자 ; 사용, 마지막 구분자 필수 */
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: true,
        },
        multilineDetection: 'brackets',
      }],

      /* 삼항 연산자는 한 줄에 유지 */
      '@stylistic/multiline-ternary': 'off',

      /* 불필요한 세미콜론 제거 */
      '@stylistic/no-extra-semi': 'error',

      /* 서로 다른 연산자 우선순위 혼합 금지 (괄호로 명확히 표현) */
      '@stylistic/no-mixed-operators': ['error', {
        groups: [
          ['+', '-', '*', '/', '%', '**'],
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: true,
      }],

      /* 단일 블록 문은 같은 줄에 작성 */
      '@stylistic/nonblock-statement-body-position': ['error', 'beside'],

      /* 속성이 4개 이상인 경우 줄바꿈 일관성 적용 */
      '@stylistic/object-curly-newline': ['error', {
        ObjectExpression: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
      }],

      /* 객체 속성 줄바꿈 스타일 설정 */
      '@stylistic/object-property-newline': ['error', {
        allowAllPropertiesOnSameLine: false,
      }],
      '@stylistic/one-var-declaration-per-line': ['error', 'always'],

      /* 문장 간 공백 줄 설정 (가독성 확보 목적) */
      '@stylistic/padding-line-between-statements': ['error',
        // return 문 앞에는 항상 공백 (가독성을 위해 유지)
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },

        // 변수 선언 그룹 후에만 공백 (연속된 변수 선언은 허용)
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },

        // directive (use strict 등) 후 공백
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'directive',
          next: 'directive',
        },

        // import/export 그룹화 (import 플러그인과 일관성)
        {
          blankLine: 'always',
          prev: 'import',
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'import',
          next: 'import',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'export',
        },
        {
          blankLine: 'any',
          prev: 'export',
          next: 'export',
        },

        // 클래스 선언 전후 공백 (구조적 분리)
        {
          blankLine: 'always',
          prev: '*',
          next: 'class',
        },
        {
          blankLine: 'always',
          prev: 'class',
          next: '*',
        },
      ],

      /* 객체 속성의 따옴표는 필요한 경우만 사용 */
      '@stylistic/quote-props': ['error', 'as-needed'],

      /* 문자열은 항상 작은 따옴표(single quote) 사용, 템플릿 리터럴은 금지 */
      '@stylistic/quotes': ['error', 'single', {
        allowTemplateLiterals: true, // 필요시 백틱 허용
        avoidEscape: true, // 이스케이프를 피하기 위한 다른 따옴표 허용
      }],

      /* 객체/배열 등 멀티라인 구조에 trailing comma 사용 */
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        enums: 'always-multiline',
      }],

      /* 객체에서 key: value 사이 공백 스타일 설정 */
      '@stylistic/key-spacing': ['error', {
        beforeColon: false,
        afterColon: true,
      }],

      /* 계산된 속성 대괄호 안에 공백 허용 안 함 (e.g. obj['key']) */
      '@stylistic/computed-property-spacing': ['error', 'never'],

      /* 코드 블록 스타일은 1tbs(one true brace style) 적용 */
      '@stylistic/brace-style': ['error', '1tbs'],

      /* JSX 들여쓰기 - 2칸 */
      '@stylistic/jsx-indent': ['error', 2],

      /* JSX 속성 들여쓰기 - 2칸 */
      '@stylistic/jsx-indent-props': ['error', 2],

      /* 자식 요소가 없는 태그는 self-closing 사용 */
      '@stylistic/jsx-self-closing-comp': ['error', {
        component: true,
        html: true,
      }],

      /* JSX 닫는 괄호 위치 - 마지막 속성과 같은 줄 */
      '@stylistic/jsx-closing-bracket-location': ['error', 'tag-aligned'],

      /* 멀티라인 JSX는 괄호로 감싸기 */
      '@stylistic/jsx-wrap-multilines': ['error', {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      }],

      /* JSX 속성 정렬 - 첫 번째 속성 기준 */
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],

      /* 한 줄당 최대 속성 개수 */
      '@stylistic/jsx-max-props-per-line': ['error', {
        maximum: 1,
        when: 'multiline',
      }],

      /* JSX 속성값 따옴표 - 큰따옴표 사용 */
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],

      /* JSX 중괄호 내부 공백 */
      '@stylistic/jsx-curly-spacing': ['error', {
        when: 'never',
        children: true,
      }],

    },
  },
];
