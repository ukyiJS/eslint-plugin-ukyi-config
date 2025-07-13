import { describe, it, expect } from 'vitest';
import plugin from '../index';

describe('플러그인 통합 테스트', () => {
  describe('플러그인 구조', () => {
    it('올바른 플러그인 구조를 내보내야 함', () => {
      expect(plugin).toBeDefined();
      expect(plugin.meta).toBeDefined();
      expect(plugin.meta.name).toBe('eslint-plugin-ukyi-config');
      expect(plugin.meta.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(plugin.configs).toBeDefined();
    });

    it('모든 예상 설정을 내보내야 함', () => {
      expect(plugin.configs.format).toBeDefined();
      expect(plugin.configs.javascript).toBeDefined();
      expect(plugin.configs.typescript).toBeDefined();
      expect(plugin.configs.react).toBeDefined();
      expect(plugin.configs.recommended).toBeDefined();
    });
  });
});