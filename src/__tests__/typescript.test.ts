import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ESLint } from 'eslint';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { formatConfig } from '../configs/format';
import { typescriptConfig } from '../configs/typescript';

const _dirname = path.dirname(fileURLToPath(import.meta.url));

describe('TypeScript 코드 품질 규칙 테스트', () => {
  let eslint: ESLint;
  let tempDir: string;

  beforeEach(() => {
    // 임시 디렉토리 생성
    tempDir = path.join(_dirname, 'temp-test-project');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // 임시 tsconfig.json 생성
    const tsconfigPath = path.join(tempDir, 'tsconfig.json');

    fs.writeFileSync(tsconfigPath, JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        lib: ['ES2022'],
        moduleResolution: 'node',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
      },
      include: ['**/*.ts', '**/*.tsx'],
    }, null, 2));

    // 타입 정보를 포함한 설정으로 ESLint 인스턴스 생성
    const configWithTypeInfo = [...formatConfig, ...typescriptConfig].map(config => {
      if (config.name === 'ukyi-config/typescript') {
        return {
          ...config,
          languageOptions: {
            ...config.languageOptions,
            parserOptions: {
              project: tsconfigPath,
              tsconfigRootDir: tempDir,
            },
          },
        };
      }

      return config;
    });

    eslint = new ESLint({
      overrideConfigFile: true,
      baseConfig: configWithTypeInfo,
      ignore: false,
      cwd: tempDir,
    });
  });

  afterEach(() => {
    // 임시 디렉토리 정리
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, {
        recursive: true,
        force: true,
      });
    }
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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const anyErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-explicit-any');

      expect(anyErrors.length).toBe(0);
    });
  });

  describe('타입 임포트 일관성', () => {
    it('타입만 임포트할 때는 type import를 사용해야 한다 (@typescript-eslint/consistent-type-imports)', async () => {
      // 실제로 다른 파일이 필요하므로 간단한 타입 파일 생성
      const typeFilePath = path.join(tempDir, 'types.ts');

      fs.writeFileSync(typeFilePath, `
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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const sortErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/sort-type-constituents');

      expect(sortErrors.length).toBe(0);
    });
  });

  describe('사용하지 않는 변수', () => {
    it('사용하지 않는 변수가 있으면 경고가 발생해야 한다 (@typescript-eslint/no-unused-vars)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `const unused = 42;`;

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const switchErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/switch-exhaustiveness-check');

      expect(switchErrors.length).toBe(1);
    });
  });

  describe('Promise 처리', () => {
    it('처리되지 않은 Promise가 있으면 에러가 발생해야 한다 (@typescript-eslint/no-floating-promises)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
async function fetchData() {
  return { data: 'test' };
}

function main() {
  fetchData(); // floating promise
}
`;

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const promiseErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-floating-promises');

      expect(promiseErrors.length).toBe(1);
    });

    it('await로 처리된 Promise는 허용되어야 한다 (@typescript-eslint/no-floating-promises)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
async function fetchData() {
  return { data: 'test' };
}

async function main() {
  await fetchData();
}
`;

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const promiseErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-floating-promises');

      expect(promiseErrors.length).toBe(0);
    });

    it('then/catch로 처리된 Promise는 허용되어야 한다 (@typescript-eslint/no-floating-promises)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
async function fetchData() {
  return { data: 'test' };
}

function main() {
  // then과 catch가 체인으로 연결되어야 함
  fetchData()
    .then(data => console.log(data))
    .catch(err => console.error(err));
}
`;

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const promiseErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-floating-promises');

      expect(promiseErrors.length).toBe(0);
    });

    it('void 연산자로 명시적으로 무시한 Promise는 허용되어야 한다 (@typescript-eslint/no-floating-promises)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
async function fetchData() {
  return { data: 'test' };
}

function main() {
  void fetchData();
}
`;

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const promiseErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-floating-promises');

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const awaitErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/require-await');

      expect(awaitErrors.length).toBe(0);
    });
  });

  describe('불필요한 조건문 검사', () => {
    it('항상 참인 조건문은 경고가 발생해야 한다 (@typescript-eslint/no-unnecessary-condition)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
const value = 42;
if (value !== null) {
  console.log(value);
}
`;

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const conditionErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-unnecessary-condition');

      expect(conditionErrors.length).toBe(1);
      expect(conditionErrors[0].severity).toBe(1); // warning
    });

    it('필요한 조건문은 허용되어야 한다 (@typescript-eslint/no-unnecessary-condition)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `
const value: number | null = Math.random() > 0.5 ? 42 : null;
if (value !== null) {
  console.log(value);
}
`;

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const conditionErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-unnecessary-condition');

      expect(conditionErrors.length).toBe(0);
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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const nullishErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/prefer-nullish-coalescing');

      expect(nullishErrors.length).toBe(0);
    });
  });

  describe('네이밍 컨벤션', () => {
    it('네이밍 컨벤션을 위반한 변수명은 에러가 발생해야 한다 (@typescript-eslint/naming-convention)', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      const code = `const bad_name_wrong = 'test';

console.log(bad_name_wrong);
`;

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const namingErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/naming-convention');

      expect(namingErrors.length).toBe(4); // interface, type, enum, enumMember 모두 에러
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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

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

      fs.writeFileSync(filePath, code);

      const [result] = await eslint.lintFiles([filePath]);
      const delimiterErrors = result.messages.filter(m => m.ruleId === '@stylistic/member-delimiter-style');

      expect(delimiterErrors.length).toBe(0);
    });
  });
});
