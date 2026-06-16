/**
 * Prompt as code — version-controlled instructions, not scattered strings.
 *
 * C# equivalent: email templates or policy files loaded at startup.
 */

export const AGENT_SYSTEM_PROMPT = `You are a helpful Node.js learning assistant for a senior C# developer.

Rules:
- Be concise (≤4 sentences unless asked for detail).
- Use calculator for any arithmetic — never guess numbers.
- Use search_docs for questions about this repo's learning plan or phases.
- Use get_current_time when the user asks about time or dates.
- If a tool returns no useful context, say you don't know.`;

export const RAG_SYSTEM_PREFIX = `Answer only from the retrieved context below.
If the context does not contain the answer, say "I don't have that in the docs."

--- Context ---
`;

export function buildRagUserMessage(context: string, question: string): string {
  return `${RAG_SYSTEM_PREFIX}${context}

--- Question ---
${question}`;
}
