/**
 * Phase 5 — TypeScript Deep Dive (C# type system lens).
 *
 * Run: npm run phase5
 * Debug: open this file → F5 → "Debug current TS file"
 */

import { z } from 'zod';

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

// ── 1. tsconfig.json (see project root) ────────────────────────────────
section('tsconfig.json');

console.log(`
  strict: true           → like nullable reference types + no implicit any
  module: NodeNext        → ESM output matching Node's resolver
  moduleResolution: NodeNext → import paths follow package.json "exports"
  target: ES2022          → JS language level emitted by tsc
  declaration: true       → emit .d.ts (like XML doc + public API surface)
`);

// ── 2. Interface vs type alias ─────────────────────────────────────────
section('interface vs type');

// C#: interface IUser { string Name { get; } }
interface User {
  id: string;
  name: string;
}

// type alias — unions, primitives, tuples; can't be reopened
type UserId = string;
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

let tuser: UserId = 'my_user';
console.log(`created user with id: ${tuser}`);

// Structural typing: if it has id + name, it's a User (duck typing)
const alice: User = { id: '1', name: 'Alice' };
console.log('User:', alice.name);

// Intersection: combine shapes (C# has no direct equivalent)
type Named = { name: string };
type Identified = { id: string };
type NamedUser = Named & Identified;

// ── 3. Union types ─────────────────────────────────────────────────────
section('Unions');

// C# 8+ has similar with discriminated unions via records + pattern matching
type ChatRole = 'system' | 'user' | 'assistant';
type Message = { role: ChatRole; content: string };

function roleLabel(role: ChatRole): string {
  switch (role) {
    case 'system':
      return 'System prompt';
    case 'user':
      return 'User input';
    case 'assistant':
      return 'Model reply';
  }
}

console.log(roleLabel('assistant'));

// ── 4. Generics ────────────────────────────────────────────────────────
section('Generics');

// C#: T First<T>(IList<T> items) where T : class
function first<T>(items: T[]): T | undefined {
  return items[0];
}

function maxBy<T>(items: T[], score: (item: T) => number): T | undefined {
  if (items.length === 0) return undefined;
  return items.reduce((best, item) => (score(item) > score(best) ? item : best));
}

const nums = [3, 1, 4, 1, 5];
console.log('first:', first(nums), 'max:', maxBy(nums, (n) => n));

// Constraint: T must have an id property
interface HasId {
  id: string;
}
function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

console.log('findById:', findById([alice], '1')?.name);

// ── 5. Utility types ───────────────────────────────────────────────────
section('Utility types');

interface ChatRequest {
  model: string;
  messages: Message[];
  temperature: number;
  stream: boolean;
}

// Partial<T>     → all props optional (like optional params everywhere)
type ChatPatch = Partial<ChatRequest>;

// Pick / Omit    → slice or exclude properties
type ChatMeta = Pick<ChatRequest, 'model' | 'temperature'>;
type ChatWithoutStream = Omit<ChatRequest, 'stream'>;

// Record<K, V>   → Dictionary<K, V>
type ModelPricing = Record<string, number>;

const pricing: ModelPricing = { 'gpt-4o': 0.005, 'gpt-4o-mini': 0.00015 };
console.log('pricing keys:', Object.keys(pricing));

const patch: ChatPatch = { temperature: 0.7 };
console.log('patch:', patch);

// ── 6. unknown vs any ──────────────────────────────────────────────────
section('unknown vs any');

// any  → turns off checking (like dynamic — avoid)
// unknown → safe top type; must narrow before use (prefer this)

function parseJsonSafe(raw: string): unknown {
  return JSON.parse(raw);
}

const parsed = parseJsonSafe('{"role":"user","content":"hi"}');

// Type narrowing required:
if (
  typeof parsed === 'object' &&
  parsed !== null &&
  'content' in parsed &&
  typeof (parsed as { content: unknown }).content === 'string'
) {
  console.log('parsed content:', (parsed as { content: string }).content);
}

// ── 7. Type narrowing ──────────────────────────────────────────────────
section('Type narrowing');

type ApiResponse =
  | { status: 'success'; data: string }
  | { status: 'error'; code: number; message: string };

function handleResponse(response: ApiResponse): void {
  // Discriminated union — check the discriminant field
  if (response.status === 'success') {
    console.log('data:', response.data); // TS knows .data exists
  } else {
    console.log('error:', response.code, response.message);
  }
}

handleResponse({ status: 'success', data: 'Hello' });
handleResponse({ status: 'error', code: 429, message: 'Rate limited' });

// typeof / instanceof
function format(value: string | number): string {
  if (typeof value === 'number') return value.toFixed(2);
  return value.toUpperCase();
}

console.log(format(3.14159), format('hello'));

// ── 8. Zod — runtime validation (types erased at compile time!) ───────
section('Zod runtime validation');

const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

// z.infer derives TS type from schema — single source of truth
type ValidatedMessage = z.infer<typeof MessageSchema>;

const external = JSON.parse('{"role":"assistant","content":"Done."}');
const result = MessageSchema.safeParse(external);

if (result.success) {
  const msg: ValidatedMessage = result.data;
  console.log('Zod validated:', msg.role, msg.content.slice(0, 20));
} else {
  console.error('Validation failed:', result.error.flatten());
}

// LLM footgun: model may return malformed JSON — always validate
const badLlmJson = { role: 'assistant', content: 42 };
const bad = MessageSchema.safeParse(badLlmJson);
console.log('bad parse ok?', bad.error?.flatten());

// ── 9. Declaration files (.d.ts) ─────────────────────────────────────
section('Declaration files (.d.ts)');

console.log(`
  .d.ts files describe JS libraries without TS source (like metadata-only assemblies).
  @types/node gives you types for Node built-ins.
  declaration: true in tsconfig emits .d.ts for YOUR public API.
  You rarely write .d.ts by hand unless wrapping untyped JS.
`);

console.log('\nPhase 5 fundamentals complete. Next: npm run phase5-exercise');
