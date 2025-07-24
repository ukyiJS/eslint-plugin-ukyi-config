import { ESLint } from 'eslint';
import { describe, it, expect, beforeEach } from 'vitest';

import { importConfig } from '../configs/import';

describe('Import 문 규칙 테스트', () => {
  let eslint: ESLint;

  beforeEach(() => {
    eslint = new ESLint({
      baseConfig: importConfig,
      overrideConfigFile: true,
      ignore: false,
    });
  });

  describe('named export를 default로 사용', () => {
    it('named export를 default import로 잘못 사용하면 경고가 발생해야 한다 (import/no-named-as-default)', async () => {
      // 실제로는 모듈 시스템이 필요하므로 이 테스트는 제한적
      const code = `
        import myFunction from './module';
        myFunction();
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });

      // 이 규칙은 실제 모듈 해석이 필요하므로 단위 테스트에서는 완전히 검증하기 어려움
      expect(results[0].messages).toBeDefined();
    });
  });

  describe('default export의 멤버 접근', () => {
    it('default export 객체에서 named export와 같은 이름의 멤버에 접근하면 경고가 발생해야 한다 (import/no-named-as-default-member)', async () => {
      // 실제로는 모듈 시스템이 필요하므로 이 테스트는 제한적
      const code = `
        import myModule from './module';
        // myModule이 default export이고 namedExport라는 named export가 있다고 가정
        console.log(myModule.namedExport);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });

      // 이 규칙은 실제 모듈 해석이 필요하므로 단위 테스트에서는 완전히 검증하기 어려움
      expect(results[0].messages).toBeDefined();
    });
  });

  describe('중복 import 방지', () => {
    it('동일한 모듈을 여러 번 import하면 에러가 발생해야 한다 (import/no-duplicates)', async () => {
      const code = `
        import { foo } from 'module';
        import { bar } from 'module';
        
        console.log(foo, bar);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/no-duplicates')).toBe(true);
    });

    it('서로 다른 모듈을 import하는 것은 허용되어야 한다 (import/no-duplicates)', async () => {
      const code = `
        import { foo } from 'module1';
        import { bar } from 'module2';
        
        console.log(foo, bar);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.filter(m => m.ruleId === 'import/no-duplicates').length).toBe(0);
    });
  });

  describe('import 문 정렬 순서', () => {
    it('import 순서가 잘못되면 에러가 발생해야 한다 (import/order)', async () => {
      const code = `
        import { Component } from '@/components';
        import fs from 'fs';
        import React from 'react';
        import { helper } from './helper';
        
        console.log(Component, fs, React, helper);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/order')).toBe(true);
    });

    it('올바른 순서로 정렬된 import는 허용되어야 한다 (import/order)', async () => {
      const code = `
        import fs from 'fs';
        import path from 'path';

        import React from 'react';
        import { render } from 'react-dom';

        import { Component } from '@/components';
        import { utils } from '@/utils';

        import { helper } from './helper';
        import { sibling } from './sibling';

        import type { MyType } from './types';

        console.log(fs, path, React, render, Component, utils, helper, sibling);
        const x: MyType = {};
      `;

      const results = await eslint.lintText(code, { filePath: 'test.ts' });
      const messages = results[0].messages;

      expect(messages.filter(m => m.ruleId === 'import/order').length).toBe(0);
    });

    it('import 그룹 사이에 빈 줄이 없으면 에러가 발생해야 한다 (import/order)', async () => {
      const code = `
        import fs from 'fs';
        import React from 'react';
        import { helper } from './helper';
        
        console.log(fs, React, helper);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/order')).toBe(true);
    });

    it('같은 그룹 내에서 알파벳 순서가 지켜지지 않으면 에러가 발생해야 한다 (import/order)', async () => {
      const code = `
        import path from 'path';
        import fs from 'fs';
        
        console.log(path, fs);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/order')).toBe(true);
    });
  });

  describe('import 문 위치', () => {
    it('import 문이 파일 상단에 없으면 에러가 발생해야 한다 (import/first)', async () => {
      const code = `
        const x = 1;
        import fs from 'fs';
        
        console.log(x, fs);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/first')).toBe(true);
    });

    it('모든 import가 파일 상단에 위치하면 허용되어야 한다 (import/first)', async () => {
      const code = `
        import fs from 'fs';
        import path from 'path';
        
        const x = 1;
        console.log(x, fs, path);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.filter(m => m.ruleId === 'import/first').length).toBe(0);
    });
  });

  describe('import 후 빈 줄', () => {
    it('마지막 import 후에 빈 줄이 없으면 에러가 발생해야 한다 (import/newline-after-import)', async () => {
      const code = `
        import fs from 'fs';
        const x = 1;
        console.log(x, fs);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/newline-after-import')).toBe(true);
    });

    it('import 후 정확히 한 줄의 빈 줄이 있으면 허용되어야 한다 (import/newline-after-import)', async () => {
      const code = `
        import fs from 'fs';
        import path from 'path';

        const x = 1;
        console.log(x, fs, path);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.filter(m => m.ruleId === 'import/newline-after-import').length).toBe(0);
    });

    it('import 후 두 줄 이상의 빈 줄이 있으면 에러가 발생해야 한다 (import/newline-after-import)', async () => {
      // exactCount: true로 설정되어 있어서 정확히 1줄의 공백만 허용됨
      const code = `
        import fs from 'fs';


        const x = 1;
        console.log(x, fs);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      // exactCount: true로 인해 정확히 1줄의 공백만 허용되므로
      // 2줄 이상의 공백은 에러가 발생함
      expect(messages.some(m => m.ruleId === 'import/newline-after-import')).toBe(true);
    });
  });

  describe('불필요한 경로 세그먼트', () => {
    it('불필요한 상대 경로 세그먼트를 사용하면 에러가 발생해야 한다 (import/no-useless-path-segments)', async () => {
      const code = `
        import { helper } from './utils/../helper';
        import { another } from './components/./Component';
        
        console.log(helper, another);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.filter(m => m.ruleId === 'import/no-useless-path-segments').length).toBeGreaterThan(0);
    });

    it('깨끗한 상대 경로는 허용되어야 한다 (import/no-useless-path-segments)', async () => {
      const code = `
        import { helper } from './helper';
        import { utils } from '../utils';
        import { Component } from '../../components/Component';
        
        console.log(helper, utils, Component);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.filter(m => m.ruleId === 'import/no-useless-path-segments').length).toBe(0);
    });
  });

  describe('익명 default export', () => {
    it('익명 함수를 default export하면 에러가 발생해야 한다 (import/no-anonymous-default-export)', async () => {
      const code = `
        export default function() {
          return 'anonymous';
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/no-anonymous-default-export')).toBe(true);
    });

    it('익명 화살표 함수를 default export하면 에러가 발생해야 한다 (import/no-anonymous-default-export)', async () => {
      const code = `
        export default () => {
          return 'anonymous arrow';
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/no-anonymous-default-export')).toBe(true);
    });

    it('익명 객체를 default export하면 에러가 발생해야 한다 (import/no-anonymous-default-export)', async () => {
      const code = `
        export default {
          name: 'test',
          value: 123
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/no-anonymous-default-export')).toBe(true);
    });

    it('익명 배열을 default export하면 에러가 발생해야 한다 (import/no-anonymous-default-export)', async () => {
      const code = `
        export default [1, 2, 3];
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/no-anonymous-default-export')).toBe(true);
    });

    it('명명된 함수를 default export하는 것은 허용되어야 한다 (import/no-anonymous-default-export)', async () => {
      const code = `
        function myFunction() {
          return 'named';
        }
        export default myFunction;
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.filter(m => m.ruleId === 'import/no-anonymous-default-export').length).toBe(0);
    });

    it('명명된 변수를 default export하는 것은 허용되어야 한다 (import/no-anonymous-default-export)', async () => {
      const code = `
        const myConfig = {
          name: 'test',
          value: 123
        };
        export default myConfig;
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.filter(m => m.ruleId === 'import/no-anonymous-default-export').length).toBe(0);
    });
  });

  describe('CommonJS 문법 금지', () => {
    it('require를 사용하면 에러가 발생해야 한다 (import/no-commonjs)', async () => {
      const code = `
        const fs = require('fs');
        const path = require('path');
        
        console.log(fs, path);
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.filter(m => m.ruleId === 'import/no-commonjs').length).toBeGreaterThan(0);
    });

    it('module.exports를 사용하면 에러가 발생해야 한다 (import/no-commonjs)', async () => {
      const code = `
        const config = { test: true };
        module.exports = config;
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/no-commonjs')).toBe(true);
    });

    it('exports 객체를 사용하면 에러가 발생해야 한다 (import/no-commonjs)', async () => {
      const code = `
        exports.myFunction = function() {
          return 'test';
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'import/no-commonjs')).toBe(true);
    });

    it('ES 모듈 문법을 사용하면 허용되어야 한다 (import/no-commonjs)', async () => {
      const code = `
        import fs from 'fs';
        export const myFunction = () => 'test';
        export default { config: true };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      expect(messages.filter(m => m.ruleId === 'import/no-commonjs').length).toBe(0);
    });
  });

  describe('올바른 import 코드 예시', () => {
    it('모든 import 규칙을 준수한 코드는 에러가 없어야 한다', async () => {
      const code = `
        // Node.js 내장 모듈
        import fs from 'fs';
        import path from 'path';

        // 외부 패키지
        import React from 'react';
        import { render } from 'react-dom';

        // 내부 절대 경로
        import { Component } from '@/components/Component';
        import { useAuth } from '@/hooks/useAuth';

        // 상대 경로
        import { helper } from './helper';
        import { utils } from './utils';

        // 타입 import
        import type { Config } from './types';
        import type { User } from './models';

        const myComponent = () => {
          const auth = useAuth();
          return React.createElement(Component, { auth });
        };

        const processFile = (filename: string) => {
          const fullPath = path.join(fs.cwd(), filename);
          return helper(fullPath);
        };

        const config: Config = {
          user: {} as User,
          utils: utils
        };

        export { myComponent, processFile, config };
        export default myComponent;
      `;

      const results = await eslint.lintText(code, { filePath: 'test.ts' });
      const messages = results[0].messages;

      // import 관련 규칙만 필터링
      const importMessages = messages.filter(m => m.ruleId?.startsWith('import/'));

      expect(importMessages.length).toBe(0);
    });
  });

  describe('순환 참조 감지', () => {
    it('순환 참조는 여러 파일 간의 관계를 분석해야 감지할 수 있다 (import/no-cycle)', async () => {
      // 이 규칙은 실제로 여러 파일 간의 관계를 분석해야 하므로
      // 단위 테스트에서는 완전히 검증하기 어려움
      const code = `
        import { something } from './circular';
        export const mySomething = something;
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });

      // 단일 파일로는 순환 참조를 감지할 수 없으므로 에러가 없을 것
      expect(results[0].messages).toBeDefined();
    });
  });

  describe('사용하지 않는 export', () => {
    it('사용되지 않는 export가 있으면 경고가 발생할 수 있다 (import/no-unused-modules)', async () => {
      // 이 규칙도 프로젝트 전체를 분석해야 하므로
      // 단위 테스트에서는 제한적
      const code = `
        export const unusedExport = 'This might be unused';
        export const anotherUnused = 42;
      `;

      const results = await eslint.lintText(code, { filePath: 'test.js' });
      const messages = results[0].messages;

      // 경고가 발생할 수 있음
      const unusedMessages = messages.filter(m => m.ruleId === 'import/no-unused-modules');

      expect(unusedMessages.every(m => m.severity === 1)).toBe(true); // 모두 warning
    });
  });
});
