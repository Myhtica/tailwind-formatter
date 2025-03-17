/**
 * core/formatter.core.ts
 *
 * Formatter for formatting JSX/TSX elements containing Tailwind CSS classes.
 * Processes class attributes, maintains indentation, and formats classes based on configuration.
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
  shouldUseSingleLine,
  fixClassNameIndentation,
} from "../utils/formatter.utils";

/**
 * Formats the text using the provided formatter configuration.
 *
 * @param text - Selected text to format
 * @param formatterConfig - Configuration for the formatter
 * @param isRangeFormatting - Flag indicating if the text is being formatted as a range
 * @returns Formatted text or null if formatting fails
 *
 */
export async function formatText(
  text: string,
  formatterConfig: FormatterConfig,
  isFullDocumentFormatting: boolean = true
): Promise<string | null> {
  const formattedText = await formatTailwindClasses(text, formatterConfig);
  if (!formattedText) {
    throw new Error("Failed to format Tailwind classes");
  }

  /* Skip Prettier and post-formatting if not full document formatting as Prettier does
     not have access to entire document scope and will cause multiple formatting errors */
  if (!isFullDocumentFormatting) {
    return formattedText;
  }

  const PrettierFormattedText = await formatWithPrettier(
    formattedText,
    formatterConfig.prettierConfig
  );
  if (!PrettierFormattedText) {
    throw new Error("Failed to apply prettier formatting");
  }

  /* If the text did not change, no need for post-processing */
  if (PrettierFormattedText === text) {
    return PrettierFormattedText;
  }

  /* Fix indentation in case Prettier formatting changes it */
  return fixClassNameIndentation(PrettierFormattedText, formatterConfig);
}

/**
 * Formats tailwind classes in the text.
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

  const classNameAttr = classNameNode.name.name;
  const nonClassNameAttributes = getNonClassAttributes(elementNode);
  const { openingWrapper, closingWrapper } = getJSXWrappers(
    classNameNode.value
  );
  const { baseIndent, attrIndent, classIndent } = getIndentationLevels(
    elementLine,
    formatterConfig.usesTabs,
    formatterConfig.tabSize
  );

  const rawClassContent = classGroups.join(" ");
  const useSingleLine = shouldUseSingleLine(rawClassContent, formatterConfig);

  /* Format classes based on single-line or multi-line mode */
  const formattedClasses = useSingleLine
    ? classGroups.join(" ").trim()
    : classGroups.map((group) => `${classIndent}${group}`).join("\n");

  /* Construct the formatted element string */
  let formattedElementString = elementPrefix;

  nonClassNameAttributes.forEach((attr) => {
    const attributeText = sourceText.slice(attr.start!, attr.end!);
    formattedElementString += `\n${attrIndent}${attributeText}`;
  });

  if (useSingleLine) {
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
