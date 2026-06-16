/**
 * Phase 9 — Applied AI patterns (C# lens).
 *
 * Run: npm run phase9
 * Requires OPENAI_API_KEY in .env
 */

import { runAgent } from './lib/agent.js';
import { AGENT_SYSTEM_PROMPT } from './lib/prompts.js';
import { chunkText, clearIndex, cosineSimilarity, searchDocuments } from './lib/rag.js';
import { DEFAULT_CHAT_MODEL, openai } from './lib/sdk-client.js';
import { estimateTokenCount, usageFromApi } from './lib/tokens.js';
import { safeCalculate, toolDefinitions } from './lib/tools.js';
import { createTrace } from './lib/trace.js';

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

// ── 1. SDK vs raw fetch ─────────────────────────────────────────────────
section('OpenAI SDK (vs Phase 8 fetch)');

console.log(`
  Phase 8: manual fetch + JSON.parse each SSE line
  Phase 9: openai.chat.completions.create({ stream: true })

  C# parallel: HttpClient → official OpenAI NuGet SDK
  Anthropic:   new Anthropic({ apiKey }) + messages.create() — same shape, different API
`);

const models = await openai.models.list();
const mini = models.data.find((m) => m.id.includes('gpt-4o-mini'));
console.log('SDK connected. Sample model:', mini?.id ?? DEFAULT_CHAT_MODEL);

// ── 2. Prompt as code ─────────────────────────────────────────────────
section('Prompt as code — system vs user');

console.log('System prompt (first 120 chars):', AGENT_SYSTEM_PROMPT.slice(0, 120) + '…');
console.log(`
  roles:
    system    → instructions (like injected app policy)
    user      → human input
    assistant → prior model replies (replay for multi-turn)
    tool      → your function results (fed back to the model)
`);

// ── 3. Token counting ─────────────────────────────────────────────────
section('Token counting (conceptual)');

const sample = 'Applied AI apps budget context by tokens, not characters.';
const estimated = estimateTokenCount(sample);
console.log('Text:', sample);
console.log('Estimated tokens (~chars/4):', estimated);

const countRes = await openai.chat.completions.create({
  model: DEFAULT_CHAT_MODEL,
  messages: [{ role: 'user', content: 'Reply with exactly: ok' }],
  max_tokens: 5,
});
const usage = usageFromApi(countRes.usage);
console.log('API usage from response:', usage);

// ── 4. Tool definitions ───────────────────────────────────────────────
section('Tool / function calling schemas');

for (const tool of toolDefinitions) {
  if (tool.type !== 'function') continue;
  console.log(`  • ${tool.function.name}: ${tool.function.description}`);
}

const calc = safeCalculate('(12 + 8) * 3');
console.log('Local tool demo — calculator("(12 + 8) * 3") =', calc);

// ── 5. RAG — embed, store, retrieve ───────────────────────────────────
section('RAG — chunk, embed, cosine similarity');

clearIndex();
const demoChunks = chunkText('Phase 9 covers RAG.\n\nRAG retrieves relevant chunks.\n\nAgents use tools in a loop.');
console.log('Chunk count from demo text:', demoChunks.length);

const sim = cosineSimilarity([1, 0, 0], [0.9, 0.1, 0]);
console.log('Cosine similarity [1,0,0] vs [0.9,0.1,0]:', sim.toFixed(3));

console.log('Building in-memory doc index (calls embedding API)…');
const hits = await searchDocuments('What is Phase 9 about?', 2);
for (const hit of hits) {
  console.log(`  score ${hit.score.toFixed(3)} | ${hit.text.slice(0, 70).replace(/\n/g, ' ')}…`);
}

// ── 6. Streaming tokens (SDK) ───────────────────────────────────────────
section('Streaming tokens (SDK async iterator)');

process.stdout.write('  Stream: ');
const stream = await openai.chat.completions.create({
  model: DEFAULT_CHAT_MODEL,
  messages: [{ role: 'user', content: 'Count from 1 to 5, space-separated.' }],
  max_tokens: 30,
  stream: true,
});

for await (const chunk of stream) {
  const token = chunk.choices[0]?.delta?.content;
  if (token) process.stdout.write(token);
}
console.log('\n  (Same pattern powers SSE in npm run phase9-server)');

// ── 7. Agent loop (plan → act → observe) ──────────────────────────────
section('Agent loop — one tool call');

const trace = createTrace();
const agentResult = await runAgent({
  userMessage: 'Use the calculator: what is 99 * 101?',
  maxSteps: 4,
  trace,
});

console.log('Answer:', agentResult.answer.trim());
console.log('Steps:', agentResult.steps, '| Tools:', agentResult.toolsUsed.join(', ') || '(none)');
console.log('Tokens:', agentResult.usage.totalTokens, '| Trace:', agentResult.traceId);

// ── 8. Evals & traces ─────────────────────────────────────────────────
section('Evals and traces');

console.log(`
  Evals: golden Q&A fixtures → npm run phase9-evals (no API for unit checks)
  Traces: structured pino logs with traceId — see stderr JSON during agent runs

  C# parallel: xUnit theories + OpenTelemetry Activity spans
`);

console.log('\nNext:');
console.log('  npm run phase9-agent -- "What topics are in Phase 9?"');
console.log('  npm run phase9-server   → POST /chat/stream for SSE');
console.log('  npm run phase9-evals');
