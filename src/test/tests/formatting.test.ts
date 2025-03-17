/**
 * src/test/suites/formatting.test.ts
 *
 * Tests for different formatting configurations
 */

import * as vscode from "vscode";
import * as assert from "assert";
import { formatAndCompare } from "../../utils/test.utils";

export function registerFormattingSuite() {
  suite("Format Configuration Tests", () => {
    let originalConfig: any;

    suiteSetup(async () => {
      originalConfig = vscode.workspace.getConfiguration("tailwindFormatter");
    });

    suiteTeardown(async () => {
      await vscode.workspace
        .getConfiguration()
        .update(
          "tailwindFormatter.formatting.multiLineThreshold",
          originalConfig.get("formatting.multiLineThreshold"),
          vscode.ConfigurationTarget.Global
        );
      await vscode.workspace
        .getConfiguration()
        .update(
          "tailwindFormatter.formatting.alwaysUseSingleLine",
          originalConfig.get("formatting.alwaysUseSingleLine"),
          vscode.ConfigurationTarget.Global
        );
    });

    suite("Always Single Line Mode", () => {
      suiteSetup(async () => {
        await vscode.workspace
          .getConfiguration()
          .update(
            "tailwindFormatter.formatting.alwaysUseSingleLine",
            true,
            vscode.ConfigurationTarget.Global
          );
      });

      suiteTeardown(() => {
        console.log("");
      });

      test("Basic classes always single line", async () => {
        const result = await formatAndCompare("always-single-line/basic.tsx");
        assert.strictEqual(result.actual, result.expected);
      });

      test("Long classes forced to single line", async () => {
        const result = await formatAndCompare(
          "always-single-line/long-classes.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });

      test("Dynamic classes on single line", async () => {
        const result = await formatAndCompare("always-single-line/dynamic.tsx");
        assert.strictEqual(result.actual, result.expected);
      });

      test("Multiple elements all single line", async () => {
        const result = await formatAndCompare(
          "always-single-line/multiple.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });
    });

    suite("Multi Line Threshold", () => {
      suiteSetup(async () => {
        // Configure for multi-line threshold
        await vscode.workspace
          .getConfiguration()
          .update(
            "tailwindFormatter.formatting.alwaysUseSingleLine",
            false,
            vscode.ConfigurationTarget.Global
          );
        await vscode.workspace
          .getConfiguration()
          .update(
            "tailwindFormatter.formatting.multiLineThreshold",
            40,
            vscode.ConfigurationTarget.Global
          );
      });

      suiteTeardown(() => {
        console.log("");
      });

      test("Short classes stay single line", async () => {
        const result = await formatAndCompare("threshold/short.tsx");
        assert.strictEqual(result.actual, result.expected);
      });

      test("Classes over threshold split to multiple lines", async () => {
        const result = await formatAndCompare("threshold/long.tsx");
        assert.strictEqual(result.actual, result.expected);
      });

      test("Dynamic classes respect threshold", async () => {
        const result = await formatAndCompare("threshold/dynamic.tsx");
        assert.strictEqual(result.actual, result.expected);
      });

      test("Mixed length elements respect threshold", async () => {
        const result = await formatAndCompare("threshold/mixed.tsx");
        assert.strictEqual(result.actual, result.expected);
      });
    });
  });
}
