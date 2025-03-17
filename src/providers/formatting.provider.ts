/**
 * /providers/formatting.provider.ts
 *
 * VSCode formatting provider for Tailwind classes.
 * Supports Format Document, Format Selection, and format on save commands
 *
 */

import * as vscode from "vscode";
import { ValidationResult, Result } from "../types";
import { SUPPORTED_EXTENSIONS } from "../config/constants.config";
import { FormatterConfigManager } from "../config/formatter.config";
import { logger } from "../logger";
import { formatText } from "../core/formatter.core";

/**
 * VSCode formatting provider for Tailwind classes
 * Implements document and range formatting capabilities
 */
export class TailwindFormattingProvider
  implements
    vscode.DocumentRangeFormattingEditProvider,
    vscode.DocumentFormattingEditProvider
{
  private configManager = FormatterConfigManager.getInstance();

  /**
   * Validates if the document can be formatted
   *
   * @param document The document to validate
   * @returns Validation result
   */
  private validateDocument(document: vscode.TextDocument): ValidationResult {
    const extension = document.fileName.split(".").pop() || "";
    if (!SUPPORTED_EXTENSIONS.has(extension)) {
      return {
        ok: false,
        error: `File extension .${extension} is not supported.`,
      };
    }

    const documentText = document.getText();
    if (documentText.trim().length === 0) {
      return { ok: false, error: "The document is empty." };
    }

    return { ok: true };
  }

  /**
   * Formats the document text using the formatter configuration
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
      const validation = this.validateDocument(document);
      if (!validation.ok) {
        return { ok: false, error: validation.error };
      }

      const documentText = document.getText(range);
      const formatterConfig = await this.configManager.getConfig(document);

      const formattedText = await formatText(
        documentText,
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
   * Format the entire document
   *
   * @param document The document to format
   * @returns Array of text edits to apply, or empty array if formatting failed
   */
  private async formatDocument(
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
   * Formats the entire document using the active editor
   *
   * @returns True if formatting was successful, false otherwise
   */
  public async formatActiveDocument(): Promise<boolean> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor found.");
      return false;
    }

    const edits = await this.formatDocument(editor.document);

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
   * Provides formatting edits for the entire document
   */
  public async provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    return this.formatDocument(document);
  }

  /**
   * Provides formatting edits for the selected range
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
