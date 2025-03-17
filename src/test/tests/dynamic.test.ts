/**
 * src/test/suites/dynamic.test.ts
 *
 * Tests for dynamic Tailwind class formatting
 */

import * as assert from "assert";
import { formatAndCompare } from "../../utils/test.utils";

export function registerDynamicSuite() {
  suite("Dynamic Classes", () => {
    /* Add for new line in between suites */

    suiteTeardown(() => {
      console.log("");
    });

    test("Template literals", async () => {
      const result = await formatAndCompare("dynamic/template-literal.tsx");
      assert.strictEqual(result.actual, result.expected);
    });

    test("Conditional classes", async () => {
      const result = await formatAndCompare("dynamic/conditional.tsx");
      assert.strictEqual(result.actual, result.expected);
    });
  });
}
