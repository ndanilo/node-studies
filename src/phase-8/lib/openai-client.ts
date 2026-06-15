/**
 * OpenAI chat proxy — fetch client for /chat endpoint.
 *
 * C# equivalent: HttpClient.PostAsJsonAsync to OpenAI, with typed response.
 */

import { config } from '../../config/index.js';
import { classifyLlmFailure, parseLlmResponse } from '../../phase-7/lib/llm-errors.js';

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';

export type ChatRequest = {
  message: string;
  model?: string;
};

export async function createChatCompletion(req: ChatRequest): Promise<string> {
  const response = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: req.model ?? 'gpt-4o-mini',
      messages: [{ role: 'user', content: req.message }],
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw classifyLlmFailure(new Error(`HTTP ${response.status}: ${body}`));
  }

  const data = await response.json();
  const parsed = parseLlmResponse(data);
  return parsed.choices[0].message.content;
}

/** Stream tokens from OpenAI — ReadableStream demo for fundamentals. */
export async function* streamChatCompletion(req: ChatRequest): AsyncGenerator<string> {
  const response = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: req.model ?? 'gpt-4o-mini',
      messages: [{ role: 'user', content: req.message }],
      stream: true,
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok || !response.body) {
    const body = await response.text();
    throw classifyLlmFailure(new Error(`HTTP ${response.status}: ${body}`));
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') return;

      const chunk = JSON.parse(payload) as {
        choices?: Array<{ delta?: { content?: string } }>;
      };
      const token = chunk.choices?.[0]?.delta?.content;
      if (token) yield token;
    }
  }
}
