/**
 * utils/formatter.utils.ts
 *
 * Utilities for formatting Tailwind CSS classes in JSX/TSX.
 */

import * as vscode from "vscode";
import * as t from "@babel/types";
import { FormatterConfig } from "../types";

/**
 * Gets the className/class node in a JSX element.
 *
 * @param node - Babel AST node path for the JSX element
 * @returns The className/class node or undefined if not found
 */
export function getClassNameNode(
  node: t.JSXOpeningElement
): t.JSXAttribute | undefined {
  return node.attributes.find(
    (attr): attr is t.JSXAttribute =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name) &&
      (attr.name.name === "class" || attr.name.name === "className")
  );
}

/**
 * Gets all attributes except className/class (e.g. `key`, `ref`, etc.).
 *
 * @param node - Babel AST node path for the JSX element
 * @returns Array of non-className/class attributes
 */
export function getNonClassAttributes(
  node: t.JSXOpeningElement
): t.JSXAttribute[] {
  return node.attributes.filter((attr): attr is t.JSXAttribute => {
    if (t.isJSXAttribute(attr)) {
      return attr.name.name !== "class" && attr.name.name !== "className";
    }

    return false;
  });
}

/**
 * Gets the wrapping characters for a JSX class attribute.
 *
 * @param valueNode - The class attribute's value node
 * @returns Object containing opening and closing wrapper characters
 */
export function getJSXWrappers(valueNode: t.JSXAttribute["value"]) {
  if (t.isJSXExpressionContainer(valueNode)) {
    if (t.isTemplateLiteral(valueNode.expression)) {
      return {
        openingWrapper: "{`",
        closingWrapper: "`}",
      };
    }

    return {
      openingWrapper: "{",
      closingWrapper: "}",
    };
  }

  return {
    openingWrapper: '"', // double quotes is default in JSX
    closingWrapper: '"',
  };
}

/**
 * Gets the indentation levels for a JSX element.
 *
 * Generates three levels of indentation:
 * - baseIndent: The starting indentation level
 * - attrIndent: Indentation for attributes
 * - classIndent: Indentation for class names
 *
 * @param elementLine - The full line containing the element
 * @param usesTabs - Whether to indent with tabs instead of spaces
 * @param tabSize - Number of spaces per indentation level
 * @returns Object containing the three indentation levels
 */
export function getIndentationLevels(
  elementLine: string,
  usesTabs: boolean,
  tabSize: number
) {
  const indentUnit = usesTabs ? "\t" : " ".repeat(tabSize);
  const baseIndent = elementLine.match(/^[\t ]*/)?.[0] || indentUnit;
  const attrIndent = baseIndent + indentUnit;
  const classIndent = attrIndent + indentUnit;

  return {
    baseIndent,
    attrIndent,
    classIndent,
  };
}

/**
 * Formats the text using a Prettier configuration.
 *
 * @param text - Text to format
 * @param prettierConfig - Prettier configuration options
 * @returns Final formatted document text
 */
export async function formatWithPrettier(
  text: string,
  prettierConfig: Record<string, any>
): Promise<string | null> {
  try {
    const prettier = require("prettier");
    return await prettier.format(text, prettierConfig);
  } catch (error) {
    throw new Error(`Prettier formatting failed: ${error}`);
  }
}

/**
 * Checks if the classes should be formatted in a single line.
 *
 * @param classes - Array of classes to check
 * @param formatterConfig - Formatter configuration
 * @returns Whether to format in a single line
 */
export function shouldUseSingleLine(
  classContent: string,
  formatterConfig: FormatterConfig
): boolean {
  if (formatterConfig.alwaysUseSingleLine) {
    return true;
  }

  /* Remove existing newlines and extra spaces to get true content length */
  const normalizedContent = classContent.replace(/[\n\s]+/g, " ").trim();
  return normalizedContent.length <= formatterConfig.multiLineThreshold;
}

/**
 * Fixes indentation of className attributes in the text.
 *
 * Ensures consistent indentation structure:
 * - className=" at base indent
 * - content at base indent + 1 level using configured indentation
 * - closing wrapper at base indent
 *
 * @param text - The text to fix indentation for
 * @param formatterConfig - Formatter configuration
 * @returns Text with fixed className indentation
 */
export function fixClassNameIndentation(
  text: string,
  formatterConfig: FormatterConfig
): string {
  const indentUnit = formatterConfig.usesTabs
    ? "\t"
    : " ".repeat(formatterConfig.tabSize);

  /* Regex to match className attributes with multi-line values
   * Captures:
   * (1) leading whitespace (2) attribute name+opening quote
   * (3) indent before content (4) attribute content
   * (5) indent before closing quote (6) closing quote
   */
  const classNameRegex =
    /^(\s*)(className=["'{`])\n(\s*)(.+?)\n(\s*)(["'`}])/gms;

  return text.replace(
    classNameRegex,
    (
      match,
      baseIndent,
      classNameOpening,
      contentIndent,
      classContent,
      wrapperIndent,
      classNameClosing
    ) => {
      const formattedClasses = classContent
        .split("\n")
        .map((classLine: string) => {
          const trimmedClass = classLine.trimStart();
          if (trimmedClass) {
            return `${baseIndent}${indentUnit}${trimmedClass}`;
          }

          return "";
        })
        .join("\n");

      return `${baseIndent}${classNameOpening}\n${formattedClasses}\n${baseIndent}${classNameClosing}`;
    }
  );
}
