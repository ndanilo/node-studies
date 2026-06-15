/**
 * Phase 6 exercise — typed config module with Zod validation.
 *
 * Setup:
 *   1. Copy .env.example → .env and set OPENAI_API_KEY
 *   2. Run: npm run phase6-exercise
 *
 * C# equivalent: inject IOptions<AppSettings> and use config.Port, not Configuration["Port"].
 */

import { config, getSafeConfigSummary } from '../config/index.js';

function logAtLevel(level: string, message: string): void {
  const levels = ['debug', 'info', 'warn', 'error'] as const;
  const current = levels.indexOf(config.LOG_LEVEL);
  const requested = levels.indexOf(level as (typeof levels)[number]);

  if (requested >= current) {
    console.log(`[${level}] ${message}`);
  }
}

console.log('── Phase 6: Typed config module ──\n');
console.log('Safe config summary (no full secrets):');
console.log(getSafeConfigSummary());

console.log('\n── LOG_LEVEL gating (respects config.LOG_LEVEL) ──\n');
logAtLevel('debug', 'This appears only when LOG_LEVEL=debug');
logAtLevel('info', 'App would listen on port ' + config.PORT);
logAtLevel('warn', 'Never log raw process.env in production');

console.log('\n── NODE_ENV behavior ──\n');
if (config.NODE_ENV === 'development') {
  console.log('Development: verbose diagnostics enabled');
} else if (config.NODE_ENV === 'production') {
  console.log('Production: use structured logging; hide internal errors from clients');
} else {
  console.log('Test: Vitest/Jest often set NODE_ENV=test automatically');
}

console.log('\nKey takeaway: import { config } from "../config/index.js" — never scatter process.env.');
