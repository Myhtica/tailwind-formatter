/**
 * core/parser.core.ts
 *
 * Parser for extracting Tailwind CSS classes from JSX/TSX code using AST analysis.
 * Handles static class names and dynamic expressions, including template literals
 * and conditional expressions.
 */

import * as t from "@babel/types";
import { ClassParseResult } from "../types";

/**
 * Parses Tailwind CSS classes from a JSX/TSX class/className attribute.
 * Separates static classes from dynamic expressions for proper formatting.
 *
 * @param classNameNode - The JSX attribute node containing class/className
 * @param sourceText - The original source text for extracting dynamic expressions
 * @param categories - The Tailwind CSS categories and prefixes
 * @param viewports - The list of viewport prefixes to check for
 * @returns ClassParseResult object containing baseClasses, viewportClasses, and dynamicExpressions
 */
export function parseTailwindClasses(
  classNameNode: t.JSXAttribute,
  sourceText: string,
  categories: Record<string, string>,
  viewports: string[]
): ClassParseResult {
  const parsedClasses: ClassParseResult = {
    baseClasses: [],
    viewportClasses: {},
    dynamicExpressions: [],
  };
  viewports.forEach((viewport) => {
    parsedClasses.viewportClasses[viewport] = [];
  });

  const classNameValue = classNameNode.value;

  if (t.isStringLiteral(classNameValue)) {
    const classNameString = classNameValue.value;
    processTailwindClasses(classNameString, parsedClasses, viewports);

    return parsedClasses;
  }

  if (t.isJSXExpressionContainer(classNameValue)) {
    const classNameExpression = classNameValue.expression;
    const expressionText = sourceText.slice(
      classNameExpression.start!,
      classNameExpression.end!
    );

    if (t.isTemplateLiteral(classNameExpression)) {
      processTemplateLiteral(
        classNameExpression,
        sourceText,
        parsedClasses,
        categories,
        viewports
      );
    } else if (
      t.isConditionalExpression(classNameExpression) ||
      t.isCallExpression(classNameExpression)
    ) {
      parsedClasses.dynamicExpressions.push(`\${${expressionText}}`);
    } else if (hasTailwindPrefix(expressionText, categories)) {
      processTailwindClasses(expressionText, parsedClasses, viewports);
    } else {
      parsedClasses.dynamicExpressions.push(`\${${expressionText}}`);
    }
  }

  return parsedClasses;
}

/**
 * Helper function to check if a class string matches a Tailwind pattern.
 * Returns true if matched, false otherwise.
 *
 * @param classString - The class string to check
 * @param categories - The Tailwind CSS categories and prefixes
 * @returns true if matched, false otherwise
 */
function hasTailwindPrefix(
  classString: string,
  categories: Record<string, string>
): boolean {
  for (const [category, prefixString] of Object.entries(categories)) {
    const prefixes = prefixString.split(" ");

    for (const prefix of prefixes) {
      if (classString.startsWith(prefix)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Helper function to process classes that follow Tailwind patterns,
 * including both static classes and those with simple interpolation.
 *
 * Separates viewport variants from base classes.
 *
 * @param classNameString - The class string to process (may contain simple ${} interpolation)
 * @param parsedClasses - The ClassParseResult object to update
 * @param viewports - The list of viewport prefixes to check for
 */
function processTailwindClasses(
  classNameString: string,
  parsedClasses: ClassParseResult,
  viewports: string[]
): void {
  /* Split by any whitespace (spaces, tabs, newlines) and remove empty entries */
  const classes = classNameString.split(/\s+/).filter(Boolean);

  classes.forEach((cls) => {
    const viewportPrefix = viewports.find((v) => cls.startsWith(`${v}:`));

    if (viewportPrefix) {
      const baseClass = cls.slice(viewportPrefix.length + 1);
      parsedClasses.viewportClasses[viewportPrefix].push(baseClass);
    } else {
      parsedClasses.baseClasses.push(cls);
    }
  });
}

/**
 * Helper function to process template literals.
 * Always preserves ${} syntax for dynamic parts and treats classes
 * with Tailwind prefixes as base classes if they contain simple interpolation.
 *
 * @param templateLiteral - The template literal node to process
 * @param sourceText - The source text for extracting dynamic expressions
 * @param parsedClasses - The ClassParseResult object to update
 * @param categories - The Tailwind CSS categories and prefixes
 * @param viewports - The list of viewport prefixes to check for
 */
function processTemplateLiteral(
  templateLiteral: t.TemplateLiteral,
  sourceText: string,
  parsedClasses: ClassParseResult,
  categories: Record<string, string>,
  viewports: string[]
): void {
  let currentClass = "";

  templateLiteral.quasis.forEach((quasi, index) => {
    const quasiText = quasi.value.raw;
    currentClass += quasiText;

    /* Check if an expression follows this quasi */
    if (index < templateLiteral.expressions.length) {
      const expression = templateLiteral.expressions[index];
      const expressionText = sourceText.slice(
        expression.start!,
        expression.end!
      );

      if (
        t.isConditionalExpression(expression) ||
        t.isCallExpression(expression)
      ) {
        parsedClasses.dynamicExpressions.push(`\${${expressionText}}`);
      } else {
        currentClass += `\${${expressionText}}`;
      }
    }

    /*
     * Handle class boundary detection:
     *  - Space indicates natural class separation
     *  - Last quasi needs processing even without space
     */
    const isLastQuasi = index === templateLiteral.quasis.length - 1;
    if (quasiText.endsWith(" ") || isLastQuasi) {
      currentClass = currentClass.trim();

      /* Check if class contains dynamic interpolation */
      if (currentClass.includes("${")) {
        const textBeforeInterpolation = currentClass.split("${")[0];

        if (hasTailwindPrefix(textBeforeInterpolation, categories)) {
          processTailwindClasses(currentClass, parsedClasses, viewports);
        } else {
          parsedClasses.dynamicExpressions.push(currentClass);
        }
      } else {
        if (currentClass) {
          processTailwindClasses(currentClass, parsedClasses, viewports);
        }
      }

      currentClass = "";
    }
  });
}
