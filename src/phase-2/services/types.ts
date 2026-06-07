/** TS interface — compile-time only (erased at runtime). Like C# interface. */
export interface IGreetingService {
  greet(name: string): string;
}

/*
 *   public interface ITokenCounter
 *   {
 *       int Count(string text);
 *   }
*/
export interface ITokenCounter 
{ 
  count(text: string): number;
}