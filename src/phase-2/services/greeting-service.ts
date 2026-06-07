import type { IGreetingService } from './types.js';

/** C#: public class GreetingService : IGreetingService */
export class GreetingService implements IGreetingService {
  constructor(private readonly prefix = 'Hello') {}

  greet(name: string): string {
    return `${this.prefix}, ${name}!`;
  }

  static createFriendly(): GreetingService {
    return new GreetingService('Hi there');
  }
}
