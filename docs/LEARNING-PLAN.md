# Node.js & TypeScript Learning Plan
## For C# Developers → Applied AI Engineering

Track progress by checking boxes. Ask Cursor to teach any unchecked topic — rules in `.cursor/rules/` will guide the session.

---

## Phase 0 — Environment Setup
> Goal: run TypeScript locally, debug in Cursor, read env vars.

- [x] Install Node.js LTS (20 or 22) — verify with `node -v` and `npm -v`
- [x] Understand `package.json`, `npm install`, `npm run`
- [x] Run first script: `src/phase-0/hello.ts`
- [ ] Configure debugger (`.vscode/launch.json`)
- [ ] Read env vars with `dotenv` — see `src/phase-0/env-demo.ts`
- [ ] Gitignore: `node_modules/`, `.env`, `dist/`

**Cursor prompt:** *"Teach me Phase 0 from LEARNING-PLAN. I'm from C# — walk me through setup and env vars."*

---

## Phase 1 — JavaScript Fundamentals (C# Lens)
> Goal: stop translating C# line-by-line; know JS quirks.

- [ ] `let` vs `const` vs `var`
- [ ] Types: `number`, `string`, `boolean`, `bigint`, `symbol`
- [ ] `null` vs `undefined`
- [ ] `==` vs `===` (always use strict)
- [ ] Truthy / falsy values
- [ ] Objects vs Maps; arrays vs Lists
- [ ] Destructuring (`const { x } = obj`)
- [ ] Spread / rest (`...args`)
- [ ] Template literals (`` `Hello ${name}` ``)
- [ ] Arrow functions vs regular functions (`this` binding!)
- [ ] `for...of` vs `for...in`
- [ ] JSON.parse / JSON.stringify vs System.Text.Json

**Exercise:** Rewrite a small C# console app (e.g. word counter) in `src/phase-1/`.

---

## Phase 2 — Functions, Classes & Modules
> Goal: structure code like you would in C# but idiomatically.

- [ ] Function declarations vs expressions
- [ ] Default parameters and optional params
- [ ] Rest parameters (`...items`)
- [ ] Classes: constructor, extends, static, private `#field`
- [ ] Prototypes (brief — know they exist under the hood)
- [ ] ESM: `import` / `export` (prefer over CommonJS `require`)
- [ ] Barrel exports (`index.ts` re-exporting)
- [ ] No namespaces — use modules instead

**Exercise:** Port a C# service class + interface to TS in `src/phase-2/`.

---

## Phase 3 — Async & Concurrency
> Goal: confident with Promises before touching LLM streaming.

- [ ] Callbacks (historical context only)
- [ ] Promises: `.then()`, `.catch()`, `Promise.all`, `Promise.race`, `Promise.allSettled`
- [ ] `async` / `await` (maps directly to C#)
- [ ] Error propagation in async chains
- [ ] `setTimeout` / `setInterval` vs `Task.Delay`
- [ ] `AbortController` for cancellation
- [ ] Event loop (high level — why CPU-bound work blocks)
- [ ] Streaming with `async` iterators

**Exercise:** Fetch JSON from a public API with timeout + retry in `src/phase-3/`.

---

## Phase 4 — TypeScript Deep Dive
> Goal: leverage types like C#; know where they differ.

- [ ] `tsconfig.json` — `strict`, `module`, `moduleResolution`
- [ ] Interfaces vs type aliases
- [ ] Union and intersection types
- [ ] Generics (`<T>`, constraints)
- [ ] Utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K,V>`
- [ ] `unknown` vs `any`
- [ ] Type narrowing (`typeof`, `instanceof`, discriminated unions)
- [ ] Runtime validation with Zod (LLM JSON responses!)
- [ ] Declaration files (`.d.ts`) — when you need them

**Exercise:** Define types for an OpenAI chat response + validate with Zod.

---

## Phase 5 — Configuration & Secrets (Applied AI)
> Goal: production-ready config for API keys and model settings.

- [ ] `process.env` and `.env` files
- [ ] `.env.example` for team onboarding
- [ ] Typed config module (Zod schema at startup)
- [ ] `NODE_ENV` behavior
- [ ] Never log secrets; redact in error messages
- [ ] Compare: `appsettings.json` + User Secrets vs dotenv

**Exercise:** Build `src/config/env.ts` that validates `OPENAI_API_KEY`, `PORT`, `LOG_LEVEL`.

---

## Phase 6 — Error Handling & Debugging
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

## Phase 7 — HTTP Clients & Small APIs
> Goal: call LLM APIs and expose your own endpoints.

- [ ] Native `fetch` in Node 18+
- [ ] Request headers, body, query params
- [ ] Streaming responses (`ReadableStream`)
- [ ] Express or Fastify hello-world API
- [ ] Middleware concept (≈ ASP.NET middleware pipeline)
- [ ] Optional: NestJS overview for DI lovers

**Exercise:** Minimal Express server with `/health` and `/chat` proxy to OpenAI.

---

## Phase 8 — Applied AI Patterns (Node Ecosystem)
> Goal: confidence in real AI engineering repos.

- [ ] OpenAI / Anthropic SDK usage in Node
- [ ] Prompt as code; system vs user messages
- [ ] Token counting (conceptual)
- [ ] Streaming tokens to client (SSE)
- [ ] Tool / function calling flow
- [ ] RAG basics: embed, store, retrieve (langchain.js or plain SDK)
- [ ] Agent loops (plan → act → observe)
- [ ] Evals and logging traces

**Exercise:** CLI agent in `src/phase-8/` that uses tools and streams output.

---

## Phase 9 — Testing & Quality
> Goal: same rigor as xUnit/NUnit in C#.

- [ ] Vitest or Jest basics
- [ ] `describe` / `it` ≈ `[Fact]` / `[Theory]`
- [ ] Mocking `fetch` and env vars
- [ ] Snapshot testing (use sparingly)
- [ ] ESLint + Prettier (≈ analyzers + format on save)

---

## Phase 10 — Deployment & Ops (Overview)
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
| 5+ | 8–10 (Applied AI focus) |

Adjust based on depth — you're senior in C#, so Phases 0–4 may go faster than Phases 8–10.
