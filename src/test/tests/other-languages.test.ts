/**
 * src/test/suites/other-languages.test.ts
 *
 * Tests for other languages
 */

import * as assert from "assert";
import { formatAndCompare } from "../../utils/test.utils";

export function registerOtherLanguagesSuite() {
  suite("Other Languages", () => {
    /* Add for new line in between suites */
    suiteTeardown(() => {
      console.log("");
    });

    /* For now, tests with non JSX/TSX not working in test environment, but have had success when testing manually (may have something to do with caching) */
    test("Astro", async () => {
      const result = await formatAndCompare("other-languages/astro-test.astro");
      assert.strictEqual(result.actual, result.expected);
    });
  });
}
