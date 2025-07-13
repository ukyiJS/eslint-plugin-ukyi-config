import { ESLint } from 'eslint';
import plugin from '../index';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Format 설정 규칙', () => {
  let eslint: ESLint;

  beforeEach(() => {
    eslint = new ESLint({
      baseConfig: plugin.configs.format,
      overrideConfigFile: true,
      ignore: false
    });
  });

  describe('화살표 함수 규칙', () => {
    it('@stylistic/arrow-parens 규칙을 강제해야 함 (as-needed)', async () => {
      const code = `
        const fn1 = (x) => x + 1;
        const fn2 = (x, y) => x + y;
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/arrow-parens')).toBe(true);
    });
  });

  describe('점 표기법 규칙', () => {
    it('@stylistic/dot-location 규칙을 강제해야 함 (property)', async () => {
      // dot-location 규칙은 객체 연결에서 . 위치가 object 대신 property에 있어야 함
      const code = `
const obj = foo.
bar.
baz;
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/dot-location')).toBe(true);
    });
  });

  describe('함수 호출 인자 규칙', () => {
    it('@stylistic/function-call-argument-newline 규칙을 강제해야 함 (consistent)', async () => {
      const code = `
        fn(a, b,
           c);
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/function-call-argument-newline')).toBe(true);
    });
  });

  describe('이진 연산자 들여쓰기', () => {
    it('@stylistic/indent-binary-ops 규칙을 강제해야 함 (2 spaces)', async () => {
      const code = `
        const result = a +
        b +
        c;
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/indent-binary-ops')).toBe(true);
    });
  });

  describe('멤버 구분자 스타일', () => {
    it.skip('@stylistic/member-delimiter-style 규칙을 강제해야 함 - TypeScript 파일에서만 작동', async () => {
      // 이 규칙은 TypeScript 파싱이 필요하므로 통합 테스트에서 확인
      const code = `
        interface Foo {
          a: string,
          b: number
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.ts' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/member-delimiter-style')).toBe(true);
    });
  });

  describe('세미콜론 규칙', () => {
    it('@stylistic/no-extra-semi 규칙을 강제해야 함', async () => {
      const code = `
        const x = 1;;
        function foo() {
          return 5;;
        };
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === '@stylistic/no-extra-semi').length).toBeGreaterThan(0);
    });
  });

  describe('혼합 연산자 규칙', () => {
    it('@stylistic/no-mixed-operators 규칙을 강제해야 함', async () => {
      const code = `
        const a = 1 + 2 * 3;
        const b = x && y || z;
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === '@stylistic/no-mixed-operators').length).toBeGreaterThan(0);
    });
  });

  describe('비블록 문장 위치', () => {
    it('@stylistic/nonblock-statement-body-position 규칙을 강제해야 함 (beside)', async () => {
      const code = `
        if (true)
          console.log('test');
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/nonblock-statement-body-position')).toBe(true);
    });
  });

  describe('객체 중괄호 줄바꿈', () => {
    it('@stylistic/object-curly-newline 규칙을 강제해야 함', async () => {
      const code = `
        const obj = { a: 1, b: 2, c: 3, d: 4 };
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/object-curly-newline')).toBe(true);
    });
  });

  describe('객체 속성 줄바꿈', () => {
    it('@stylistic/object-property-newline 규칙을 강제해야 함', async () => {
      const code = `
        const obj = {
          a: 1, b: 2,
          c: 3
        };
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/object-property-newline')).toBe(true);
    });
  });

  describe('변수 선언 줄바꿈', () => {
    it('@stylistic/one-var-declaration-per-line 규칙을 강제해야 함', async () => {
      const code = `
        let a = 1, b = 2;
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/one-var-declaration-per-line')).toBe(true);
    });
  });

  describe('문장 간 패딩 라인', () => {
    it('@stylistic/padding-line-between-statements 규칙을 강제해야 함 - return 전에 빈 줄', async () => {
      const code = `
        function test() {
          const x = 1;
          return x;
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/padding-line-between-statements')).toBe(true);
    });

    it('@stylistic/padding-line-between-statements 규칙을 강제해야 함 - 변수 선언 후 빈 줄', async () => {
      const code = `
        const x = 1;
        console.log(x);
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/padding-line-between-statements')).toBe(true);
    });

    it('@stylistic/padding-line-between-statements 규칙을 강제해야 함 - 블록문 전후 빈 줄', async () => {
      const code = `
        const x = 1;
        if (x > 0) {
          console.log(x);
        }
        const y = 2;
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/padding-line-between-statements')).toBe(true);
    });
  });

  describe('속성 따옴표', () => {
    it('@stylistic/quote-props 규칙을 강제해야 함 (as-needed)', async () => {
      const code = `
        const obj = {
          'foo': 1,
          'bar-baz': 2
        };
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/quote-props')).toBe(true);
    });
  });

  describe('문자열 따옴표', () => {
    it('@stylistic/quotes 규칙을 강제해야 함 (single quotes)', async () => {
      const code = `
        const str1 = "double quotes";
        const str2 = \`template literal\`;
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === '@stylistic/quotes').length).toBe(2);
    });
  });

  describe('쉼표 스타일', () => {
    it('@stylistic/comma-dangle 규칙을 강제해야 함 (always-multiline)', async () => {
      const code = `
        const arr = [
          1,
          2
        ];
        
        const obj = {
          a: 1,
          b: 2
        };
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === '@stylistic/comma-dangle').length).toBeGreaterThan(0);
    });
  });

  describe('키 간격', () => {
    it('@stylistic/key-spacing 규칙을 강제해야 함', async () => {
      const code = `
        const obj = {
          a :1,
          b:  2
        };
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === '@stylistic/key-spacing').length).toBeGreaterThan(0);
    });
  });

  describe('계산된 속성 간격', () => {
    it('@stylistic/computed-property-spacing 규칙을 강제해야 함 (never)', async () => {
      const code = `
        const obj = {};
        const key = 'foo';
        const value = obj[ key ];
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.some(m => m.ruleId === '@stylistic/computed-property-spacing')).toBe(true);
    });
  });

  describe('중괄호 스타일', () => {
    it('@stylistic/brace-style 규칙을 강제해야 함 (1tbs)', async () => {
      const code = `
        if (true)
        {
          console.log('test');
        }
        else
        {
          console.log('else');
        }
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;
      
      expect(messages.filter(m => m.ruleId === '@stylistic/brace-style').length).toBeGreaterThan(0);
    });
  });

  describe('올바른 포맷 코드 예시', () => {
    it('적절히 포맷된 코드에 대해 오류가 없어야 한다', async () => {
      const code = `
        import fs from 'fs';
        import path from 'path';

        const config = {
          name: 'test',
          version: '1.0.0',
          features: {
            enabled: true,
            timeout: 5000,
          },
        };

        interface User {
          id: number;
          name: string;
          email: string;
        }

        function processUser(user: User): string {
          const { name, email } = user;

          if (!name || !email) {
            throw new Error('Invalid user data');
          }

          return \`User: \${name} <\${email}>\`;
        }

        const calculate = (x: number, y: number) => x + y;

        async function fetchData(url: string) {
          try {
            const response = await fetch(url);
            const data = await response.json();

            return data;
          } catch (error) {
            console.error('Failed to fetch data:', error);

            return null;
          }
        }

        class DataProcessor {
          private data: any[];

          constructor(data: any[]) {
            this.data = data;
          }

          process() {
            return this.data
              .filter(item => item.active)
              .map(item => ({
                ...item,
                processed: true,
              }));
          }
        }

        export { processUser, calculate, fetchData, DataProcessor };
      `;
      
      const results = await eslint.lintText(code, { filePath: 'test.ts' });
      const messages = results[0].messages;
      
      // 포맷 관련 규칙만 필터링 (다른 설정의 규칙 제외)
      const formatMessages = messages.filter(m => m.ruleId?.startsWith('@stylistic/'));
      
      expect(formatMessages.length).toBe(0);
    });
  });
});