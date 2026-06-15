/**
 * Express middleware — like ASP.NET middleware pipeline.
 */

import type { NextFunction, Request, Response } from 'express';
import { mapErrorToHttpResponse } from '../../phase-7/lib/http-errors.js';
import { logger } from '../../phase-7/lib/logger.js';
import { config } from '../../config/index.js';

/** Log every request — runs before route handlers. */
export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  logger.info({ method: req.method, path: req.path }, 'Incoming request');
  next();
}

/** Central error handler — like UseExceptionHandler in ASP.NET. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const exposeDetails = config.NODE_ENV === 'development';
  const http = mapErrorToHttpResponse(err, exposeDetails);
  logger.error({ err, status: http.status }, 'Request failed');
  res.status(http.status).json(http.body);
}
