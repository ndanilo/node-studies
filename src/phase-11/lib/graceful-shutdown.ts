/**
 * Graceful shutdown — finish in-flight work before exit.
 *
 * C# equivalent: IHostApplicationLifetime.ApplicationStopping +
 *   stopping token passed to Kestrel / BackgroundService.
 *
 * Cloud platforms send SIGTERM before killing the container (30s typical grace period).
 */

import type { Server } from 'node:http';
import type { Logger } from 'pino';

export type ShutdownOptions = {
  server: Server;
  log: Logger;
  /** Max ms to wait for connections to drain before force exit. */
  timeoutMs?: number;
  onShutdown?: () => Promise<void> | void;
};

export function registerGracefulShutdown(options: ShutdownOptions): void {
  const { server, log, timeoutMs = 10_000, onShutdown } = options;

  let shuttingDown = false;

  async function shutdown(signal: string): Promise<void> {
    if (shuttingDown) return;
    shuttingDown = true;

    log.info({ event: 'shutdown_started', signal }, 'Graceful shutdown started');

    const forceExitTimer = setTimeout(() => {
      log.error({ event: 'shutdown_timeout' }, 'Shutdown timed out — forcing exit');
      process.exit(1);
    }, timeoutMs);
    forceExitTimer.unref();

    try {
      await onShutdown?.();
    } catch (err) {
      log.error({ err, event: 'shutdown_hook_failed' }, 'Shutdown hook failed');
    }

    server.close((err) => {
      clearTimeout(forceExitTimer);

      if (err) {
        log.error({ err, event: 'server_close_failed' }, 'Error closing HTTP server');
        process.exit(1);
      }

      log.info({ event: 'shutdown_complete' }, 'HTTP server closed — exiting cleanly');
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}
