/**
 * Custom errors with cause chains — like C# Exception.InnerException.
 *
 * ES2022: new Error('wrapper', { cause: originalError })
 */

export class AppError extends Error {
  readonly code?: string;

  constructor(message: string, options?: { cause?: unknown; code?: string }) {
    super(message, { cause: options?.cause });
    this.name = this.constructor.name;
    this.code = options?.code;
  }
}

export class ConfigError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, code: 'CONFIG_ERROR' });
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, { code: 'NOT_FOUND' });
  }
}

/** Walk the cause chain — useful for logging and debugging. */
export function getErrorChain(err: unknown): Error[] {
  const chain: Error[] = [];
  let current: unknown = err;

  while (current instanceof Error) {
    chain.push(current);
    current = current.cause;
  }

  return chain;
}
