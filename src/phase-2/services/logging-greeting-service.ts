import type { IGreetingService } from './types.js';

/** C#: decorator / wrapper implementing the same interface */
export class LoggingGreetingService implements IGreetingService {
  readonly #logPrefix = '[greet]';

  constructor(private readonly inner: IGreetingService) {}

  greet(name: string): string {
    const message = this.inner.greet(name);
    console.log(`${this.#logPrefix} ${message}`);
    return message;
  }
}
