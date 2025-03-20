/**
 * src/test/suites/line-formatting.test.ts
 *
 * Tests for different line formatting configurations
 */

import * as vscode from "vscode";
import * as assert from "assert";
import { formatAndCompare } from "../../utils/test.utils";

export function registerLineFormattingSuite() {
  suite("Format Configuration Tests", () => {
    let originalConfig: any;

    suiteSetup(async () => {
      originalConfig = vscode.workspace.getConfiguration("tailwindFormatter");
    });

    suiteTeardown(async () => {
      await vscode.workspace
        .getConfiguration()
        .update(
          "tailwindFormatter.lineFormatting.multiLineClasses",
          originalConfig.get("lineFormatting.multiLineClasses"),
          vscode.ConfigurationTarget.Global
        );
      await vscode.workspace
        .getConfiguration()
        .update(
          "tailwindFormatter.lineFormatting.multiLineClassThreshold",
          originalConfig.get("lineFormatting.multiLineClassThreshold"),
          vscode.ConfigurationTarget.Global
        );
    });

    suite("Always Multi Line Classes", () => {
      suiteSetup(async () => {
        await vscode.workspace
          .getConfiguration()
          .update(
            "tailwindFormatter.lineFormatting.multiLineClasses",
            true,
            vscode.ConfigurationTarget.Global
          );
      });

      suiteTeardown(() => {
        console.log("");
      });

      test("Simple classes forced to multi-line", async () => {
        const result = await formatAndCompare("always-multi-line/simple.tsx");
        assert.strictEqual(result.actual, result.expected);
      });

      test("Long classes on multi-line", async () => {
        const result = await formatAndCompare(
          "always-multi-line/long-classes.tsx"
        );
        assert.strictEqual(result.actual, result.expected);
      });

      test("Dynamic classes on multi-line", async () => {
        const result = await formatAndCompare("always-multi-line/dynamic.tsx");
        assert.strictEqual(result.actual, result.expected);
      });

      test("Multiple elements all multi-line", async () => {
        const result = await formatAndCompare("always-multi-line/multiple.tsx");
        assert.strictEqual(result.actual, result.expected);
      });
    });

    suite("Always Single Line", () => {
      suiteSetup(async () => {
        await vscode.workspace
          .getConfiguration()
          .update(
            "tailwindFormatter.lineFormatting.multiLineClasses",
            false,
            vscode.ConfigurationTarget.Global
          );
        await vscode.workspace.getConfiguration().update(
          "tailwindFormatter.lineFormatting.multiLineClassThreshold",
          999, // Configure for always single-line classes (high threshold)
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

    suite("Threshold-Based Line Formatting", () => {
      suiteSetup(async () => {
        // Configure for potential single line classes (turn off multi-line)
        await vscode.workspace
          .getConfiguration()
          .update(
            "tailwindFormatter.lineFormatting.multiLineClasses",
            false,
            vscode.ConfigurationTarget.Global
          );
        await vscode.workspace
          .getConfiguration()
          .update(
            "tailwindFormatter.lineFormatting.multiLineClassThreshold",
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
