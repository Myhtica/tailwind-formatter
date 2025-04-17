/**
 * core/formatter.core.ts
 *
 * Core formatting logic for the Tailwind CSS class formatter extension.
 * Handles parsing, categorizing, and formatting Tailwind CSS classes in JSX elements.
 */

import { BABEL_SUPPORTED_LANGUAGES } from "../config/constants.config";
import { FormatterConfig, ClassParseResult } from "../types";
import { categorizeClassesAndViewports } from "./categorizer.core";
import { formatTextWithBabel } from "./formatters/babel.formatter";
import { formatTextWithRegex } from "./formatters/regex.formatter";

/**
 * Formats the text using the provided formatter configuration and language ID.
 *
 * @param text - Selected text to format
 * @param languageId - Language ID of the document
 * @param formatterConfig - Configuration for the formatter
 * @param isFullDocumentFormatting - Flag indicating if formatting an entire document (true) or just a range (false)
 * @returns Formatted text or null if formatting fails
 *
 */
export async function formatText(
  text: string,
  languageId: string,
  formatterConfig: FormatterConfig,
  isFullDocumentFormatting: boolean
): Promise<string | null> {
  if (BABEL_SUPPORTED_LANGUAGES.has(languageId)) {
    return formatTextWithBabel(text, formatterConfig, isFullDocumentFormatting);
  } else {
    return formatTextWithRegex(text, formatterConfig, isFullDocumentFormatting);
  }
}

/**
 * Formats class groups, including both static and dynamic classes.
 *
 * @param parsedClasses - Parsed classes object containing baseClasses, viewportClasses, and dynamicExpressions
 * @param formatterConfig - Formatter configuration for viewports and categories
 * @returns Array of formatted class groups
 */
export function formatClassGroups(
  parsedClasses: ClassParseResult,
  formatterConfig: FormatterConfig
): string[] {
  const classGroups: string[] = [];

  if (
    parsedClasses.baseClasses.length > 0 ||
    Object.keys(parsedClasses.viewportClasses).length > 0
  ) {
    classGroups.push(
      ...categorizeClassesAndViewports(parsedClasses, formatterConfig)
    );
  }

  if (parsedClasses.dynamicExpressions.length > 0) {
    classGroups.push(...parsedClasses.dynamicExpressions);
  }

  return classGroups;
}
