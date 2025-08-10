import { ESLint } from 'eslint';

import type { Linter } from 'eslint';

/**
 * ESLint 인스턴스 생성 헬퍼
 */
export function createESLint(config: Linter.Config | Linter.Config[]): ESLint {
  return new ESLint({
    baseConfig: config,
    overrideConfigFile: true,
    ignore: false,
  });
}

/**
 * 코드를 린트하고 결과를 반환하는 헬퍼
 */
export async function lintText(
  eslint: ESLint,
  code: string,
  filePath = 'test.js',
): Promise<ESLint.LintResult> {
  const [result] = await eslint.lintText(code, { filePath });

  return result;
}

/**
 * 특정 규칙의 에러/경고 메시지 필터링 헬퍼
 */
export function getMessagesForRule(
  messages: Linter.LintMessage[],
  ruleId: string,
): Linter.LintMessage[] {
  return messages.filter(m => m.ruleId === ruleId);
}

/**
 * 특정 규칙의 에러가 있는지 확인하는 헬퍼
 */
export function hasRuleError(
  messages: Linter.LintMessage[],
  ruleId: string,
): boolean {
  return messages.some(m => m.ruleId === ruleId);
}

/**
 * 특정 규칙의 에러 개수를 세는 헬퍼
 */
export function countRuleErrors(
  messages: Linter.LintMessage[],
  ruleId: string,
): number {
  return messages.filter(m => m.ruleId === ruleId).length;
}

/**
 * 심각도별 메시지 필터링 헬퍼
 */
export function getMessagesBySeverity(
  messages: Linter.LintMessage[],
  severity: 1 | 2, // 1: warning, 2: error
): Linter.LintMessage[] {
  return messages.filter(m => m.severity === severity);
}

/**
 * 치명적인 파싱 에러가 있는지 확인하는 헬퍼
 */
export function hasFatalErrors(messages: Linter.LintMessage[]): boolean {
  return messages.some(m => m.fatal === true);
}

/**
 * 에러 메시지에서 규칙 ID 목록을 추출하는 헬퍼
 */
export function getRuleIds(messages: Linter.LintMessage[]): string[] {
  return [...new Set(messages.map(m => m.ruleId).filter(Boolean))] as string[];
}

/**
 * 테스트용 코드 샘플 생성 헬퍼
 */
export const codeSamples = {
  // JavaScript 기본 코드
  basicJS: `const x = 1;
const y = 2;
console.log(x + y);`,

  // TypeScript 기본 코드
  basicTS: `const x: number = 1;
const y: number = 2;
console.log(x + y);`,

  // React 컴포넌트 코드
  reactComponent: `export const Component = () => {
  return <div>Hello World</div>;
};`,

  // React with TypeScript
  reactTSComponent: `interface Props {
  name: string;
}

export const Component: React.FC<Props> = ({ name }) => {
  return <div>Hello {name}</div>;
};`,

  // 복잡한 import 구조
  complexImports: `import fs from 'fs';
import path from 'path';

import React from 'react';
import { render } from 'react-dom';

import { Component } from '@/components';
import { utils } from '@/utils';

import { helper } from './helper';
import type { Config } from './types';`,
};

/**
 * 비동기 테스트 헬퍼 - 에러가 발생해야 하는 경우
 */
export async function expectRuleError(
  eslint: ESLint,
  code: string,
  ruleId: string,
  filePath = 'test.js',
): Promise<void> {
  const result = await lintText(eslint, code, filePath);
  const hasError = hasRuleError(result.messages, ruleId);

  if (!hasError) {
    throw new Error(`Expected rule '${ruleId}' to report an error, but it didn't`);
  }
}

/**
 * 비동기 테스트 헬퍼 - 에러가 없어야 하는 경우
 */
export async function expectNoRuleError(
  eslint: ESLint,
  code: string,
  ruleId: string,
  filePath = 'test.js',
): Promise<void> {
  const result = await lintText(eslint, code, filePath);
  const hasError = hasRuleError(result.messages, ruleId);

  if (hasError) {
    throw new Error(`Expected no error from rule '${ruleId}', but found one`);
  }
}

/**
 * 여러 규칙을 한 번에 테스트하는 헬퍼
 */
export async function testMultipleRules(
  eslint: ESLint,
  code: string,
  expectations: { ruleId: string;
    shouldError: boolean; }[],
  filePath = 'test.js',
): Promise<void> {
  const result = await lintText(eslint, code, filePath);

  for (const { ruleId, shouldError } of expectations) {
    const hasError = hasRuleError(result.messages, ruleId);

    if (shouldError && !hasError) {
      throw new Error(`Expected rule '${ruleId}' to report an error, but it didn't`);
    }

    if (!shouldError && hasError) {
      throw new Error(`Expected no error from rule '${ruleId}', but found one`);
    }
  }
}
