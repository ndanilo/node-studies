# Node.js & TypeScript Learning Plan
## For C# Developers → Applied AI Engineering

Track progress by checking boxes. Ask Cursor to teach any unchecked topic — rules in `.cursor/rules/` will guide the session.

---

## Phase 0 — Environment Setup
> Goal: run TypeScript locally, debug in Cursor, read env vars.

- [x] Install Node.js LTS (20 or 22) — verify with `node -v` and `npm -v`
- [x] Understand `package.json`, `npm install`, `npm run`
- [x] Run first script: `src/phase-0/hello.ts`
- [x] Configure debugger (`.vscode/launch.json`)
- [x] Read env vars with `dotenv` — see `src/phase-0/env-demo.ts`
- [x] Gitignore: `node_modules/`, `.env`, `dist/`

**Cursor prompt:** *"Teach me Phase 0 from LEARNING-PLAN. I'm from C# — walk me through setup and env vars."*

---

## Phase 1 — JavaScript Fundamentals (C# Lens)
> Goal: stop translating C# line-by-line; know JS quirks.

- [x] `let` vs `const` vs `var`
- [x] Types: `number`, `string`, `boolean`, `bigint`, `symbol`
- [x] `null` vs `undefined`
- [x] `==` vs `===` (always use strict)
- [x] Truthy / falsy values
- [x] Objects vs Maps; arrays vs Lists
- [x] Destructuring (`const { x } = obj`)
- [x] Spread / rest (`...args`)
- [x] Template literals (`` `Hello ${name}` ``)
- [x] Arrow functions vs regular functions (`this` binding!)
- [x] `for...of` vs `for...in`
- [x] JSON.parse / JSON.stringify vs System.Text.Json

**Exercise:** Rewrite a small C# console app (e.g. word counter) in `src/phase-1/`.

---

## Phase 2 — Functions, Classes & Modules
> Goal: structure code like you would in C# but idiomatically.

- [x] Function declarations vs expressions
- [x] Default parameters and optional params
- [x] Rest parameters (`...items`)
- [x] Classes: constructor, extends, static, private `#field`
- [x] Prototypes (brief — know they exist under the hood)
- [x] ESM: `import` / `export` (prefer over CommonJS `require`)
- [x] Barrel exports (`index.ts` re-exporting)
- [x] No namespaces — use modules instead

**Exercise:** Port a C# service class + interface to TS in `src/phase-2/`.

---

## Phase 3 — Async & Concurrency
> Goal: confident with Promises before touching LLM streaming.

- [x] Callbacks (historical context only)
- [x] Promises: `.then()`, `.catch()`, `Promise.all`, `Promise.race`, `Promise.allSettled`
- [x] `async` / `await` (maps directly to C#)
- [x] Error propagation in async chains
- [x] `setTimeout` / `setInterval` vs `Task.Delay`
- [x] `AbortController` for cancellation
- [x] Event loop (high level — why CPU-bound work blocks)
- [x] Streaming with `async` iterators

**Exercise:** Fetch JSON from a public API with timeout + retry in `src/phase-3/`.

---

## Phase 4 — File I/O & Streams
> Goal: read/write files and work with streams — like `System.IO`; foundation for LLM streaming and RAG doc ingestion.

- [x] `node:fs` and `node:fs/promises` — prefer async; avoid sync I/O on servers
- [x] `readFile` / `writeFile` — `File.ReadAllText` / `File.WriteAllText` equivalent
- [x] Paths with `node:path` — `join`, `resolve`, `basename` (like `Path.Combine`)
- [x] `import.meta.url` + `fileURLToPath` — `__dirname` equivalent in ESM
- [x] `Buffer` — byte data (like `byte[]`); encoding (`utf8`, `base64`)
- [x] Read/write streams — `createReadStream`, `createWriteStream` (like `FileStream`)
- [x] `pipe` and `stream.promises.pipeline` — chain streams without loading entire file into memory
- [x] Backpressure (high level — why listeners wait for `drain`)
- [x] Line-by-line reading with `readline` (like `StreamReader.ReadLine`)
- [x] `fs.watch` — brief; file change notifications (like `FileSystemWatcher`)
- [x] Applied AI: load prompt templates from disk; stream model output to a file; chunk large docs for RAG

**Exercise:** Read a text file, count lines/words, write a summary report; then redo it with streams for a large file in `src/phase-4/`.

**Cursor prompt:** *"Teach me Phase 4 from LEARNING-PLAN. File I/O and streams with C# System.IO comparison."*

---

## Phase 5 — TypeScript Deep Dive
> Goal: leverage types like C#; know where they differ.

- [x] `tsconfig.json` — `strict`, `module`, `moduleResolution`
- [x] Interfaces vs type aliases
- [x] Union and intersection types
- [x] Generics (`<T>`, constraints)
- [x] Utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K,V>`
- [x] `unknown` vs `any`
- [x] Type narrowing (`typeof`, `instanceof`, discriminated unions)
- [x] Runtime validation with Zod (LLM JSON responses!)
- [x] Declaration files (`.d.ts`) — when you need them

**Exercise:** Define types for an OpenAI chat response + validate with Zod.

---

## Phase 6 — Configuration & Secrets (Applied AI)
> Goal: production-ready config for API keys and model settings.

- [x] `process.env` and `.env` files
- [x] `.env.example` for team onboarding
- [x] Typed config module (Zod schema at startup)
- [x] `NODE_ENV` behavior
- [x] Never log secrets; redact in error messages
- [x] Compare: `appsettings.json` + User Secrets vs dotenv

**Exercise:** Build `src/config/env.ts` that validates `OPENAI_API_KEY`, `PORT`, `LOG_LEVEL`.

---

## Phase 7 — Error Handling & Debugging
> Goal: find bugs as fast as in Visual Studio.

- [ ] `Error`, custom errors, `cause` chain
- [ ] Sync vs async stack traces
- [ ] Cursor/VS Code debugger: breakpoints, watch, call stack
- [ ] `console.log` vs structured logging (`pino`)
- [ ] Global handlers: `unhandledRejection`, `uncaughtException`
- [ ] HTTP error mapping (4xx vs 5xx)
- [ ] LLM-specific: rate limits, timeouts, malformed JSON

**Exercise:** Add intentional bugs; practice debugging with F5.

---

## Phase 8 — HTTP Clients & Small APIs
> Goal: call LLM APIs and expose your own endpoints.

- [ ] Native `fetch` in Node 18+
- [ ] Request headers, body, query params
- [ ] Streaming responses (`ReadableStream`)
- [ ] Express or Fastify hello-world API
- [ ] Middleware concept (≈ ASP.NET middleware pipeline)
- [ ] Optional: NestJS overview for DI lovers

**Exercise:** Minimal Express server with `/health` and `/chat` proxy to OpenAI.

---

## Phase 9 — Applied AI Patterns (Node Ecosystem)
> Goal: confidence in real AI engineering repos.

- [ ] OpenAI / Anthropic SDK usage in Node
- [ ] Prompt as code; system vs user messages
- [ ] Token counting (conceptual)
- [ ] Streaming tokens to client (SSE)
- [ ] Tool / function calling flow
- [ ] RAG basics: embed, store, retrieve (langchain.js or plain SDK)
- [ ] Agent loops (plan → act → observe)
- [ ] Evals and logging traces

**Exercise:** CLI agent in `src/phase-9/` that uses tools and streams output.

---

## Phase 10 — Testing & Quality
> Goal: same rigor as xUnit/NUnit in C#.

- [ ] Vitest or Jest basics
- [ ] `describe` / `it` ≈ `[Fact]` / `[Theory]`
- [ ] Mocking `fetch` and env vars
- [ ] Snapshot testing (use sparingly)
- [ ] ESLint + Prettier (≈ analyzers + format on save)

---

## Phase 11 — Deployment & Ops (Overview)
> Goal: know how Node AI services run in prod.

- [ ] `node dist/index.js` vs `tsx` for dev only
- [ ] Docker for Node apps
- [ ] Health checks and graceful shutdown (`SIGTERM`)
- [ ] Env vars in cloud (Railway, Fly, Azure, AWS)
- [ ] Observability: logs, metrics, tracing

---

## How to Use This Repo with Cursor

1. Open this folder in Cursor — rules auto-load from `.cursor/rules/`.
2. Pick a phase; ask: *"Teach me Phase N topic X with C# comparison and an exercise."*
3. Complete exercises under `src/phase-N/`.
4. Check boxes here (or ask Cursor to update the plan).
5. Add new rules from `docs/RULE-TEMPLATE.md` as you learn new topics.

## Suggested Pace

| Week | Phases |
|------|--------|
| 1 | 0–1 |
| 2 | 2–3 |
| 3 | 4–5 |
| 4 | 6–7 |
| 5 | 8 |
| 6+ | 9–11 (Applied AI focus) |

Adjust based on depth — you're senior in C#, so Phases 0–5 may go faster than Phases 9–11.
