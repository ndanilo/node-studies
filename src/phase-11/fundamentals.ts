/**
 * Phase 11 — Deployment & Ops (C# lens).
 *
 * Run: npm run phase11
 */

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

section('1. tsx (dev) vs node dist/ (prod)');

console.log(`
  Dev   →  tsx src/phase-11/server.ts     compile-on-the-fly, fast iteration
  Prod  →  npm run build:prod && npm start    tsc → dist/ → node (no tsx in prod image)

  C# parallel:
    dotnet run              ≈ tsx (dev convenience)
    dotnet publish + dll      ≈ tsc + node dist/...

  Why not tsx in production?
    • Extra dependency and startup overhead
    • No pre-compile typecheck gate before deploy
    • Smaller Docker image without devDependencies
`);

section('2. Docker for Node apps');

console.log(`
  Dockerfile (multi-stage):
    Stage "build"  — npm ci, tsc, produce dist/
    Stage "run"    — node:22-alpine, npm ci --omit=dev, COPY dist, CMD node ...

  C# parallel: multi-stage Dockerfile with SDK image → runtime aspnet image.

  Files in repo root:
    Dockerfile      — build + run instructions
    .dockerignore   — exclude node_modules, .env, src (only ship dist)

  Build & run locally:
    docker build -t node-studies-phase11 .
    docker run -p 3000:3000 -e OPENAI_API_KEY=sk-... node-studies-phase11
`);

section('3. Health checks & graceful shutdown');

console.log(`
  /health/live   — liveness  (process up?)           → always 200 if handler runs
  /health/ready  — readiness (can serve traffic?)    → 503 if API key missing

  C# parallel: ASP.NET Core MapHealthChecks with separate tags:
    AddCheck("live", ...) vs AddCheck("ready", ...) — K8s probes hit different URLs.

  SIGTERM / SIGINT:
    Cloud sends SIGTERM → stop accepting new connections → drain in-flight → exit 0
    C# parallel: IHostApplicationLifetime.ApplicationStopping

  See: src/phase-11/lib/graceful-shutdown.ts
`);

section('4. Env vars in cloud');

console.log(`
  Local dev     →  .env file (dotenv) — never commit secrets
  Cloud prod    →  platform injects env vars (no .env file in container)

  | Platform   | Where you set OPENAI_API_KEY, PORT        |
  |------------|-------------------------------------------|
  | Railway    | Project → Variables tab                   |
  | Fly.io     | fly secrets set OPENAI_API_KEY=...        |
  | Azure      | App Service Configuration / Key Vault ref |
  | AWS        | ECS task definition / Secrets Manager     |

  C# parallel: Azure App Settings / Key Vault references instead of appsettings.Development.json secrets.

  Same code path: import { config } from "../config/index.js" — Zod validates at boot, fail fast.
`);

section('5. Observability — logs, metrics, tracing');

console.log(`
  Logs     →  pino JSON (Phase 7) — query in Datadog, CloudWatch, Azure Monitor
  Metrics  →  /metrics endpoint (demo) — production: Prometheus + Grafana
  Tracing  →  traceId per request (Phase 9) — production: OpenTelemetry → Jaeger/Honeycomb

  C# parallel:
    Serilog structured logs  ≈  pino
    Application Insights     ≈  OpenTelemetry + vendor backend
    Activity / W3C traceparent ≈  traceId propagation

  AI-specific: log token usage, latencyMs, model name — never log full prompts with PII in prod.
`);

section('Try it');

console.log(`
  1. npm run phase11-server              — dev server with health + shutdown
  2. curl http://localhost:3000/health/ready
  3. npm run build:prod && npm start     — prod path (compiled JS)
  4. docker build -t node-studies-phase11 .
  5. docker run -p 3000:3000 -e OPENAI_API_KEY=sk-... node-studies-phase11
  6. Ctrl+C or docker stop — watch graceful shutdown logs
`);

console.log('\nKey takeaway: dev ergonomics (tsx) ≠ prod runtime (node + dist + Docker + probes).\n');
