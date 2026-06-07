import type { ITokenCounter } from './types.js';

/**
 * Phase 2 exercise — port this from C# to TypeScript.
 *
 * C# reference:
 *
 *   public interface ITokenCounter
 *   {
 *       int Count(string text);
 *   }
 *
 *   public class TokenCounter : ITokenCounter
 *   {
 *       public int Count(string text) =>
 *           text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
 *   }
 *
 * TODO 1: Export interface ITokenCounter with count(text: string): number
 * TODO 2: Export class TokenCounter implementing ITokenCounter
 * TODO 3: Split on whitespace, filter empty strings, return length
 */

export class TokenCounter implements ITokenCounter {
  count(text: string): number {
    return text.split(' ').filter(o => o.trim().length > 0).map(o => o.trim()).length;
  }
}