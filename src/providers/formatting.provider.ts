/**
 * /providers/formatting.provider.ts
 *
 * Formatting provider for Tailwind classes.
 */

import * as vscode from "vscode";
import { ValidationResult, Result } from "../types";
import {
  SUPPORTED_LANGUAGES,
  BABEL_SUPPORTED_LANGUAGES,
  REGEX_SUPPORTED_LANGUAGES,
} from "../config/constants.config";
import { FormatterConfigManager } from "../config/formatter.config";
import { logger } from "../logger";
import { formatText } from "../core/formatter.core";

/**
 * VS Code formatting provider for Tailwind classes.
 * Implements document and range formatting capabilities.
 */
export class TailwindFormattingProvider
  implements
    vscode.DocumentRangeFormattingEditProvider,
    vscode.DocumentFormattingEditProvider
{
  private configManager = FormatterConfigManager.getInstance();

  /**
   * Validates if the document can be formatted.
   *
   * @param document The document to validate
   * @param isFullDocumentFormatting Whether this is a full document formatting operation
   * @returns Validation result
   */
  private async validateDocument(
    document: vscode.TextDocument,
    isFullDocumentFormatting: boolean = false
  ): Promise<ValidationResult> {
    const languageId = document.languageId;

    if (isFullDocumentFormatting) {
      if (BABEL_SUPPORTED_LANGUAGES.has(languageId)) {
        return { ok: true };
      }

      if (REGEX_SUPPORTED_LANGUAGES.has(languageId)) {
        const warningResult = await this.showNonJSXWarning(languageId);
        return warningResult.ok ? { ok: true } : warningResult;
      }
    } else {
      if (SUPPORTED_LANGUAGES.has(languageId)) {
        return { ok: true };
      }
    }

    return {
      ok: false,
      error: `Language '${languageId}' is not supported for formatting.`,
    };
  }

  /**
   * Shows a warning about limitations when formatting non-JSX/TSX files.
   * Allows users to continue or disable future warnings.
   *
   * @param languageId The language ID being formatted
   * @returns ValidationResult indicating whether to proceed
   */
  private async showNonJSXWarning(
    languageId: string
  ): Promise<ValidationResult> {
    const config = vscode.workspace.getConfiguration("tailwindFormatter");
    const suppressWarning = config.get("suppressNonJSXWarning") as boolean;

    if (!suppressWarning) {
      const selection = await vscode.window.showWarningMessage(
        `Full document formatting for '${languageId}' files has limitations: dynamic classes will be ignored and only static classes will be formatted.`,
        { modal: false },
        "Continue Anyway",
        "Don't Show Again"
      );

      if (selection === "Don't Show Again") {
        await config.update("suppressNonJSXWarning", true, true);
      }

      if (!selection) {
        return { ok: false, error: "Operation canceled by user" };
      }

      logger.log(
        `Proceeding with limited formatting support for ${languageId}`
      );
    }

    return { ok: true };
  }

  /**
   * Formats the range of text in the document.
   *
   * @param document The document containing the text
   * @param range The range to format
   * @param isFullDocumentFormatting Whether this is a full document formatting operation
   * @returns A Result containing either the formatted text or an error message
   */
  private async formatDocumentText(
    document: vscode.TextDocument,
    range: vscode.Range,
    isFullDocumentFormatting: boolean = false
  ): Promise<Result<string, string>> {
    try {
      const validation = await this.validateDocument(
        document,
        isFullDocumentFormatting
      );
      if (!validation.ok) {
        return { ok: false, error: validation.error };
      }

      const documentText = document.getText(range);
      if (documentText.trim().length === 0) {
        return { ok: true, value: documentText };
      }

      const formatterConfig = await this.configManager.getConfig(document);
      if (!formatterConfig) {
        return {
          ok: false,
          error: "Failed to load formatter configuration",
        };
      }

      const formattedText = await formatText(
        documentText,
        document.languageId,
        formatterConfig,
        isFullDocumentFormatting
      );
      if (!formattedText) {
        return {
          ok: false,
          error: `Failed to format text (${document.fileName}, range: ${range.start.line}-${range.end.line})`,
        };
      }

      return { ok: true, value: formattedText };
    } catch (error) {
      logger.error("Error formatting text:", error);
      return {
        ok: false,
        error: `Formatting error: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Format the entire document.
   *
   * @param document The document to format
   * @returns Array of text edits to apply, or empty array if formatting failed
   */
  private async formatEntireDocument(
    document: vscode.TextDocument
  ): Promise<vscode.TextEdit[]> {
    const fullDocumentRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(document.getText().length)
    );

    const formattedText = await this.formatDocumentText(
      document,
      fullDocumentRange,
      true
    );
    if (!formattedText.ok) {
      vscode.window.showErrorMessage(formattedText.error);
      return [];
    }

    return [new vscode.TextEdit(fullDocumentRange, formattedText.value)];
  }

  /**
   * Formats the entire document using the active editor.
   *
   * @returns True if formatting was successful, false otherwise
   */
  public async formatActiveDocument(): Promise<boolean> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor found.");
      return false;
    }

    const edits = await this.formatEntireDocument(editor.document);
    if (edits.length === 0) {
      return false;
    }

    const formatSuccessful = await editor.edit((builder) => {
      edits.forEach((edit) => builder.replace(edit.range, edit.newText));
    });
    if (formatSuccessful) {
      vscode.window.showInformationMessage("Tailwind classes formatted!");
    }

    return formatSuccessful;
  }

  /**
   * Provides formatting edits for the entire document.
   *
   * @param document The document to format
   * @param options Formatting options
   * @param token Cancellation token
   * @returns Array of text edits to apply
   */
  public async provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    return this.formatEntireDocument(document);
  }

  /**
   * Provides formatting edits for the selected range in the document.
   *
   * @param document The document containing the range
   * @param range The range to format
   * @param options Formatting options
   * @param token Cancellation token
   * @returns Array of text edits to apply
   */
  public async provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    const formattedText = await this.formatDocumentText(document, range);
    if (!formattedText.ok) {
      vscode.window.showErrorMessage(formattedText.error);
      return [];
    }

    return [new vscode.TextEdit(range, formattedText.value)];
  }
}
