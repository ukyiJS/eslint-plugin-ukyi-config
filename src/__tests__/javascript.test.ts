import { describe, it, expect, beforeEach } from 'vitest';

import plugin from '../index';
import {
  createESLint,
  lintText,
  hasRuleError,
  countRuleErrors,
} from './helpers/lint';

import type { ESLint } from 'eslint';

describe('JavaScript 코드 품질 규칙 테스트', () => {
  let eslint: ESLint;

  beforeEach(() => {
    eslint = createESLint(plugin.configs.javascript);
  });

  describe('동등성 비교 연산자', () => {
    it('느슨한 동등 비교(==, !=)를 사용하면 에러가 발생해야 한다 (eqeqeq)', async () => {
      const code = `
        function test() {
          const x = 1;
          if (x == 1) {
            return true;
          }
          if (x != 2) {
            return false;
          }
        }
      `;

      const result = await lintText(eslint, code);

      expect(countRuleErrors(result.messages, 'eqeqeq')).toBe(2);
    });

    it('변수를 자기 자신과 비교하면 에러가 발생해야 한다 (no-self-compare)', async () => {
      const code = `
        function test() {
          const x = 1;
          if (x === x) {
            return true;
          }
        }
      `;

      const result = await lintText(eslint, code);

      expect(hasRuleError(result.messages, 'no-self-compare')).toBe(true);
    });
  });

  describe('콘솔 및 디버그 사용', () => {
    it('console 메서드를 사용하면 경고가 발생해야 한다 (no-console)', async () => {
      const code = `
        function test() {
          console.log('test');
          console.error('error');
          console.time('timer');
        }
      `;

      const result = await lintText(eslint, code);

      expect(countRuleErrors(result.messages, 'no-console')).toBe(3);
    });

    it('debugger 문을 사용하면 경고가 발생해야 한다 (no-debugger)', async () => {
      const code = `
        function test() {
          debugger;
          return true;
        }
      `;

      const result = await lintText(eslint, code);

      expect(hasRuleError(result.messages, 'no-debugger')).toBe(true);
    });
  });

  describe('제어 흐름 최적화', () => {
    it('return 문 다음에 else를 사용하면 에러가 발생해야 한다 (no-else-return)', async () => {
      const code = `
        function test(x) {
          if (x > 0) {
            return true;
          } else {
            return false;
          }
        }
      `;

      const result = await lintText(eslint, code);

      expect(hasRuleError(result.messages, 'no-else-return')).toBe(true);
    });

    it('불필요하게 return await를 사용하면 에러가 발생해야 한다 (no-return-await)', async () => {
      const code = `
        async function test() {
          return await Promise.resolve(1);
        }
      `;

      const result = await lintText(eslint, code);

      expect(hasRuleError(result.messages, 'no-return-await')).toBe(true);
    });

    it('else 블록 안에 단독 if문이 있으면 에러가 발생해야 한다 (no-lonely-if)', async () => {
      const code = `
        function test(x, y) {
          if (x) {
            // do something
          } else {
            if (y) {
              return true;
            }
          }
        }
      `;

      const result = await lintText(eslint, code);

      expect(hasRuleError(result.messages, 'no-lonely-if')).toBe(true);
    });
  });

  describe('코드 스타일 및 선호 규칙', () => {
    it('화살표 함수에 불필요한 중괄호를 사용하면 에러가 발생해야 한다 (arrow-body-style)', async () => {
      const code = `
        const fn1 = () => {
          return 1;
        };
        const fn2 = () => {
          console.log('test');
        };
      `;

      const result = await lintText(eslint, code);

      expect(hasRuleError(result.messages, 'arrow-body-style')).toBe(true);
    });

    it('객체 속성과 메서드를 축약 표기법으로 작성하지 않으면 에러가 발생해야 한다 (object-shorthand)', async () => {
      const code = `
        const name = 'test';
        const obj = {
          name: name,
          method: function() {
            return true;
          }
        };
      `;

      const result = await lintText(eslint, code);

      expect(countRuleErrors(result.messages, 'object-shorthand')).toBeGreaterThan(0);
    });

    it('재할당하지 않는 변수를 let으로 선언하면 에러가 발생해야 한다 (prefer-const)', async () => {
      const code = `
        function test() {
          let x = 1;
          let y = 2;
          y = 3;
          return x + y;
        }
      `;

      const result = await lintText(eslint, code);

      expect(hasRuleError(result.messages, 'prefer-const')).toBe(true);
    });

    it('배열과 객체에서 구조 분해 할당을 사용하지 않으면 에러가 발생해야 한다 (prefer-destructuring)', async () => {
      const code = `
        function test() {
          const arr = [1, 2, 3];
          const first = arr[0];
          
          const obj = { a: 1, b: 2 };
          const a = obj.a;
        }
      `;

      const result = await lintText(eslint, code);

      expect(countRuleErrors(result.messages, 'prefer-destructuring')).toBe(2);
    });

    it('문자열 연결에 + 연산자를 사용하면 에러가 발생해야 한다 (prefer-template)', async () => {
      const code = `
        function test(name) {
          const message = 'Hello, ' + name + '!';
          return message;
        }
      `;

      const result = await lintText(eslint, code);

      expect(hasRuleError(result.messages, 'prefer-template')).toBe(true);
    });

    it('Object.assign 대신 전개 연산자를 사용하지 않으면 에러가 발생해야 한다 (prefer-object-spread)', async () => {
      const code = `
        const obj1 = { a: 1 };
        const obj2 = Object.assign({}, obj1, { b: 2 });
      `;

      const result = await lintText(eslint, code);

      expect(hasRuleError(result.messages, 'prefer-object-spread')).toBe(true);
    });

    it('Math.pow 대신 거듭제곱 연산자(**)를 사용하지 않으면 에러가 발생해야 한다 (prefer-exponentiation-operator)', async () => {
      const code = `
        const square = Math.pow(2, 2);
        const cube = Math.pow(3, 3);
      `;

      const result = await lintText(eslint, code);

      expect(countRuleErrors(result.messages, 'prefer-exponentiation-operator')).toBe(2);
    });

    it('메서드 체이닝이 긴 경우 줄바꿈이 없으면 에러가 발생해야 한다 (newline-per-chained-call)', async () => {
      const code = `
        const result = [1, 2, 3].map(x => x * 2).filter(x => x > 2).reduce((a, b) => a + b);
      `;

      const result = await lintText(eslint, code);

      expect(hasRuleError(result.messages, 'newline-per-chained-call')).toBe(true);
    });
  });

  describe('에러 처리 및 코드 안전성', () => {
    it('빈 블록은 에러가 발생하지만 빈 catch 블록은 허용되어야 한다 (no-empty)', async () => {
      const code = `
        function test() {
          if (true) {
          }
          
          try {
            throw new Error();
          } catch (e) {
          }
        }
      `;

      const result = await lintText(eslint, code);

      const emptyMessages = countRuleErrors(result.messages, 'no-empty');

      expect(emptyMessages).toBe(1); // Only the if block should trigger
    });

    it('변수를 자기 자신에게 할당하면 에러가 발생해야 한다 (no-self-assign)', async () => {
      const code = `
        function test() {
          let x = 1;
          x = x;
          
          const obj = { a: 1 };
          obj.a = obj.a;
        }
      `;

      const result = await lintText(eslint, code);

      expect(countRuleErrors(result.messages, 'no-self-assign')).toBe(2);
    });

    it('URL을 사용하면 에러가 발생해야 한다 (no-script-url)', async () => {
      const code = `
        const url = 'javascript:void(0)';
        const link = 'javascript:alert("XSS")';
      `;

      const result = await lintText(eslint, code);

      expect(countRuleErrors(result.messages, 'no-script-url')).toBe(2);
    });
  });

  describe('올바른 JavaScript 코드 예시', () => {
    it('모든 JavaScript 품질 규칙을 준수한 코드는 에러가 없어야 한다', async () => {
      const code = `
        const config = {
          name: 'test',
          version: '1.0.0',
          enabled: true
        };

        function processData(data) {
          const { name, value } = data;
          
          if (!name) {
            return null;
          }
          
          return \`Processing \${name} with value \${value}\`;
        }

        const calculate = (x, y) => x ** y;

        async function getData(url) {
          const response = await Promise.resolve({ data: url });
          return response.data;
        }

        function useConfig() {
          return config.name;
        }

        export { processData, calculate, getData, useConfig };
      `;

      const result = await lintText(eslint, code);

      const relevantMessages = result.messages.filter(m => m.ruleId !== 'import/no-cycle');

      expect(relevantMessages.length).toBe(0);
    });
  });
});
