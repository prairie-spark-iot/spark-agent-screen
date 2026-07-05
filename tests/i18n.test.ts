import { describe, it, expect } from 'vitest';
import { translations } from '../src/i18n/context';

describe('Industrial RAG Agent Bilingual Internationalization Suite', () => {
  it('every translation key must define both en and zh language entries', () => {
    const keys = Object.keys(translations);
    expect(keys.length).toBeGreaterThan(50);

    keys.forEach((key) => {
      const entry = translations[key];
      expect(entry, `Missing translation entry for key: ${key}`).toBeDefined();
      expect(entry.en, `Missing English translation for key: ${key}`).toBeTypeOf('string');
      expect(entry.zh, `Missing Chinese translation for key: ${key}`).toBeTypeOf('string');
      expect(entry.en.trim().length, `Empty English string for key: ${key}`).toBeGreaterThan(0);
      expect(entry.zh.trim().length, `Empty Chinese string for key: ${key}`).toBeGreaterThan(0);
    });
  });

  it('critical system vocabulary and telemetry terms must be translated accurately', () => {
    expect(translations['appName'].en).toContain('Spark IoT');
    expect(translations['appName'].zh).toContain('Spark IoT');
    expect(translations['systemGateway'].zh).toContain('物联网关');
    expect(translations['aiDiagnosesToday'].zh).toContain('今日 AI 诊断');
  });
});
