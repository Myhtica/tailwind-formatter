/**
 * src/test/suites/responsive.test.ts
 *
 * Tests for responsive Tailwind class formatting
 */

import * as assert from "assert";
import { formatAndCompare } from "../../utils/test.utils";

export function registerResponsiveSuite() {
  suite("Responsive Classes", () => {
    /* Add for new line in between suites */
    suiteTeardown(() => {
      console.log("");
    });

    test("Breakpoint ordering", async () => {
      const result = await formatAndCompare("responsive/breakpoints.tsx");
      assert.strictEqual(result.actual, result.expected);
    });

    test("Mixed responsive and static", async () => {
      const result = await formatAndCompare("responsive/mixed.tsx");
      assert.strictEqual(result.actual, result.expected);
    });
  });
}
