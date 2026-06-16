/**
 * Token counting — conceptual + API usage fields.
 *
 * Models bill and truncate by tokens, not characters.
 * Production: use tiktoken or SDK usage; here we estimate for budgeting.
 */

/** Rough English estimate: ~4 chars per token. Not exact — use API usage in prod. */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export function sumUsage(usages: TokenUsage[]): TokenUsage {
  return usages.reduce(
    (acc, u) => ({
      promptTokens: acc.promptTokens + u.promptTokens,
      completionTokens: acc.completionTokens + u.completionTokens,
      totalTokens: acc.totalTokens + u.totalTokens,
    }),
    { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
  );
}

export function usageFromApi(usage?: {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}): TokenUsage {
  return {
    promptTokens: usage?.prompt_tokens ?? 0,
    completionTokens: usage?.completion_tokens ?? 0,
    totalTokens: usage?.total_tokens ?? 0,
  };
}
