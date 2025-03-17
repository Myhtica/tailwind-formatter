/**
 * src/test/extension.test.ts
 *
 * This file contains the test suite for the Tailwind Formatter extension.
 * It uses the Mocha testing framework to run the tests and the VSCode API
 * to interact with the extension.
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
import { registerFormattingSuite } from "./tests/formatting.test";
import { registerViewportsSuite } from "./tests/viewports.test";
import { registerEdgeCasesSuite } from "./tests/edge-cases.test";

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

  registerStaticSuite();
  registerDynamicSuite();
  registerResponsiveSuite();
  registerComplexSuite();
  registerCategoriesSuite();
  registerFormattingSuite();
  registerViewportsSuite();
  registerEdgeCasesSuite();
});
