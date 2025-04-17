/**
 * config/constants.config.ts
 *
 * Constants for the Tailwind Formatter extension.
 */

import { TransformOptions } from "@babel/core";
import { PrettierLanguageConfig } from "../types";

/**
 * Languages supported by Babel.
 */
export const BABEL_SUPPORTED_LANGUAGES = new Set([
  "typescriptreact",
  "javascriptreact",
]);

/**
 * Languages supported through regex parsing.
 */
export const REGEX_SUPPORTED_LANGUAGES = new Set([
  "astro",
  "vue",
  "svelte",
  "blade",
  "php",
  "elixir",
  "html",
]);

/**
 * Languages that are supported by Prettier (parser or plugin).
 */
export const PRETTIER_SUPPORTED_LANGUAGES = new Set([
  "typescriptreact",
  "javascriptreact",
  "html",
  "vue",
  "svelte",
  "astro",
  "php",
  "blade",
]);

/**
 * All supported languages (combination of fully supported and range-only).
 */
export const SUPPORTED_LANGUAGES = new Set([
  ...Array.from(BABEL_SUPPORTED_LANGUAGES),
  ...Array.from(REGEX_SUPPORTED_LANGUAGES),
]);

/**
 * Language-specific Babel configurations.
 * Each configuration has specific presets and plugins needed for parsing that language.
 */
export const LANGUAGE_BABEL_CONFIGS: Record<string, TransformOptions> = {
  /* JavaScript React configuration */
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

/**
 * Language-specific Prettier configurations.
 * Each configuration has specific parser and plugins needed for formatting that language.
 */
export const LANGUAGE_PRETTIER_CONFIGS: Record<string, PrettierLanguageConfig> =
  {
    typescriptreact: { parser: "typescript" },
    javascriptreact: { parser: "typescript" },
    html: { parser: "html" },
    vue: { parser: "vue" },
    elixir: { parser: "html" }, // fallback to html parser
    svelte: {
      parser: "svelte",
      plugins: ["prettier-plugin-svelte"],
      requiresOverride: true,
    },
    astro: {
      parser: "astro",
      plugins: ["prettier-plugin-astro"],
      requiresOverride: true,
    },
    blade: {
      parser: "blade",
      plugins: ["prettier-plugin-blade"],
      requiresOverride: true,
    },
    php: {
      parser: "php",
      plugins: ["@prettier/plugin-php"],
    },
  };

/**
 * Default Prettier configuration.
 */
export const DEFAULT_PRETTIER_CONFIG = {
  printWidth: 80,
  quoteProps: "preserve",
  endOfLine: "auto",
};
