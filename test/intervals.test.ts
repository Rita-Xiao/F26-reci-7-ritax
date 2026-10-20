import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { mergeIntervals, type Interval } from '../src/intervals';

// Recitation Part 2 (groups) and problem set Task 2.
// Read the spec in src/intervals/mergeIntervals.ts, then check your progress
// with `npm run mutants:intervals`.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The output is sorted.
// (invariant, algebraic, metamorphic, differential, or conditional)

// A first attempt at a generator. It has a problem: run the tests and read
// the counterexample.
// Fix these two lines
const interval: fc.Arbitrary<Interval> = fc.tuple(fc.integer(), fc.integer()).map(([a, b]) => (a <= b ? [a, b] : [b, a]));
const intervalList = fc.array(interval);


describe('mergeIntervals', () => {
  // Pattern: invariant. Every input interval lies inside some output interval.
  it('every input interval lies inside some output interval', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);
        const uncovered = xs.filter(([s, e]) => !out.some(([a, b]) => a <= s && e <= b));
        expect(uncovered).toEqual([]);
      }),
    );
  });

  // Add your properties here. Aim for at least one of each pattern:
  // invariant, algebraic, metamorphic, differential, conditional.

  // Pattern: invariant. Merging does not modify the input intervals.
  it('does not modify its input', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -20, max: 20 }),
        fc.integer({ min: 1, max: 10 }),
        (start, width) => {
          const xs: Interval[] = [
            [start, start + width],
            [start + width, start + width + 1],
          ];
          const before = xs.map(([s, e]): Interval => [s, e]);

          mergeIntervals(xs);

          expect(xs).toEqual(before);
        },
      ),
    );
  });

  // Pattern: conditional. Touching intervals merge into one interval.
  it('merges touching intervals', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -20, max: 20 }),
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 1, max: 10 }),
        (start, a, b) => {
          expect(mergeIntervals([
            [start, start + a],
            [start + a, start + a + b],
          ])).toEqual([[start, start + a + b]]);
        },
      ),
    );
  });
  
  // Pattern: algebraic. Merging twice gives the same result as merging once.
  it('is idempotent, where when we merge twice, we get the same result as merging once', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const once = mergeIntervals(xs);
        expect(mergeIntervals(once)).toEqual(once);
      }),
    );
  });

  // Pattern: metamorphic. Reversing input does not change output.
  it('reversing input gives the same result', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);
        expect(mergeIntervals([...xs].reverse())).toEqual(out);
      }),
    );
  });

  // Pattern: differential. The output is the same as a reference implementation.
  it('preserves point coverage', () => {
    fc.assert(
      fc.property(
        intervalList,
        fc.integer({ min: -40, max: 40 }),
        (xs, n) => {
          const p = n / 2;
          const out = mergeIntervals(xs);
          const before = xs.some(([s, e]) => s <= p && p <= e);
          const after = out.some(([s, e]) => s <= p && p <= e);
          expect(after).toBe(before);
        },
      ),
    );
  });

  // Pattern: conditional. If the input is already sorted and disjoint, it remains unchanged.
  it('preserves already sorted and disjoint input', () => {
    const disjointList = fc.array(
      fc.tuple(
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 0, max: 10 }),
      ),
    ).map(steps => {
      let end = 0;
      return steps.map(([gap, width]): Interval => {
        const start = end + gap;
        end = start + width;
        return [start, end];
      });
    });

    fc.assert(
      fc.property(disjointList, xs => {
        expect(mergeIntervals(xs)).toEqual(xs);
      }),
    );
  });
});
