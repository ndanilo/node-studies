/**
 * Phase 7 exercise — find and fix 4 bugs using F5 debugger.
 *
 * Setup:
 *   1. Open this file in Cursor
 *   2. Set a breakpoint on the first line inside run()
 *   3. F5 → "Debug Phase 7 exercise"
 *   4. Step through (F10/F11), inspect variables, read call stack
 *
 * Symptoms (try debugging before reading docs/PHASE-7-SOLUTIONS.md):
 *   1. Missing user returns HTTP 500 instead of 404
 *   2. Config load errors lose the original cause / stack trace
 *   3. Valid LLM fixture fails validation unexpectedly
 *   4. Rate-limit errors are not classified as retryable LLM errors
 *
 * When all fixed: npm run phase7-exercise → all scenarios show ✓
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getErrorChain, NotFoundError } from './lib/errors.js';
import { mapErrorToHttpResponse } from './lib/http-errors.js';
import {
  classifyLlmFailure,
  LlmRateLimitError,
  parseLlmResponse,
} from './lib/llm-errors.js';
import { logger } from './lib/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');

type ScenarioResult = { name: string; passed: boolean; detail: string };

async function loadLlmFixture(filename: string): Promise<unknown> {
  try {
    const raw = await readFile(join(dataDir, filename), 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error('Failed to load LLM fixture', { cause: err });
  }
}

async function fetchSimulatedLlm(): Promise<unknown> {
  return loadLlmFixture('valid-llm.json');
}

function handleMissingUser(userId: string | undefined): void {
  if (!userId) {
    throw new NotFoundError(`User ${userId ?? '(empty)'} not found`);
  }
}

function mapNotFoundToHttp(err: unknown) {
  return mapErrorToHttpResponse(err, true);
}

function classifyRateLimit(err: unknown) {
  return classifyLlmFailure(err);
}

async function run(): Promise<void> {
  const results: ScenarioResult[] = [];

  // Scenario 1: client error → 404
  try {
    handleMissingUser(undefined);
    results.push({ name: '404 for missing user', passed: false, detail: 'Expected NotFoundError' });
  } catch (err) {
    const http = mapNotFoundToHttp(err);
    const passed = http.status === 404;
    results.push({
      name: '404 for missing user',
      passed,
      detail: `got HTTP ${http.status}`,
    });
  }

  // Scenario 2: cause chain preserved when fixture missing
  try {
    await loadLlmFixture('does-not-exist.json');
    results.push({ name: 'Cause chain on file error', passed: false, detail: 'Expected throw' });
  } catch (err) {
    const chain = getErrorChain(err);
    const passed = chain.length >= 2;
    results.push({
      name: 'Cause chain on file error',
      passed,
      detail: `chain length ${chain.length} (want ≥ 2)`,
    });
  }

  // Scenario 3: valid LLM JSON parses
  try {
    const raw = await fetchSimulatedLlm();
    const parsed = parseLlmResponse(raw);
    results.push({
      name: 'Parse valid LLM JSON',
      passed: true,
      detail: parsed.choices[0].message.content,
    });
  } catch (err) {
    results.push({
      name: 'Parse valid LLM JSON',
      passed: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  // Scenario 4: rate limit classified
  const rateLimitErr = classifyRateLimit(new Error('HTTP 429: Too Many Requests'));
  results.push({
    name: 'Classify 429 as LlmRateLimitError',
    passed: rateLimitErr instanceof LlmRateLimitError,
    detail: `got ${rateLimitErr.constructor.name}`,
  });

  console.log('── Phase 7 exercise: bug hunt results ──\n');
  for (const r of results) {
    console.log(`${r.passed ? '✓' : '✗'} ${r.name} — ${r.detail}`);
  }

  const allPassed = results.every((r) => r.passed);
  if (allPassed) {
    logger.info({ event: 'phase7_complete' }, 'All scenarios passed');
  } else {
    console.log('\nSome scenarios failed — use F5 debugger to find the bugs.');
    process.exitCode = 1;
  }
}

await run();
