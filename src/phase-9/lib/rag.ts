/**
 * RAG — embed, store, retrieve (in-memory, no external vector DB).
 *
 * Pipeline: chunk docs → embed → cosine similarity → top-k chunks.
 *
 * C# equivalent: build a search index at startup, query with embeddings API.
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_EMBED_MODEL, openai } from './sdk-client.js';

export type DocumentChunk = {
  id: string;
  text: string;
  embedding: number[];
};

export type RetrievedChunk = {
  text: string;
  score: number;
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');

let index: DocumentChunk[] | null = null;

/** Split on blank lines — good enough for markdown study docs. */
export function chunkText(text: string, maxChars = 600): string[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if (current.length + para.length + 2 <= maxChars) {
      current = current ? `${current}\n\n${para}` : para;
    } else {
      if (current) chunks.push(current);
      current = para.length <= maxChars ? para : para.slice(0, maxChars);
    }
  }
  if (current) chunks.push(current);

  return chunks;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: DEFAULT_EMBED_MODEL,
    input: texts,
  });

  return response.data.map((row) => row.embedding);
}

export async function buildIndex(sourceFiles: string[]): Promise<DocumentChunk[]> {
  const chunks: DocumentChunk[] = [];

  for (const file of sourceFiles) {
    const text = await readFile(join(dataDir, file), 'utf8');
    const parts = chunkText(text);
    const embeddings = await embedTexts(parts);

    parts.forEach((part, i) => {
      chunks.push({
        id: `${file}#${i}`,
        text: part,
        embedding: embeddings[i]!,
      });
    });
  }

  index = chunks;
  return chunks;
}

export async function ensureIndex(): Promise<DocumentChunk[]> {
  if (index) return index;
  return buildIndex(['learning-plan-snippet.md']);
}

export async function searchDocuments(query: string, topK = 3): Promise<RetrievedChunk[]> {
  const docs = await ensureIndex();
  const [queryEmbedding] = await embedTexts([query]);

  return docs
    .map((doc) => ({
      text: doc.text,
      score: cosineSimilarity(queryEmbedding!, doc.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/** Reset index — for tests / re-ingest. */
export function clearIndex(): void {
  index = null;
}
