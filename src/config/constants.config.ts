/**
 * config/constants.config.ts
 *
 * Constants for the Tailwind Formatter extension.
 */

import { TransformOptions } from "@babel/core";

/**
 * Default Prettier configuration
 */
export const DEFAULT_PRETTIER_CONFIG = {
  parser: "typescript", // Required for proper JSX/TSX parsing of text instead of files
  printWidth: 80,
  quoteProps: "preserve",
  endOfLine: "auto",
};

/**
 * Supported file extensions for the formatter (requires a corresponding Babel config in FILE_CONFIGS)
 */
export const SUPPORTED_EXTENSIONS = new Set(["jsx", "tsx"]);

/**
 * File-specific Babel configurations.
 *
 * Each configuration extends the base config with specific presets and plugins
 * needed for parsing that file type.
 */
export const FILE_CONFIGS: Record<string, TransformOptions> = {
  jsx: {
    sourceType: "module",
    presets: [require("@babel/preset-react")], // ensure dependency is loaded
    parserOpts: {
      tokens: true,
      plugins: ["jsx"],
    },
  },
  tsx: {
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
