/**
 * config/formatter.config.ts
 *
 * Formatter configuration resolution for the Tailwind Formatter extension.
 *
 */

import * as vscode from "vscode";
import {
  REGEX_SUPPORTED_LANGUAGES,
  LANGUAGE_BABEL_CONFIGS,
  LANGUAGE_PRETTIER_CONFIGS,
  DEFAULT_PRETTIER_CONFIG,
} from "./constants.config";
import { TransformOptions } from "@babel/core";
import { FormatterConfig } from "../types";

/**
 * Manager for the formatter configuration.
 * Handles caching and invalidation of the formatter configuration.
 */
export class FormatterConfigManager {
  private static instance: FormatterConfigManager;
  private staticConfig: Omit<
    FormatterConfig,
    "prettierConfig" | "babelConfig"
  > | null = null;
  private disposables: vscode.Disposable[] = [];

  /**
   * Private constructor to prevent direct instantiation.
   * Sets up configuration change listener for cache invalidation.
   */
  private constructor() {
    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("tailwindFormatter")) {
          this.staticConfig = null;
        }
      })
    );
  }

  /**
   * Cleans up resources when the extension is deactivated.
   */
  public dispose(): void {
    this.disposables.forEach((d) => d.dispose());
  }

  /**
   * Gets or creates the instance of the FormatterConfigManager.
   */
  public static getInstance(): FormatterConfigManager {
    if (!FormatterConfigManager.instance) {
      FormatterConfigManager.instance = new FormatterConfigManager();
    }

    return FormatterConfigManager.instance;
  }

  /**
   * Gets the complete formatter configuration for a document.
   * Combines cached static config with dynamic configs.
   */
  public async getConfig(
    document: vscode.TextDocument
  ): Promise<FormatterConfig> {
    try {
      this.getStaticConfig(document);
      if (!this.staticConfig) {
        throw new Error("Failed to get static configuration");
      }

      const babelConfig = this.getBabelConfig(document);
      if (!babelConfig) {
        throw new Error(
          `Failed to resolve Babel configuration for language: ${document.languageId}`
        );
      }

      const prettierConfig = await this.getPrettierConfig(document);
      if (!prettierConfig) {
        throw new Error("Failed to get Prettier configuration");
      }

      return {
        ...this.staticConfig!,
        babelConfig,
        prettierConfig,
        usesTabs: prettierConfig.useTabs ?? this.staticConfig.usesTabs,
        tabSize: prettierConfig.tabWidth ?? this.staticConfig.tabSize,
      };
    } catch (error) {
      throw new Error(`Failed to get formatter config: ${error}`);
    }
  }

  /**
   * Initializes or returns cached static configuration.
   * Includes categories, viewports, and other formatting options.
   */
  private getStaticConfig(document: vscode.TextDocument): void {
    if (this.staticConfig) {
      return;
    }

    const config = vscode.workspace.getConfiguration("tailwindFormatter");

    this.staticConfig = {
      categories: config.get("classes.categories") as Record<string, string>,
      uncategorizedPosition: config.get("classes.uncategorizedPosition") as
        | "beforeCategorized"
        | "afterCategorized",

      viewports: config.get("viewports.breakpoints") as string[],
      viewportGrouping: config.get("viewports.grouping") as
        | "separate"
        | "separate-categorized"
        | "inline",

      multiLineClasses: config.get(
        "lineFormatting.multiLineClasses"
      ) as boolean,
      multiLineClassThreshold: config.get(
        "lineFormatting.multiLineClassThreshold"
      ) as number,

      usesTabs: config.get("indentation.usesTabs") as boolean,
      tabSize: config.get("indentation.tabSize") as number,
    };
  }

  /**
   * Helper function to get the Babel configuration for a specific document.
   *
   * @param languageId The VSCode language identifier
   * @returns Babel configuration for the language
   * @throws Error if no configuration is available
   */
  private getBabelConfig(document: vscode.TextDocument): TransformOptions {
    const languageId = document.languageId;

    if (languageId in LANGUAGE_BABEL_CONFIGS) {
      return LANGUAGE_BABEL_CONFIGS[languageId];
    }

    if (REGEX_SUPPORTED_LANGUAGES.has(languageId)) {
      return LANGUAGE_BABEL_CONFIGS["javascriptreact"];
    }

    throw new Error(`No Babel configuration found for language: ${languageId}`);
  }

  /**
   * Gets the Prettier configuration for a specific document. Attempts
   * to use project config if enabled, else falls back to extension config.
   *
   * This is always fetched fresh as it can be file-specific.
   *
   * @param document - The document to get the Prettier configuration for
   * @returns Resolved Prettier configuration
   */
  private async getPrettierConfig(
    document: vscode.TextDocument
  ): Promise<Record<string, any>> {
    const extensionConfig =
      vscode.workspace.getConfiguration("tailwindFormatter");
    const documentPath = document.uri.fsPath;
    const languageId = document.languageId;
    const langConfig = LANGUAGE_PRETTIER_CONFIGS[languageId];
    const usesTabs = extensionConfig.get("indentation.usesTabs") as boolean;
    const tabSize = extensionConfig.get("indentation.tabSize") as number;

    const useProjectPrettierConfig = extensionConfig.get(
      "prettier.useProjectPrettierConfig"
    ) as boolean;
    const extensionPrettierConfig = extensionConfig.get(
      "prettier.config"
    ) as Record<string, any> | null;

    let prettierConfig: Record<string, any> = {
      ...DEFAULT_PRETTIER_CONFIG,
      ...(extensionPrettierConfig ?? {}), // merge with default config if present
      parser: langConfig.parser || languageId,
      useTabs: usesTabs,
      tabWidth: tabSize,
    };

    if (useProjectPrettierConfig) {
      try {
        const prettier = require("prettier");
        const projectPrettierConfig =
          await prettier.resolveConfig(documentPath);

        if (projectPrettierConfig) {
          /*
           * Ensure parser is set to our language-specific parser because
           * we are not parsing files but rather the document text itself.
           */
          prettierConfig = {
            ...projectPrettierConfig,
            parser: langConfig.parser,
          };
        }
      } catch (error) {
        throw new Error(`Failed to resolve project Prettier config: ${error}`);
      }
    }

    if (langConfig.plugins && langConfig.plugins.length > 0) {
      prettierConfig.plugins = langConfig.plugins;
    }

    if (langConfig.requiresOverride) {
      const fileExtension = document.fileName.split(".").pop();
      prettierConfig.overrides = [
        {
          files: [`*.${fileExtension}`],
          options: {
            parser: langConfig.parser,
          },
        },
      ];
    }

    return prettierConfig;
  }
}
