/**
 * Shared shape of every locale. German (`de/`) is the source; each other
 * locale must satisfy `Strings` exactly — a missing key or a function with a
 * different signature breaks the build (`src/test/i18n.test.ts` additionally
 * compares the key trees).
 */
import type { strings as de } from './de/strings'

export type Locale = 'de' | 'en'
export const LOCALES: readonly Locale[] = ['de', 'en']

/**
 * Literal types → their base type, so English text can differ from German.
 * Arrays keep their length (mapped tuple), so lists line up one to one.
 */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends (...args: infer A) => infer R
        ? (...args: A) => Widen<R>
        : T extends object
            ? { readonly [K in keyof T]: Widen<T[K]> }
            : T

export type Strings = Widen<typeof de>
