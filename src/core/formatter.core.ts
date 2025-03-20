/**
 * core/formatter.core.ts
 *
 * Core formatting logic for the Tailwind CSS class formatter extension.
 * Handles parsing, categorizing, and formatting Tailwind CSS classes in JSX elements.
 */

import * as t from "@babel/types";
import traverse from "@babel/traverse";
import { FormatterConfig, ClassParseResult } from "../types";
import { parseAsync } from "@babel/core";
import { parseTailwindClasses } from "./parser.core";
import { categorizeClassesAndViewports } from "./categorizer.core";
import {
  getClassNameNode,
  getNonClassAttributes,
  getJSXWrappers,
  getIndentationLevels,
  formatWithPrettier,
  shouldFormatClassesMultiline,
  getFormattedNonClassAttributes,
  getFormattedClasses,
  fixClassNameIndentation,
} from "../utils/formatter.utils";

/**
 * Formats the text using the provided formatter configuration.
 *
 * @param text - Selected text to format
 * @param formatterConfig - Configuration for the formatter
 * @param isFullDocumentFormatting - Flag indicating if formatting an entire document (true) or just a range (false)
 * @returns Formatted text or null if formatting fails
 *
 */
export async function formatText(
  text: string,
  formatterConfig: FormatterConfig,
  isFullDocumentFormatting: boolean
): Promise<string | null> {
  const formattedText = await formatTailwindClasses(text, formatterConfig);
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
 * Formats Tailwind classes in the text.
 *
 * @param text - Selected text to format
 * @param formatterConfig - Configuration for the formatter
 * @returns Text with formatted Tailwind classes or null if formatting fails
 */
export async function formatTailwindClasses(
  text: string,
  formatterConfig: FormatterConfig
): Promise<string | null> {
  const modifications: Array<{
    start: number;
    end: number;
    replacement: string;
  }> = [];

  const ast = await parseAsync(text, formatterConfig.babelConfig);
  if (!ast) {
    throw new Error(
      `Failed to generate AST for JSX content (${text.length} characters)`
    );
  }

  traverse(ast, {
    JSXOpeningElement(path) {
      const elementNode = path.node;
      const classNameNode: t.JSXAttribute | undefined =
        getClassNameNode(elementNode);

      if (classNameNode) {
        const modification = formatJSXOpeningElement(
          elementNode,
          classNameNode,
          text,
          formatterConfig
        );

        if (modification) {
          modifications.push(modification);
        }
      }
    },
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
 * Formats Tailwind CSS classes within a JSX opening element.
 *
 * @param elementNode - Babel AST node for the JSX element
 * @param classNameNode - Babel AST node with the className/class attribute
 * @param sourceText - Source text for the JSX element
 * @param formatterConfig - Configuration for formatting behavior
 * @returns Modification object containing start/end positions and replacement text
 */
function formatJSXOpeningElement(
  elementNode: t.JSXOpeningElement,
  classNameNode: t.JSXAttribute,
  sourceText: string,
  formatterConfig: FormatterConfig
): { start: number; end: number; replacement: string } | null {
  const parsedClasses = parseTailwindClasses(
    classNameNode,
    sourceText,
    formatterConfig.categories,
    formatterConfig.viewports
  );

  const classGroups: string[] = formatClassGroups(
    parsedClasses,
    formatterConfig
  );

  return constructFormattedJSXElement(
    elementNode,
    classNameNode,
    classGroups,
    sourceText,
    formatterConfig
  );
}

/**
 * Formats class groups, including both static and dynamic classes.
 *
 * @param parsedClasses - Parsed classes object containing baseClasses, viewportClasses, and dynamicExpressions
 * @param formatterConfig - Formatter configuration for viewports and categories
 * @returns Array of formatted class groups
 */
function formatClassGroups(
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

/**
 * Constructs the final formatted element string for a JSX element.
 *
 * @param elementNode - Babel AST node path for the JSX element
 * @param classNameNode - Babel AST node path for the className/class attribute
 * @param classGroups - Array of formatted class groups
 * @param sourceText - Original source text
 * @param formatterConfig - Configuration for formatting behavior
 * @returns Modification object containing start/end positions and replacement text
 */
function constructFormattedJSXElement(
  elementNode: t.JSXOpeningElement,
  classNameNode: t.JSXAttribute,
  classGroups: string[],
  sourceText: string,
  formatterConfig: FormatterConfig
): { start: number; end: number; replacement: string } {
  const elementLine =
    sourceText.slice(0, elementNode.start!).split("\n").pop() || "";
  const elementPrefix = sourceText.slice(
    elementNode.start!,
    elementNode.name.end!
  );
  const elementSuffix = elementNode.selfClosing ? "/>" : ">";

  const { openingWrapper, closingWrapper } = getJSXWrappers(
    classNameNode.value
  );
  const { baseIndent, attrIndent, classIndent } = getIndentationLevels(
    elementLine,
    formatterConfig.usesTabs,
    formatterConfig.tabSize
  );

  const classNameAttr = classNameNode.name.name;
  const nonClassNameAttributes = getNonClassAttributes(elementNode);
  const attributesText = nonClassNameAttributes.map((attr) =>
    sourceText.slice(attr.start!, attr.end!).trim()
  );
  const formattedNonClassAttributes = getFormattedNonClassAttributes(
    attributesText,
    attrIndent
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

  /* Construct the formatted element string */
  let formattedElementString = elementPrefix + formattedNonClassAttributes;

  if (!formatClassesMultiline) {
    formattedElementString += `\n${attrIndent}${classNameAttr}=${openingWrapper}${formattedClasses}${closingWrapper}`;
  } else {
    formattedElementString += `\n${attrIndent}${classNameAttr}=${openingWrapper}\n`;
    formattedElementString += formattedClasses;
    formattedElementString += `\n${attrIndent}${closingWrapper}`;
  }

  formattedElementString += `\n${baseIndent}${elementSuffix}`;

  return {
    start: elementNode.start!,
    end: elementNode.end!,
    replacement: formattedElementString,
  };
}
