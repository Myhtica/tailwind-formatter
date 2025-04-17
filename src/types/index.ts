/**
 * types/index.ts
 *
 * Type definitions for the Tailwind Formatter extension.
 * Defines interfaces for configuration, parsing results, and formatting options.
 */
import { TransformOptions } from "@babel/core";

/**
 * Type for operations that return a value or error.
 */
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Type for validation operations that only need success/failure.
 */
export type ValidationResult = { ok: true } | { ok: false; error: string };

/**
 * Prefix information for a Tailwind CSS class.
 */
export type PrefixInfo = { category: string; prefix: string; length: number };

/**
 * Result from parsing Tailwind classes in JSX/TSX code.
 * Separates base classes, dynamic expressions, and viewport variants.
 */
export interface ClassParseResult {
  /** Static classes or simple expressions with tailwind prefixes */
  baseClasses: string[];

  /** Static classes organized by viewport */
  viewportClasses: Record<string, string[]>;

  /** Dynamic expressions that need to be preserved */
  dynamicExpressions: string[];
}

/**
 * Interface for holding class attribute information extracted via regex
 */
export interface ClassAttribute {
  /* "class" or "className" or language-specific variant */
  name: string;

  /* The contents of the class attribute (without quotes) */
  value: string;

  /* The opening wrapper used (", ', or `) */
  opening: string;

  /* The closing wrapper used */
  closing: string;

  /* Start position of the attribute in the text */
  start: number;

  /* End position of the attribute in the text */
  end: number;

  /* The indentation of the attribute */
  indentation: string;
}

/**
 * Main configuration interface for the formatter.
 * Defines all configurable aspects of the formatting behavior.
 */
export interface FormatterConfig {
  /** Babel configuration options */
  babelConfig: TransformOptions;

  /** Prettier configuration options */
  prettierConfig: Record<string, any>;

  /** Mapping of category names to their class prefixes */
  categories: Record<string, string>;

  /** Where to place uncategorized classes */
  uncategorizedPosition: "beforeCategorized" | "afterCategorized";

  /** Available viewport breakpoints in order (e.g., ['sm', 'md', 'lg']) */
  viewports: string[];

  /** How to group viewport-specific classes */
  viewportGrouping: "separate" | "separate-categorized" | "inline";

  /** When true, always format Tailwind classes on multiple lines */
  multiLineClasses: boolean;

  /** Format classes on multiple lines when width exceeds this number */
  multiLineClassThreshold: number;

  /** Whether to use tabs instead of spaces */
  usesTabs: boolean;

  /** Number of spaces for each indentation level */
  tabSize: number;
}

/**
 * Configuration mapping for Prettier integration.
 * Defines how to handle different languages and their specific settings.
 */
export interface PrettierLanguageConfig {
  /* Parser to use (if different from language name) */
  parser?: string;

  /* Plugin packages to require */
  plugins?: string[];

  /* Whether this require file-specific override */
  requiresOverride?: boolean;
}
