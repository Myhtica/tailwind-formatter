/**
 * src/test/suites/complex.test.ts
 *
 * Tests for complex Tailwind class formatting
 */

import * as assert from "assert";
import { formatAndCompare } from "../../utils/test.utils";

export function registerComplexSuite() {
  suite("Complex Class Combinations", () => {
    /* Add for new line in between suites */
    suiteTeardown(() => {
      console.log("");
    });

    test("Mixed classes", async () => {
      const result = await formatAndCompare("complex/mixed.tsx");
      assert.strictEqual(result.actual, result.expected);
    });

    test("Conditional classes", async () => {
      const result = await formatAndCompare("complex/conditional.tsx");
      assert.strictEqual(result.actual, result.expected);
    });
  });
}
