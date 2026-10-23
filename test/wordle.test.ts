import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { matchGuess } from '../src/wordle';

// Recitation Part 1: follow along with your TA, filling in the todos below.
// Problem set Task 1: keep adding properties until `npm run mutants:wordle`
// kills every mutant. Read the spec in src/wordle/matchGuess.ts.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The result always has exactly five colors.
// (invariant, algebraic, metamorphic, differential, or conditional)

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Step 1: a generator for five-letter uppercase words.

const wordFrom = (letters: string) =>
  fc.array(fc.constantFrom(...letters), {minLength: 5, maxLength: 5}).map(cs => cs.join(''));
const word = wordFrom(ALPHABET);

describe('matchGuess', () => {
  // Pattern: invariant. The result contains exactly five colors.
  it('returns exactly five colors', () => {
    fc.assert(
      fc.property(word, word, (secret, guess) => {
        expect(matchGuess(secret, guess)).toHaveLength(5);
      })
    );
  });
  // Pattern: invariant. Every color is G, Y, or B.
  it('only uses the colors G, Y, B', () => {
    fc.assert(
      fc.property(word, word, (secret, guess) => {
        for (const c of matchGuess(secret, guess)) expect(['G', 'Y', 'B']).toContain(c);
      }),
    );
  });
  // Pattern: conditional. Guessing the secret gives all greens.
  it('guessing the secret gives all greens', () => {
    fc.assert(
      fc.property(word, w => {
        expect(matchGuess(w, w)).toEqual(['G', 'G', 'G', 'G', 'G']);
      }),
    );
  });
  // Pattern: metamorphic. Renaming letters consistently preserves the colors.
  it('renaming letters gives the same colors', () => {
    const rename = (w: string) =>
      [...w].map(c => ALPHABET[25 - ALPHABET.indexOf(c)]).join('');

    fc.assert(
      fc.property(word, word, (secret, guess) => {
        expect(matchGuess(rename(secret), rename(guess)))
          .toEqual(matchGuess(secret, guess));
      }),
    );
  });
  // Pattern: invariant. A letter is never credited more often than it occurs in the secret.
  it('never credits a letter more times than the secret contains it', () => {
    fc.assert(
      fc.property(word, word, (secret, guess) => {
        const result = matchGuess(secret, guess);
        for (const letter of new Set(guess)) {
          const credited = [...guess].filter((c, i) => c === letter && result[i] !== 'B').length;
          const inSecret = [...secret].filter(c => c === letter).length;
          expect(credited).toBeLessThanOrEqual(inSecret);
        }
      }), 
    );
  });

  // Pattern: conditional. Greens reserve their occurrences before remaining letters receive yellows.
  it('reserves greens before assigning yellows', () => {
    const cases = fc.shuffledSubarray([...ALPHABET], { minLength: 3, maxLength: 3 })
      .map(([a, b, c]) => ({
        secret: b + b + b + c + a,
        guess: a + b + b + b + a,
      }));

    fc.assert(
      fc.property(cases, ({ secret, guess }) => {
        expect(matchGuess(secret, guess))
          .toEqual(['B', 'G', 'G', 'Y', 'G']);
      }),
    );
  });

});
