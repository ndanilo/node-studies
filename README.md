# node-studies

Node.js / TypeScript learning lab for **Applied AI Engineering**, designed for senior **C#** developers.

## Quick Start

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run hello
npm run env-demo
```

## What's Inside

| Path | Purpose |
|------|---------|
| `.cursor/rules/` | Cursor AI rules — C# ↔ JS comparisons, auto-loaded in this project |
| `docs/LEARNING-PLAN.md` | 11-phase curriculum with checkboxes |
| `docs/RULE-TEMPLATE.md` | Template for adding new rules as you learn |
| `src/phase-N/` | Hands-on exercises per phase |

## Cursor Rules (auto-loaded)

| Rule | Topic |
|------|-------|
| `00-learning-context` | Always-on teaching mode for C# → Node |
| `01-csharp-to-js-core` | Types, classes, modules, async |
| `02-environment-config` | `.env`, `process.env`, Zod validation |
| `03-typescript` | TS for C# devs |
| `04-error-handling-debugging` | Errors, debugger, logging |
| `05-node-tooling` | npm, package.json |
| `06-http-apis` | fetch, streaming, Express |

## How to Learn with Cursor

Open this folder in Cursor and try prompts like:

- *"Teach me Phase 0 from LEARNING-PLAN. Walk me through env vars with C# comparison."*
- *"Explain `==` vs `===` like I'm a C# dev."*
- *"Help me complete the Phase 1 word counter exercise."*

Rules ensure every answer compares to C# and stays focused on Applied AI patterns.

## Debug in Cursor

Press **F5** → choose **Debug hello.ts** or **Debug current TS file**.

## Next Step

Open `docs/LEARNING-PLAN.md` and start **Phase 0**.
