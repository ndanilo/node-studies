/**
 * Phase 10 — Mocking env vars (config under test).
 *
 * C# parallel: [Fact] with environment variables set in test fixture, or
 * WebApplicationFactory.WithWebHostBuilder(c => c.UseSetting(...)).
 */

import { describe, expect, it } from 'vitest';
import { loadConfig } from './load-config.js';

describe('loadConfig', () => {
  it('parses valid env into typed config', () => {
    const config = loadConfig({
      OPENAI_API_KEY: 'sk-test',
      LOG_LEVEL: 'debug',
      MAX_TOKENS: '2048',
    });

    expect(config.OPENAI_API_KEY).toBe('sk-test');
    expect(config.LOG_LEVEL).toBe('debug');
    expect(config.MAX_TOKENS).toBe(2048);
  });

  it('applies defaults when optional vars are missing', () => {
    const config = loadConfig({ OPENAI_API_KEY: 'sk-test' });

    expect(config.LOG_LEVEL).toBe('info');
    expect(config.MAX_TOKENS).toBe(1024);
  });

  it('throws when OPENAI_API_KEY is missing', () => {
    expect(() => loadConfig({})).toThrow(/OPENAI_API_KEY/);
  });
});

/** Theory-style table test — like [Theory] [InlineData(...)] in xUnit. */
describe.each([
  { input: 'debug', expected: 'debug' },
  { input: 'warn', expected: 'warn' },
  { input: undefined, expected: 'info' },
])('LOG_LEVEL defaulting', ({ input, expected }) => {
  it(`maps LOG_LEVEL=${input ?? '(missing)'} → ${expected}`, () => {
    const env: Record<string, string> = { OPENAI_API_KEY: 'sk-test' };
    if (input !== undefined) env.LOG_LEVEL = input;

    expect(loadConfig(env).LOG_LEVEL).toBe(expected);
  });
});
