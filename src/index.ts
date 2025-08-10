import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatConfig } from './configs/format';
import { importConfig } from './configs/import';
import { javascriptConfig } from './configs/javascript';
import { reactConfig } from './configs/react';
import { typescriptConfig } from './configs/typescript';

import type { Plugin } from './types';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const packageJson = JSON.parse(fs.readFileSync(path.join(_dirname, '..', 'package.json'), 'utf-8'));

const plugin: Plugin = {
  meta: {
    name: 'eslint-plugin-ukyi-config',
    version: packageJson.version,
  },
  configs: {
    /** 코드 포맷팅 관련 규칙들 (들여쓰기, 따옴표, 줄바꿈 등) */
    format: formatConfig,

    /** Import 관련 규칙들 (정렬, 그룹핑, 중복 제거 등) */
    import: importConfig,

    /** JavaScript 코드 품질 규칙들 (ES6+ 기능, 코드 스타일 등) */
    javascript: javascriptConfig,

    /** TypeScript 전용 규칙들 (타입 정의, any 사용 제한 등) */
    typescript: typescriptConfig,

    /** React/JSX 관련 규칙들 (컴포넌트, Hooks, JSX 스타일) */
    react: reactConfig,

    /** 권장 설정 (포맷팅 + Import + JavaScript) */
    'recommended-javascript': [
      ...formatConfig,
      ...importConfig,
      ...javascriptConfig,
    ],

    /** 권장 설정 (포맷팅 + Import + JavaScript + TypeScript) */
    'recommended-typescript': [
      ...formatConfig,
      ...importConfig,
      ...javascriptConfig,
      ...typescriptConfig,
    ],

    /** 권장 설정 (포맷팅 + Import + JavaScript + React) */
    'recommended-react': [
      ...formatConfig,
      ...importConfig,
      ...javascriptConfig,
      ...reactConfig,
    ],

    /** 권장 설정 (포맷팅 + Import + JavaScript + TypeScript + React) */
    'recommended-all': [
      ...formatConfig,
      ...importConfig,
      ...javascriptConfig,
      ...typescriptConfig,
      ...reactConfig,
    ],
  },
};

export default plugin;
