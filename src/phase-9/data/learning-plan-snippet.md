# Node Studies — Learning Plan Excerpt

## Phase 9 — Applied AI Patterns

Goal: confidence in real AI engineering repos.

Topics covered:
- OpenAI / Anthropic SDK usage in Node
- Prompt as code; system vs user messages
- Token counting (conceptual)
- Streaming tokens to client (SSE)
- Tool / function calling flow
- RAG basics: embed, store, retrieve
- Agent loops (plan → act → observe)
- Evals and logging traces

Exercise: CLI agent that uses tools and streams output.

## Phase 8 — HTTP Clients & Small APIs

Goal: call LLM APIs and expose your own endpoints.

Topics: native fetch, Express middleware, streaming ReadableStream, /health and /chat proxy.

## Phase 6 — Configuration & Secrets

Goal: production-ready config for API keys and model settings.

Use Zod to validate OPENAI_API_KEY, PORT, and LOG_LEVEL at startup. Never log secrets.

## Suggested Pace

Weeks 1–5 cover Phases 0–8. Weeks 6+ focus on Applied AI (Phases 9–11).
