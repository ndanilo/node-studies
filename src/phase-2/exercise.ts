/**
 * Phase 2 exercise — wire up your TokenCounter service.
 *
 * Run: npm run phase2-exercise
 */

import { TokenCounter } from './services/token-counter.js';

const samples = [
  'hello world',
  'one',
  '',
  '  spaced   words  here  ',
];

const counter = new TokenCounter();

for (const text of samples) {
  console.log(`"${text}" → ${counter.count(text)} token(s)`);
}
