import { describe, it, expect, beforeEach } from 'vitest';
import { ESLint } from 'eslint';
import { reactConfig } from '../configs/react';

describe('React 설정', () => {
  let eslint: ESLint;

  beforeEach(() => {
    eslint = new ESLint({
      baseConfig: reactConfig,
      overrideConfigFile: true,
    });
  });

  describe('JSX 불린 값', () => {
    it('불린 속성에 true를 명시하면 오류가 발생해야 함', async () => {
      const code = `
        const Component = () => {
          return <button disabled={true}>Click</button>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;
      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-boolean-value',
        })
      );
    });

    it('불린 속성을 단축 표기하면 오류가 없어야 함', async () => {
      const code = `
        export const Component = () => {
          return <button disabled>Click</button>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const ruleIds = results[0].messages.map(m => m.ruleId);
      expect(ruleIds).not.toContain('react/jsx-boolean-value');
    });
  });

  describe('JSX 중괄호 사용', () => {
    it('불필요한 중괄호를 사용하면 오류가 발생해야 함', async () => {
      const code = `
        const Component = () => {
          return <div className={"test"}>{"Hello"}</div>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;
      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-curly-brace-presence',
        })
      );
    });

    it('문자열 리터럴은 중괄호 없이 사용해야 함', async () => {
      const code = `
        export const Component = () => {
          return <div className="test">Hello</div>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const ruleIds = results[0].messages.map(m => m.ruleId);
      expect(ruleIds).not.toContain('react/jsx-curly-brace-presence');
    });
  });

  describe('JSX 중괄호 간격', () => {
    it('중괄호 내부에 공백이 있으면 오류가 발생해야 함', async () => {
      const code = `
        const Component = () => {
          const name = 'World';
          return <div>{ name }</div>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;
      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-curly-spacing',
        })
      );
    });
  });

  describe('JSX 등호 간격', () => {
    it('등호 주변에 공백이 있으면 오류가 발생해야 함', async () => {
      const code = `
        const Component = () => {
          return <button onClick = {() => {}}>Click</button>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;
      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-equals-spacing',
        })
      );
    });
  });

  describe('JSX 줄바꿈', () => {
    it('인접한 JSX 요소 사이에 줄바꿈이 있으면 오류가 발생해야 함', async () => {
      const code = `
        const Component = () => {
          return (
            <div>
              <span>Hello</span>

              <span>World</span>
            </div>
          );
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;
      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-newline',
        })
      );
    });
  });

  describe('불필요한 Fragment', () => {
    it('단일 자식만 있는 Fragment는 오류가 발생해야 함', async () => {
      const code = `
        const Component = () => {
          return (
            <>
              <div>Hello</div>
            </>
          );
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;
      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-no-useless-fragment',
        })
      );
    });
  });

  describe('JSX props 정렬', () => {
    it('props가 정렬되지 않으면 오류가 발생해야 함', async () => {
      const code = `
        const Component = () => {
          return (
            <button 
              onClick={() => {}}
              className="btn"
              id="submit"
            >
              Submit
            </button>
          );
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;
      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-sort-props',
        })
      );
    });

    it('예약된 props가 먼저, 콜백이 마지막에 오면 오류가 없어야 함', async () => {
      const code = `
        export const Component = () => {
          return (
            <button 
              key="btn"
              className="btn"
              id="submit"
              onClick={() => {}}
            >
              Submit
            </button>
          );
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const ruleIds = results[0].messages.map(m => m.ruleId);
      expect(ruleIds).not.toContain('react/jsx-sort-props');
    });
  });

  describe('JSX 태그 간격', () => {
    it('self-closing 태그 전에 공백이 없으면 오류가 발생해야 함', async () => {
      const code = `
        const Component = () => {
          return <input type="text"/>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;
      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-tag-spacing',
        })
      );
    });
  });

  describe('Self-closing 컴포넌트', () => {
    it('자식이 없는 컴포넌트는 self-closing이어야 함', async () => {
      const code = `
        const Component = () => {
          return <div></div>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;
      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/self-closing-comp',
        })
      );
    });
  });

  describe('React Hooks 규칙', () => {
    it('Hook 사용 규칙이 적용되어야 함', async () => {
      const code = `
        import { useState } from 'react';
        export const Component = () => {
          const [state, setState] = useState(0);
          return <div>{state}</div>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const ruleIds = results[0].messages.map(m => m.ruleId);
      expect(ruleIds).not.toContain('react-hooks/rules-of-hooks');
    });
  });

  describe('React in JSX scope', () => {
    it('React를 import하지 않아도 오류가 없어야 함', async () => {
      const code = `
        const Component = () => {
          return <div>Hello</div>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;
      expect(errors).not.toContainEqual(
        expect.objectContaining({
          ruleId: 'react/react-in-jsx-scope',
        })
      );
    });
  });
});