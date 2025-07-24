# @ukyijs/eslint-plugin-ukyi-config

[![npm version](https://img.shields.io/npm/v/@ukyijs/eslint-plugin-ukyi-config.svg)](https://www.npmjs.com/package/@ukyijs/eslint-plugin-ukyi-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

개인 프로젝트를 위한 ESLint 플러그인으로, 일관된 코드 스타일과 품질을 유지하기 위한 규칙들을 제공합니다.

## 설치

```bash
npm install --save-dev @ukyijs/eslint-plugin-ukyi-config
# 또는
yarn add -D @ukyijs/eslint-plugin-ukyi-config
# 또는
pnpm add -D @ukyijs/eslint-plugin-ukyi-config
```

## 사용법

### ESLint 설정 파일 (eslint.config.js)

```javascript
import ukyiPlugin from '@ukyijs/eslint-plugin-ukyi-config';

export default [
  // 권장 설정 사용
  ...ukyiPlugin.configs.recommended,
  
  // 또는 개별 설정 사용
  // ...ukyiPlugin.configs.format,
  // ...ukyiPlugin.configs.javascript,
  // ...ukyiPlugin.configs.typescript,
  // ...ukyiPlugin.configs.react,
  // ...ukyiPlugin.configs.import,
];
```

## 제공하는 설정

### `format`
코드 포맷팅 관련 규칙들을 포함합니다.
- 화살표 함수 괄호
- 점 표기법 위치
- 함수 호출 인자 줄바꿈
- 줄 길이 제한
- 들여쓰기
- 따옴표 스타일 등

### `javascript`
JavaScript 코드 품질 규칙들을 포함합니다.
- import 문 정렬 및 중복 제거
- 동등 비교 연산자 (===, !==) 사용 강제
- console 및 debugger 사용 경고
- 제어 흐름 최적화
- ES6+ 기능 선호

### `typescript`
TypeScript 전용 규칙들을 포함합니다.
- 타입 import 규칙
- 배열 타입 표기법
- interface vs type 일관성
- 멤버 정렬
- any 사용 제한

### `react`
React/JSX 관련 규칙들을 포함합니다.
- JSX 불린 속성 표기
- JSX 중괄호 사용
- 컴포넌트 정의 방식
- Props 정렬
- Hooks 규칙

### `import`
import/export 관련 규칙들을 포함합니다.
- import 문 정렬 및 그룹화
- 중복 import 방지
- CommonJS (require) 사용 금지
- 사용하지 않는 import 제거
- import 문 위치 강제

### `recommended`
일반적인 프로젝트에 권장되는 설정입니다.
- format + javascript + typescript + import

## 주요 규칙 설명

### JavaScript 규칙

#### 코드 스타일
- `eqeqeq`: 엄격한 동등 비교 (=== 및 !==) 사용
- `prefer-const`: 재할당하지 않는 변수는 const 사용
- `prefer-template`: 문자열 연결 대신 템플릿 리터럴 사용
- `object-shorthand`: 객체 속성 단축 표기법 사용
- `arrow-body-style`: 화살표 함수 본문 간소화

### TypeScript 규칙

#### 타입 관련
- `@typescript-eslint/no-explicit-any`: any 타입 사용 제한 (unknown 권장)
- `@typescript-eslint/consistent-type-imports`: 타입은 `import type` 사용
- `@typescript-eslint/array-type`: 배열 타입은 `T[]` 형태로 통일
- `@typescript-eslint/consistent-type-definitions`: 객체 타입은 interface 사용

#### 코드 구조
- `@typescript-eslint/member-ordering`: 클래스 멤버 정렬 순서 강제
- `@typescript-eslint/method-signature-style`: 메서드 시그니처 스타일 통일
- `@typescript-eslint/sort-type-constituents`: 유니온 타입 구성요소 정렬

### React 규칙

#### JSX 스타일
- `react/jsx-boolean-value`: 불린 props는 값 생략 (`<Comp isActive />`)
- `react/jsx-curly-brace-presence`: 불필요한 중괄호 제거
- `react/jsx-curly-spacing`: JSX 중괄호 내 공백 제거
- `react/self-closing-comp`: 자식이 없는 컴포넌트는 self-closing 태그 사용

#### 컴포넌트 작성
- `react/function-component-definition`: 화살표 함수로 컴포넌트 정의
- `react/jsx-sort-props`: props 알파벳 순 정렬
- `react-hooks/rules-of-hooks`: React Hooks 규칙 준수
- `react-hooks/exhaustive-deps`: useEffect 의존성 배열 검증

### Import 규칙

#### 정렬 및 그룹화
- `import/order`: import 문을 그룹별로 정렬
  - builtin (Node.js 내장 모듈)
  - external (npm 패키지)
  - internal (프로젝트 내부 별칭)
  - parent (상위 디렉토리)
  - sibling (같은 디렉토리)
  - index (현재 디렉토리의 index 파일)
  - object (객체 import)
  - type (타입 import)

#### 품질 관리
- `import/no-duplicates`: 동일한 모듈에서 여러 번 import 금지
- `import/first`: 모든 import는 파일 최상단에 위치
- `import/newline-after-import`: import 후 빈 줄 필수
- `import/no-commonjs`: require() 사용 금지 (ES6 모듈 사용)
- `import/no-amd`: AMD 모듈 시스템 사용 금지
- `import/no-nodejs-modules`: Node.js 내장 모듈 직접 import 금지 (브라우저 환경)

#### 의존성 관리
- `import/no-extraneous-dependencies`: package.json에 없는 패키지 import 금지
- `import/no-mutable-exports`: 변경 가능한 바인딩 export 금지
- `import/no-unused-modules`: 사용하지 않는 export 감지

## 예외 처리

### TypeScript `.d.ts` 파일
타입 정의 파일에서는 다음 규칙이 비활성화됩니다:
- `@typescript-eslint/consistent-type-definitions`: interface/type 혼용 허용

### 특수 패턴
- 언더스코어(`_`)로 시작하는 변수는 미사용 경고에서 제외
- catch 블록의 error 변수도 `_error`로 명명 시 경고 제외

## 버전 관리

이 프로젝트는 [Semantic Versioning](https://semver.org/)을 따르며, [Conventional Commits](https://www.conventionalcommits.org/)를 사용합니다.

### 커밋 메시지 규칙

- `fix:` 버그 수정 (패치 버전 증가)
- `feat:` 새로운 기능 (마이너 버전 증가)
- `BREAKING CHANGE:` 호환성을 깨는 변경 (메이저 버전 증가)
- `chore:`, `docs:`, `style:`, `refactor:`, `test:` 버전 증가 없음

### 자동 릴리즈

main 브랜치에 푸시하면 자동으로:
1. 커밋 메시지 분석
2. 버전 자동 결정
3. CHANGELOG 업데이트
4. 태그 생성
5. NPM 배포
6. GitHub Release 생성
