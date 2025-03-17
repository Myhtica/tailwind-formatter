/**
 * core/categorizer.core.ts
 *
 * Categorizer for organizing Tailwind CSS classes into categories. Handles separate,
 * separate-categorized, and inline viewport grouping modes.
 */

import { PrefixInfo, ClassParseResult, FormatterConfig } from "../types";

/**
 * Categorizes classes and viewports according to viewport grouping configuration.
 * Handles both separate and inline viewport grouping modes.
 *
 * @param parsedClasses - ClassParseResult Object containing baseClasses and viewportClasses
 * @param formatterConfig - Formatter configuration with viewport grouping and categories
 * @returns An array of categorized classes and viewports
 */
export function categorizeClassesAndViewports(
  parsedClasses: ClassParseResult,
  formatterConfig: FormatterConfig
): string[] {
  switch (formatterConfig.viewportGrouping) {
    case "separate":
      return categorizeSeparateMode(parsedClasses, formatterConfig);
    case "separate-categorized":
      return categorizeSeparateCategorizedMode(parsedClasses, formatterConfig);
    case "inline":
      return categorizeInlineMode(parsedClasses, formatterConfig);
    default:
      return [];
  }
}

/**
 * Categorize in "separate" mode - viewports are separated into single groups from base classes
 *
 * @param parsedClasses - ClassParseResult Object containing baseClasses and viewportClasses
 * @param formatterConfig - Formatter configuration with viewport grouping and categories
 * @param categorized - Whether to categorize viewports separately
 * @returns An array of categorized classes and viewports in "separate" mode
 */
function categorizeSeparateMode(
  parsedClasses: ClassParseResult,
  formatterConfig: FormatterConfig,
  categorized: boolean = false
): string[] {
  const categorizedResult: string[] = [];

  const baseClassCategories = categorizeTailwindClasses(
    parsedClasses.baseClasses,
    formatterConfig
  );

  if (baseClassCategories) {
    categorizedResult.push(...baseClassCategories);
  }

  formatterConfig.viewports.forEach((viewport) => {
    if (parsedClasses.viewportClasses[viewport]?.length > 0) {
      const prefixedClasses = parsedClasses.viewportClasses[viewport].map(
        (cls) => `${viewport}:${cls}`
      );

      const viewportCategories = categorizeTailwindClasses(
        prefixedClasses,
        formatterConfig
      );

      if (viewportCategories.length > 0) {
        if (categorized) {
          categorizedResult.push(...viewportCategories);
        } else {
          /* Combine same viewport classes into a single line */
          categorizedResult.push(viewportCategories.join(" "));
        }
      }
    }
  });

  return categorizedResult;
}

/**
 * Categorize in "separate-categorized" mode - viewports are separated from base
 * classes and categorized into multiple groups
 *
 * @param parsedClasses - ClassParseResult Object containing baseClasses and viewportClasses
 * @param formatterConfig - Formatter configuration with viewport grouping and categories
 * @returns An array of categorized classes and viewports in "separate-categorized" mode
 */
function categorizeSeparateCategorizedMode(
  parsedClasses: ClassParseResult,
  formatterConfig: FormatterConfig
): string[] {
  return categorizeSeparateMode(parsedClasses, formatterConfig, true);
}

/**
 * Categorize in "inline" mode - all classes are grouped together by category
 *
 * @param parsedClasses - ClassParseResult Object containing baseClasses and viewportClasses
 * @param formatterConfig - Formatter configuration with viewport grouping and categories
 * @returns An array of categorized classes and viewports in "inline" mode
 */
function categorizeInlineMode(
  parsedClasses: ClassParseResult,
  formatterConfig: FormatterConfig
): string[] {
  const allClasses: string[] = [...parsedClasses.baseClasses];

  /* Combine all classes with their respective viewport prefixes */
  formatterConfig.viewports.forEach((viewport) => {
    if (parsedClasses.viewportClasses[viewport]?.length > 0) {
      allClasses.push(
        ...parsedClasses.viewportClasses[viewport].map(
          (cls) => `${viewport}:${cls}`
        )
      );
    }
  });

  return categorizeTailwindClasses(allClasses, formatterConfig);
}

/**
 * Categorizes Tailwind CSS classes into groups based on their prefixes.
 *
 * @param classes - Array of classes to categorize
 * @param formatterConfig - Formatter configuration with categories
 * @returns An array of strings, each representing a category line
 */
export function categorizeTailwindClasses(
  classes: string[],
  formatterConfig: FormatterConfig
): string[] {
  const { categories, viewports, uncategorizedPosition } = formatterConfig;
  const categorized: Record<string, string[]> = {};
  const uncategorized: string[] = [];

  if (classes.length === 0 || Object.keys(categories).length === 0) {
    return [];
  }

  /* Map for categorized classes */
  Object.keys(categories).forEach((category) => {
    categorized[category] = [];
  });

  /* Map for all prefixes with their categories and lengths to
    find the most specific matching prefix for each class */
  const allPrefixes: PrefixInfo[] = [];

  Object.entries(categories).forEach(([category, prefixesString]) => {
    const prefixes = prefixesString.split(" ");
    prefixes.forEach((prefix) => {
      allPrefixes.push({
        category,
        prefix,
        length: prefix.length,
      });
    });
  });

  /* Sort prefixes by length in descending order (most specific first) */
  allPrefixes.sort((a, b) => b.length - a.length);

  classes.forEach((cls) => {
    let matched = false;
    let classToCheck = cls;

    /* Handle any viewport prefixes */
    const viewportPrefix = viewports.find((vp) => cls.startsWith(`${vp}:`));
    if (viewportPrefix) {
      classToCheck = cls.substring(viewportPrefix.length + 1);
    }

    /* Check before any ${ in case a var inside the ${} starts wth a prefix, 
       but is not necessarily the actual class prefix, e.g. hsv-${bg-template} */
    const classBeforeInterpolation = classToCheck.split("${")[0];

    /* Find the most specific (longest) matching prefix */
    for (const { category, prefix } of allPrefixes) {
      if (classBeforeInterpolation.startsWith(prefix)) {
        categorized[category].push(cls);
        matched = true;
        break;
      }
    }

    if (!matched) {
      uncategorized.push(cls);
    }
  });

  const categorizedClasses = Object.entries(categorized)
    .filter(([_, classes]) => classes.length > 0)
    .map(([_, classes]) => classes.join(" "));

  const uncategorizedClasses =
    uncategorized.length > 0 ? [uncategorized.join(" ")] : [];

  return uncategorizedPosition === "beforeCategorized"
    ? [...uncategorizedClasses, ...categorizedClasses]
    : [...categorizedClasses, ...uncategorizedClasses];
}
