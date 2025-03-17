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
          "tailwindFormatter.lineFormatting.multiLineClasses",
          originalConfig.get("lineFormatting.multiLineClasses"),
          vscode.ConfigurationTarget.Global
        );
      await vscode.workspace
        .getConfiguration()
        .update(
          "tailwindFormatter.lineFormatting.classLineThreshold",
          originalConfig.get("lineFormatting.classLineThreshold"),
          vscode.ConfigurationTarget.Global
        );
      await vscode.workspace
        .getConfiguration()
        .update(
          "tailwindFormatter.lineFormatting.multiLineAttributes",
          originalConfig.get("lineFormatting.multiLineAttributes"),
          vscode.ConfigurationTarget.Global
        );
      await vscode.workspace
        .getConfiguration()
        .update(
          "tailwindFormatter.lineFormatting.attributeLineThreshold",
          originalConfig.get("lineFormatting.attributeLineThreshold"),
          vscode.ConfigurationTarget.Global
        );
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
        await vscode.workspace
          .getConfiguration()
          .update(
            "tailwindFormatter.lineFormatting.classLineThreshold",
            999,
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
        // Configure for potential single line classes
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
            "tailwindFormatter.lineFormatting.classLineThreshold",
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
