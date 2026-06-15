/**
 * HTTP error mapping — 4xx client vs 5xx server (like ASP.NET ProblemDetails).
 */

import { AppError } from './errors.js';

export class HttpError extends AppError {
  constructor(
    message: string,
    readonly statusCode: number,
    options?: { cause?: unknown; code?: string },
  ) {
    super(message, { ...options, code: options?.code ?? `HTTP_${statusCode}` });
  }
}

export type HttpErrorResponse = {
  status: number;
  body: { error: string; code?: string };
};

/** Map thrown errors to HTTP status + safe client body (never leak stack in prod). */
export function mapErrorToHttpResponse(err: unknown, exposeDetails = false): HttpErrorResponse {
  if (err instanceof HttpError) {
    return {
      status: err.statusCode,
      body: { error: err.message, code: err.code },
    };
  }

  if (err instanceof AppError) {
    const status = err.code === 'NOT_FOUND' ? 404 : 500;
    const safeClientMessage = isClientError(status) || exposeDetails;
    return {
      status,
      body: {
        error: safeClientMessage ? err.message : 'Internal Server Error',
        code: err.code,
      },
    };
  }

  return {
    status: 500,
    body: { error: exposeDetails && err instanceof Error ? err.message : 'Internal Server Error' },
  };
}

export function isClientError(status: number): boolean {
  return status >= 400 && status < 500;
}

export function isServerError(status: number): boolean {
  return status >= 500;
}
