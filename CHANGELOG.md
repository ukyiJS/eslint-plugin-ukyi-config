## [2.0.1](https://github.com/ukyiJS/eslint-plugin-ukyi-config/compare/v2.0.0...v2.0.1) (2025-08-10)


### Bug Fixes

* React 버전 자동 감지 설정 추가 ([#5](https://github.com/ukyiJS/eslint-plugin-ukyi-config/issues/5)) ([889e3e7](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/889e3e7a2c4f97221da276c510a36add698c4bf9))

# [2.0.0](https://github.com/ukyiJS/eslint-plugin-ukyi-config/compare/v1.1.1...v2.0.0) (2025-08-10)


### Bug Fixes

* CI example 테스트에서 recommended-all 설정 사용 ([e3b7320](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/e3b73201eaf1901736cdd1b9cf859a5c923d3b34))
* React 버전을 18.0.0으로 고정 ([8af0c29](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/8af0c295bd715a634962e01ff307101b156cdbe7))


### Features

* import 규칙 개선 및 테스트 추가 ([d349c19](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/d349c19d149d03efcb194baf897982b2a675ac1e))
* TypeScript 린트 규칙 개선 및 테스트 추가 ([68dd90f](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/68dd90f1375aa369387a894ec24ed5ed74ea8072))
* 권장 설정을 프로젝트 유형별로 세분화 ([2b02354](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/2b0235409b4b43b485718cdcf6d58ee7255d9470))
* 권장 설정을 프로젝트 유형별로 세분화 ([d5a3706](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/d5a37069a0fea23006cfb4d854abdbc3c41d4212))
* 코드 포맷팅 설정에 JSDoc 주석 추가 ([b4ec414](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/b4ec414a518a163aa7a7afdc0940a4221f408d27))


### BREAKING CHANGES

* recommended 설정이 제거되고 recommended-javascript, recommended-typescript, recommended-react, recommended-all로 세분화됨
* recommended 설정이 제거되고 recommended-javascript, recommended-typescript, recommended-react, recommended-all로 세분화됨
* 기존 'recommended' 설정은 'recommended-typescript'로 변경됨

## [1.1.1](https://github.com/ukyiJS/eslint-plugin-ukyi-config/compare/v1.1.0...v1.1.1) (2025-07-25)


### Bug Fixes

* semantic-release 인증 설정 추가 ([#2](https://github.com/ukyiJS/eslint-plugin-ukyi-config/issues/2)) ([c226aff](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/c226affb1798d7c2d2b3f07b7bac2b1b4ada24c1))
* 빌드 설정 간소화 및 TypeScript 파서 옵션 개선 ([#1](https://github.com/ukyiJS/eslint-plugin-ukyi-config/issues/1)) ([4444ed5](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/4444ed58a4939095f570f650f91c72aef2d64b7c))

# [1.1.0](https://github.com/ukyiJS/eslint-plugin-ukyi-config/compare/v1.0.0...v1.1.0) (2025-07-24)


### Features

* import 설정 추가 ([0fde3a5](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/0fde3a5a7ee3ba9c66f5518431e1c6c1632884dd))
* 프로젝트 자체 ESLint 설정 추가 ([e95f903](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/e95f90322aa3118df864093d3a94396845c56557))

# 1.0.0 (2025-07-13)


### Features

* ESLint 플러그인 구현체 추가 ([2fd48d6](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/2fd48d68c5ec348932524f68ab145e41738be2c7))
* 프로젝트 초기 설정 및 기본 구성 ([c83bb30](https://github.com/ukyiJS/eslint-plugin-ukyi-config/commit/c83bb30115b94b4cd6ebacb08fac6ef17d413726))

## [0.0.1] - 2025-07-13

### Added
- ESLint 플러그인 초기 릴리즈
- JavaScript 코드 품질 규칙 설정
- TypeScript 지원 및 타입 체크 규칙
- React 및 React Hooks 린트 규칙
- 코드 포맷팅 규칙 (들여쓰기, 따옴표 등)
- 권장 설정 (recommended) 제공
- ESLint 9.x Flat Config 지원

### Features
- **포맷팅 규칙**: 일관된 코드 스타일 유지
  - 화살표 함수 괄호, 점 표기법, 들여쓰기 등
- **JavaScript 규칙**: 현대적인 JavaScript 모범 사례
  - ES6+ 기능 선호, import 정렬, 엄격한 동등 비교
- **TypeScript 규칙**: 타입 안전성 향상
  - any 사용 제한, 일관된 타입 정의, 타입 import 강제
- **React 규칙**: React 모범 사례
  - JSX 스타일 통일, Hooks 규칙, 컴포넌트 정의 방식

### Details
- Vite를 사용한 빌드 시스템
- Vitest를 사용한 테스트
- CommonJS와 ESM 모두 지원
- TypeScript 타입 정의 포함
