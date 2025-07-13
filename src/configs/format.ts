import stylistic from '@stylistic/eslint-plugin';
import { Linter } from 'eslint';

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
        ImportDeclaration: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ExportDeclaration: {
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
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
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
        {
          blankLine: 'always',
          prev: '*',
          next: 'block-like',
        },
        {
          blankLine: 'always',
          prev: 'block-like',
          next: '*',
        },
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
        {
          blankLine: 'always',
          prev: '*',
          next: 'function',
        },
        {
          blankLine: 'always',
          prev: 'function',
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['if', 'for', 'while', 'switch'],
        },
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
        {
          blankLine: 'always',
          prev: 'expression',
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'expression',
          next: 'expression',
        },
        {
          blankLine: 'any',
          prev: 'case',
          next: 'case',
        },
        {
          blankLine: 'any',
          prev: 'case',
          next: 'default',
        },
        {
          blankLine: 'any',
          prev: 'case',
          next: 'break',
        },
        {
          blankLine: 'any',
          prev: 'default',
          next: 'break',
        },
        {
          blankLine: 'any',
          prev: 'expression',
          next: 'break',
        },
      ],

      /* 객체 속성의 따옴표는 필요한 경우만 사용 */
      '@stylistic/quote-props': ['error', 'as-needed'],

      /* 문자열은 항상 작은 따옴표(single quote) 사용, 템플릿 리터럴은 금지 */
      '@stylistic/quotes': ['error', 'single', {
        allowTemplateLiterals: false,
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
    },
  },
];
