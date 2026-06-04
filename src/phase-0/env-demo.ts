/**
 * Phase 0 — Environment variables (C# appsettings + env override equivalent).
 *
 * C# equivalent:
 *   var apiKey = configuration["OpenAI:ApiKey"];
 *
 * Setup:
 *   1. Copy .env.example → .env
 *   2. Run: npm run env-demo
 */

import 'dotenv/config';
import { z } from 'zod';

// --- Raw access (like IConfiguration indexer) ---
const rawApiKey = process.env.OPENAI_API_KEY;
console.log('Raw OPENAI_API_KEY set?', rawApiKey ? 'yes' : 'no');

// --- Typed + validated (like IOptions<T> + validation at startup) ---
const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

try {
  const config = envSchema.parse(process.env);
  console.log('Validated config:', {
    port: config.PORT,
    logLevel: config.LOG_LEVEL,
    nodeEnv: config.NODE_ENV,
    apiKeyPrefix: config.OPENAI_API_KEY.slice(0, 7) + '...', // never log full key
  });
} catch (err) {
  if (err instanceof z.ZodError) {
    console.error('Config validation failed:');
    err.errors.forEach((e) => console.error(`  - ${e.path.join('.')}: ${e.message}`));
    process.exit(1);
  }
  throw err;
}
