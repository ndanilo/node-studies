/**
 * Tiny config loader — tests stub process.env without touching .env on disk.
 *
 * C# equivalent: WebApplicationFactory sets Configuration in-memory for integration tests.
 */

import { z } from 'zod';

const ConfigSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  MAX_TOKENS: z.coerce.number().int().positive().default(1024),
});

export type AppConfig = z.infer<typeof ConfigSchema>;

/** Read env at call time so tests can mutate process.env between cases. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return ConfigSchema.parse({
    OPENAI_API_KEY: env.OPENAI_API_KEY,
    LOG_LEVEL: env.LOG_LEVEL,
    MAX_TOKENS: env.MAX_TOKENS,
  });
}
