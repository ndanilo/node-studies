/**
 * Phase 4 exercise — analyze a text file and write a summary report.
 *
 * C# reference:
 *   var text = await File.ReadAllTextAsync(path);
 *   var lines = text.Split('\n').Length;
 */

import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

export type FileStats = {
  lines: number;
  words: number;
  chars: number;
};

function countWords(line: string): number {
  if (line.trim().length === 0) return 0;
  return line.trim().split(/\s+/).length;
}

function splitLines(text: string): string[] {
  const lines = text.split(/\r?\n/);
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

export async function analyzeFileSync(filePath: string): Promise<FileStats> {
  const text = await readFile(filePath, 'utf8');
  const lines = splitLines(text);

  let words = 0;
  for (const line of lines) {
    words += countWords(line);
  }

  return { lines: lines.length, words, chars: text.length };
}

export async function analyzeFileStream(filePath: string): Promise<FileStats> {
  let lines = 0;
  let words = 0;

  const rl = createInterface({
    input: createReadStream(filePath, 'utf8'),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    lines++;
    words += countWords(line);
  }

  let chars = 0;
  for await (const chunk of createReadStream(filePath)) {
    chars += chunk.length;
  }

  return { lines, words, chars };
}

export async function writeReport(
  reportPath: string,
  sourcePath: string,
  stats: FileStats,
  method: 'sync' | 'stream',
): Promise<void> {
  const report = [
    'File Analysis Report',
    '====================',
    `Method: ${method}`,
    `Source: ${sourcePath}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    `Lines:  ${stats.lines}`,
    `Words:  ${stats.words}`,
    `Chars:  ${stats.chars}`,
    '',
  ].join('\n');

  await writeFile(reportPath, report, 'utf8');
}
