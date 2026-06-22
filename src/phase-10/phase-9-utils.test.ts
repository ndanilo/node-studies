/**
 * Phase 10 — Testing pure functions from Phase 9 (no mocks needed).
 *
 * C# parallel: test CalculatorService.Add(2,3) directly — fastest, most reliable tests.
 */

import { describe, expect, it } from 'vitest';
import { chunkText, cosineSimilarity } from '../phase-9/lib/rag.js';
import { estimateTokenCount, sumUsage, usageFromApi } from '../phase-9/lib/tokens.js';
import { safeCalculate } from '../phase-9/lib/tools.js';

describe('estimateTokenCount', () => {
  it('ceil-divides character length by 4', () => {
    expect(estimateTokenCount('abcd')).toBe(1);
    expect(estimateTokenCount('abcde')).toBe(2);
    expect(estimateTokenCount('')).toBe(0);
  });
});

describe('sumUsage', () => {
  it('aggregates token fields across calls', () => {
    const total = sumUsage([
      { promptTokens: 10, completionTokens: 5, totalTokens: 15 },
      { promptTokens: 20, completionTokens: 8, totalTokens: 28 },
    ]);

    expect(total).toEqual({
      promptTokens: 30,
      completionTokens: 13,
      totalTokens: 43,
    });
  });
});

describe('usageFromApi', () => {
  it('maps snake_case API fields to camelCase', () => {
    expect(
      usageFromApi({ prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 }),
    ).toEqual({
      promptTokens: 100,
      completionTokens: 50,
      totalTokens: 150,
    });
  });

  it('defaults missing usage to zero', () => {
    expect(usageFromApi(undefined)).toEqual({
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    });
  });
});

describe('chunkText', () => {
  it('splits on blank lines and respects maxChars', () => {
    const text = 'First paragraph.\n\nSecond paragraph is here.\n\nThird.';
    const chunks = chunkText(text, 30);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((c) => c.length <= 30)).toBe(true);
  });
});

describe('cosineSimilarity', () => {
  it('returns 1 for identical vectors', () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBeCloseTo(1);
  });

  it('returns 0 for orthogonal vectors', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });

  it('returns 0 when vector lengths differ', () => {
    expect(cosineSimilarity([1, 0], [1, 0, 0])).toBe(0);
  });
});

describe('safeCalculate', () => {
  it('evaluates safe arithmetic', () => {
    expect(safeCalculate('(12 + 8) * 3')).toBe(60);
  });

  it('rejects unsafe expressions', () => {
    expect(() => safeCalculate('process.exit()')).toThrow(/Unsafe expression/);
  });
});
