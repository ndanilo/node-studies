/**
 * Phase 5 exercise — OpenAI chat response types + Zod validation.
 *
 * Run: npm run phase5-exercise
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ChatCompletionSchema } from './lib/schemas.js';
import { extractAssistantText } from './lib/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');

async function loadJson(filename: string): Promise<unknown> {
  const raw = await readFile(join(dataDir, filename), 'utf8');
  return JSON.parse(raw);
}

function validate(label: string, data: unknown): void {
  const result = ChatCompletionSchema.safeParse(data);

  if (result.success) {
    const text = extractAssistantText(result.data);
    console.log(`✓ ${label}`);
    console.log(`  model: ${result.data.model}`);
    console.log(`  tokens: ${result.data.usage?.total_tokens ?? 'n/a'}`);
    console.log(`  reply: ${text?.slice(0, 60)}…`);
  } else {
    console.log(`✗ ${label}`);
    console.log('  errors:', result.error.flatten().fieldErrors);
  }
}

const valid = await loadJson('sample-response.json');
const invalid = await loadJson('invalid-response.json');

console.log('── Validating OpenAI chat completion JSON ──\n');
validate('sample-response.json', valid);
console.log();
validate('invalid-response.json', invalid);

console.log('\nKey takeaway: TS types in lib/types.ts catch mistakes at compile time.');
console.log('Zod in lib/schemas.ts catches bad API/LLM JSON at runtime.');
