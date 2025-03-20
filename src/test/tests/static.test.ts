/**
 * src/test/suites/static.test.ts
 *
 * Tests for static Tailwind CSS classes
 */

import * as assert from "assert";
import { formatAndCompare } from "../../utils/test.utils";

export function registerStaticSuite() {
  suite("Static Classes", () => {
    /* Add for new line in between suites */
    suiteTeardown(() => {
      console.log("");
    });

    test("Basic class formatting", async () => {
      const result = await formatAndCompare("static/basic.tsx");
      assert.strictEqual(result.actual, result.expected);
    });

    test("Self-closing tags", async () => {
      const result = await formatAndCompare("static/self-closing.tsx");
      assert.strictEqual(result.actual, result.expected);
    });

    test("Multiple class attributes", async () => {
      const result = await formatAndCompare("static/multiple-elements.tsx");
      assert.strictEqual(result.actual, result.expected);
    });

    test("Long class lists", async () => {
      const result = await formatAndCompare("static/long-classes.tsx");
      assert.strictEqual(result.actual, result.expected);
    });
  });
}
