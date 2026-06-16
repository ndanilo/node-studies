/**
 * Phase 9 — SSE streaming server (OpenAI tokens → browser/curl).
 *
 * Run: npm run phase9-server
 *
 * Try:
 *   curl -N -X POST http://localhost:3000/chat/stream ^
 *     -H "Content-Type: application/json" ^
 *     -d "{\"message\":\"Say hello in 8 words\"}"
 */

import express from 'express';
import { z } from 'zod';
import { config } from '../config/index.js';
import { HttpError } from '../phase-7/lib/http-errors.js';
import { classifyLlmFailure } from '../phase-7/lib/llm-errors.js';
import { logger } from '../phase-7/lib/logger.js';
import { errorHandler, requestLogger } from '../phase-8/lib/middleware.js';
import { streamChat } from './lib/agent.js';
import { createTrace, logAgentStep } from './lib/trace.js';

const ChatBodySchema = z.object({
  message: z.string().min(1, 'message is required'),
});

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', phase: 9, feature: 'sse-streaming' });
});

app.post('/chat/stream', async (req, res, next) => {
  const trace = createTrace();

  try {
    const parsed = ChatBodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError('Invalid request body', 400, { cause: parsed.error });
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    logAgentStep(trace, 1, 'stream', { endpoint: '/chat/stream' });

    const usage = await streamChat(parsed.data.message, (token) => {
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ done: true, usage, traceId: trace.traceId })}\n\n`);
    res.end();

    logger.info(
      { traceId: trace.traceId, event: 'sse_complete', usage },
      'SSE stream completed',
    );
  } catch (err) {
    if (!res.headersSent) {
      next(err);
      return;
    }

    const classified = classifyLlmFailure(err);
    res.write(`data: ${JSON.stringify({ error: classified.message })}\n\n`);
    res.end();
  }
});

app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info({ port: config.PORT, event: 'phase9_server_started' }, 'Phase 9 SSE server listening');
  console.log(`\n  GET  http://localhost:${config.PORT}/health`);
  console.log(`  POST http://localhost:${config.PORT}/chat/stream  { "message": "..." }`);
  console.log('  Tip: curl -N for unbuffered SSE\n');
});
