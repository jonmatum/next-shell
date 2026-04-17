/**
 * String utilities. Pure functions, no dependencies.
 */

/**
 * Truncate a string to `maxLength` characters, appending `suffix` when cut.
 *
 * ```ts
 * truncate('Hello, world!', 8) // "Hello, …"
 * truncate('Hi', 8) // "Hi"
 * ```
 */
export function truncate(str: string, maxLength: number, suffix = '…'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Return `singular` when `count === 1`, otherwise `plural` (defaults to
 * `singular + 's'`).
 *
 * ```ts
 * pluralize(1, 'item') // "1 item"
 * pluralize(3, 'item') // "3 items"
 * pluralize(2, 'goose', 'geese') // "2 geese"
 * ```
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${word}`;
}

/**
 * Convert a string to Title Case.
 *
 * ```ts
 * toTitleCase('hello world') // "Hello World"
 * ```
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}

/**
 * Convert a string to kebab-case.
 *
 * ```ts
 * toKebabCase('HelloWorld') // "hello-world"
 * toKebabCase('my string') // "my-string"
 * ```
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Slugify a string for use in URLs (lowercase, hyphens, ASCII only).
 *
 * ```ts
 * slugify('Hello World!') // "hello-world"
 * ```
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');
}
