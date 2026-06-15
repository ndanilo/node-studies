/**
 * LLM-specific errors — rate limits, timeouts, malformed JSON.
 */

import { z } from 'zod';
import { AppError } from './errors.js';

export class LlmRateLimitError extends AppError {
  readonly retryAfterMs?: number;

  constructor(retryAfterMs?: number) {
    super('LLM rate limit exceeded (429)', { code: 'LLM_RATE_LIMIT' });
    this.retryAfterMs = retryAfterMs;
  }
}

export class LlmTimeoutError extends AppError {
  constructor(timeoutMs: number, cause?: unknown) {
    super(`LLM request timed out after ${timeoutMs}ms`, { cause, code: 'LLM_TIMEOUT' });
  }
}

export class MalformedLlmResponseError extends AppError {
  constructor(cause?: unknown) {
    super('LLM returned invalid or unexpected JSON', { cause, code: 'LLM_MALFORMED' });
  }
}

const LlmReplySchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z.string(),
        }),
      }),
    )
    .min(1),
});

export type LlmReply = z.infer<typeof LlmReplySchema>;

/** Parse + validate LLM JSON — never trust raw model output. */
export function parseLlmResponse(data: unknown): LlmReply {
  const result = LlmReplySchema.safeParse(data);

  if (!result.success) {
    throw new MalformedLlmResponseError(result.error);
  }

  return result.data;
}

/** Classify fetch/SDK failures into retryable LLM errors. */
export function classifyLlmFailure(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof Error) {
    if (err.name === 'AbortError' || err.message.includes('timeout')) {
      return new LlmTimeoutError(30_000, err);
    }
    if (err.message.includes('429') || err.message.includes('rate limit')) {
      return new LlmRateLimitError(60_000);
    }
  }

  return new AppError('Unexpected LLM failure', { cause: err, code: 'LLM_UNKNOWN' });
}
