/**
 * src/test/test.utils.ts
 *
 * Shared utilities for all test files
 */

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { TailwindFormattingProvider } from "../providers/formatting.provider";

export const styles = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

const BANNER = `
╔════════════════════════════════════════╗
║     Tailwind Formatter Test Suite      ║
╚════════════════════════════════════════╝`;

/* Set to true to delete formatted files after running tests */
const CLEAN_UP_FORMATTED_FILES = false;

export const testsFileDir = path.join(__dirname, "../../src/test/test-files");

export interface TestStats {
  passed: number;
  failed: number;
  startTime: number;
}

export const testStats: TestStats = {
  passed: 0,
  failed: 0,
  startTime: 0,
};

/**
 * Initialize the main test suite
 */
export async function initTestSuite() {
  console.log(`${styles.blue}${BANNER}${styles.reset}\n`);
  testStats.startTime = Date.now();

  console.log(`${styles.bright}🔧 Test Environment Setup${styles.reset}`);
  console.log(`${styles.yellow}├── Loading extension${styles.reset}`);

  await vscode.extensions
    .getExtension("Myhtica.tailwind-formatter")
    ?.activate();

  console.log(
    `${styles.yellow}├── Verifying test files directory${styles.reset}`
  );

  if (!fs.existsSync(testsFileDir)) {
    throw new Error(`Tests directory not found: ${testsFileDir}`);
  }

  console.log(`${styles.green}└── Setup complete ✓${styles.reset}\n`);
}

/**
 * Prints test suite summary.
 */
export function printSummary() {
  const duration = ((Date.now() - testStats.startTime) / 1000).toFixed(2);
  const totalTests = testStats.passed + testStats.failed;
  const passPercentage = ((testStats.passed / totalTests) * 100).toFixed(2);

  console.log(`\n${styles.bright}📊 Test Suite Summary${styles.reset}`);
  console.log(`${styles.yellow}├── Duration: ${duration}s${styles.reset}`);
  console.log(
    `${styles.green}├── Passed: ${testStats.passed} tests ✓${styles.reset}`
  );
  console.log(
    `${styles.red}├── Failed: ${testStats.failed} tests ✗${styles.reset}`
  );
  console.log(
    `${styles.blue}├── Pass Percentage: ${passPercentage}%${styles.reset}`
  );
  console.log(`${styles.yellow}└── Completed all test suites${styles.reset}\n`);
}

/**
 * Normalizes text for comparison by removing comments and normalizing line endings.
 *
 * @param text - Text to normalize
 * @returns Normalized text
 */
export function normalizeText(text: string): string {
  // Remove single-line comments
  text = text.replace(/\/\/.*$/gm, "");
  // Remove multi-line comments
  text = text.replace(/\/\*[\s\S]*?\*\//g, "");
  // Normalize line endings
  return text.replace(/\r\n/g, "\n").trim();
}

/**
 * Formats and compares a test file with its expected result.
 *
 * @param testFile - Test file to format and compare
 * @returns Object containing actual and expected formatted text
 * @throws Error if an error occurs during processing
 * @returns Object containing actual and expected formatted text
 */
export async function formatAndCompare(testFile: string) {
  console.log(`${styles.yellow}  ├── Processing: ${testFile}${styles.reset}`);

  try {
    const inputPath = path.join(testsFileDir, testFile);
    const fileExtension = path.extname(inputPath);
    const baseName = path.basename(inputPath, fileExtension);
    const dir = path.dirname(inputPath);

    const expectedPath = path.join(dir, `${baseName}.expected${fileExtension}`);
    const formattedPath = path.join(
      dir,
      `${baseName}.formatted${fileExtension}`
    );

    const document = await vscode.workspace.openTextDocument(inputPath);

    await vscode.window.showTextDocument(document);
    await vscode.commands.executeCommand(
      "tailwind-formatter.formatTailwindClasses"
    );

    const actualText = normalizeText(document.getText());
    fs.writeFileSync(formattedPath, actualText, "utf8");

    const expected = normalizeText(fs.readFileSync(expectedPath, "utf8"));
    const passed = actualText === expected;

    if (passed) {
      testStats.passed++;
      console.log(
        `${styles.green}  └── Test passed: ${testFile} ✓${styles.reset}\n`
      );
    } else {
      testStats.failed++;
      console.log(
        `${styles.red}  └── Test failed: ${testFile} ✗${styles.reset}\n`
      );
    }

    return {
      actual: actualText,
      expected,
    };
  } catch (error) {
    testStats.failed++;
    console.log(
      `${styles.red}  └── Test error: ${testFile} ✗${styles.reset}\n`
    );
    console.log(`${styles.red}      ${error}${styles.reset}`);
    throw error;
  }
}

/**
 * Simulates range formatting in a document.
 *
 * @param content - Content to format
 * @param rangeStart - Start of the range to format
 * @param rangeEnd - End of the range to format
 * @returns Formatted text edits
 */
export async function testRangeFormatting(
  content: string,
  rangeStart: number,
  rangeEnd: number
): Promise<vscode.TextEdit[]> {
  const uri = vscode.Uri.parse("untitled:test.tsx");
  const document = await vscode.workspace.openTextDocument(uri);
  const edit = new vscode.WorkspaceEdit();
  edit.insert(uri, new vscode.Position(0, 0), content);
  await vscode.workspace.applyEdit(edit);

  const formattingProvider = new TailwindFormattingProvider();
  const range = new vscode.Range(
    document.positionAt(rangeStart),
    document.positionAt(rangeEnd)
  );

  return formattingProvider.provideDocumentRangeFormattingEdits(
    document,
    range,
    {} as vscode.FormattingOptions,
    {} as vscode.CancellationToken
  );
}

/**
 * Cleans up formatted files in the test-files directory.
 *
 */
export function cleanupFormattedFiles() {
  if (CLEAN_UP_FORMATTED_FILES) {
    const formattedFiles = fs.readdirSync(testsFileDir, {
      recursive: true,
    }) as string[];
    formattedFiles
      .filter((file) => file.includes(".formatted."))
      .forEach((file) => {
        const filePath = path.join(testsFileDir, file);
        fs.unlinkSync(filePath);
      });
  }
}
