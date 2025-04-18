/**
 * utils/formatter.utils.ts
 *
 * Utilities for formatting Tailwind CSS classes.
 */

import * as t from "@babel/types";
import { FormatterConfig, ClassAttribute } from "../types";
import { logger } from "../logger";

/**
 * Gets the className node in a JSX element.
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
 * Gets class attributes from text using regular expressions.
 *
 * @param text - The text to get class attributes from
 * @returns Array of extracted class attributes
 */
export function getClassAttributes(text: string): ClassAttribute[] {
  const patterns = [
    /* Multi-line class attributes with newlines */
    /(\s*)((?:class|className)=)(["']|\{`)\n([\s\S]*?)\n(\s*)(["']|\}`)/gm,

    /* Single-line class attributes */
    /(\s*)((?:class|className)=)(["']|\{`)([^"'`}]*?)(["']|\}`)/g,
  ];

  const attributes: ClassAttribute[] = [];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const [fullMatch, indent, attrWithEquals, opening, value, closing] =
        match;
      const attrName = attrWithEquals.replace("=", "").trim();

      attributes.push({
        name: attrName,
        value: value.trim(),
        opening,
        closing,
        start: match.index,
        end: match.index + fullMatch.length,
        indentation: indent,
      });
    }
  }

  return attributes;
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
 * Formats the text using Prettier.
 * If Prettier fails, logs a warning and returns the original text.
 *
 * @param text - Text to format
 * @param prettierConfig - Prettier configuration options
 * @returns Prettier-formatted text, or original text if formatting fails
 */
export async function formatWithPrettier(
  text: string,
  prettierConfig: Record<string, any>
): Promise<string> {
  try {
    const prettier = require("prettier");

    /* Load language-specific plugins using import */
    if (prettierConfig.plugins) {
      try {
        const loadedPlugins = [];

        for (const pluginName of prettierConfig.plugins) {
          try {
            const plugin = await import(pluginName);
            loadedPlugins.push(plugin.default || plugin);
          } catch (error) {
            logger.warn(`Failed to load plugin ${pluginName}: ${error}`);
          }
        }

        if (loadedPlugins.length > 0) {
          prettierConfig.plugins = loadedPlugins;
        } else {
          delete prettierConfig.plugins;
        }
      } catch (error) {
        logger.warn(`Failed to load Prettier plugins: ${error}`);
        delete prettierConfig.plugins;
      }
    }

    const formattedText = await prettier.format(text, prettierConfig);
    if (!formattedText) {
      logger.warn(
        "Prettier returned null result. Using Tailwind-only formatting"
      );
      return text;
    }

    return formattedText;
  } catch (error) {
    logger.warn(
      `Prettier formatting failed: ${error}. Using Tailwind-only formatting`
    );
    return text;
  }
}

/**
 * Determines if Tailwind classes should be formatted on multiple lines based on configuration.
 *
 * @param classGroups - Array of class groups to format
 * @param formatterConfig - Formatter configuration
 * @returns Whether to format Tailwind Classes on multiple lines
 */
export function shouldFormatClassesMultiline(
  classGroups: string[],
  formatterConfig: FormatterConfig
): boolean {
  if (formatterConfig.multiLineClasses) {
    return true;
  }

  /* Remove existing newlines and extra spaces to get true content length */
  const classContent = classGroups.join(" ");
  const normalizedContent = classContent.replace(/[\n\s]+/g, " ").trim();

  return normalizedContent.length > formatterConfig.multiLineClassThreshold;
}

/**
 * Gets the formatted content for a group of Tailwind classes.
 * This will format the classes on multiple lines if necessary.
 *
 * @param classGroups - Array of class groups to format
 * @param classIndent - Indentation for classes
 * @param formatClassesMultiline - Whether to format on multiple lines
 * @returns Formatted Tailwind class content
 */
export function getFormattedClasses(
  classGroups: string[],
  classIndent: string,
  formatClassesMultiline: boolean
): string {
  return formatClassesMultiline
    ? classGroups.map((group) => `${classIndent}${group}`).join("\n")
    : classGroups.join(" ").trim();
}

/**
 * Gets the formatted content for non-class attributes (e.g., `key`, `ref`, etc.).
 * This will always format the attributes on multiple lines.
 *
 * @param attributeTexts - Array of attribute texts to format
 * @param attrIndent - Indentation for attributes
 * @returns Formatted non-class attribute content or empty string if no attributes
 */
export function getFormattedNonClassAttributes(
  attributeTexts: string[],
  attrIndent: string
): string {
  if (!attributeTexts.length) {
    return "";
  }

  return attributeTexts
    .map((attrText) => `\n${attrIndent}${attrText}`)
    .join("");
}

/**
 * Fixes indentation of className attributes in the text (multi-line values only).
 *
 * This is necessary because Prettier does not handle indentation of class names and
 * can cause inconsistent formatting.
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
   * (ignores single-lines). The regex captures the following groups:
   *
   * (1) leading whitespace            (2) class attribute with equals sign
   * (3) opening wrapper               (4) indent before content
   * (5) class content                 (6) indent before closing wrapper
   * (7) closing wrapper
   */
  const classNameRegex =
    /^(\s*)((?:class|className)=)((?:["']|\{`))\n(\s*)(.+?)\n(\s*)(["']|`\})/gms;
  return text.replace(
    classNameRegex,
    (
      match,
      baseIndent,
      classAttr,
      openingWrapper,
      contentIndent,
      classContent,
      wrapperIndent,
      closingWrapper
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

      return `${baseIndent}${classAttr}${openingWrapper}\n${formattedClasses}\n${baseIndent}${closingWrapper}`;
    }
  );
}
