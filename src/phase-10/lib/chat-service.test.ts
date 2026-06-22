/**
 * Phase 10 — Mocking fetch (HTTP client under test).
 *
 * C# parallel: Mock<HttpMessageHandler> or WireMock; never hit api.openai.com in unit tests.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createChatCompletion } from './chat-service.js';

describe('createChatCompletion', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Mocked summary of the document.' } }],
        }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns assistant text when API succeeds', async () => {
    const reply = await createChatCompletion('test-key', [
      { role: 'user', content: 'Summarize this doc.' },
    ]);

    expect(reply).toBe('Mocked summary of the document.');
  });

  it('sends Authorization header with the API key', async () => {
    await createChatCompletion('sk-test-123', [{ role: 'user', content: 'Hi' }]);

    expect(fetch).toHaveBeenCalledOnce();
    const [, init] = vi.mocked(fetch).mock.calls[0]!;
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer sk-test-123' });
  });

  it('throws when API returns non-OK status', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    } as Response);

    await expect(
      createChatCompletion('test-key', [{ role: 'user', content: 'Hi' }]),
    ).rejects.toThrow(/429/);
  });
});
