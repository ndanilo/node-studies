import { z } from 'zod';

/** Zod schemas for OpenAI chat completion responses — runtime validation layer. */

export const ChatRoleSchema = z.enum(['system', 'user', 'assistant', 'tool']);

export const ChatMessageSchema = z.object({
  role: ChatRoleSchema,
  content: z.string().nullable(),
});

export const ChatChoiceSchema = z.object({
  index: z.number().int().nonnegative(),
  message: ChatMessageSchema,
  finish_reason: z.enum(['stop', 'length', 'tool_calls', 'content_filter']).nullable(),
});

export const UsageSchema = z.object({
  prompt_tokens: z.number().int().nonnegative(),
  completion_tokens: z.number().int().nonnegative(),
  total_tokens: z.number().int().nonnegative(),
});

export const ChatCompletionSchema = z.object({
  id: z.string(),
  object: z.literal('chat.completion'),
  created: z.number().int(),
  model: z.string(),
  choices: z.array(ChatChoiceSchema).min(1),
  usage: UsageSchema.optional(),
});

export type ChatCompletion = z.infer<typeof ChatCompletionSchema>;
