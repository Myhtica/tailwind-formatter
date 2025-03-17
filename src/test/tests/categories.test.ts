/**
 * src/test/suites/categories.test.ts
 *
 * Tests for categories Tailwind class formatting
 */

import * as assert from "assert";
import { formatAndCompare } from "../../utils/test.utils";

export function registerCategoriesSuite() {
  suite("Class Categories", () => {
    /* Add for new line in between suites */
    suiteTeardown(() => {
      console.log("");
    });

    test("Layout classes", async () => {
      const result = await formatAndCompare("categories/layout.tsx");
      assert.strictEqual(result.actual, result.expected);
    });

    test("Typography classes", async () => {
      const result = await formatAndCompare("categories/typography.tsx");
      assert.strictEqual(result.actual, result.expected);
    });

    test("Multiple categories", async () => {
      const result = await formatAndCompare(
        "categories/multiple-categories.tsx"
      );
      assert.strictEqual(result.actual, result.expected);
    });
  });
}
