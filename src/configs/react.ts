import { fixupPluginRules } from '@eslint/compat';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import * as reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

import type { FixupPluginDefinition } from '@eslint/compat';
import type { Linter } from 'eslint';

export const reactConfig: Linter.Config[] = [
  {
    name: 'ukyi-config/react',
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      'jsx-a11y': fixupPluginRules(jsxA11yPlugin as FixupPluginDefinition),
    },
    rules: {
      /* 리액트 훅 관련 권장 규칙 */
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactRefreshPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,

      /* react-refresh: HMR 안정성을 위해 컴포넌트만 export 하도록 제한 */
      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true,
      }],

      /* boolean props는 값 없이 작성 (e.g. <input disabled />) */
      'react/jsx-boolean-value': ['error', 'never'],

      /* JSX 닫는 괄호 위치를 일관되게 설정 */
      'react/jsx-closing-bracket-location': 'error',

      /* 닫는 태그의 위치를 일관되게 설정 */
      'react/jsx-closing-tag-location': 'error',

      /* props와 children에서 불필요한 중괄호 제거 (e.g. title={"hi"} → title="hi") */
      'react/jsx-curly-brace-presence': ['error', {
        props: 'never',
        children: 'never',
      }],

      /* 중괄호 안 공백 금지 (children은 허용) */
      'react/jsx-curly-spacing': ['error', {
        when: 'never',
        attributes: {
          allowMultiline: false,
        },
        children: true,
      }],

      /* = 앞뒤에 공백 없이 작성 (e.g. prop="value") */
      'react/jsx-equals-spacing': ['error', 'never'],

      /* JSX에서 줄바꿈 방지 설정 */
      'react/jsx-newline': ['error', {
        prevent: true,
      }],

      /* 쓸모없는 Fragment 제거 (e.g. <></>만 사용하는 경우) */
      'react/jsx-no-useless-fragment': 'error',

      /* JSX prop 사이에 여러 공백 금지 */
      'react/jsx-props-no-multi-spaces': 'error',

      /* JSX prop 정렬: reserved → 일반 → callback → shorthand 순서 */
      'react/jsx-sort-props': ['error', {
        noSortAlphabetically: true,
        reservedFirst: true,
        shorthandLast: true,
        callbacksLast: true,
      }],

      /* 태그 간격 설정 (e.g. <Component /> 형태로) */
      'react/jsx-tag-spacing': ['error', {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        beforeClosing: 'never',
      }],

      /* 셀프 클로징 가능한 태그는 자동 닫힘 적용 (e.g. <img />) */
      'react/self-closing-comp': ['error', {
        component: true,
        html: true,
      }],

      /* 불필요한 익명 함수 생성 방지 */
      'react/jsx-no-bind': ['warn', {
        ignoreRefs: true,
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false,
      }],

      /* React.memo 사용 시 props 비교 함수 권장 */
      'react/prefer-stateless-function': 'error',

      /* 배열 렌더링 시 key prop 검증 강화 */
      'react/jsx-key': ['error', {
        checkFragmentShorthand: true,
        checkKeyMustBeforeSpread: true,
      }],

      /* displayName은 디버깅에 유용 */
      'react/display-name': 'warn',

      /* 위험한 HTML 삽입 방지 */
      'react/no-danger': 'warn',
      'react/no-danger-with-children': 'error',

      /* target="_blank" 사용 시 보안 이슈 방지 */
      'react/jsx-no-target-blank': ['error', {
        allowReferrer: false,
        enforceDynamicLinks: 'always',
      }],

      /* 중복된 props 방지 */
      'react/jsx-no-duplicate-props': ['error', {
        ignoreCase: true,
      }],

      /* 사용하지 않는 state 방지 */
      'react/no-unused-state': 'warn',

      /* 잘못된 생명주기 메서드 방지 */
      'react/no-unsafe': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      /* PropTypes는 TypeScript 타입으로 대체 */
      'react/prop-types': 'off',
      /* TypeScript가 더 정확한 타입 체크 제공 */
      'react/require-default-props': 'off',
      /* TypeScript 제네릭으로 충분 */
      'react/jsx-props-no-spreading': 'off',
    },
  },
];
