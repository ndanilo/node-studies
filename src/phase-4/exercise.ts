/**
 * Phase 4 exercise — file analysis report.
 *
 * Run: npm run phase4-exercise
 */

import { mkdir } from 'node:fs/promises';
import {
  analyzeFileStream,
  analyzeFileSync,
  writeReport,
} from './lib/file-analyzer.js';
import { dataPath, outputPath } from './lib/paths.js';

const source = dataPath('sample.txt');
await mkdir(outputPath(), { recursive: true });

const syncStats = await analyzeFileSync(source);
await writeReport(
  outputPath('report-sync.txt'),
  source,
  syncStats,
  'sync',
);

const streamStats = await analyzeFileStream(source);
await writeReport(
  outputPath('report-stream.txt'),
  source,
  streamStats,
  'stream',
);

console.log('Sync stats:', syncStats);
console.log('Stream stats:', streamStats);
console.log('Reports written to src/phase-4/output/');
