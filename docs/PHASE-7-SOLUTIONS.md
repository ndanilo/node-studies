# Phase 7 Exercise — Solutions

Open only after you've tried debugging with F5.

## Bug 1 — HTTP 500 instead of 404

**File:** `src/phase-7/exercise.ts` → `mapNotFoundToHttp`

The wrapper overwrites the correct status from `mapErrorToHttpResponse`:

```typescript
function mapNotFoundToHttp(err: unknown) {
  return mapErrorToHttpResponse(err, true);
}
```

## Bug 2 — Lost cause chain on file read

**File:** `src/phase-7/exercise.ts` → `loadLlmFixture`

```typescript
throw new Error('Failed to load LLM fixture', { cause: err });
```

## Bug 3 — Valid LLM JSON fails validation

**File:** `src/phase-7/exercise.ts` → scenario 3 in `run()`

Missing `await` — `parseLlmResponse` receives a `Promise`, not JSON:

```typescript
try {
  const raw = await fetchSimulatedLlm();
  const parsed = parseLlmResponse(raw);
  results.push({
    name: 'Parse valid LLM JSON',
    passed: true,
    detail: parsed.choices[0].message.content,
  });
} catch (err) {
  // ...
}
```

## Bug 4 — Rate limit not classified

**File:** `src/phase-7/exercise.ts` → `classifyRateLimit`

Returns raw `Error` instead of delegating to `classifyLlmFailure`:

```typescript
function classifyRateLimit(err: unknown) {
  return classifyLlmFailure(err);
}
```

## Debugger workflow (C# comparison)

| Step | Visual Studio | Cursor |
|------|---------------|--------|
| Start | F5 | F5 → "Debug Phase 7 exercise" |
| Breakpoint | F9 | Click gutter |
| Step over | F10 | F10 |
| Step into | F11 | F11 |
| Inspect | Locals / Watch | VARIABLES / WATCH |
| Stack | Call Stack | CALL STACK |

Set a breakpoint on `run()`, run scenario 1, inspect `http.status` in WATCH — you'll see 500 when you expect 404.
