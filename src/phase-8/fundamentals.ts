/**
 * Phase 8 — HTTP clients & small APIs (C# lens).
 *
 * Run: npm run phase8
 * Debug: open this file → F5 → "Debug current TS file"
 */

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

// ── 1. Native fetch in Node 18+ ────────────────────────────────────────
section('Native fetch (Node 18+)');

// C#: HttpClient.GetAsync(url) — no extra package needed since Node 18
const getRes = await fetch('https://jsonplaceholder.typicode.com/posts/1');
console.log('GET status:', getRes.status, getRes.statusText);
console.log('Content-Type header:', getRes.headers.get('content-type'));

if (!getRes.ok) {
  throw new Error(`HTTP ${getRes.status}: ${getRes.statusText}`);
}

const post = (await getRes.json()) as { id: number; title: string };
console.log('GET body:', { id: post.id, title: post.title.slice(0, 40) + '…' });

// ── 2. Query params, headers, body ─────────────────────────────────────
section('Query params, headers, POST body');

// C#: new UriBuilder + HttpRequestMessage with headers
const params = new URLSearchParams({ userId: '1', _limit: '2' });
const listUrl = `https://jsonplaceholder.typicode.com/posts?${params}`;

const listRes = await fetch(listUrl, {
  headers: { Accept: 'application/json' },
});
const posts = (await listRes.json()) as unknown[];
console.log('Query ?userId=1&_limit=2 →', posts.length, 'posts');

// C#: PostAsJsonAsync
const createRes = await fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Request-Id': 'phase8-demo',
  },
  body: JSON.stringify({
    title: 'Applied AI note',
    body: 'fetch is built into Node 18+',
    userId: 1,
  }),
});

const created = (await createRes.json()) as { id: number; title: string };
console.log('POST created id:', created.id, '| title:', created.title);

// ── 3. Streaming responses (ReadableStream) ────────────────────────────
section('ReadableStream (response.body)');

// C#: await response.Content.ReadAsStreamAsync() + read chunks
// httpbin streams N JSON lines — good stand-in for SSE/token streams
const streamRes = await fetch('https://httpbin.org/stream/3', {
  signal: AbortSignal.timeout(10_000),
});

if (!streamRes.body) throw new Error('No response body');

const reader = streamRes.body.getReader();
const decoder = new TextDecoder();
let chunkCount = 0;

while (chunkCount < 3) {
  const { done, value } = await reader.read();
  if (done) break;
  chunkCount++;
  const text = decoder.decode(value, { stream: true });
  console.log(`  chunk ${chunkCount}:`, text.trim().slice(0, 60) + '…');
}

reader.releaseLock();
console.log('LLM apps use the same pattern: response.body → read chunks → yield tokens');

// ── 4. Middleware concept ──────────────────────────────────────────────
section('Middleware (≈ ASP.NET pipeline)');

console.log(`
  ASP.NET Core                          Express
  ─────────────────                     ─────────────────────────────
  app.UseAuthentication()               app.use(authMiddleware)
  app.UseRouting()                      app.use(requestLogger)
  app.MapControllers()                  app.get('/health', handler)
  app.UseExceptionHandler()             app.use(errorHandler)  // last

  Each middleware: (req, res, next) => { ...; next(); }
  Order matters — first registered runs first on the way IN.
`);

// ── 5. Framework overview ──────────────────────────────────────────────
section('Express vs Fastify vs NestJS');

console.log(`
  Express  — most tutorials; app.use() middleware; minimal structure
  Fastify  — faster; built-in JSON schema validation; plugin system
  NestJS   — closest to ASP.NET Core: modules, DI, decorators, guards
             @Controller(), @Injectable(), @Get() — if you miss DI, look here

  This repo uses Express for the exercise — smallest step from HttpClient + Kestrel mental model.
`);

console.log('\nNext: npm run phase8-server — start /health and /chat, then try:');
console.log('  curl http://localhost:3000/health');
console.log('  curl -X POST http://localhost:3000/chat -H "Content-Type: application/json" -d "{\\"message\\":\\"Say hi in 5 words\\"}"');
