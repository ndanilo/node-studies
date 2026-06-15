/**
 * Phase 7 — Error handling & debugging (C# lens).
 *
 * Run: npm run phase7
 * Debug: open this file → F5 → "Debug current TS file"
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppError, ConfigError, getErrorChain } from './lib/errors.js';
import { setupGlobalErrorHandlers } from './lib/global-handlers.js';
import { HttpError, isClientError, isServerError, mapErrorToHttpResponse } from './lib/http-errors.js';
import {
  classifyLlmFailure,
  LlmRateLimitError,
  MalformedLlmResponseError,
  parseLlmResponse,
} from './lib/llm-errors.js';
import { logChatRequest, logger } from './lib/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

// ── 1. Error, custom errors, cause chain ───────────────────────────────
section('Error + cause chain');

// C#: throw new InvalidOperationException("...", innerException);
try {
  try {
    throw new TypeError('JSON parse failed at position 42');
  } catch (inner) {
    throw new ConfigError('Failed to load appsettings equivalent', inner);
  }
} catch (err) {
  if (err instanceof ConfigError) {
    console.log('Outer:', err.message, '| code:', err.code);
    console.log('Inner:', (err.cause as Error)?.message);
    console.log('Chain:', getErrorChain(err).map((e) => e.name).join(' → '));
  }
}

// ── 2. Sync vs async stack traces ──────────────────────────────────────
section('Sync vs async stack traces');

function syncFail(): never {
  throw new Error('sync failure');
}

async function asyncFail(): Promise<never> {
  await Promise.resolve();
  throw new Error('async failure');
}

try {
  syncFail();
} catch (err) {
  console.log('Sync stack (first line):', (err as Error).stack?.split('\n')[1]?.trim());
}

try {
  await asyncFail();
} catch (err) {
  console.log('Async stack (first line):', (err as Error).stack?.split('\n')[1]?.trim());
  console.log('Note: async stacks include await frames — use F5 to see full call stack.');
}

// ── 3. console.log vs structured logging (pino) ──────────────────────────
section('console.log vs pino');

console.log('console.log: Chat done model=gpt-4o tokens=150'); // hard to grep in CloudWatch/Datadog

logChatRequest('gpt-4o', 150); // JSON: { level, time, model, tokenCount, event, msg }

// ── 4. Global handlers ─────────────────────────────────────────────────
section('Global handlers (unhandledRejection / uncaughtException)');

setupGlobalErrorHandlers(logger);
console.log('Registered process.on("unhandledRejection") and process.on("uncaughtException")');
console.log('Always await promises or attach .catch() — unhandled rejections crash Node in modern versions.');

// ── 5. HTTP error mapping (4xx vs 5xx) ─────────────────────────────────
section('HTTP error mapping');

const notFound = mapErrorToHttpResponse(new AppError('User missing', { code: 'NOT_FOUND' }));
const badRequest = mapErrorToHttpResponse(new HttpError('Invalid prompt', 400));
const serverErr = mapErrorToHttpResponse(new Error('DB connection lost'));

console.log('404 client:', notFound.status, notFound.body);
console.log('400 client:', badRequest.status, isClientError(badRequest.status));
console.log('500 server:', serverErr.status, isServerError(serverErr.status));

// ── 6. LLM-specific errors ─────────────────────────────────────────────
section('LLM errors: rate limit, timeout, malformed JSON');

const rateLimit = classifyLlmFailure(new Error('HTTP 429: rate limit exceeded'));
console.log('429 classified as:', rateLimit.code, rateLimit instanceof LlmRateLimitError);

const timeout = classifyLlmFailure(Object.assign(new Error('aborted'), { name: 'AbortError' }));
console.log('Timeout classified as:', timeout.code);

const validJson = JSON.parse(await readFile(join(dataDir, 'valid-llm.json'), 'utf8'));
const parsed = parseLlmResponse(validJson);
console.log('Valid LLM JSON:', parsed.choices[0].message.content);

try {
  const invalidJson = JSON.parse(await readFile(join(dataDir, 'invalid-llm.json'), 'utf8'));
  parseLlmResponse(invalidJson);
} catch (err) {
  if (err instanceof MalformedLlmResponseError) {
    console.log('Invalid LLM JSON caught:', err.code);
    console.log('Zod cause available:', err.cause instanceof Error ? 'yes' : typeof err.cause);
  }
}

// ── 7. Debugger tip ────────────────────────────────────────────────────
section('Debugger (F5 in Cursor)');

console.log(`
  Visual Studio          →  Cursor / VS Code
  F5 Start Debugging     →  F5 (pick "Debug current TS file")
  Breakpoint (F9)        →  Click gutter or F9
  Watch window           →  WATCH panel
  Call Stack             →  CALL STACK panel
  Debugger.Break()       →  debugger; statement (remove before commit!)
`);

console.log('\nNext: npm run phase7-exercise — find 4 intentional bugs with the debugger.');
