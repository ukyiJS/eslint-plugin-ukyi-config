import type { Linter } from 'eslint';

export interface PluginMeta {
  name: string;
  version: string;
}

export type ConfigName =
  | 'recommended'
  | 'format'
  | 'javascript'
  | 'typescript'
  | 'react';

export interface Plugin {
  meta: PluginMeta;
  configs: {
    /** 코드 포맷팅 관련 규칙들 (들여쓰기, 따옴표, 줄바꿈 등) */
    format: Linter.Config[];
    /** JavaScript 코드 품질 규칙들 (import 정렬, ES6+ 기능 등) */
    javascript: Linter.Config[];
    /** TypeScript 전용 규칙들 (타입 정의, any 사용 제한 등) */
    typescript: Linter.Config[];
    /** React/JSX 관련 규칙들 (컴포넌트, Hooks, JSX 스타일) */
    react: Linter.Config[];
    /** 권장 설정 (포맷팅 + JavaScript + TypeScript) */
    recommended: Linter.Config[];
  };
}