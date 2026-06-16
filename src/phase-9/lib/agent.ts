/**
 * Agent loop — plan → act → observe until done or max steps.
 *
 * Tool rounds use non-streaming completions; final answer can stream tokens.
 */

import type OpenAI from 'openai';
import { classifyLlmFailure } from '../../phase-7/lib/llm-errors.js';
import { AGENT_SYSTEM_PROMPT } from './prompts.js';
import { DEFAULT_CHAT_MODEL, openai } from './sdk-client.js';
import { sumUsage, usageFromApi, type TokenUsage } from './tokens.js';
import {
  createTrace,
  logAgentComplete,
  logAgentStart,
  logAgentStep,
  type TraceContext,
} from './trace.js';
import { executeTool, toolDefinitions } from './tools.js';

export type AgentOptions = {
  userMessage: string;
  model?: string;
  maxSteps?: number;
  streamFinal?: boolean;
  onToken?: (token: string) => void;
  trace?: TraceContext;
};

export type AgentResult = {
  answer: string;
  steps: number;
  usage: TokenUsage;
  toolsUsed: string[];
  traceId: string;
};

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export async function runAgent(options: AgentOptions): Promise<AgentResult> {
  const trace = options.trace ?? createTrace();
  const model = options.model ?? DEFAULT_CHAT_MODEL;
  const maxSteps = options.maxSteps ?? 6;
  const messages: ChatMessage[] = [
    { role: 'system', content: AGENT_SYSTEM_PROMPT },
    { role: 'user', content: options.userMessage },
  ];

  const usages: TokenUsage[] = [];
  const toolsUsed: string[] = [];

  logAgentStart(trace, options.userMessage);

  for (let step = 0; step < maxSteps; step++) {
    const isLastAllowedStep = step === maxSteps - 1;

    logAgentStep(trace, step + 1, 'llm_call', { model, messageCount: messages.length });

    const completion = await openai.chat.completions.create({
      model,
      messages,
      tools: toolDefinitions,
      tool_choice: isLastAllowedStep ? 'none' : 'auto',
    });

    usages.push(usageFromApi(completion.usage));

    const choice = completion.choices[0];
    if (!choice) {
      throw classifyLlmFailure(new Error('No completion choice returned'));
    }

    const assistantMessage = choice.message;

    if (choice.finish_reason === 'tool_calls' && assistantMessage.tool_calls?.length) {
      messages.push({
        role: 'assistant',
        content: assistantMessage.content,
        tool_calls: assistantMessage.tool_calls,
      });

      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type !== 'function') continue;

        logAgentStep(trace, step + 1, 'tool_call', {
          tool: toolCall.function.name,
          args: toolCall.function.arguments,
        });

        toolsUsed.push(toolCall.function.name);

        let output: string;
        try {
          const result = await executeTool(toolCall.function.name, toolCall.function.arguments);
          output = result.output;
        } catch (err) {
          output = err instanceof Error ? err.message : 'Tool execution failed';
        }

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: output,
        });
      }

      continue;
    }

    const text = assistantMessage.content ?? '';

    if (options.streamFinal && options.onToken) {
      for (const char of text) {
        options.onToken(char);
      }
    }

    logAgentComplete(trace, step + 1, sumUsage(usages), toolsUsed);

    return {
      answer: text,
      steps: step + 1,
      usage: sumUsage(usages),
      toolsUsed,
      traceId: trace.traceId,
    };
  }

  logAgentComplete(trace, maxSteps, sumUsage(usages), toolsUsed);

  return {
    answer: 'Agent stopped: maximum steps reached without a final answer.',
    steps: maxSteps,
    usage: sumUsage(usages),
    toolsUsed,
    traceId: trace.traceId,
  };
}

/** Stream tokens for a simple one-shot chat (no tools) — used by SSE demo. */
export async function streamChat(
  userMessage: string,
  onToken: (token: string) => void,
  model = DEFAULT_CHAT_MODEL,
): Promise<TokenUsage> {
  const stream = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are a concise assistant.' },
      { role: 'user', content: userMessage },
    ],
    stream: true,
    stream_options: { include_usage: true },
  });

  let usage: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) onToken(token);
    if (chunk.usage) usage = usageFromApi(chunk.usage);
  }

  return usage;
}
