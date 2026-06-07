/**
 * Phase 3 exercise — fetch JSON with timeout + retry.
 *
 * Run: npm run phase3-exercise
 *
 * Uses JSONPlaceholder (no API key): https://jsonplaceholder.typicode.com
 */

import { fetchJsonWithRetry } from './lib/http-client.js';

type Post = {
  id: number;
  title: string;
  body: string;
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';

const post = await fetchJsonWithRetry<Post>(url, {
  timeoutMs: 5_000,
  retries: 3,
});

console.log('Fetched post:', { id: post.id, title: post.title, body: post.body });
