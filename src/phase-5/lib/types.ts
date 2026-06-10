/**
 * Compile-time types for OpenAI chat completions.
 *
 * Note: these do NOT exist at runtime. Pair with Zod in schemas.ts for API responses.
 */

export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  role: ChatRole;
  content: string | null;
}

export interface ChatChoice {
  index: number;
  message: ChatMessage;
  finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatChoice[];
  usage?: Usage;
}

/** Extract assistant text from a validated completion — common helper pattern. */
export function extractAssistantText(completion: ChatCompletion): string | null {
  const choice = completion.choices[0];
  if (!choice) return null;
  return choice.message.content;
}
