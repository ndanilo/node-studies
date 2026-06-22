/**
 * Phase 10 — Testing & Quality (C# lens).
 *
 * Run this overview:  npm run phase10
 * Run all tests:      npm test
 * Watch mode:         npm run test:watch
 * Lint:               npm run lint
 * Format check:       npm run format:check
 *
 * Topics covered in *.test.ts files under this folder.
 */

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

section('Vitest vs Jest vs xUnit');

console.log(`
  xUnit/NUnit     →  Vitest (or Jest) in Node/TS repos
  dotnet test     →  npm test
  [Fact]          →  it('does something', () => { ... })
  [Theory]        →  it.each([...]) or describe.each([...])
  Assert.Equal    →  expect(x).toBe(y)  (strict ===)
  Moq / NSubstitute → vi.fn(), vi.spyOn(), vi.stubGlobal('fetch', ...)
  Test host       →  Vitest sets NODE_ENV=test automatically
`);

section('Why Vitest over Jest for this repo?');

console.log(`
  • Native ESM — we use "type": "module" + NodeNext (Phase 5)
  • Same API as Jest — describe/it/expect/mocks feel familiar
  • Fast — Vite-powered; great watch mode for TDD
  • tsx not required — Vitest runs .ts directly

  Jest still dominates older CJS codebases; either is fine on a team.
`);

section('Test file layout');

console.log(`
  src/phase-10/lib/chat-service.ts       ← code under test
  src/phase-10/lib/chat-service.test.ts  ← colocated tests (*.test.ts)

  C# equivalent: ChatServiceTests.cs next to ChatService.cs, or in a Tests project.
  AI repos often colocate: embedding-utils.test.ts beside embedding-utils.ts.
`);

section('What to test in Applied AI code');

console.log(`
  ✓ Pure functions     — token math, chunking, Zod parsers, prompt builders
  ✓ HTTP clients       — mock fetch; assert headers, body, error mapping
  ✓ Config loading     — inject env dict; never read real .env in unit tests
  ✓ Tool dispatch      — calculator, JSON arg parsing, unknown tool handling

  ✗ Live LLM calls     — too slow, flaky, costs money → integration/eval scripts (Phase 9 evals)
  ✗ Snapshot LLM text  — non-deterministic; snapshot stable formatters instead
`);

section('ESLint + Prettier');

console.log(`
  ESLint   ≈ Roslyn analyzers + StyleCop — catches bugs and bad patterns
  Prettier ≈ dotnet format              — opinionated formatting (run on save)

  eslint.config.js  — flat config (ESLint 9+)
  .prettierrc.json  — team-wide formatting rules
  eslint-config-prettier — turn off ESLint rules that fight Prettier
`);

section('Try it');

console.log(`
  1. npm test                          — run all tests once
  2. npm run test:watch                — re-run on file save (TDD loop)
  3. Open chat-service.test.ts         — read fetch mock pattern
  4. Open load-config.test.ts          — read env + describe.each (Theory)
  5. Open format-tool-result.test.ts   — see __snapshots__/ folder after first run
  6. npm run lint                      — static analysis
  7. npm run format                    — auto-fix formatting
`);

console.log('\nKey takeaway: unit-test your AI plumbing; eval scripts (Phase 9) test model quality.\n');
