const quotes = ['test1', 'test2'];
/**
 * Return String of the array.
 *
 * @returns String.
 * @example example
 */
export function randomQuote(): string {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
