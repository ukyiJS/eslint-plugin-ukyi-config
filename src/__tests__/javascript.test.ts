import { ESLint } from 'eslint';
import plugin from '../index';
import { describe, it, expect, beforeEach } from 'vitest';

describe('JavaScript 설정 규칙', () => {
  let eslint: ESLint;

  beforeEach(() => {
    eslint = new ESLint({
      baseConfig: plugin.configs.javascript,
      overrideConfigFile: true,
      ignore: false
    });
  });

  describe('Import 규칙', () => {
    it('import/no-duplicates 규칙을 강제해야 함', async () => {
      const code = `
        import { foo } from './module';
        import { bar } from './module';
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'import/no-duplicates')).toBe(true);
    });

    it('적절한 그룹핑으로 import/order 규칙을 강제해야 함', async () => {
      const code = `
        import { local } from './local';
        import fs from 'fs';
        import React from 'react';
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'import/order')).toBe(true);
    });

    it('import/first 규칙을 강제해야 함', async () => {
      const code = `
        const x = 1;
        import fs from 'fs';
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'import/first')).toBe(true);
    });

    it('import/newline-after-import 규칙을 강제해야 함', async () => {
      const code = `
        import fs from 'fs';
        const x = 1;
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'import/newline-after-import')).toBe(true);
    });

    it('import/no-useless-path-segments 규칙을 강제해야 함', async () => {
      const code = `
        import foo from './foo/index.js';
        import bar from '../src/../src/bar';
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'import/no-useless-path-segments')).toBe(true);
    });
  });

  describe('동등성과 비교 규칙', () => {
    it('eqeqeq 규칙을 강제해야 함 (=== 및 !== 사용)', async () => {
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
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === 'eqeqeq').length).toBe(2);
    });

    it('no-self-compare 규칙에서 오류를 발생시켜야 한다', async () => {
      const code = `
        function test() {
          const x = 1;
          if (x === x) {
            return true;
          }
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'no-self-compare')).toBe(true);
    });
  });

  describe('콘솔 및 디버그 규칙', () => {
    it('콘솔 사용에 대해 경고해야 함', async () => {
      const code = `
        function test() {
          console.log('test');
          console.error('error');
          console.time('timer');
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === 'no-console').length).toBe(3);
    });

    it('debugger 구문에 대해 경고해야 함', async () => {
      const code = `
        function test() {
          debugger;
          return true;
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'no-debugger')).toBe(true);
    });
  });

  describe('제어 흐름 규칙', () => {
    it('no-else-return 규칙에서 오류를 발생시켜야 한다', async () => {
      const code = `
        function test(x) {
          if (x > 0) {
            return true;
          } else {
            return false;
          }
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'no-else-return')).toBe(true);
    });

    it('no-return-await 규칙에서 오류를 발생시켜야 한다', async () => {
      const code = `
        async function test() {
          return await Promise.resolve(1);
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'no-return-await')).toBe(true);
    });

    it('no-lonely-if 규칙에서 오류를 발생시켜야 한다', async () => {
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
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'no-lonely-if')).toBe(true);
    });
  });

  describe('스타일 및 선호도 규칙', () => {
    it('arrow-body-style as-needed 규칙을 강제해야 함', async () => {
      const code = `
        const fn1 = () => {
          return 1;
        };
        const fn2 = () => {
          console.log('test');
        };
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'arrow-body-style')).toBe(true);
    });

    it('object-shorthand 규칙을 강제해야 함', async () => {
      const code = `
        const name = 'test';
        const obj = {
          name: name,
          method: function() {
            return true;
          }
        };
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === 'object-shorthand').length).toBeGreaterThan(0);
    });

    it('prefer-const 규칙을 강제해야 함', async () => {
      const code = `
        function test() {
          let x = 1;
          let y = 2;
          y = 3;
          return x + y;
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'prefer-const')).toBe(true);
    });

    it('prefer-destructuring 규칙을 강제해야 함', async () => {
      const code = `
        function test() {
          const arr = [1, 2, 3];
          const first = arr[0];
          
          const obj = { a: 1, b: 2 };
          const a = obj.a;
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === 'prefer-destructuring').length).toBe(2);
    });

    it('prefer-template 규칙을 강제해야 함', async () => {
      const code = `
        function test(name) {
          const message = 'Hello, ' + name + '!';
          return message;
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'prefer-template')).toBe(true);
    });

    it('prefer-object-spread 규칙을 강제해야 함', async () => {
      const code = `
        const obj1 = { a: 1 };
        const obj2 = Object.assign({}, obj1, { b: 2 });
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'prefer-object-spread')).toBe(true);
    });

    it('prefer-exponentiation-operator 규칙을 강제해야 함', async () => {
      const code = `
        const square = Math.pow(2, 2);
        const cube = Math.pow(3, 3);
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === 'prefer-exponentiation-operator').length).toBe(2);
    });

    it('newline-per-chained-call 규칙을 강제해야 함', async () => {
      const code = `
        const result = [1, 2, 3].map(x => x * 2).filter(x => x > 2).reduce((a, b) => a + b);
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === 'newline-per-chained-call')).toBe(true);
    });
  });

  describe('에러 처리 규칙', () => {
    it('빈 블록에 대해 경고하지만 빈 catch는 허용해야 함', async () => {
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
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      const emptyMessages = messages.filter(m => m.ruleId === 'no-empty');
      expect(emptyMessages.length).toBe(1); // Only the if block should trigger
    });

    it('no-self-assign 규칙에서 오류를 발생시켜야 한다', async () => {
      const code = `
        function test() {
          let x = 1;
          x = x;
          
          const obj = { a: 1 };
          obj.a = obj.a;
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === 'no-self-assign').length).toBe(2);
    });

    it('no-script-url 규칙에서 오류를 발생시켜야 한다', async () => {
      const code = `
        const url = 'javascript:void(0)';
        const link = 'javascript:alert("XSS")';
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === 'no-script-url').length).toBe(2);
    });
  });

  describe('올바른 코드 예시', () => {
    it('적절히 포맷된 코드에 대해 최소한의 오류만 있어야 한다', async () => {
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
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      const relevantMessages = messages.filter(m => m.ruleId !== 'import/no-cycle');
      
      expect(relevantMessages.length).toBe(0);
    });
  });
});