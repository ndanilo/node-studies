/**
 * Global process error handlers — catch what try/catch missed.
 *
 * C# equivalent: TaskScheduler.UnobservedTaskException, AppDomain.UnhandledException
 */

import type { Logger } from 'pino';

export function setupGlobalErrorHandlers(log: Logger): void {
  process.on('unhandledRejection', (reason) => {
    log.error({ err: reason }, 'Unhandled promise rejection');
  });

  process.on('uncaughtException', (err) => {
    log.fatal({ err }, 'Uncaught exception — exiting');
    process.exit(1);
  });
}
