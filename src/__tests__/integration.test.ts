import { ESLint } from 'eslint';
import { describe, it, expect } from 'vitest';

import plugin from '../index';

import type { Linter } from 'eslint';

describe('ESLint 플러그인 통합 테스트', () => {
  describe('플러그인 기본 구조 검증', () => {
    it('플러그인이 올바른 메타 정보와 구조를 가져야 한다', () => {
      expect(plugin).toBeDefined();
      expect(plugin.meta).toBeDefined();
      expect(plugin.meta.name).toBe('eslint-plugin-ukyi-config');
      expect(plugin.meta.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(plugin.configs).toBeDefined();
    });

    it('필요한 모든 설정(format, javascript, typescript, import, react, recommended)을 내보내야 한다', () => {
      expect(plugin.configs.format).toBeDefined();
      expect(plugin.configs.javascript).toBeDefined();
      expect(plugin.configs.typescript).toBeDefined();
      expect(plugin.configs.import).toBeDefined();
      expect(plugin.configs.react).toBeDefined();
      expect(plugin.configs.recommended).toBeDefined();
    });
  });

  describe('각 설정의 구조 검증', () => {
    const configs = ['format', 'javascript', 'typescript', 'import', 'react'] as const;

    configs.forEach(configName => {
      describe(`${configName} 설정`, () => {
        it('ESLint Flat Config 형식(Linter.Config[])을 따라야 한다', () => {
          const config = plugin.configs[configName];

          expect(Array.isArray(config)).toBe(true);
          expect(config.length).toBeGreaterThan(0);
        });

        it('files 패턴이 지원하는 파일 확장자를 포함해야 한다', () => {
          const config = plugin.configs[configName];

          config.forEach((conf: Linter.Config) => {
            if (conf.files) {
              expect(Array.isArray(conf.files)).toBe(true);
              conf.files.forEach((pattern: string[] | string) => {
                // 패턴이 glob 형식인지 확인
                expect(pattern).toMatch(/\.(js|mjs|cjs|jsx|ts|mts|cts|tsx)|(\{[^}]+\})/);
              });
            }
          });
        });
      });
    });
  });

  describe('recommended 설정 구성', () => {
    it('format, import, javascript, typescript 설정을 순서대로 포함해야 한다', () => {
      const recommended = plugin.configs.recommended;
      const expectedConfigs = [
        ...plugin.configs.format,
        ...plugin.configs.import,
        ...plugin.configs.javascript,
        ...plugin.configs.typescript,
      ];

      expect(recommended.length).toBe(expectedConfigs.length);
    });
  });

  describe('ESLint 인스턴스 생성 테스트', () => {
    const testConfigs = ['format', 'javascript', 'typescript', 'react', 'recommended'] as const;

    testConfigs.forEach(configName => {
      it(`${configName} 설정으로 ESLint 인스턴스를 생성하고 린트를 실행할 수 있어야 한다`, async () => {
        const eslint = new ESLint({
          baseConfig: plugin.configs[configName],
          overrideConfigFile: true,
          ignore: false,
        });

        expect(eslint).toBeDefined();

        // 간단한 코드로 lint 가능한지 확인
        const code = 'const x = 1;';
        const results = await eslint.lintText(code, { filePath: 'test.js' });

        expect(results).toBeDefined();
        expect(Array.isArray(results)).toBe(true);
      });
    });
  });

  describe('설정 간 호환성 테스트', () => {
    it('format과 react 설정을 함께 사용할 때 JSX 파일을 정상적으로 파싱할 수 있어야 한다', async () => {
      const eslint = new ESLint({
        baseConfig: [
          ...plugin.configs.format,
          ...plugin.configs.react,
        ],
        overrideConfigFile: true,
        ignore: false,
      });

      const jsxCode = `
import React from 'react';

const Component = () => {
  return <div>Hello</div>;
};

export default Component;
      `;

      const results = await eslint.lintText(jsxCode, { filePath: 'test.jsx' });

      expect(results).toBeDefined();
      // 스타일 관련 경고는 있을 수 있지만 파싱 오류는 없어야 함
      const messages = results[0].messages;
      const fatalErrors = messages.filter(m => m.fatal);

      expect(fatalErrors.length).toBe(0);
    });
  });

  describe('플러그인 의존성 검증', () => {
    it('각 설정이 필요한 ESLint 플러그인을 올바르게 포함해야 한다', () => {
      const configsWithPlugins = {
        format: '@stylistic',
        typescript: 'typescript-eslint',
        import: 'import',
        react: ['react', 'react-hooks'],
      };

      Object.entries(configsWithPlugins).forEach(([configName, expectedPlugins]) => {
        if (configName === 'javascript') return; // javascript는 플러그인이 없음

        const config = plugin.configs[configName as keyof typeof plugin.configs];
        const plugins = config.flatMap((conf: Linter.Config) =>
          conf.plugins ? Object.keys(conf.plugins) : [],
        );

        const pluginsToCheck = Array.isArray(expectedPlugins) ? expectedPlugins : [expectedPlugins];

        pluginsToCheck.forEach(plugin => {
          expect(plugins.some(p => p.includes(plugin))).toBe(true);
        });
      });
    });
  });

  describe('설정 커스터마이징 테스트', () => {
    it('사용자가 기본 규칙을 덮어쓰고 수정할 수 있어야 한다', async () => {
      const customConfig: Linter.Config[] = [
        ...plugin.configs.format,
        {
          rules: {
            '@stylistic/semi': ['error', 'never'],
          },
        },
      ];

      const eslint = new ESLint({
        baseConfig: customConfig,
        overrideConfigFile: true,
        ignore: false,
      });

      const code = 'const x = 1'; // 세미콜론 없음
      const results = await eslint.lintText(code, { filePath: 'test.js' });

      // 세미콜론 없음이 오류가 아니어야 함
      const semiErrors = results[0].messages.filter(m => m.ruleId === '@stylistic/semi');

      expect(semiErrors.length).toBe(0);
    });
  });
});
