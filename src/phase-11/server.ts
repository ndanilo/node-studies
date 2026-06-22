/**
 * Phase 11 — production-shaped HTTP server.
 *
 * Dev:   npm run phase11-server     (tsx — fast reload, no compile step)
 * Prod:  npm run build && npm start (node dist/phase-11/index.js)
 *
 * Features: liveness/readiness, graceful SIGTERM, structured logs, basic metrics.
 */

import express from 'express';
import { z } from 'zod';
import { config, getSafeConfigSummary } from '../config/index.js';
import { setupGlobalErrorHandlers } from '../phase-7/lib/global-handlers.js';
import { HttpError } from '../phase-7/lib/http-errors.js';
import { logger } from '../phase-7/lib/logger.js';
import { errorHandler, requestLogger } from '../phase-8/lib/middleware.js';
import { createChatCompletion } from '../phase-8/lib/openai-client.js';
import { registerGracefulShutdown } from './lib/graceful-shutdown.js';
import { getLiveness, getReadiness } from './lib/health.js';
import { getMetricsSnapshot, incrementCounter } from './lib/metrics.js';

const ChatBodySchema = z.object({
  message: z.string().min(1, 'message is required'),
});

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  // Liveness — "is the process alive?" (always 200 if we reach this handler)
  app.get('/health/live', (_req, res) => {
    res.json(getLiveness());
  });

  // Readiness — "can we serve traffic?" (503 if misconfigured)
  app.get('/health/ready', (_req, res) => {
    const readiness = getReadiness(config.OPENAI_API_KEY.length > 0);
    const statusCode = readiness.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(readiness);
  });

  // Legacy single endpoint — maps to liveness for simple load balancers
  app.get('/health', (_req, res) => {
    res.json({ ...getLiveness(), phase: 11, nodeEnv: config.NODE_ENV });
  });

  app.get('/metrics', (_req, res) => {
    res.json(getMetricsSnapshot());
  });

  app.post('/chat', async (req, res, next) => {
    try {
      const parsed = ChatBodySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new HttpError('Invalid request body', 400, { cause: parsed.error });
      }

      incrementCounter('chat_requests_total');
      const reply = await createChatCompletion({ message: parsed.data.message });
      incrementCounter('chat_requests_success');

      res.json({ reply });
    } catch (err) {
      incrementCounter('chat_requests_failed');
      next(err);
    }
  });

  app.use(errorHandler);

  return app;
}

export function startServer() {
  setupGlobalErrorHandlers(logger);

  const app = createApp();
  const host = '0.0.0.0'; // Required in Docker — 127.0.0.1 is unreachable from outside the container

  const server = app.listen(config.PORT, host, () => {
    logger.info(
      {
        event: 'server_started',
        ...getSafeConfigSummary(),
        host,
        pid: process.pid,
      },
      'Phase 11 server listening',
    );

    console.log(`\n  GET  http://localhost:${config.PORT}/health/live`);
    console.log(`  GET  http://localhost:${config.PORT}/health/ready`);
    console.log(`  GET  http://localhost:${config.PORT}/metrics`);
    console.log(`  POST http://localhost:${config.PORT}/chat  { "message": "..." }\n`);
  });

  registerGracefulShutdown({
    server,
    log: logger,
    onShutdown: async () => {
      logger.info({ event: 'draining_connections' }, 'Waiting for in-flight requests to finish');
    },
  });

  return server;
}
