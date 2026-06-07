import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** ESM equivalent of C# Assembly location / __dirname in CommonJS */
export function moduleDir(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}

export const phase4Dir = fileURLToPath(new URL('..', import.meta.url));

export function dataPath(...segments: string[]): string {
  return join(phase4Dir, 'data', ...segments);
}

export function outputPath(...segments: string[]): string {
  return join(phase4Dir, 'output', ...segments);
}
