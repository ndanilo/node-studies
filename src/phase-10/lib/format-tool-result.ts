/**
 * Stable string formatter — good snapshot target (output rarely changes shape).
 */

export type ToolResultLine = {
  toolName: string;
  output: string;
};

export function formatToolResults(results: ToolResultLine[]): string {
  if (results.length === 0) {
    return '(no tool calls)';
  }

  return results
    .map((r, index) => `[${index + 1}] ${r.toolName}\n${r.output.trim()}`)
    .join('\n\n');
}
