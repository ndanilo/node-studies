/**
 * Phase 0 — Your first TypeScript file in Node.
 *
 * C# equivalent:
 *   Console.WriteLine("Hello from C#");
 *
 * Run: npm run hello
 */

const name = process.argv[2] ?? 'C# developer';

console.log(`Hello from Node.js, ${name}!`);
console.log(`Node version: ${process.version}`);

// Try: npm run hello -- "Your Name"
