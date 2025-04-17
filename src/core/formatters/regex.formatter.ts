/**
 * core/formatters/regex.formatter.ts
 *
 * Regex-based formatter for non-JSX/TSX languages like HTML, Vue, Svelte, etc.
 * Provides basic class formatting functionality with limited support for dynamic expressions.
 * Designed as a fallback for languages not fully supported by the Babel parser.
 */

import { FormatterConfig, ClassAttribute } from "../../types";
import { parseTailwindClassesWithRegex } from "../parser.core";
import { formatClassGroups } from "../formatter.core";
import {
  getClassAttributes,
  getIndentationLevels,
  formatWithPrettier,
  shouldFormatClassesMultiline,
  getFormattedClasses,
  fixClassNameIndentation,
} from "../../utils/formatter.utils";

/**
 * Formats Tailwind classes in text using regular expressions.
 * Used for languages that aren't fully supported by the Babel parser.
 *
 * @param text - Selected text to format
 * @param languageId - The language ID of the document
 * @param formatterConfig - Configuration for the formatter
 * @param isFullDocumentFormatting - Whether this is a full document formatting operation
 * @returns Text with formatted Tailwind classes
 */
export async function formatTextWithRegex(
  text: string,
  formatterConfig: FormatterConfig,
  isFullDocumentFormatting: boolean
): Promise<string | null> {
  const formattedText = await formatTailwindClassesWithRegex(
    text,
    formatterConfig
  );
  if (!formattedText) {
    throw new Error("Failed to format Tailwind classes");
  }

  /* Skip Prettier for partial document formatting to avoid formatting errors
     caused by Prettier not having full document context */
  if (!isFullDocumentFormatting) {
    return formattedText;
  }

  const prettierFormattedText = await formatWithPrettier(
    formattedText,
    formatterConfig.prettierConfig
  );

  /* If the text did not change, no need for post-processing */
  if (prettierFormattedText === formattedText) {
    return prettierFormattedText;
  }

  /* Post-processing in case Prettier changes the formatting */
  return fixClassNameIndentation(prettierFormattedText, formatterConfig);
}

/**
 * Formats Tailwind classes in the text using regex.
 *
 * @param text - Selected text to format
 * @param formatterConfig - Configuration for the formatter
 * @returns Text with formatted Tailwind classes or null if formatting fails
 */
export async function formatTailwindClassesWithRegex(
  text: string,
  formatterConfig: FormatterConfig
): Promise<string | null> {
  const classAttributes = getClassAttributes(text);
  if (classAttributes.length === 0) {
    return text;
  }

  const modifications = classAttributes.map((attr) => {
    return formatClassAttribute(attr, text, formatterConfig);
  });
  if (modifications.length === 0) {
    return text;
  }

  /*
   * Apply modifications in reverse order (from end to start)
   * to avoid position shifts affecting other modifications
   */
  return modifications
    .sort((a, b) => b.start - a.start)
    .reduce(
      (formatted, mod) =>
        formatted.slice(0, mod.start) +
        mod.replacement +
        formatted.slice(mod.end),
      text
    );
}

/**
 * Formats Tailwind classes within a class attribute.
 *
 * @param attr - Class attribute information
 * @param sourceText - Source text for the class attribute
 * @param formatterConfig - Configuration for formatting behavior
 * @returns Modification object containing start/end positions and replacement text
 */
function formatClassAttribute(
  attr: ClassAttribute,
  sourceText: string,
  formatterConfig: FormatterConfig
): { start: number; end: number; replacement: string } {
  const parsedClasses = parseTailwindClassesWithRegex(
    attr.value,
    sourceText,
    formatterConfig.categories,
    formatterConfig.viewports
  );

  const classGroups: string[] = formatClassGroups(
    parsedClasses,
    formatterConfig
  );

  return constructFormattedClassAttr(
    attr,
    classGroups,
    sourceText,
    formatterConfig
  );
}

/**
 * Constructs the final formatted element string for a class attribute.
 *
 * @param attr - Class attribute information
 * @param classGroups - Array of formatted class groups
 * @param sourceText - Original source text
 * @param formatterConfig - Configuration for formatting behavior
 * @returns Modification object containing start/end positions and replacement text
 */
function constructFormattedClassAttr(
  attr: ClassAttribute,
  classGroups: string[],
  sourceText: string,
  formatterConfig: FormatterConfig
): { start: number; end: number; replacement: string } {
  const elementLine =
    sourceText.substring(0, attr.start).split("\n").pop() || "";
  const { baseIndent, attrIndent, classIndent } = getIndentationLevels(
    elementLine,
    formatterConfig.usesTabs,
    formatterConfig.tabSize
  );

  const formatClassesMultiline = shouldFormatClassesMultiline(
    classGroups,
    formatterConfig
  );
  const formattedClasses = getFormattedClasses(
    classGroups,
    classIndent,
    formatClassesMultiline
  );

  /* Construct the formatted attribute string */
  let formattedAttrString = "";

  if (!formatClassesMultiline) {
    formattedAttrString += `\n${attrIndent}${attr.name}=${attr.opening}${formattedClasses}${attr.closing}`;
  } else {
    formattedAttrString += `\n${attrIndent}${attr.name}=${attr.opening}\n`;
    formattedAttrString += formattedClasses;
    formattedAttrString += `\n${attrIndent}${attr.closing}`;
  }

  formattedAttrString += `\n${baseIndent}`;

  return {
    start: attr.start,
    end: attr.end,
    replacement: formattedAttrString,
  };
}
