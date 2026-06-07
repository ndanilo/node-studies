/**
 * Phase 3 exercise — fetch JSON with timeout + retry.
 *
 * C# mental model:
 *   HttpClient + CancellationTokenSource.CancelAfter(ms) + Polly retry
 */

import { delay } from './delay.js';

export type FetchJsonOptions = {
  timeoutMs?: number;
  retries?: number;
};

export async function fetchJsonWithRetry<T>(
  url: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  const { timeoutMs = 3_000, retries = 3 } = options;
  let lastError = new Error('Request failed');

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt === retries) break;

      const backoffMs = 200 * 2 ** (attempt - 1);
      await delay(backoffMs);
    }
  }

  throw lastError;
}
