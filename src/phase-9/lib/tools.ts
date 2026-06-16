/**
 * Tool definitions + typed handlers — function calling in practice.
 *
 * C# equivalent: IActionResult Dispatch(string toolName, JsonElement args)
 * with a switch on known names — never eval() raw model output.
 */

import { z } from 'zod';
import type OpenAI from 'openai';
import { searchDocuments } from './rag.js';

const CalculatorArgs = z.object({
  expression: z.string().min(1),
});

const SearchDocsArgs = z.object({
  query: z.string().min(1),
  topK: z.number().int().min(1).max(5).optional(),
});

/** OpenAI tool schemas — sent to the API so the model knows what it can call. */
export const toolDefinitions: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Evaluate a safe arithmetic expression (digits, +, -, *, /, parentheses).',
      parameters: {
        type: 'object',
        properties: {
          expression: { type: 'string', description: 'e.g. "(12 + 8) * 3"' },
        },
        required: ['expression'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_docs',
      description: 'Search the node-studies learning docs for phase topics and goals.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'What to look up in the docs' },
          topK: { type: 'number', description: 'Number of chunks to return (1-5)' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_current_time',
      description: 'Return the current UTC date and time as ISO-8601.',
      parameters: { type: 'object', properties: {} },
    },
  },
];

/** Safe arithmetic — validate chars before evaluating. Production: use a math library. */
export function safeCalculate(expression: string): number {
  const trimmed = expression.replace(/\s/g, '');
  if (!/^[\d+\-*/().]+$/.test(trimmed)) {
    throw new Error(`Unsafe expression: ${expression}`);
  }

  const result = Function(`"use strict"; return (${trimmed})`)();
  if (typeof result !== 'number' || !Number.isFinite(result)) {
    throw new Error(`Expression did not produce a finite number: ${expression}`);
  }
  return result;
}

export type ToolResult = {
  toolName: string;
  output: string;
};

export async function executeTool(name: string, rawArgs: string): Promise<ToolResult> {
  switch (name) {
    case 'calculator': {
      const args = CalculatorArgs.parse(JSON.parse(rawArgs));
      const value = safeCalculate(args.expression);
      return { toolName: name, output: String(value) };
    }
    case 'search_docs': {
      const args = SearchDocsArgs.parse(JSON.parse(rawArgs));
      const chunks = await searchDocuments(args.query, args.topK ?? 3);
      if (chunks.length === 0) {
        return { toolName: name, output: 'No matching documentation found.' };
      }
      const body = chunks
        .map((c, i) => `[${i + 1}] (score ${c.score.toFixed(3)})\n${c.text}`)
        .join('\n\n');
      return { toolName: name, output: body };
    }
    case 'get_current_time':
      return { toolName: name, output: new Date().toISOString() };
    default:
      return { toolName: name, output: `Unknown tool: ${name}` };
  }
}
