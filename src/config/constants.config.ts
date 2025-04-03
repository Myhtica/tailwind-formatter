/**
 * config/constants.config.ts
 *
 * Constants for the Tailwind Formatter extension.
 */

import { TransformOptions } from "@babel/core";

/**
 * Default Prettier configuration.
 */
export const DEFAULT_PRETTIER_CONFIG = {
  parser: "typescript", // Required for proper JSX/TSX parsing of text instead of files
  printWidth: 80,
  quoteProps: "preserve",
  endOfLine: "auto",
};

/**
 * Languages fully supported by the formatter (both document and range formatting)
 */
export const FULLY_SUPPORTED_LANGUAGES = new Set([
  "typescriptreact",
  "javascriptreact",
]);

/**
 * Languages with limited range-only formatting support
 */
export const RANGE_ONLY_LANGUAGES = new Set([
  "astro",
  "vue",
  "svelte",
  "blade",
  "php",
  "elixir",
  "html",
]);

/**
 * All supported languages (combination of fully supported and range-only)
 */
export const SUPPORTED_LANGUAGES = new Set([
  ...Array.from(FULLY_SUPPORTED_LANGUAGES),
  ...Array.from(RANGE_ONLY_LANGUAGES),
]);

/**
 * Language-specific Babel configurations.
 * Each configuration has specific presets and plugins needed for parsing that language.
 */
export const LANGUAGE_BABEL_CONFIGS: Record<string, TransformOptions> = {
  /* JavaScript React configuration (also used as default for JSX-like languages) */
  javascriptreact: {
    sourceType: "module",
    presets: [require("@babel/preset-react")], // require ensures dependency is loaded
    parserOpts: {
      tokens: true,
      plugins: ["jsx"],
    },
  },

  /* TypeScript React configuration */
  typescriptreact: {
    sourceType: "module",
    presets: [
      [
        require("@babel/preset-typescript"),
        {
          isTSX: true,
          allExtensions: true, // Required for TSX parsing
        },
      ],
      require("@babel/preset-react"),
    ],
    parserOpts: {
      tokens: true,
      plugins: ["jsx", "typescript"],
    },
  },
};
