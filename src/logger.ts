/**
 * src/logger.ts
 *
 * Application-wide logging service that provides centralized logging
 * capabilities through VSCode's output channel.
 */

import * as vscode from "vscode";

/**
 * Singleton logger class that handles all application logging.
 * Provides methods for logging at different levels (log, error, debug)
 * and manages a VSCode output channel.
 */
export class Logger {
  private static instance: Logger;
  private outputChannel: vscode.OutputChannel;

  /**
   * Creates a new VSCode output channel for the extension.
   */
  private constructor() {
    this.outputChannel =
      vscode.window.createOutputChannel("Tailwind Formatter");
  }

  /**
   * Disposes of the output channel and cleans up resources.
   */
  public dispose(): void {
    this.outputChannel?.dispose();
  }

  /**
   * Gets the singleton instance of the Logger.
   * Creates the instance if it doesn't exist.
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  /**
   * Shows the output channel in VSCode's UI.
   */
  public show(): void {
    this.outputChannel.show();
  }

  /**
   * Logs an informational message with timestamp to the output channel.
   *
   * @param message - The message to log
   */
  public log(message: string): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`[${timestamp}] ${message}`);
  }

  /**
   * Logs an error message with timestamp and optional error details
   * to the output channel.
   *
   * @param message - The error message to log
   * @param error - Optional error object with additional details
   */
  public error(message: string, error?: unknown): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`[${timestamp}] ERROR: ${message}`);

    if (error) {
      const errorString =
        error instanceof Error
          ? `${error.message}\n${error.stack}`
          : String(error);
      this.outputChannel.appendLine(errorString);
    }
  }

  /**
   * Logs a warning message with timestamp to the output channel.
   *
   * @param message - The warning message to log
   */
  public warn(message: string): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`[${timestamp}] WARNING: ${message}`);
  }

  /**
   * Logs a debug message to the console only.
   * Use for development-time debugging.
   *
   * @param message - The debug message to log
   */
  public debug(message: string): void {
    console.debug(message);
  }
}

export const logger = Logger.getInstance();
