/**
 * Phase 10 — Snapshot testing (use sparingly).
 *
 * Snapshots store expected output on disk; CI fails when output changes.
 * Good for: stable serializers, CLI help text, prompt templates.
 * Bad for: timestamps, random IDs, LLM text (non-deterministic).
 *
 * C# parallel: Verify(...).MatchesSnapshot() in Verify.NET — same idea.
 */

import { describe, expect, it } from 'vitest';
import { formatToolResults } from './format-tool-result.js';

describe('formatToolResults snapshots', () => {
  it('formats multiple tool results consistently', () => {
    const formatted = formatToolResults([
      { toolName: 'calculator', output: '60' },
      { toolName: 'search_docs', output: '[1] Phase 9 covers RAG.' },
    ]);

    expect(formatted).toMatchSnapshot();
  });

  it('formats empty results consistently', () => {
    expect(formatToolResults([])).toMatchSnapshot();
  });
});
