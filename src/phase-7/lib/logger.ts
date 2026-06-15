/**
 * Structured logging with pino — like Serilog structured properties.
 *
 * console.log → human-readable, hard to query in prod
 * pino        → JSON lines with level, time, msg, and custom fields
 */

import pino from 'pino';
import { config } from '../../config/index.js';

export const logger = pino({
  level: config.LOG_LEVEL,
  redact: {
    paths: ['apiKey', 'OPENAI_API_KEY', 'req.headers.authorization'],
    censor: '[REDACTED]',
  },
});

/** Demo helper — shows why structured fields beat string concatenation. */
export function logChatRequest(model: string, tokenCount: number): void {
  logger.info({ model, tokenCount, event: 'chat_request' }, 'Chat request completed');
}
