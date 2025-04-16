/**
 * src/test/extension.test.ts
 *
 * Main test suite for the Tailwind CSS class formatter extension. Registers all test suites.
 */

import {
  styles,
  initTestSuite,
  printSummary,
  cleanupFormattedFiles,
} from "../utils/test.utils";

import { registerStaticSuite } from "./tests/static.test";
import { registerDynamicSuite } from "./tests/dynamic.test";
import { registerResponsiveSuite } from "./tests/responsive.test";
import { registerComplexSuite } from "./tests/complex.test";
import { registerCategoriesSuite } from "./tests/categories.test";
import { registerViewportsSuite } from "./tests/viewports.test";
import { registerLineFormattingSuite } from "./tests/line-formatting.test";
import { registerEdgeCasesSuite } from "./tests/edge-cases.test";
import { registerOtherLanguagesSuite } from "./tests/other-languages.test";

suite("Tailwind Formatter Test Suite", () => {
  suiteSetup(async () => {
    await initTestSuite();
  });

  suiteTeardown(() => {
    printSummary();
  });

  setup(() => {
    console.log(`${styles.blue}\n▶ Starting new test${styles.reset}`);
  });

  teardown(() => {
    cleanupFormattedFiles();
  });

  /* Register all test suites below */
  registerStaticSuite();
  registerDynamicSuite();
  registerResponsiveSuite();
  registerComplexSuite();
  registerCategoriesSuite();
  registerViewportsSuite();
  registerLineFormattingSuite();
  registerEdgeCasesSuite();
  registerOtherLanguagesSuite();
});
