/**
 * Typed application config — validate once at startup, import everywhere.
 *
 * C# equivalent: IOptions<AppSettings> bound from configuration + validated on boot.
 *
 * Load order:
 *   1. dotenv reads .env into process.env (local dev only)
 *   2. Zod parses + coerces env vars into a typed object
 *   3. Fail fast with clear errors if anything is missing or invalid
 */

import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type AppConfig = z.infer<typeof envSchema>;

function loadConfig(): AppConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment configuration:');
    for (const issue of result.error.issues) {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'env';
      console.error(`  - ${path}: ${issue.message}`);
    }
    process.exit(1);
  }

  return result.data;
}

/** Validated config — import this instead of reading process.env directly. */
export const config = loadConfig();

/** Safe summary for logs — never includes full secrets. */
export function getSafeConfigSummary(cfg: AppConfig = config) {
  return {
    port: cfg.PORT,
    logLevel: cfg.LOG_LEVEL,
    nodeEnv: cfg.NODE_ENV,
    openaiApiKeySet: cfg.OPENAI_API_KEY.length > 0,
    openaiApiKeyPrefix: cfg.OPENAI_API_KEY.slice(0, 7) + '...',
  };
}
