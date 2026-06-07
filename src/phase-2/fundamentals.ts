/**
 * Phase 2 — Functions, classes & modules (C# lens).
 *
 * Run: npm run phase2
 * Debug: open this file → F5 → "Debug current TS file"
 */

import {
  GreetingService,
  LoggingGreetingService,
  type IGreetingService,
} from './services/index.js';

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

// ── 1. Function declarations vs expressions ────────────────────────────
section('Function declarations vs expressions');

// Declaration — hoisted (can call before line appears, like C# local function... mostly)
function add(a: number, b: number): number {
  return a + b;
}

// Expression assigned to const — NOT hoisted
const multiply = function (a: number, b: number): number {
  return a * b;
};

// Arrow expression — concise; no own `this` (Phase 1)
const double = (n: number) => n * 2;

console.log({ sum: add(2, 3), product: multiply(2, 3), doubled: double(5) });

// ── 2. Default & optional parameters ─────────────────────────────────
section('Default & optional parameters');

// C#: void Log(string msg, string level = "info")
function log(message: string, level = 'info'): void {
  console.log(`[${level}] ${message}`);
}

// C# optional: void F(int x, string? label = null)
function labelValue(value: number, label?: string): void {
  console.log(label ? `${label}: ${value}` : value);
}

log('server started');
labelValue(42);
labelValue(42, 'port');

// ── 3. Rest parameters ───────────────────────────────────────────────
section('Rest parameters');

// C#: int Sum(params int[] nums)
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
console.log('sum(1,2,3):', sum(1, 2, 3));

// ── 4. Classes ───────────────────────────────────────────────────────
section('Classes');

class Animal {
  static kingdom = 'Animalia';

  constructor(protected readonly name: string) {}

  speak(): string {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  #breed: string; // JS private field (runtime enforced)

  constructor(name: string, breed: string) {
    super(name); // like base(name) in C#
    this.#breed = breed;
  }

  speak(): string {
    return `${this.name} (${this.#breed}) barks`;
  }
}

const dog = new Dog('Rex', 'lab');
console.log(dog.speak());
console.log('kingdom:', Dog.kingdom);

// ── 5. Prototypes (brief) ────────────────────────────────────────────
section('Prototypes');

// Classes are syntactic sugar over prototypes — the mechanism under the hood.
console.log('dog is Dog?', dog instanceof Dog);
console.log('speak on prototype?', 'speak' in Dog.prototype);

// ── 6–8. ESM modules & barrel exports ────────────────────────────────
section('ESM modules & barrel exports');

// C#: namespace + using → ESM import/export (no namespaces in modern JS)
// Files live in ./services/ — imported via barrel ./services/index.js
function runService(service: IGreetingService, name: string): string {
  return service.greet(name);
}

const basic = GreetingService.createFriendly();
const logging = new LoggingGreetingService(basic);

console.log('basic:', runService(basic, 'Ada'));
console.log('logging:', runService(logging, 'Grace'));

// No C# namespaces — use folders + modules instead:
//   services/greeting-service.ts  →  export class GreetingService
//   services/index.ts             →  re-export public API

console.log('\n✓ Phase 2 fundamentals complete. Next: npm run phase2-exercise');
