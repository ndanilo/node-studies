/**
 * Barrel export — re-exports a module's public API from one entry point.
 * C# analogy: one namespace/folder, consumers use a single import path.
 */
export type { IGreetingService } from './types.js';
export { GreetingService } from './greeting-service.js';
export { LoggingGreetingService } from './logging-greeting-service.js';
