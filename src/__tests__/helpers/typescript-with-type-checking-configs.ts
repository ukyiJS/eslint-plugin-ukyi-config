import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ESLint } from 'eslint';

import { formatConfig } from '../../configs/format';
import { typescriptConfig } from '../../configs/typescript';

import type { Linter } from 'eslint';

const _dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 타입 체킹이 필요한 TypeScript 테스트를 위한 설정과 헬퍼 함수들
 */

// 임시 디렉토리 경로
export const getTempDir = () => path.join(_dirname, 'temp-test-project');

/**
 * 임시 테스트 프로젝트 디렉토리 생성
 */
export function createTempProject(): string {
  const tempDir = getTempDir();

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // tsconfig.json 생성
  const tsconfigPath = path.join(tempDir, 'tsconfig.json');

  fs.writeFileSync(tsconfigPath, JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'node',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    },
    include: ['**/*.ts', '**/*.tsx'],
  }, null, 2));

  return tempDir;
}

/**
 * 임시 디렉토리 정리
 */
export function cleanupTempProject(): void {
  const tempDir = getTempDir();

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, {
      recursive: true,
      force: true,
    });
  }
}

/**
 * 타입 체킹이 포함된 TypeScript ESLint 인스턴스 생성
 */
export function createTypeAwareESLint(cwd: string): ESLint {
  return new ESLint({
    baseConfig: [...formatConfig, ...typescriptConfig],
    overrideConfigFile: true,
    ignore: false,
    cwd,
  });
}

/**
 * 테스트 파일 작성 헬퍼
 */
export function writeTestFile(filename: string, content: string): string {
  const tempDir = getTempDir();
  const filePath = path.join(tempDir, filename);

  fs.writeFileSync(filePath, content);

  return filePath;
}

/**
 * 테스트용 타입 체킹이 포함된 TypeScript 설정
 * (실제 프로젝트에서 사용하는 것과 동일한 설정)
 */
export const typescriptConfigWithTypeChecking: Linter.Config[] = typescriptConfig;

/**
 * 편의를 위한 config 조합 (타입 체킹 포함)
 */
export const typeAwareConfigs = {
  format: formatConfig,
  typescript: typescriptConfigWithTypeChecking,
  recommended: [...formatConfig, ...typescriptConfigWithTypeChecking],
};
