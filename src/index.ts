import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { Plugin } from './types';
import { formatConfig } from './configs/format';
import { javascriptConfig } from './configs/javascript';
import { typescriptConfig } from './configs/typescript';
import { reactConfig } from './configs/react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
);

const plugin: Plugin = {
  meta: {
    name: 'eslint-plugin-ukyi-config',
    version: packageJson.version
  },
  configs: {
    /** 코드 포맷팅 관련 규칙들 (들여쓰기, 따옴표, 줄바꿈 등) */
    format: formatConfig,
    
    /** JavaScript 코드 품질 규칙들 (import 정렬, ES6+ 기능 등) */
    javascript: javascriptConfig,
    
    /** TypeScript 전용 규칙들 (타입 정의, any 사용 제한 등) */
    typescript: typescriptConfig,
    
    /** React/JSX 관련 규칙들 (컴포넌트, Hooks, JSX 스타일) */
    react: reactConfig,
    
    /** 권장 설정 (포맷팅 + JavaScript + TypeScript) */
    recommended: [
      ...formatConfig,
      ...javascriptConfig,
      ...typescriptConfig
    ],
  }
};

export default plugin;

