/**
 * Phase 3 — Async & concurrency (C# lens).
 *
 * Run: npm run phase3
 * Debug: open this file → F5 → "Debug current TS file"
 */

import { delay } from './lib/delay.js';

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

// ── 1. Callbacks (historical) ──────────────────────────────────────────
section('Callbacks (historical)');

// Old Node style: callback as last arg (err, result) — "error-first callbacks"
function loadConfigCallback(
  done: (err: Error | null, value?: string) => void,
): void {
  setTimeout(() => done(null, '{"model":"gpt-4o"}'), 50);
}

loadConfigCallback((err, value) => {
  if (err) throw err;
  console.log('callback result:', value);
});

// Modern code uses Promises / async-await instead (LLM SDKs are Promise-based).

// ── 2. Promises ────────────────────────────────────────────────────────
section('Promises');

// C#: Task<string> — JS: Promise<string>
const task: Promise<string> = delay(30).then(() => 'done');

await task;

task
  .then((value) => console.log('.then():', value))
  .catch((err: Error) => console.error('.catch():', err.message));

const [a, b] = await Promise.all([delay(20).then(() => 1), delay(10).then(() => 2)]);
console.log('Promise.all:', a, b);

const winner = await Promise.race([
  delay(100).then(() => 'slow'),
  delay(10000).then(() => 'fast'),
]);
console.log('Promise.race:', winner);

const settled = await Promise.allSettled([
  Promise.resolve('ok'),
  Promise.reject(new Error('fail')),
]);
console.log(
  'Promise.allSettled:',
  settled.map((r) => (r.status === 'fulfilled' ? r.value : r.reason.message)),
);

// ── 3. async / await ───────────────────────────────────────────────────
section('async / await');

async function loadModelName(): Promise<string> {
  await delay(20);
  return 'gpt-4o';
}

const model = await loadModelName();
console.log('async/await:', model);

// ── 4. Error propagation ───────────────────────────────────────────────
section('Error propagation');

async function mayFail(fail: boolean): Promise<string> {
  await delay(10);
  if (fail) throw new Error('boom');
  return 'success';
}

try {
  await mayFail(true);
} catch (err) {
  console.log('caught in async:', err instanceof Error ? err.message : err);
}

// Unhandled rejections crash Node — always await or .catch() (like unobserved Task exceptions).

// ── 5. setTimeout vs Task.Delay ──────────────────────────────────────
section('setTimeout vs Task.Delay');

console.time('delay-50');
await delay(50);
console.timeEnd('delay-50');

// ── 6. AbortController (cancellation) ──────────────────────────────────
section('AbortController');

// C#: CancellationToken + CancelAfter
const controller = new AbortController();
setTimeout(() => controller.abort(), 25);

try {
  await delay(200, controller.signal);
} catch (err) {
  console.log('aborted:', err instanceof Error ? err.message : err);
}

// Node 18+: AbortSignal.timeout(ms) works directly with fetch (see exercise).

// ── 7. Event loop (high level) ─────────────────────────────────────────
section('Event loop');

const start = Date.now();
setTimeout(() => console.log(`timer fired after ${Date.now() - start}ms`), 0);
// CPU-bound sync work blocks the loop — timers wait
let sum = 0;
for (let i = 0; i < 5_000_000; i++) sum += i;
console.log('sync work done, sum tail:', sum % 1000);

// ── 8. Async iterators (streaming preview) ─────────────────────────────
section('Async iterators');

async function* tokenStream(): AsyncGenerator<string> {
  for (const token of ['Hello', ' ', 'world']) {
    await delay(30);
    yield token;
  }
}

let streamed = '';
for await (const token of tokenStream()) {
  streamed += token;
}
console.log('streamed:', JSON.stringify(streamed));

console.log('\n✓ Phase 3 fundamentals complete. Next: npm run phase3-exercise');
