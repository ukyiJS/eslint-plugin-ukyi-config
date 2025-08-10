import { describe, it, expect } from 'vitest';

import { formatConfig } from '../configs/format';
import { javascriptConfig } from '../configs/javascript';
import {
  createESLint,
  lintText,
  hasRuleError,
  countRuleErrors,
  expectRuleError,
  expectNoRuleError,
  testMultipleRules,
  codeSamples,
  getMessagesBySeverity,
} from './helpers/lint';

describe('헬퍼 함수 사용 예제', () => {
  describe('기본 헬퍼 함수 사용', () => {
    it('createESLint와 lintText를 사용한 테스트', async () => {
      const eslint = createESLint([...formatConfig, ...javascriptConfig]);
      const result = await lintText(eslint, codeSamples.basicJS);

      // console.log 사용으로 인한 경고가 있어야 함
      const hasConsoleError = hasRuleError(result.messages, 'no-console');

      expect(hasConsoleError).toBe(true);
    });

    it('countRuleErrors를 사용한 에러 개수 확인', async () => {
      const eslint = createESLint(javascriptConfig);
      const code = `
        const x = 1;
        const y = 2;
        console.log(x);
        console.error(y);
        console.warn('test');
      `;

      const result = await lintText(eslint, code);
      const consoleCount = countRuleErrors(result.messages, 'no-console');

      expect(consoleCount).toBe(3);
    });

    it('getMessagesBySeverity를 사용한 심각도별 필터링', async () => {
      const eslint = createESLint(javascriptConfig);
      const code = `
        debugger; // warning
        const x = 1 == 1; // error (eqeqeq)
      `;

      const result = await lintText(eslint, code);
      const warnings = getMessagesBySeverity(result.messages, 1);
      const errors = getMessagesBySeverity(result.messages, 2);

      expect(warnings.length).toBeGreaterThan(0);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('비동기 테스트 헬퍼 사용', () => {
    it('expectRuleError를 사용한 에러 검증', async () => {
      const eslint = createESLint(javascriptConfig);
      const code = `const x = 1 == 1;`;

      // eqeqeq 규칙 에러가 발생해야 함
      await expectRuleError(eslint, code, 'eqeqeq');
    });

    it('expectNoRuleError를 사용한 에러 없음 검증', async () => {
      const eslint = createESLint(javascriptConfig);
      const code = `const x = 1 === 1;`;

      // eqeqeq 규칙 에러가 없어야 함
      await expectNoRuleError(eslint, code, 'eqeqeq');
    });
  });

  describe('여러 규칙 동시 테스트', () => {
    it('testMultipleRules를 사용한 복수 규칙 검증', async () => {
      const eslint = createESLint(javascriptConfig);
      const code = `
        let x = 1;
        const y = 2;
        console.log(x === y);
      `;

      await testMultipleRules(eslint, code, [
        {
          ruleId: 'prefer-const',
          shouldError: true,
        }, // x는 재할당 없으므로 const여야 함
        {
          ruleId: 'no-console',
          shouldError: true,
        }, // console.log 사용
        {
          ruleId: 'eqeqeq',
          shouldError: false,
        }, // === 사용했으므로 에러 없음
      ]);
    });
  });
});
