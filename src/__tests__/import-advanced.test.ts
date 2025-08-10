import { describe, it, expect } from 'vitest';

import { createESLint, lintText } from './helpers/lint';
import { testConfigs } from './helpers/no-type-checking-configs';

describe('Import 규칙 테스트 (가상 코드)', () => {
  describe('CommonJS 사용 방지', () => {
    it('require() 사용 시 에러가 발생해야 한다', async () => {
      const eslint = createESLint([...testConfigs.typescript, ...testConfigs.import]);
      const code = `
const fs = require('fs');
module.exports = { test: 'value' };
`;
      const result = await lintText(eslint, code, 'test.ts');
      const errors = result.messages.filter(m => m.ruleId === 'import/no-commonjs');

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.message.includes('require'))).toBe(true);
    });
  });

  describe('Import 순서 규칙', () => {
    it('import 문이 올바른 순서로 정렬되어야 한다', async () => {
      const eslint = createESLint([...testConfigs.typescript, ...testConfigs.import]);
      const code = `
import { useState } from 'react';
import fs from 'node:fs';
import './styles.css';
import axios from 'axios';
import { helperFunction } from '../utils';
`;
      const result = await lintText(eslint, code, 'test.tsx');
      const orderErrors = result.messages.filter(m => m.ruleId === 'import/order');

      // import/order 규칙은 순서가 잘못되었을 때만 에러 발생
      // 위 코드는 node builtins → external → relative 순서가 아니므로 에러 발생
      expect(orderErrors.length).toBeGreaterThan(0);
    });

    it('올바른 import 순서는 에러가 없어야 한다', async () => {
      const eslint = createESLint([...testConfigs.typescript, ...testConfigs.import]);
      const code = `
import fs from 'node:fs';
import path from 'node:path';

import axios from 'axios';
import React, { useState } from 'react';

import { helperFunction } from '../utils';
import './styles.css';
`;
      const result = await lintText(eslint, code, 'test.tsx');
      const orderErrors = result.messages.filter(m => m.ruleId === 'import/order');

      expect(orderErrors.length).toBe(0);
    });
  });

  describe('중복 import 방지', () => {
    it('같은 모듈을 여러 번 import하면 에러가 발생해야 한다', async () => {
      const eslint = createESLint([...testConfigs.typescript, ...testConfigs.import]);
      const code = `
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
`;
      const result = await lintText(eslint, code, 'test.tsx');
      const duplicateErrors = result.messages.filter(m => m.ruleId === 'import/no-duplicates');

      expect(duplicateErrors.length).toBeGreaterThan(0);
    });

    it('하나의 import 문으로 합치면 에러가 없어야 한다', async () => {
      const eslint = createESLint([...testConfigs.typescript, ...testConfigs.import]);
      const code = `
import React, { useState, useEffect } from 'react';
`;
      const result = await lintText(eslint, code, 'test.tsx');
      const duplicateErrors = result.messages.filter(m => m.ruleId === 'import/no-duplicates');

      expect(duplicateErrors.length).toBe(0);
    });
  });

  describe('절대 경로 import', () => {
    it('절대 경로 import를 사용하면 에러가 발생해야 한다', async () => {
      const eslint = createESLint([...testConfigs.typescript, ...testConfigs.import]);
      const code = `
import something from '/absolute/path/to/module';
`;
      const result = await lintText(eslint, code, 'test.ts');
      const absoluteErrors = result.messages.filter(m => m.ruleId === 'import/no-absolute-path');

      expect(absoluteErrors.length).toBeGreaterThan(0);
    });
  });

  describe('Self import 방지', () => {
    it('self-import 규칙이 활성화되어 있어야 한다', () => {
      // import/no-self-import 규칙은 실제 파일 시스템과 package.json이 필요하므로
      // lintText로는 테스트할 수 없음. 대신 규칙이 활성화되어 있는지만 확인
      expect(testConfigs.import[0].rules?.['import/no-self-import']).toBe('error');
    });
  });
});
