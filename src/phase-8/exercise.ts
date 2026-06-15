/**
 * Phase 8 exercise — minimal Express server with /health and /chat proxy.
 *
 * Run: npm run phase8-server
 * Debug: F5 → "Debug Phase 8 server"
 *
 * Requires OPENAI_API_KEY in .env (real key, not placeholder).
 *
 * Try:
 *   curl http://localhost:3000/health
 *   curl -X POST http://localhost:3000/chat ^
 *     -H "Content-Type: application/json" ^
 *     -d "{\"message\":\"Say hello in 5 words\"}"
 */

import express from 'express';
import { z } from 'zod';
import { config } from '../config/index.js';
import { HttpError } from '../phase-7/lib/http-errors.js';
import { logger } from '../phase-7/lib/logger.js';
import { errorHandler, requestLogger } from './lib/middleware.js';
import { createChatCompletion } from './lib/openai-client.js';

const ChatBodySchema = z.object({
  message: z.string().min(1, 'message is required'),
  model: z.string().optional(),
});

const app = express();

// Middleware pipeline — order matters (like app.Use in ASP.NET)
app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok_works', nodeEnv: config.NODE_ENV });
});

app.post('/chat', async (req, res, next) => {
  try {
    const parsed = ChatBodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError('Invalid request body', 400, { cause: parsed.error });
    }

    const reply = await createChatCompletion({
      message: parsed.data.message,
      model: parsed.data.model,
    });

    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

// Error handler must be last
app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info({ port: config.PORT, event: 'server_started' }, 'Phase 8 server listening');
  console.log(`\n  GET  http://localhost:${config.PORT}/health`);
  console.log(`  POST http://localhost:${config.PORT}/chat  { "message": "...xxxx" }\n`);
});
