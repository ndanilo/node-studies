/**
 * Request traces — structured logging for agent debugging.
 *
 * C# equivalent: Activity / distributed tracing spans (OpenTelemetry).
 */

import { randomUUID } from 'node:crypto';
import { logger } from '../../phase-7/lib/logger.js';
import type { TokenUsage } from './tokens.js';

export type TraceContext = {
  traceId: string;
  startMs: number;
};

export function createTrace(): TraceContext {
  return { traceId: randomUUID(), startMs: Date.now() };
}

function elapsed(ctx: TraceContext): number {
  return Date.now() - ctx.startMs;
}

export function logAgentStart(ctx: TraceContext, userMessage: string): void {
  logger.info(
    { traceId: ctx.traceId, event: 'agent_start', messageLength: userMessage.length },
    'Agent run started',
  );
}

export function logAgentStep(
  ctx: TraceContext,
  step: number,
  action: 'llm_call' | 'tool_call' | 'stream',
  detail: Record<string, unknown>,
): void {
  logger.info(
    { traceId: ctx.traceId, event: 'agent_step', step, action, latencyMs: elapsed(ctx), ...detail },
    `Agent step ${step}: ${action}`,
  );
}

export function logAgentComplete(
  ctx: TraceContext,
  steps: number,
  usage: TokenUsage,
  toolNames: string[],
): void {
  logger.info(
    {
      traceId: ctx.traceId,
      event: 'agent_complete',
      steps,
      latencyMs: elapsed(ctx),
      usage,
      toolCalls: toolNames,
    },
    'Agent run completed',
  );
}
