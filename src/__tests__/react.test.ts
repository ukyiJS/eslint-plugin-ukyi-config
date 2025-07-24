import { ESLint } from 'eslint';
import { describe, it, expect, beforeEach } from 'vitest';

import { formatConfig } from '../configs/format';
import { reactConfig } from '../configs/react';

describe('React/JSX 코드 품질 규칙 테스트', () => {
  let eslint: ESLint;

  beforeEach(() => {
    eslint = new ESLint({
      baseConfig: [...formatConfig, ...reactConfig],
      overrideConfigFile: true,
    });
  });

  describe('JSX 불린 속성 표기', () => {
    it('불린 속성에 true를 명시적으로 작성하면 에러가 발생해야 한다 (react/jsx-boolean-value)', async () => {
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
        }),
      );
    });

    it('불린 속성을 단축 표기로 사용하면 허용되어야 한다 (react/jsx-boolean-value)', async () => {
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

  describe('JSX 중괄호 사용 규칙', () => {
    it('불필요한 중괄호를 사용하면 에러가 발생해야 한다 (react/jsx-curly-brace-presence)', async () => {
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
        }),
      );
    });

    it('문자열 리터럴은 중괄호 없이 사용하면 허용되어야 한다 (react/jsx-curly-brace-presence)', async () => {
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

  describe('JSX 중괄호 내부 공백', () => {
    it('중괄호 내부에 불필요한 공백이 있으면 에러가 발생해야 한다 (react/jsx-curly-spacing)', async () => {
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
        }),
      );
    });
  });

  describe('JSX 등호 주변 공백', () => {
    it('등호 주변에 불필요한 공백이 있으면 에러가 발생해야 한다 (react/jsx-equals-spacing)', async () => {
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
        }),
      );
    });
  });

  describe('JSX 요소 간 줄바꿈', () => {
    it('인접한 JSX 요소 사이에 불필요한 빈 줄이 있으면 에러가 발생해야 한다 (react/jsx-newline)', async () => {
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
        }),
      );
    });
  });

  describe('불필요한 Fragment 사용', () => {
    it('단일 자식만 있는 Fragment를 사용하면 에러가 발생해야 한다 (react/jsx-no-useless-fragment)', async () => {
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
        }),
      );
    });
  });

  describe('JSX props 정렬 순서', () => {
    it('props가 알파벳 순으로 정렬되지 않으면 에러가 발생해야 한다 (react/jsx-sort-props)', async () => {
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
        }),
      );
    });

    it('예약된 props가 먼저, 콜백이 마지막에 오는 순서는 허용되어야 한다 (react/jsx-sort-props)', async () => {
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

  describe('JSX 태그 공백', () => {
    it('self-closing 태그 전에 공백이 없으면 에러가 발생해야 한다 (react/jsx-tag-spacing)', async () => {
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
        }),
      );
    });
  });

  describe('Self-closing 컴포넌트 사용', () => {
    it('자식이 없는 컴포넌트는 self-closing으로 작성해야 한다 (react/self-closing-comp)', async () => {
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
        }),
      );
    });
  });

  describe('React Hooks 사용 규칙', () => {
    it('Hook 사용 규칙을 준수한 코드는 허용되어야 한다 (react-hooks/rules-of-hooks)', async () => {
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

  describe('JSX에서 React import', () => {
    it('React를 import하지 않아도 JSX를 사용할 수 있어야 한다 (react/react-in-jsx-scope)', async () => {
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
        }),
      );
    });
  });

  describe('JSX에서 인라인 함수 사용', () => {
    it('인라인 함수 표현식을 사용하면 경고가 발생해야 한다 (react/jsx-no-bind)', async () => {
      const code = `
        const Component = () => {
          return <button onClick={function() {}}>Click</button>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-no-bind',
          severity: 1,
        }),
      );
    });

    it('화살표 함수 사용은 허용되어야 한다 (react/jsx-no-bind)', async () => {
      const code = `
        export const Component = () => {
          return <button onClick={() => {}}>Click</button>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const ruleIds = results[0].messages.map(m => m.ruleId);

      expect(ruleIds).not.toContain('react/jsx-no-bind');
    });
  });

  describe('함수형 컴포넌트 선호', () => {
    it('상태가 없는 클래스 컴포넌트는 함수형으로 작성해야 한다 (react/prefer-stateless-function)', async () => {
      const code = `
        import React from 'react';
        class Component extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/prefer-stateless-function',
        }),
      );
    });
  });

  describe('JSX에서 key 속성', () => {
    it('배열 렌더링 시 key prop이 없으면 에러가 발생해야 한다 (react/jsx-key)', async () => {
      const code = `
        const Component = () => {
          const items = ['a', 'b', 'c'];
          return (
            <div>
              {items.map(item => <div>{item}</div>)}
            </div>
          );
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-key',
        }),
      );
    });

    it('Fragment 단축 문법에서도 key prop이 필요하면 에러가 발생해야 한다 (react/jsx-key)', async () => {
      const code = `
        const Component = () => {
          const items = ['a', 'b', 'c'];
          return (
            <div>
              {items.map(item => <><div>{item}</div></>)}
            </div>
          );
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-key',
        }),
      );
    });
  });

  describe('컴포넌트 display name', () => {
    it('익명 컴포넌트를 사용하면 경고가 발생해야 한다 (react/display-name)', async () => {
      const code = `
        export default () => {
          return <div>Hello</div>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/display-name',
          severity: 1,
        }),
      );
    });
  });

  describe('위험한 HTML 주입', () => {
    it('dangerouslySetInnerHTML을 사용하면 경고가 발생해야 한다 (react/no-danger)', async () => {
      const code = `
        const Component = () => {
          return <div dangerouslySetInnerHTML={{ __html: '<p>test</p>' }} />;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/no-danger',
          severity: 1,
        }),
      );
    });
  });

  describe('dangerouslySetInnerHTML과 children 동시 사용', () => {
    it('dangerouslySetInnerHTML과 children을 함께 사용하면 에러가 발생해야 한다 (react/no-danger-with-children)', async () => {
      const code = `
        const Component = () => {
          return (
            <div dangerouslySetInnerHTML={{ __html: '<p>test</p>' }}>
              Child content
            </div>
          );
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/no-danger-with-children',
        }),
      );
    });
  });

  describe('외부 링크 보안', () => {
    it('target="_blank"를 rel 속성 없이 사용하면 에러가 발생해야 한다 (react/jsx-no-target-blank)', async () => {
      const code = `
        const Component = () => {
          return <a href="https://example.com" target="_blank">Link</a>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-no-target-blank',
        }),
      );
    });
  });

  describe('중복 props 검사', () => {
    it('동일한 prop을 중복해서 사용하면 에러가 발생해야 한다 (react/jsx-no-duplicate-props)', async () => {
      const code = `
        const Component = () => {
          return <div className="test" className="duplicate">Content</div>;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/jsx-no-duplicate-props',
        }),
      );
    });
  });

  describe('사용하지 않는 state', () => {
    it('선언했지만 사용하지 않는 state가 있으면 경고가 발생해야 한다 (react/no-unused-state)', async () => {
      const code = `
        import React from 'react';
        class Component extends React.Component {
          state = {
            unused: 'value',
            used: 'value'
          };
          render() {
            return <div>{this.state.used}</div>;
          }
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/no-unused-state',
          severity: 1,
        }),
      );
    });
  });

  describe('안전하지 않은 생명주기 메서드', () => {
    it('UNSAFE_ 생명주기 메서드를 사용하면 에러가 발생해야 한다 (react/no-unsafe)', async () => {
      const code = `
        import React from 'react';
        class Component extends React.Component {
          UNSAFE_componentWillMount() {
            console.log('will mount');
          }
          render() {
            return <div>Hello</div>;
          }
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'react/no-unsafe',
        }),
      );
    });
  });

  describe('접근성(a11y) 규칙', () => {
    it('img 태그에 alt 속성이 없으면 에러가 발생해야 한다 (jsx-a11y/alt-text)', async () => {
      const code = `
        const Component = () => {
          return <img src="image.jpg" />;
        };
      `;
      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const errors = results[0].messages;

      expect(errors).toContainEqual(
        expect.objectContaining({
          ruleId: 'jsx-a11y/alt-text',
        }),
      );
    });
  });

  describe('JSX 포맷팅 및 스타일', () => {
    it('JSX 들여쓰기가 잘못되면 에러가 발생해야 한다 (@stylistic/jsx-indent)', async () => {
      const code = `
        const Component = () => {
          return (
            <div>
          <span>잘못된 들여쓰기</span>
            </div>
          );
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === '@stylistic/jsx-indent')).toBe(true);
    });

    it('JSX props 들여쓰기가 잘못되면 에러가 발생해야 한다 (@stylistic/jsx-indent-props)', async () => {
      const code = `
        const Component = () => {
          return (
            <input
              type="text"
            value="test"
              placeholder="Enter text"
            />
          );
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === '@stylistic/jsx-indent-props')).toBe(true);
    });

    it('JSX 닫는 괄호의 위치가 잘못되면 에러가 발생해야 한다 (@stylistic/jsx-closing-bracket-location)', async () => {
      const code = `
        const Component = () => {
          return (
            <div
              className="test"
              id="main">
              Content
            </div>
          );
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === '@stylistic/jsx-closing-bracket-location')).toBe(true);
    });

    it('여러 줄 JSX가 괄호로 감싸지지 않으면 에러가 발생해야 한다 (@stylistic/jsx-wrap-multilines)', async () => {
      const code = `
        const Component = () => {
          const element = <div>
            <span>멀티라인</span>
          </div>;
          return element;
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === '@stylistic/jsx-wrap-multilines')).toBe(true);
    });

    it('여러 줄 JSX에서 첫 번째 prop이 새 줄에 있지 않으면 에러가 발생해야 한다 (@stylistic/jsx-first-prop-new-line)', async () => {
      const code = `
        const Component = () => {
          return (
            <div className="test"
              id="main"
              onClick={() => {}}
            >
              Content
            </div>
          );
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === '@stylistic/jsx-first-prop-new-line')).toBe(true);
    });

    it('한 줄에 여러 개의 props가 있으면 에러가 발생해야 한다 (@stylistic/jsx-max-props-per-line)', async () => {
      const code = `
        const Component = () => {
          return (
            <div
              className="test" id="main" onClick={() => {}}
            >
              Content
            </div>
          );
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === '@stylistic/jsx-max-props-per-line')).toBe(true);
    });

    it('JSX 속성값에 작은따옴표를 사용하면 에러가 발생해야 한다 (@stylistic/jsx-quotes)', async () => {
      const code = `
        const Component = () => {
          return <div className='test'>Content</div>;
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === '@stylistic/jsx-quotes')).toBe(true);
    });

    it('JSX 닫는 태그의 위치가 잘못되면 에러가 발생해야 한다 (react/jsx-closing-tag-location)', async () => {
      const code = `
        const Component = () => {
          return (
            <div>
              <span>
                Content
            </span>
            </div>
          );
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'react/jsx-closing-tag-location')).toBe(true);
    });

    it('JSX props 사이에 여러 공백이 있으면 에러가 발생해야 한다 (react/jsx-props-no-multi-spaces)', async () => {
      const code = `
        const Component = () => {
          return <div  className="test"   id="main">Content</div>;
        };
      `;

      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'react/jsx-props-no-multi-spaces')).toBe(true);
    });

    it('컴포넌트가 아닌 값을 함께 export하면 에러가 발생해야 한다 (react-refresh/only-export-components)', async () => {
      const code = `export let someValue = 42;

export const Component = () => {
  return <div>Hello</div>;
};

export const someObject = { value: 42 };
`;

      const results = await eslint.lintText(code, { filePath: 'test.tsx' });
      const messages = results[0].messages;

      expect(messages.some(m => m.ruleId === 'react-refresh/only-export-components')).toBe(true);
    });
  });
});
