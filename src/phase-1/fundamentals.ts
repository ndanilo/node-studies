/**
 * Phase 1 — JavaScript fundamentals (C# lens).
 *
 * Run: npm run phase1
 * Debug: open this file → F5 → "Debug current TS file"
 */

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

// ── 1. let vs const vs var ─────────────────────────────────────────────
section('let vs const vs var');

// C#: var x = 1;  (inferred type, reassignable)
// JS: let = reassignable block scope | const = binding frozen | var = avoid (legacy)
let count = 0;
count = 1;
const max = 100;
// max = 200; // Error: cannot reassign const

const user = { name: 'Ada' };
user.name = 'Grace'; // OK — const freezes the binding, not the object's contents
console.log({ count, max, user });

// ── 2. Types ───────────────────────────────────────────────────────────
section('Types');

const n: number = 42;
const pi = 3.14; // all numbers are IEEE 754 doubles — no separate int type
const label: string = 'token';
const active: boolean = true;
const big: bigint = 42n; // rare; crypto / large IDs
const id: symbol = Symbol('id'); // rare; unique object keys

console.log({ n, pi, label, active, big: big.toString(), id: id.toString() });

// ── 3. null vs undefined ───────────────────────────────────────────────
section('null vs undefined');

// C#: only null. JS has TWO "empty" values.
let missing: string | undefined; // declared but never assigned → undefined
const empty: string | null = null; // intentional absence (like C# null)
console.log({ missing, empty, nullish: missing ?? 'default' }); // ?? like C# ??

// ── 4. == vs === ─────────────────────────────────────────────────────
section('== vs ===');

console.log(0 == false); // true  — coerces types (avoid!)
console.log(0 === false); // false — strict: same type AND value (use this)
console.log('' == false); // true  — footgun
console.log('' === false); // false

// ── 5. Truthy / falsy ────────────────────────────────────────────────
section('Truthy / falsy');

const falsyValues = [false, 0, '', null, undefined, NaN];
for (const v of falsyValues) {
  console.log(`  ${String(v).padEnd(9)} → ${Boolean(v) ? 'truthy' : 'falsy'}`);
}
// Everything else is truthy — including [], {}, and "0"

// ── 6. Objects vs Maps; arrays vs Lists ──────────────────────────────
section('Objects vs Maps; arrays');

// C# List<string> → string[]
const tags: string[] = ['ai', 'node', 'ts'];
tags.push('llm');

// C# Dictionary<string, number> → Map or plain object
const scores = new Map<string, number>([
  ['alice', 10],
  ['bob', 8],
]);
scores.set('carol', 9);

const config: Record<string, string> = { model: 'gpt-4o', region: 'us-east' };

console.log('tags:', tags);
console.log('scores.get("bob"):', scores.get('bob'));
console.log('config.model:', config.model);

// LINQ: words.Where(w => w.length > 3).Select(w => w.toUpperCase())
const longUpper = tags.filter((w) => w.length > 3).map((w) => w.toUpperCase());
console.log('filter + map:', longUpper);

// ── 7. Destructuring ─────────────────────────────────────────────────
section('Destructuring');

const point = { x: 10, y: 20 };
const { x, y } = point; // like C# (var x, y) = (point.X, point.Y) in C# 7+

const [first, ...rest] = tags; // rest = remaining items
console.log({ x, y, first, rest });

// ── 8. Spread / rest ─────────────────────────────────────────────────
section('Spread / rest');

const defaults = { logLevel: 'info', port: 3000 };
const overrides = { port: 8080 };
const merged = { ...defaults, ...overrides }; // spread objects (shallow copy)
console.log('merged config:', merged);

function sum(...nums: number[]) {
  // rest params — like C# params int[] nums
  return nums.reduce((a, b) => a + b, 0);
}
console.log('sum(1,2,3):', sum(1, 2, 3));

// ── 9. Template literals ───────────────────────────────────────────────
section('Template literals');

const model = 'gpt-4o';
const prompt = `Call model "${model}" with ${tags.length} tags`;
console.log(prompt);

// ── 10. Arrow vs regular functions (this binding) ────────────────────
section('Arrow vs regular functions');

const counter = {
  value: 0,
  // Regular function passed as callback — 'this' is lost (unlike C# instance method)
  brokenIncrement(fn: () => void) {
    const wrapped = function () {
      // this.value++; // 'this' is NOT counter
      fn();
    };
    wrapped();
  },
  // Arrow function inherits 'this' from the method scope (like C# lambda in a method)
  fixedIncrement() {
    const tick = () => {
      this.value++;
    };
    tick();
  },
};
counter.fixedIncrement();
console.log('counter after arrow:', counter.value);

// ── 11. for...of vs for...in ─────────────────────────────────────────
section('for...of vs for...in');

// for...of → values (use on arrays, strings, Maps)
for (const tag of tags) {
  console.log('  tag:', tag);
}

// for...in → keys (object properties) — rarely what you want on arrays
const obj = { a: 1, b: 2 };
for (const key in obj) {
  console.log(`  key ${key}:`, obj[key as keyof typeof obj]);
}

// ── 12. JSON.parse / JSON.stringify ──────────────────────────────────
section('JSON');

// C#: JsonSerializer.Serialize / Deserialize
const dto = { message: 'hello', count: 3 };
const json = JSON.stringify(dto);
const parsed = JSON.parse(json) as typeof dto;
console.log({ json, parsed });

console.log('\n✓ Phase 1 fundamentals complete. Next: npm run word-counter');
