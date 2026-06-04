/**
 * Phase 1 exercise — Word counter.
 *
 * C# reference:
 *   var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
 *   var counts = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
 *   foreach (var w in words)
 *       counts[w] = counts.GetValueOrDefault(w) + 1;
 *
 * Run: npm run word-counter
 * Run with text: npm run word-counter -- "hello world hello"
 */

// TODO 1: Read input text from process.argv[2], or default to a sample string.
const text = process.argv[2] ?? 'hello world hello node world';

// TODO 2: Split into words (lowercase), filter empty strings.
// Hint: text.toLowerCase().split(/\s+/)
const words: string[] = [];

// TODO 3: Count occurrences — use a Map<string, number>.
// Hint: counts.set(w, (counts.get(w) ?? 0) + 1)
const counts = new Map<string, number>();

// TODO 4: Print results sorted by count (desc), then word (asc).
// Hint: [...counts.entries()].sort((a, b) => ...)
for (const [word, count] of counts) {
  console.log(`${word}: ${count}`);
}
