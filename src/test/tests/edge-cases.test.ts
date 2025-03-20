/**
 * src/test/suite/edge-cases.test.ts
 *
 * Tests for edge cases and bugs in the formatter
 */

import * as assert from "assert";
import {
  formatAndCompare,
  testRangeFormatting,
  testStats,
} from "../../utils/test.utils";

export function registerEdgeCasesSuite() {
  suite("Edge Cases", () => {
    test("Single-line edge case", async () => {
      const result = await formatAndCompare("edge-cases/single-line-bug.tsx");
      assert.strictEqual(result.actual, result.expected);
    });
  });

  suite("Range Formatting Edge Cases", () => {
    test("Incomplete JSX selection returns no edits", async () => {
      const content = `<div className="p-4 m-2">
      <div className="p-2 m-1">
      </div>
    </div>`;

      /* Select everything except the final </div> */
      const edits = await testRangeFormatting(
        content,
        0,
        content.lastIndexOf("</div>")
      );

      try {
        assert.strictEqual(
          edits.length,
          0,
          "Should return no edits for incomplete JSX"
        );
        testStats.passed++;
      } catch (error) {
        testStats.failed++;
        throw error;
      }
    });

    test("Complete JSX selection returns edits", async () => {
      const content = `<div className="p-4 m-2">
      <div className="p-2 m-1">
      </div>
    </div>`;

      /* Select the entire content */
      const edits = await testRangeFormatting(content, 0, content.length);

      try {
        assert.strictEqual(
          edits.length > 0,
          true,
          "Should return edits for complete JSX"
        );
        testStats.passed++;
      } catch (error) {
        testStats.failed++;
        throw error;
      }
    });

    test("Dynamic classes have correct spacing", async () => {
      const result = await formatAndCompare("edge-cases/dynamic-bug.tsx");
      assert.strictEqual(result.actual, result.expected);
    });
  });
}
