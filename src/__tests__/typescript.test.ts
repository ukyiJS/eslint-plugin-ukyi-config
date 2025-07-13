import { describe, it, expect, beforeEach } from 'vitest';
import { ESLint } from 'eslint';
import { typescriptConfig } from '../configs/typescript';

describe('TypeScript 설정 규칙', () => {
  let eslint: ESLint;

  beforeEach(() => {
    eslint = new ESLint({
      overrideConfigFile: true,
      baseConfig: typescriptConfig,
    });
  });

  describe('빈 객체 타입 규칙 (@typescript-eslint/no-empty-object-type)', () => {
    it('빈 객체 타입을 허용해야 함 (off 설정)', async () => {
      const code = `
        type EmptyObject = {};
        interface EmptyInterface {}
        const obj: EmptyObject = {};
        const impl: EmptyInterface = {};
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const errors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-empty-object-type');
      expect(errors.length).toBe(0);
    });
  });

  describe('빈 함수 규칙 (@typescript-eslint/no-empty-function)', () => {
    it('지정된 빈 함수를 허용해야 함', async () => {
      const code = `
        function emptyFunction() {}
        const arrowFunction = () => {};
        class MyClass {
          constructor() {}
          method() {}
        }
        
        // 사용하기
        emptyFunction();
        arrowFunction();
        new MyClass();
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const emptyFunctionErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-empty-function');
      expect(emptyFunctionErrors.length).toBe(0);
    });

    it('빈 제너레이터 함수에서 에러가 발생해야 함', async () => {
      const code = `
        function* emptyGenerator() {}
        const gen = emptyGenerator();
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const emptyFunctionErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-empty-function');
      expect(emptyFunctionErrors.length).toBe(1);
    });
  });

  describe('명시적 any 사용 규칙 (@typescript-eslint/no-explicit-any)', () => {
    it('명시적 any 사용 시 에러가 발생해야 함', async () => {
      const code = `
        let value: any = 42;
        console.log(value);
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const anyErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-explicit-any');
      expect(anyErrors.length).toBe(1);
    });

    it('rest 매개변수에서는 any를 허용해야 함', async () => {
      const code = `
        function fn(...args: any[]) {
          console.log(args);
        }
        fn(1, 2, 3);
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const anyErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-explicit-any');
      expect(anyErrors.length).toBe(0);
    });
  });

  describe('일관된 타입 임포트 규칙 (@typescript-eslint/consistent-type-imports)', () => {
    it('타입 전용 import를 사용해야 함', async () => {
      // 이 규칙은 타입 정보가 필요하므로 단위 테스트에서는 완전히 검증하기 어려움
      const code = `
        import type { MyType } from './types';
        type LocalType = MyType;
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      // type import는 문제없어야 함
      expect(result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-type-imports').length).toBe(0);
    });
  });

  describe('배열 타입 규칙 (@typescript-eslint/array-type)', () => {
    it('Array<T> 문법 사용 시 에러가 발생해야 함', async () => {
      const code = `
        type Numbers = Array<number>;
        const nums: Numbers = [1, 2, 3];
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const arrayErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/array-type');
      expect(arrayErrors.length).toBe(1);
    });

    it('T[] 문법을 허용해야 함', async () => {
      const code = `
        type Numbers = number[];
        const nums: Numbers = [1, 2, 3];
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const arrayErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/array-type');
      expect(arrayErrors.length).toBe(0);
    });
  });

  describe('일관된 인덱스 객체 스타일 규칙 (@typescript-eslint/consistent-indexed-object-style)', () => {
    it('단순 인덱스 시그니처에 Record를 사용하도록 강제해야 함', async () => {
      const code = `
        type Dict = { [key: string]: string };
        const dict: Dict = { a: 'b' };
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const indexErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-indexed-object-style');
      expect(indexErrors.length).toBe(1);
    });

    it('Record 문법을 허용해야 함', async () => {
      const code = `
        type Dict = Record<string, string>;
        const dict: Dict = { a: 'b' };
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const indexErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-indexed-object-style');
      expect(indexErrors.length).toBe(0);
    });
  });

  describe('일관된 타입 정의 규칙 (@typescript-eslint/consistent-type-definitions)', () => {
    it('객체 타입에 type alias 사용 시 에러가 발생해야 함', async () => {
      const code = `
        type Person = { name: string; age: number; };
        const person: Person = { name: 'John', age: 30 };
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const typeDefErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-type-definitions');
      expect(typeDefErrors.length).toBe(1);
    });

    it('interface를 허용해야 함', async () => {
      const code = `
        interface Person { name: string; age: number; }
        const person: Person = { name: 'John', age: 30 };
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const typeDefErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-type-definitions');
      expect(typeDefErrors.length).toBe(0);
    });

    it('.d.ts 파일에서는 비활성화되어야 함', async () => {
      const code = `
        type Person = { name: string; age: number; };
        export { Person };
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.d.ts' });
      const typeDefErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-type-definitions');
      expect(typeDefErrors.length).toBe(0);
    });
  });

  describe('멤버 정렬 규칙 (@typescript-eslint/member-ordering)', () => {
    it('잘못된 멤버 순서에서 에러가 발생해야 함', async () => {
      const code = `
        class MyClass {
          method() {}
          constructor() {}
          field = 1;
          static staticField = 2;
        }
        const instance = new MyClass();
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const orderingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/member-ordering');
      expect(orderingErrors.length).toBeGreaterThan(0);
    });

    it('올바른 멤버 순서를 허용해야 함', async () => {
      const code = `
        class MyClass {
          static staticField = 2;
          field = 1;
          constructor() {}
          method() {}
        }
        const instance = new MyClass();
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const orderingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/member-ordering');
      expect(orderingErrors.length).toBe(0);
    });
  });

  describe('메서드 시그니처 스타일 규칙 (@typescript-eslint/method-signature-style)', () => {
    it('프로퍼티 스타일 메서드 시그니처에서 에러가 발생해야 함', async () => {
      const code = `
        interface MyInterface {
          method: () => void;
        }
        const impl: MyInterface = { method: () => {} };
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const methodErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/method-signature-style');
      expect(methodErrors.length).toBe(1);
    });

    it('메서드 스타일 시그니처를 허용해야 함', async () => {
      const code = `
        interface MyInterface {
          method(): void;
        }
        const impl: MyInterface = { method: () => {} };
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const methodErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/method-signature-style');
      expect(methodErrors.length).toBe(0);
    });
  });

  describe('혼동되는 non-null assertion 규칙 (@typescript-eslint/no-confusing-non-null-assertion)', () => {
    it('혼란스러운 non-null assertion에서 에러가 발생해야 함', async () => {
      const code = `
        declare const a: string | null;
        declare const b: string;
        const isEqual = a! == b;
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const confusingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-confusing-non-null-assertion');
      expect(confusingErrors.length).toBe(1);
    });

    it('명확한 non-null assertion을 허용해야 함', async () => {
      const code = `
        declare const a: string | null;
        declare const b: string;
        const isEqual = (a!) === b;
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const confusingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-confusing-non-null-assertion');
      expect(confusingErrors.length).toBe(0);
    });
  });

  describe('타입 구성요소 정렬 규칙 (@typescript-eslint/sort-type-constituents)', () => {
    it('정렬되지 않은 유니온 타입에서 에러가 발생해야 함', async () => {
      const code = `
        type Mixed = number | string | boolean;
        const value: Mixed = 42;
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const sortErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/sort-type-constituents');
      expect(sortErrors.length).toBe(1);
    });

    it('정렬된 유니온 타입을 허용해야 함', async () => {
      const code = `
        type Mixed = boolean | number | string;
        const value: Mixed = 42;
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const sortErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/sort-type-constituents');
      expect(sortErrors.length).toBe(0);
    });
  });

  describe('사용하지 않는 변수 규칙 (@typescript-eslint/no-unused-vars)', () => {
    it('사용하지 않는 변수에 경고가 발생해야 함', async () => {
      const code = `const unused = 42;`;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const unusedErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-unused-vars');
      expect(unusedErrors.length).toBe(1);
      expect(unusedErrors[0].severity).toBe(1); // warning
    });

    it('언더스코어 접두사가 있는 변수는 무시해야 함', async () => {
      const code = `
        const _unused = 42;
        function fn(_unusedParam: number) {}
        try {
          throw new Error('test');
        } catch (_error) {}
        fn(1);
      `;
      const [result] = await eslint.lintText(code, { filePath: 'test.ts' });
      const unusedErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-unused-vars');
      expect(unusedErrors.length).toBe(0);
    });
  });
});