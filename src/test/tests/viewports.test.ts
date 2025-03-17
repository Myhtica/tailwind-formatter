/**
 * src/test/suites/viewports.test.ts
 *
 * Tests for different formatting configurations
 */

import * as vscode from "vscode";
import * as assert from "assert";
import { formatAndCompare } from "../../utils/test.utils";

export function registerViewportsSuite() {
  suite("Viewport Configuration Tests", () => {
    let originalConfig: any;

    suiteSetup(async () => {
      originalConfig = vscode.workspace.getConfiguration("tailwindFormatter");
    });

    suiteTeardown(async () => {
      await vscode.workspace
        .getConfiguration()
        .update(
          "tailwindFormatter.viewports.grouping",
          originalConfig.get("viewports.grouping"),
          vscode.ConfigurationTarget.Global
        );
      await vscode.workspace
        .getConfiguration()
        .update(
          "tailwindFormatter.viewports.breakpoints",
          originalConfig.get("viewports.breakpoints"),
          vscode.ConfigurationTarget.Global
        );
    });

    suite("Separate Viewport Grouping", () => {
      suiteSetup(async () => {
        await vscode.workspace
          .getConfiguration()
          .update(
            "tailwindFormatter.viewports.grouping",
            "separate",
            vscode.ConfigurationTarget.Global
          );
      });

      suiteTeardown(() => {
        console.log("");
      });

      test("Basic viewport classes in separate groups", async () => {
        const result = await formatAndCompare(
          "viewport-separate/separate-basic.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });

      test("Multiple viewport breakpoints in order", async () => {
        const result = await formatAndCompare(
          "viewport-separate/separate-multiple.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });

      test("Mixed base and viewport classes", async () => {
        const result = await formatAndCompare(
          "viewport-separate/separate-mixed.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });

      test("Complex viewport formatting with categories", async () => {
        const result = await formatAndCompare(
          "viewport-separate/separate-categories.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });
    });

    suite("Inline Viewport Grouping", () => {
      suiteSetup(async () => {
        await vscode.workspace
          .getConfiguration()
          .update(
            "tailwindFormatter.viewports.grouping",
            "inline",
            vscode.ConfigurationTarget.Global
          );
      });

      suiteTeardown(() => {
        console.log("");
      });

      test("Basic viewport classes inline grouped", async () => {
        const result = await formatAndCompare(
          "viewport-inline/inline-basic.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });

      test("Multiple viewport breakpoints inline", async () => {
        const result = await formatAndCompare(
          "viewport-inline/inline-multiple.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });

      test("Mixed base and viewport classes inline", async () => {
        const result = await formatAndCompare(
          "viewport-inline/inline-mixed.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });

      test("Complex viewport formatting with categories inline", async () => {
        const result = await formatAndCompare(
          "viewport-inline/inline-categories.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });
    });
  });
}
