/**
 * extension.ts
 *
 * Main entry point for the extension.
 * Handles extension lifecycle (activation/deactivation) and registration
 * of the formatting provider and commands.
 *
 * Main formatting logic is delegated to the provider and core modules.
 */

import * as vscode from "vscode";
import { SUPPORTED_LANGUAGES } from "./config/constants.config";
import { TailwindFormattingProvider } from "./providers/formatting.provider";
import { logger } from "./logger";

export async function activate(context: vscode.ExtensionContext) {
  try {
    logger.show();

    const formattingProvider = new TailwindFormattingProvider();

    for (const languageId of SUPPORTED_LANGUAGES) {
      context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(
          { language: languageId },
          formattingProvider
        )
      );

      context.subscriptions.push(
        vscode.languages.registerDocumentRangeFormattingEditProvider(
          { language: languageId },
          formattingProvider
        )
      );
    }

    context.subscriptions.push(
      vscode.commands.registerCommand(
        "tailwind-formatter.formatTailwindClasses",
        async () => formattingProvider.formatActiveDocument()
      )
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error(`Failed to activate extension: ${errorMessage}`, error);
    throw error; // Re-throw to ensure VSCode knows activation failed
  }
}

export function deactivate(): void {
  try {
    logger.log("Tailwind Formatter extension deactivating...");
    logger.dispose();
  } catch (error) {
    logger.error("Error during extension deactivation", error);
  }
}
