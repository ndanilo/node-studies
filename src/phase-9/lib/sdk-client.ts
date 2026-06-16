/**
 * OpenAI SDK client — replaces hand-rolled fetch from Phase 8.
 *
 * C# equivalent: new OpenAIClient(apiKey) from the official NuGet package.
 *
 * Anthropic parallel (not wired here — same pattern):
 *   import Anthropic from '@anthropic-ai/sdk';
 *   const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 *   await client.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, messages: [...] });
 */

import OpenAI from 'openai';
import { config } from '../../config/index.js';

export const DEFAULT_CHAT_MODEL = 'gpt-4o-mini';
export const DEFAULT_EMBED_MODEL = 'text-embedding-3-small';

export const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
  timeout: 60_000,
});
