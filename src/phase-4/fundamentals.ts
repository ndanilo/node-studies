/**
 * Phase 4 — File I/O & streams (C# System.IO lens).
 *
 * Run: npm run phase4
 * Debug: open this file → F5 → "Debug current TS file"
 */

import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, watch, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createInterface } from 'node:readline';
import { dataPath, outputPath, phase4Dir } from './lib/paths.js';

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

// ── 1. Paths ───────────────────────────────────────────────────────────
section('Paths (node:path)');

const configFile = join(phase4Dir, 'data', 'sample.txt');
console.log('join:', configFile);
console.log('basename:', basename(configFile));
console.log('resolve:', resolve(phase4Dir, '..', 'phase-3', 'sample.txt'));

// ── 2. ESM __dirname ───────────────────────────────────────────────────
section('import.meta.url → __dirname');

// See lib/paths.ts — fileURLToPath(import.meta.url) gives the current file path.
console.log('phase4Dir:', phase4Dir);

// ── 3. Async read / write (prefer over sync in servers) ────────────────
section('fs/promises readFile & writeFile');

// C#: await File.ReadAllTextAsync(path)
const text = await readFile(dataPath('sample.txt'), 'utf8');
console.log('first line:', text.split('\n')[0]);

await mkdir(outputPath(), { recursive: true });
const demoOut = outputPath('fundamentals-demo.txt');
await writeFile(demoOut, `Written at ${new Date().toISOString()}\n`, 'utf8');
console.log('wrote:', demoOut);

// ── 4. Buffer (byte[]) ─────────────────────────────────────────────────
section('Buffer');

const buf = Buffer.from('Applied AI', 'utf8');
console.log('bytes:', buf.length, 'base64:', buf.toString('base64'));
console.log('decoded:', Buffer.from(buf.toString('base64'), 'base64').toString('utf8'));

// ── 5. Streams + pipeline ──────────────────────────────────────────────
section('Streams & pipeline');

const streamIn = dataPath('sample.txt');
const streamOut = outputPath('stream-copy.txt');
await pipeline(createReadStream(streamIn, 'utf8'), createWriteStream(streamOut, 'utf8'));
console.log('piped copy →', streamOut);

// ── 6. Line-by-line (readline) ─────────────────────────────────────────
section('readline');

let lineCount = 0;
const rl = createInterface({
  input: createReadStream(streamIn, 'utf8'),
  crlfDelay: Infinity,
});

for await (const line of rl) {
  lineCount++;
  if (lineCount <= 2) console.log(`  line ${lineCount}:`, line);
}
console.log('total lines:', lineCount);

// ── 7. Backpressure (high level) ───────────────────────────────────────
section('Backpressure');

console.log(
  'Streams process chunks. If the writer is slow, the reader pauses (drain event).',
);
console.log('pipeline() handles this for you — prefer it over manual pipe().');

// ── 8. fs.watch (brief) ────────────────────────────────────────────────
section('fs.watch');

// C#: new FileSystemWatcher(path).Changed += ...
// Node: fs.watch — behavior differs on Windows vs Linux; use chokidar in production.
const watchTarget = outputPath('watch-demo.txt');
await writeFile(watchTarget, 'v1\n', 'utf8');

void writeFile(watchTarget, 'v2\n', 'utf8');

let watchEvent = '(no event)';
const watcher = watch(watchTarget);
const timeout = setTimeout(() => watcher.return?.(), 300);

for await (const event of watcher) {
  clearTimeout(timeout);
  watchEvent = event.eventType;
  break;
}

console.log('watch event:', watchEvent);

// ── 9. Applied AI ──────────────────────────────────────────────────────
section('Applied AI');

console.log('• Load prompts: readFile("prompts/system.txt", "utf8")');
console.log('• Stream LLM output: response.body → createWriteStream("out.md")');
console.log('• RAG chunking: readline over large files, yield chunks');

console.log('\n✓ Phase 4 fundamentals complete. Next: npm run phase4-exercise');
