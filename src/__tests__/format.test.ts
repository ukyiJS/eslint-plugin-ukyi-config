import { ESLint } from 'eslint';
import { describe, it, expect, beforeEach } from 'vitest';

import plugin from '../index';

describe('코드 포맷팅 규칙 테스트', () => {
  let eslint: ESLint;

  beforeEach(() => {
    eslint = new ESLint({
      baseConfig: plugin.configs.format,
      overrideConfigFile: true,
      ignore: false,
    });
  });

  describe('화살표 함수 매개변수 괄호', () => {
    it('화살표 함수의 단일 매개변수에 불필요한 괄호가 있으면 에러가 발생해야 한다 (@stylistic/arrow-parens)', async () => {
      const code = `
        const fn1 = (x) => x + 1;
        const fn2 = (x, y) => x + y;
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/arrow-parens')).toBe(true);
    });
  });

  describe('점 표기법 위치', () => {
    it('체이닝에서 점(.)이 객체가 아닌 속성 앞에 위치해야 한다 (@stylistic/dot-location)', async () => {
      // dot-location 규칙은 객체 연결에서 . 위치가 object 대신 property에 있어야 함
      const code = `
const obj = foo.
bar.
baz;
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/dot-location')).toBe(true);
    });
  });

  describe('함수 호출 인자 줄바꿈', () => {
    it('함수 인자의 줄바꿈이 일관되지 않으면 에러가 발생해야 한다 (@stylistic/function-call-argument-newline)', async () => {
      const code = `
        fn(a, b,
           c);
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/function-call-argument-newline')).toBe(true);
    });
  });

  describe('이진 연산자 들여쓰기', () => {
    it('이진 연산자가 여러 줄에 걸쳐있을 때 적절한 들여쓰기가 필요하다 (@stylistic/indent-binary-ops)', async () => {
      const code = `
        const result = a +
        b +
        c;
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/indent-binary-ops')).toBe(true);
    });
  });

  describe('불필요한 세미콜론', () => {
    it('중복된 세미콜론이 있으면 에러가 발생해야 한다 (@stylistic/no-extra-semi)', async () => {
      const code = `
        const x = 1;;
        function foo() {
          return 5;;
        };
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.filter(m => m.ruleId === '@stylistic/no-extra-semi').length).toBeGreaterThan(0);
    });
  });

  describe('혼합 연산자 사용', () => {
    it('우선순위가 다른 연산자를 괄호 없이 혼합하면 에러가 발생해야 한다 (@stylistic/no-mixed-operators)', async () => {
      const code = `
        const a = 1 + 2 * 3;
        const b = x && y || z;
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.filter(m => m.ruleId === '@stylistic/no-mixed-operators').length).toBeGreaterThan(0);
    });
  });

  describe('단일 문장 위치', () => {
    it('블록이 아닌 단일 문장은 같은 줄에 위치해야 한다 (@stylistic/nonblock-statement-body-position)', async () => {
      const code = `
        if (true)
          console.log('test');
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/nonblock-statement-body-position')).toBe(true);
    });
  });

  describe('객체 중괄호 내부 줄바꿈', () => {
    it('객체에 여러 속성이 있을 때 적절한 줄바꿈이 필요하다 (@stylistic/object-curly-newline)', async () => {
      const code = `
        const obj = { a: 1, b: 2, c: 3, d: 4 };
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/object-curly-newline')).toBe(true);
    });
  });

  describe('객체 속성별 줄바꿈', () => {
    it('객체 속성이 여러 줄에 걸쳐있을 때 일관된 줄바꿈이 필요하다 (@stylistic/object-property-newline)', async () => {
      const code = `
        const obj = {
          a: 1, b: 2,
          c: 3
        };
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/object-property-newline')).toBe(true);
    });
  });

  describe('변수 선언별 줄바꿈', () => {
    it('한 줄에 여러 변수를 선언하면 에러가 발생해야 한다 (@stylistic/one-var-declaration-per-line)', async () => {
      const code = `
        let a = 1, b = 2;
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/one-var-declaration-per-line')).toBe(true);
    });
  });

  describe('문장 사이 빈 줄', () => {
    it('return 문 전에는 빈 줄이 있어야 한다 (@stylistic/padding-line-between-statements)', async () => {
      const code = `
        function test() {
          const x = 1;
          return x;
        }
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/padding-line-between-statements')).toBe(true);
    });

    it('변수 선언 후에는 빈 줄이 있어야 한다 (@stylistic/padding-line-between-statements)', async () => {
      const code = `
        const x = 1;
        console.log(x);
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/padding-line-between-statements')).toBe(true);
    });

    it('클래스 선언 전후에는 빈 줄이 있어야 한다 (@stylistic/padding-line-between-statements)', async () => {
      const code = `
        const x = 1;
        class MyClass {
          constructor() {}
        }
        const y = 2;
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.filter(m => m.ruleId === '@stylistic/padding-line-between-statements').length).toBeGreaterThan(0);
    });

    it('import 문 다음에는 빈 줄이 있어야 한다 (@stylistic/padding-line-between-statements)', async () => {
      const code = `
        import a from 'a';
        import b from 'b';
        const x = 1;
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/padding-line-between-statements')).toBe(true);
    });
  });

  describe('객체 속성명 따옴표', () => {
    it('필요하지 않은 속성명에 따옴표를 사용하면 에러가 발생해야 한다 (@stylistic/quote-props)', async () => {
      const code = `
        const obj = {
          'foo': 1,
          'bar-baz': 2
        };
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/quote-props')).toBe(true);
    });
  });

  describe('문자열 따옴표 스타일', () => {
    it('문자열에 큰따옴표를 사용하면 에러가 발생해야 한다 (@stylistic/quotes)', async () => {
      const code = `
        const str1 = "double quotes";
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.filter(m => m.ruleId === '@stylistic/quotes').length).toBe(1);
    });

    it('템플릿 리터럴 사용은 허용되어야 한다 (@stylistic/quotes)', async () => {
      const code = `
        const str = \`template literal\`;
        const str2 = \`Hello \${name}\`;
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.filter(m => m.ruleId === '@stylistic/quotes').length).toBe(0);
    });
  });

  describe('후행 쉼표', () => {
    it('여러 줄 배열/객체의 마지막 요소에 쉼표가 없으면 에러가 발생해야 한다 (@stylistic/comma-dangle)', async () => {
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

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.filter(m => m.ruleId === '@stylistic/comma-dangle').length).toBeGreaterThan(0);
    });
  });

  describe('객체 키-값 사이 간격', () => {
    it('객체의 키와 값 사이 간격이 일관되지 않으면 에러가 발생해야 한다 (@stylistic/key-spacing)', async () => {
      const code = `
        const obj = {
          a :1,
          b:  2
        };
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.filter(m => m.ruleId === '@stylistic/key-spacing').length).toBeGreaterThan(0);
    });
  });

  describe('계산된 속성 대괄호 간격', () => {
    it('계산된 속성의 대괄호 안에 공백이 있으면 에러가 발생해야 한다 (@stylistic/computed-property-spacing)', async () => {
      const code = `
        const obj = {};
        const key = 'foo';
        const value = obj[ key ];
      `;

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.some(m => m.ruleId === '@stylistic/computed-property-spacing')).toBe(true);
    });
  });

  describe('중괄호 위치 스타일', () => {
    it('중괄호가 이집트 스타일(1tbs)을 따르지 않으면 에러가 발생해야 한다 (@stylistic/brace-style)', async () => {
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

      const [result] = await eslint.lintText(code, { filePath: 'test.js' });
      const { messages } = result;

      expect(messages.filter(m => m.ruleId === '@stylistic/brace-style').length).toBeGreaterThan(0);
    });
  });

  describe('올바른 포맷팅 예시', () => {
    it('모든 포맷팅 규칙을 준수한 코드는 에러가 없어야 한다', async () => {
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

      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const { messages } = result;

      // 포맷 관련 규칙만 필터링 (다른 설정의 규칙 제외)
      const formatMessages = messages.filter(m => m.ruleId?.startsWith('@stylistic/'));

      expect(formatMessages.length).toBe(0);
    });
  });
});
