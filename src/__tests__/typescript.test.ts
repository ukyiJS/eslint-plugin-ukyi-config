import * as path from 'node:path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  createTempProject,
  cleanupTempProject,
  createTypeAwareESLint,
  writeTestFile,
} from './helpers/typescript-with-type-checking-configs';

import type { ESLint } from 'eslint';

describe('TypeScript 코드 품질 규칙 테스트', () => {
  let eslint: ESLint;
  let tempDir: string;

  beforeEach(() => {
    // 임시 프로젝트 생성
    tempDir = createTempProject();
    eslint = createTypeAwareESLint(tempDir);
  });

  afterEach(() => {
    // 임시 디렉토리 정리
    cleanupTempProject();
  });

  describe('빈 객체 타입 사용', () => {
    it('빈 객체 타입({}) 사용이 허용되어야 한다 (@typescript-eslint/no-empty-object-type - off)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type EmptyObject = {};
interface EmptyInterface {}
const obj: EmptyObject = {};
const impl: EmptyInterface = {};
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const errors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-empty-object-type');

      expect(errors.length).toBe(0);
    });
  });

  describe('빈 함수 사용', () => {
    it('특정 유형의 빈 함수는 허용되어야 한다 (@typescript-eslint/no-empty-function)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
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

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const emptyFunctionErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-empty-function');

      expect(emptyFunctionErrors.length).toBe(0);
    });

    it('빈 제너레이터 함수를 사용하면 에러가 발생해야 한다 (@typescript-eslint/no-empty-function)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
function* emptyGenerator() {}
const gen = emptyGenerator();
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const emptyFunctionErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-empty-function');

      expect(emptyFunctionErrors.length).toBe(1);
    });
  });

  describe('any 타입 사용 제한', () => {
    it('명시적으로 any 타입을 사용하면 에러가 발생해야 한다 (@typescript-eslint/no-explicit-any)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
let value: any = 42;
console.log(value);
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const anyErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-explicit-any');

      expect(anyErrors.length).toBe(1);
    });

    it('rest 매개변수에서는 any[] 타입이 허용되어야 한다 (@typescript-eslint/no-explicit-any)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
function fn(...args: any[]) {
  console.log(args);
}
fn(1, 2, 3);
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const anyErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-explicit-any');

      expect(anyErrors.length).toBe(0);
    });
  });

  describe('타입 임포트 일관성', () => {
    it('타입만 임포트할 때는 type import를 사용해야 한다 (@typescript-eslint/consistent-type-imports)', async () => {
      // 실제로 다른 파일이 필요하므로 간단한 타입 파일 생성
      writeTestFile('types.ts', `
export interface MyType {
  name: string;
}
export const myValue = 42;
`);

      const filePath = path.join(tempDir, 'test.ts');
      const code = `
import type { MyType } from './types';
import { myValue } from './types';

const data: MyType = { name: 'test' };
console.log(myValue);
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);

      expect(result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-type-imports').length).toBe(0);
    });
  });

  describe('배열 타입 표기법', () => {
    it('Array<T> 문법 대신 T[] 문법을 사용해야 한다 (@typescript-eslint/array-type)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Numbers = Array<number>;
const nums: Numbers = [1, 2, 3];
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const arrayErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/array-type');

      expect(arrayErrors.length).toBe(1);
    });

    it('T[] 문법은 허용되어야 한다 (@typescript-eslint/array-type)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Numbers = number[];
const nums: Numbers = [1, 2, 3];
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const arrayErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/array-type');

      expect(arrayErrors.length).toBe(0);
    });
  });

  describe('인덱스 시그니처 스타일', () => {
    it('단순한 인덱스 시그니처는 Record 타입을 사용해야 한다 (@typescript-eslint/consistent-indexed-object-style)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Dict = { [key: string]: string };
const dict: Dict = { a: 'b' };
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const indexErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-indexed-object-style');

      expect(indexErrors.length).toBe(1);
    });

    it('Record 타입 사용은 허용되어야 한다 (@typescript-eslint/consistent-indexed-object-style)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Dict = Record<string, string>;
const dict: Dict = { a: 'b' };
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const indexErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-indexed-object-style');

      expect(indexErrors.length).toBe(0);
    });
  });

  describe('타입 정의 일관성', () => {
    it('객체 타입 정의에 type 대신 interface를 사용해야 한다 (@typescript-eslint/consistent-type-definitions)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Person = { name: string; age: number; };
const person: Person = { name: 'John', age: 30 };
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const typeDefErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-type-definitions');

      expect(typeDefErrors.length).toBe(1);
    });

    it('interface 사용은 허용되어야 한다 (@typescript-eslint/consistent-type-definitions)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
interface Person { name: string; age: number; }
const person: Person = { name: 'John', age: 30 };
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const typeDefErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-type-definitions');

      expect(typeDefErrors.length).toBe(0);
    });

    it('.d.ts 파일에서는 type alias가 허용되어야 한다 (@typescript-eslint/consistent-type-definitions)', async () => {
      const filePath = path.join(tempDir, 'test.d.ts');
      const code = `
type Person = { name: string; age: number; };
export { Person };
`;

      writeTestFile('test.d.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const typeDefErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/consistent-type-definitions');

      expect(typeDefErrors.length).toBe(0);
    });
  });

  describe('클래스 멤버 순서', () => {
    it('클래스 멤버가 올바른 순서로 정렬되지 않으면 에러가 발생해야 한다 (@typescript-eslint/member-ordering)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
class MyClass {
  method() {}
  constructor() {}
  field = 1;
  static staticField = 2;
}
const instance = new MyClass();
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const orderingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/member-ordering');

      expect(orderingErrors.length).toBeGreaterThan(0);
    });

    it('올바른 순서로 정렬된 클래스 멤버는 허용되어야 한다 (@typescript-eslint/member-ordering)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
class MyClass {
  static staticField = 2;
  field = 1;
  constructor() {}
  method() {}
}
const instance = new MyClass();
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const orderingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/member-ordering');

      expect(orderingErrors.length).toBe(0);
    });
  });

  describe('메서드 시그니처 표기법', () => {
    it('메서드 표기법 대신 프로퍼티 표기법을 사용해야 한다 (@typescript-eslint/method-signature-style)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
interface MyInterface {
  method(): void;
}
const impl: MyInterface = { method: () => {} };
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const methodErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/method-signature-style');

      expect(methodErrors.length).toBe(1);
    });

    it('프로퍼티 스타일 메서드 시그니처는 허용되어야 한다 (@typescript-eslint/method-signature-style)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
interface MyInterface {
  method: () => void;
}
const impl: MyInterface = { method: () => {} };
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const methodErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/method-signature-style');

      expect(methodErrors.length).toBe(0);
    });
  });

  describe('non-null assertion 사용', () => {
    it('== 비교와 함께 사용된 non-null assertion은 에러가 발생해야 한다 (@typescript-eslint/no-confusing-non-null-assertion)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
declare const a: string | null;
declare const b: string;
const isEqual = a! == b;
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const confusingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-confusing-non-null-assertion');

      expect(confusingErrors.length).toBe(1);
    });

    it('명확하게 괄호로 감싼 non-null assertion은 허용되어야 한다 (@typescript-eslint/no-confusing-non-null-assertion)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
declare const a: string | null;
declare const b: string;
const isEqual = (a!) === b;
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const confusingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-confusing-non-null-assertion');

      expect(confusingErrors.length).toBe(0);
    });
  });

  describe('유니온 타입 정렬', () => {
    it('유니온 타입의 구성 요소가 정렬되지 않으면 에러가 발생해야 한다 (@typescript-eslint/sort-type-constituents)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Mixed = number | string | boolean;
const value: Mixed = 42;
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const sortErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/sort-type-constituents');

      expect(sortErrors.length).toBe(1);
    });

    it('정렬된 유니온 타입은 허용되어야 한다 (@typescript-eslint/sort-type-constituents)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Mixed = boolean | number | string;
const value: Mixed = 42;
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const sortErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/sort-type-constituents');

      expect(sortErrors.length).toBe(0);
    });
  });

  describe('사용하지 않는 변수', () => {
    it('사용하지 않는 변수가 있으면 경고가 발생해야 한다 (@typescript-eslint/no-unused-vars)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `const unused = 42;`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const unusedErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-unused-vars');

      expect(unusedErrors.length).toBe(1);
      expect(unusedErrors[0].severity).toBe(1); // warning
    });

    it('언더스코어(_)로 시작하는 변수는 무시되어야 한다 (@typescript-eslint/no-unused-vars)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
const _unused = 42;
function fn(_unusedParam: number) {}
try {
  throw new Error('test');
} catch (_error) {}
fn(1);
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const unusedErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-unused-vars');

      expect(unusedErrors.length).toBe(0);
    });
  });

  describe('switch문 완전성 검사', () => {
    it('유니온 타입의 모든 경우를 처리하지 않은 switch문은 에러가 발생해야 한다 (@typescript-eslint/switch-exhaustiveness-check)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Status = 'error' | 'pending' | 'success';
function handleStatus(status: Status) {
  switch (status) {
    case 'pending':
      return 'Loading...';
    case 'success':
      return 'Done!';
  }
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const switchErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/switch-exhaustiveness-check');

      expect(switchErrors.length).toBe(1);
    });

    it('모든 경우를 처리한 switch문은 허용되어야 한다 (@typescript-eslint/switch-exhaustiveness-check)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Status = 'error' | 'pending' | 'success';
function handleStatus(status: Status) {
  switch (status) {
    case 'pending':
      return 'Loading...';
    case 'success':
      return 'Done!';
    case 'error':
      return 'Failed!';
  }
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const switchErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/switch-exhaustiveness-check');

      expect(switchErrors.length).toBe(0);
    });

    it('default case가 있는 switch문은 허용되어야 한다 (@typescript-eslint/switch-exhaustiveness-check)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Status = 'error' | 'pending' | 'success';
function handleStatus(status: Status) {
  switch (status) {
    case 'pending':
      return 'Loading...';
    default:
      return 'Unknown';
  }
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const switchErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/switch-exhaustiveness-check');

      expect(switchErrors.length).toBe(1);
    });
  });

  describe('Promise 처리 (간단한 케이스)', () => {
    it('명시적으로 void를 사용한 Promise 무시는 허용되어야 한다 (@typescript-eslint/no-floating-promises)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
// void 연산자로 명시적으로 무시
void Promise.resolve(42);

// 변수에 할당
const promise = Promise.resolve(42);
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const promiseErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-floating-promises');

      // void와 변수 할당은 허용되므로 에러가 없어야 함
      expect(promiseErrors.length).toBe(0);
    });
  });

  describe('async 함수에서 await 사용', () => {
    it('await가 없는 async 함수는 에러가 발생해야 한다 (@typescript-eslint/require-await)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
async function noAwait() {
  return 42;
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const awaitErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/require-await');

      expect(awaitErrors.length).toBe(1);
    });

    it('await가 있는 async 함수는 허용되어야 한다 (@typescript-eslint/require-await)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
async function hasAwait() {
  const result = await Promise.resolve(42);
  return result;
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const awaitErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/require-await');

      expect(awaitErrors.length).toBe(0);
    });
  });

  describe('불필요한 조건문 검사 (간단한 케이스)', () => {
    it('리터럴 true/false 조건은 경고가 발생해야 한다 (@typescript-eslint/no-unnecessary-condition)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
// 리터럴 true는 항상 참
if (true) {
  console.log('always runs');
}

// 리터럴 false는 항상 거짓
if (false) {
  console.log('never runs');
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const conditionErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-unnecessary-condition');

      // 리터럴 불린 값은 불필요한 조건으로 간주
      expect(conditionErrors.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('불필요한 타입 단언', () => {
    it('불필요한 타입 단언을 사용하면 에러가 발생해야 한다 (@typescript-eslint/no-unnecessary-type-assertion)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
const value: string = 'hello';
const str = value as string; // unnecessary
console.log(str);
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const assertionErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-unnecessary-type-assertion');

      expect(assertionErrors.length).toBe(1);
    });

    it('필요한 타입 단언은 허용되어야 한다 (@typescript-eslint/no-unnecessary-type-assertion)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
const value: unknown = 'hello';
const str = value as string;
console.log(str);
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const assertionErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-unnecessary-type-assertion');

      expect(assertionErrors.length).toBe(0);
    });
  });

  describe('optional chaining 사용', () => {
    it('&& 연산자로 null 체크를 하면 에러가 발생해야 한다 (@typescript-eslint/prefer-optional-chain)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
interface User {
  address?: {
    street?: string;
  };
}

function getStreet(user: User) {
  return user.address && user.address.street;
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const optionalErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/prefer-optional-chain');

      expect(optionalErrors.length).toBe(1);
    });

    it('optional chaining(?.) 사용은 허용되어야 한다 (@typescript-eslint/prefer-optional-chain)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
interface User {
  address?: {
    street?: string;
  };
}

function getStreet(user: User) {
  return user.address?.street;
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const optionalErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/prefer-optional-chain');

      expect(optionalErrors.length).toBe(0);
    });
  });

  describe('nullish coalescing 사용', () => {
    it('|| 연산자로 null/undefined를 체크하면 에러가 발생해야 한다 (@typescript-eslint/prefer-nullish-coalescing)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
function getValue(value: string | null) {
  return value || 'default';
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const nullishErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/prefer-nullish-coalescing');

      expect(nullishErrors.length).toBe(1);
    });

    it('nullish coalescing(??)을 사용하면 허용되어야 한다 (@typescript-eslint/prefer-nullish-coalescing)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
function getValue(value: string | null) {
  return value ?? 'default';
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const nullishErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/prefer-nullish-coalescing');

      // ?? 사용은 권장되므로 에러가 없어야 함
      expect(nullishErrors.length).toBe(0);
    });
  });

  describe('네이밍 컨벤션', () => {
    it('네이밍 컨벤션을 위반한 변수명은 에러가 발생해야 한다 (@typescript-eslint/naming-convention)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `const bad_name_wrong = 'test';

console.log(bad_name_wrong);
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const namingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/naming-convention');

      expect(namingErrors.length).toBe(1);
    });

    it('올바른 네이밍 컨벤션을 따른 코드는 허용되어야 한다 (@typescript-eslint/naming-convention)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
// 변수
const camelCase = 'test';
const UPPER_CASE = 'CONSTANT';
const _privateVar = 'private';

// 함수
function myFunction() {}
const myArrowFunction = () => {};

// 파라미터
function fn(param: string, _unusedParam: number) {}

// 인터페이스
interface UserInterface {}

// 타입 별칭
type UserType = {};

// Enum
enum Status {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

// 사용
console.log(camelCase, UPPER_CASE, _privateVar);
myFunction();
myArrowFunction();
fn('test', 0);
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const namingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/naming-convention');

      expect(namingErrors.length).toBe(0);
    });

    it('PascalCase를 따르지 않은 인터페이스/타입/Enum 이름은 에러가 발생해야 한다 (@typescript-eslint/naming-convention)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
interface userInterface {}
type userType = {};
enum status {
  pending = 'PENDING'
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const namingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/naming-convention');

      expect(namingErrors.length).toBe(4); // interface, type, enum, enumMember 모두 에러
    });
  });

  describe('타입 추론 가능한 곳에서 타입 명시', () => {
    it('타입 추론이 가능한 곳에서 타입을 명시하면 에러가 발생해야 한다 (@typescript-eslint/no-inferrable-types)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
const myNumber: number = 5;
const myString: string = "hello";
const myBoolean: boolean = true;
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const inferrableErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-inferrable-types');

      expect(inferrableErrors.length).toBe(3);
    });

    it('타입 추론을 사용하면 에러가 없어야 한다 (@typescript-eslint/no-inferrable-types)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
const myNumber = 5;
const myString = "hello";
const myBoolean = true;
const myArray: string[] = []; // 빈 배열은 타입 명시 필요
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const inferrableErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-inferrable-types');

      expect(inferrableErrors.length).toBe(0);
    });
  });

  describe('return await 패턴 (간단한 케이스)', () => {
    it('try-catch 블록에서 return await를 사용하면 에러가 없어야 한다 (@typescript-eslint/return-await)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
async function fetchData() {
  try {
    // try 블록에서는 return await 권장
    return await Promise.resolve('data');
  } catch (error) {
    console.error(error);
    return null;
  }
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const returnAwaitErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/return-await');

      // try-catch에서 return await는 권장 패턴
      expect(returnAwaitErrors.length).toBe(0);
    });
  });

  describe('void 반환 함수 처리', () => {
    it('void 함수의 반환값을 사용하면 에러가 발생해야 한다 (@typescript-eslint/no-confusing-void-expression)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
function logMessage(msg: string): void {
  console.log(msg);
}

const result = logMessage('hello');
const wrapped = () => logMessage('world');
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const voidErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-confusing-void-expression');

      expect(voidErrors.length).toBe(2);
    });

    it('void 함수를 올바르게 사용하면 에러가 없어야 한다 (@typescript-eslint/no-confusing-void-expression)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
function logMessage(msg: string): void {
  console.log(msg);
}

logMessage('hello');
const wrapped = () => {
  logMessage('world');
};
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const voidErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-confusing-void-expression');

      expect(voidErrors.length).toBe(0);
    });
  });

  describe('문자열 시작/끝 체크 메서드', () => {
    it('indexOf를 사용한 시작 체크는 에러가 발생해야 한다 (@typescript-eslint/prefer-string-starts-ends-with)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
const str = 'hello world';
if (str.indexOf('hello') === 0) {
  console.log('starts with hello');
}
if (str.lastIndexOf('world') === str.length - 'world'.length) {
  console.log('ends with world');
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const stringMethodErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/prefer-string-starts-ends-with');

      expect(stringMethodErrors.length).toBe(2);
    });

    it('startsWith/endsWith 사용은 허용되어야 한다 (@typescript-eslint/prefer-string-starts-ends-with)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
const str = 'hello world';
if (str.startsWith('hello')) {
  console.log('starts with hello');
}
if (str.endsWith('world')) {
  console.log('ends with world');
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const stringMethodErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/prefer-string-starts-ends-with');

      expect(stringMethodErrors.length).toBe(0);
    });
  });

  describe('인터페이스/타입 멤버 구분자', () => {
    it('interface 멤버 구분자로 세미콜론을 사용하지 않으면 에러가 발생해야 한다 (@stylistic/member-delimiter-style)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
interface Foo {
  a: string,
  b: number
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const delimiterErrors = result.messages.filter(m => m.ruleId === '@stylistic/member-delimiter-style');

      expect(delimiterErrors.length).toBeGreaterThan(0);
    });

    it('interface 멤버 구분자로 세미콜론 사용은 허용되어야 한다 (@stylistic/member-delimiter-style)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
interface Foo {
  a: string;
  b: number;
}
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const delimiterErrors = result.messages.filter(m => m.ruleId === '@stylistic/member-delimiter-style');

      expect(delimiterErrors.length).toBe(0);
    });

    it('type alias 멤버 구분자로 세미콜론을 사용하지 않으면 에러가 발생해야 한다 (@stylistic/member-delimiter-style)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Foo = {
  a: string,
  b: number
};
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const delimiterErrors = result.messages.filter(m => m.ruleId === '@stylistic/member-delimiter-style');

      expect(delimiterErrors.length).toBeGreaterThan(0);
    });

    it('type alias 멤버 구분자로 세미콜론 사용은 허용되어야 한다 (@stylistic/member-delimiter-style)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
type Foo = {
  a: string;
  b: number;
};
`;

      writeTestFile('test.ts', code);

      const [result] = await eslint.lintFiles([filePath]);
      const delimiterErrors = result.messages.filter(m => m.ruleId === '@stylistic/member-delimiter-style');

      expect(delimiterErrors.length).toBe(0);
    });
  });
});
