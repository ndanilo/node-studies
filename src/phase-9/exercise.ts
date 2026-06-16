/**
 * Phase 9 exercise — CLI agent with tools and streaming output.
 *
 * Run:
 *   npm run phase9-agent -- "What is 144 / 12? Use the calculator."
 *   npm run phase9-agent -- "What does Phase 9 cover in this repo?"
 *   npm run phase9-agent          (interactive prompt)
 *
 * Requires OPENAI_API_KEY in .env
 */

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { getSafeConfigSummary } from '../config/index.js';
import { classifyLlmFailure } from '../phase-7/lib/llm-errors.js';
import { logger } from '../phase-7/lib/logger.js';
import { runAgent } from './lib/agent.js';

async function readQuestionFromArgs(): Promise<string | null> {
  const args = process.argv.slice(2);
  if (args.length === 0) return null;
  return args.join(' ').trim() || null;
}

async function readQuestionInteractive(): Promise<string> {
  const rl = createInterface({ input, output });
  const answer = await rl.question('\nAsk the agent (or press Enter for demo): ');
  rl.close();
  const trimmed = answer.trim();
  return trimmed || 'What topics are covered in Phase 9 of this learning plan?';
}

async function main(): Promise<void> {
  const question = (await readQuestionFromArgs()) ?? (await readQuestionInteractive());

  console.log('\nPhase 9 CLI Agent');
  console.log('Config:', getSafeConfigSummary());
  console.log('Question:', question);
  console.log('\nAssistant: ');

  let streamed = '';

  try {
    const result = await runAgent({
      userMessage: question,
      streamFinal: true,
      onToken: (token) => {
        streamed += token;
        process.stdout.write(token);
      },
    });

    if (!streamed && result.answer) {
      process.stdout.write(result.answer);
    }

    console.log('\n');
    console.log('── metadata ──');
    console.log('  traceId  :', result.traceId);
    console.log('  steps    :', result.steps);
    console.log('  tools    :', result.toolsUsed.length ? result.toolsUsed.join(', ') : '(none)');
    console.log('  tokens   :', result.usage.totalTokens, `(prompt ${result.usage.promptTokens}, completion ${result.usage.completionTokens})`);

    logger.info(
      {
        event: 'cli_agent_done',
        traceId: result.traceId,
        steps: result.steps,
        toolsUsed: result.toolsUsed,
        usage: result.usage,
      },
      'CLI agent finished',
    );
  } catch (err) {
    const classified = classifyLlmFailure(err);
    console.error('\nAgent failed:', classified.message);
    logger.error({ err: classified, event: 'cli_agent_error' }, 'CLI agent failed');
    process.exitCode = 1;
  }
}

await main();
