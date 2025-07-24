import type { Linter } from 'eslint';

export interface PluginMeta {
  name: string;
  version: string;
}

export type ConfigName =
  'format' | 'import' | 'javascript' | 'react' | 'recommended' | 'typescript';

export interface Plugin {
  meta: PluginMeta;
  configs: {
    /** 코드 포맷팅 관련 규칙들 (들여쓰기, 따옴표, 줄바꿈 등) */
    format: Linter.Config[];
    /** Import 관련 규칙들 (정렬, 그룹핑, 중복 제거 등) */
    import: Linter.Config[];
    /** JavaScript 코드 품질 규칙들 (ES6+ 기능, 코드 스타일 등) */
    javascript: Linter.Config[];
    /** TypeScript 전용 규칙들 (타입 정의, any 사용 제한 등) */
    typescript: Linter.Config[];
    /** React/JSX 관련 규칙들 (컴포넌트, Hooks, JSX 스타일) */
    react: Linter.Config[];
    /** 권장 설정 (포맷팅 + Import + JavaScript + TypeScript) */
    recommended: Linter.Config[];
  };
}
