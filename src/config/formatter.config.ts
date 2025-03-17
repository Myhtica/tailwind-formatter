/**
 * config/formatter.config.ts
 *
 * Formatter configuration resolution for the Tailwind Formatter extension.
 *
 */

import * as vscode from "vscode";
import { FILE_CONFIGS, DEFAULT_PRETTIER_CONFIG } from "./constants.config";
import { FormatterConfig } from "../types";

/**
 * Manager for the formatter configuration.
 * Handles caching and invalidation of the formatter configuration.
 */
export class FormatterConfigManager {
  private static instance: FormatterConfigManager;
  private staticConfig: Omit<FormatterConfig, "prettierConfig"> | null = null;
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
   * Combines cached static config with dynamic Prettier config.
   */
  public async getConfig(
    document: vscode.TextDocument
  ): Promise<FormatterConfig> {
    try {
      this.getStaticConfig(document);
      const prettierConfig = await this.getPrettierConfig(document);

      return {
        ...this.staticConfig!,
        prettierConfig,
        usesTabs: prettierConfig.useTabs ?? this.staticConfig!.usesTabs,
        tabSize: prettierConfig.tabWidth ?? this.staticConfig!.tabSize,
      };
    } catch (error) {
      throw new Error(`Failed to get formatter config: ${error}`);
    }
  }

  /**
   * Initializes or returns cached static configuration.
   * Includes babel config, categories, viewports, and formatting options.
   */
  private getStaticConfig(document: vscode.TextDocument): void {
    if (this.staticConfig) {
      return;
    }

    const config = vscode.workspace.getConfiguration("tailwindFormatter");
    const extension = document.fileName.split(".").pop();

    const babelConfig = FILE_CONFIGS[extension as keyof typeof FILE_CONFIGS];
    if (!babelConfig) {
      throw new Error(
        `No babel configuration found for extension: .${extension}`
      );
    }

    this.staticConfig = {
      babelConfig,
      categories: config.get("classes.categories") as Record<string, string>,
      uncategorizedPosition: config.get("classes.uncategorizedPosition") as
        | "beforeCategorized"
        | "afterCategorized",
      viewports: config.get("viewports.breakpoints") as string[],
      viewportGrouping: config.get("viewports.grouping") as
        | "separate"
        | "inline",
      multiLineThreshold: config.get("formatting.multiLineThreshold") as number,
      alwaysUseSingleLine: config.get(
        "formatting.alwaysUseSingleLine"
      ) as boolean,
      usesTabs: config.get("indentation.usesTabs") as boolean,
      tabSize: config.get("indentation.tabSize") as number,
    };
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
    const usesTabs = extensionConfig.get("indentation.usesTabs") as boolean;
    const tabSize = extensionConfig.get("indentation.tabSize") as number;

    const useProjectPrettierConfig = extensionConfig.get(
      "prettier.useProjectPrettierConfig"
    ) as boolean;
    const extensionPrettierConfig = extensionConfig.get(
      "prettier.config"
    ) as Record<string, any> | null;

    if (useProjectPrettierConfig) {
      try {
        const prettier = require("prettier");
        const projectPrettierConfig =
          await prettier.resolveConfig(documentPath);

        if (projectPrettierConfig) {
          /*
           * Ensure parser is set to our default parser because we are not
           * parsing files but rather the document text itself.
           */
          return {
            ...projectPrettierConfig,
            parser: DEFAULT_PRETTIER_CONFIG.parser,
          };
        }
      } catch (error) {
        throw new Error(`Failed to resolve project Prettier config: ${error}`);
      }
    }

    /* Fallback to extension config or defaults  */
    return {
      ...DEFAULT_PRETTIER_CONFIG,
      ...(extensionPrettierConfig ?? {}),
      useTabs: usesTabs,
      tabWidth: tabSize,
    };
  }
}
