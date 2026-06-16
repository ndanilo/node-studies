/**
 * Phase 9 evals — golden cases without calling the LLM.
 *
 * Run: npm run phase9-evals
 *
 * C# parallel: [Theory] + [InlineData] unit tests; live LLM evals in CI sparingly.
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chunkText, cosineSimilarity } from '../lib/rag.js';
import { safeCalculate } from '../lib/tools.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

type CalcCase = {
  name: string;
  expression: string;
  expected?: number;
  expectError?: boolean;
};

type ChunkCase = {
  name: string;
  input: string;
  minChunks: number;
};

type CosineCase = {
  name: string;
  a: number[];
  b: number[];
  minScore: number;
};

type GoldenCase = CalcCase | ChunkCase | CosineCase;

function isCalcCase(c: GoldenCase): c is CalcCase {
  return 'expression' in c;
}

function isChunkCase(c: GoldenCase): c is ChunkCase {
  return 'input' in c && 'minChunks' in c;
}

function isCosineCase(c: GoldenCase): c is CosineCase {
  return 'a' in c && 'b' in c;
}

function runCase(c: GoldenCase): { name: string; passed: boolean; detail: string } {
  if (isCalcCase(c)) {
    try {
      const value = safeCalculate(c.expression);
      if (c.expectError) {
        return { name: c.name, passed: false, detail: 'expected error but got ' + value };
      }
      const ok = value === c.expected;
      return {
        name: c.name,
        passed: ok,
        detail: ok ? `=${value}` : `expected ${c.expected}, got ${value}`,
      };
    } catch (err) {
      if (c.expectError) {
        return { name: c.name, passed: true, detail: 'rejected unsafe expression' };
      }
      return { name: c.name, passed: false, detail: err instanceof Error ? err.message : 'unknown error' };
    }
  }

  if (isChunkCase(c)) {
    const chunks = chunkText(c.input);
    const ok = chunks.length >= c.minChunks;
    return {
      name: c.name,
      passed: ok,
      detail: ok ? `${chunks.length} chunks` : `expected ≥${c.minChunks}, got ${chunks.length}`,
    };
  }

  if (isCosineCase(c)) {
    const score = cosineSimilarity(c.a, c.b);
    const ok = score >= c.minScore;
    return {
      name: c.name,
      passed: ok,
      detail: ok ? `score=${score.toFixed(3)}` : `score ${score.toFixed(3)} < ${c.minScore}`,
    };
  }

  return { name: 'unknown', passed: false, detail: 'unrecognized case shape' };
}

const raw = await readFile(join(__dirname, 'golden-cases.json'), 'utf8');
const cases = JSON.parse(raw) as GoldenCase[];

console.log('\nPhase 9 evals (offline golden cases)\n');

const results = cases.map(runCase);
let failed = 0;

for (const r of results) {
  const mark = r.passed ? '✓' : '✗';
  console.log(`  ${mark} ${r.name} — ${r.detail}`);
  if (!r.passed) failed++;
}

console.log(`\n${results.length - failed}/${results.length} passed\n`);
if (failed > 0) process.exitCode = 1;
