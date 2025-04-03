# Change Log

All notable changes to the "Tailwind Formatter" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [Unreleased] - Coming in v1.2.0

### To be Added

- **Improved Multi-language Support**: Enhanced support for non-JSX/TSX languages with a custom HTML parser

  - Reliable formatting for HTML, Vue, Svelte, Astro, Laravel Blade, PHP, and Elixir files
  - Specialized regex-based parser designed to understand each language's unique class attribute syntax
  - Proper handling of HTML self-closing tags and language-specific structures
  - Better formatting preservation for non-JSX templates

- **Dual Parser System**:
  - Enhanced fallback mechanism when Babel parsing fails
  - Language-specific optimizations for class attribute detection

## [1.1.0] - 2025-04-02

### Added

- **Multi-language Support**: Added support (limited) for formatting Tailwind classes for the following languages:

  - Astro (.astro files)
  - Vue (.vue files)
  - Svelte (.svelte files)
  - Laravel Blade (.blade.php files)
  - PHP (.php files)
  - Elixir (.ex, .exs files)
  - HTML (.html files)

- **Range-only Formatting**: Implemented specialized handling for languages that need selection-based formatting
  - Non-JSX/TSX languages now support range formatting for JSX/TSX-like portions
  - Clear error messages when attempting unsupported formatting operations

### Changed

- **Language-based Configuration**: Refactored extension to use language IDs instead of file extensions

  - More robust language detection across the codebase
  - Better configuration resolution based on document language
  - Improved Babel configuration handling for different languages

- **Enhanced Error Handling**: Added specific error messages for different formatting scenarios
  - Clearer guidance when range formatting is required
  - Better error reporting for unsupported languages

### Documentation

- Updated README with detailed information about multi-language support
- Added guidance for properly using range formatting with non-JSX/TSX files
- Expanded troubleshooting information for various language types

[1.1.0]: https://github.com/myhtica/tailwind-formatter/releases/tag/v1.1.0

## [1.0.0] - 2025-03-26

- Initial Release of Tailwind Formatter

### Added

- **Customizable Class Organization**: Group Tailwind classes by customizable prefix-based categories. Categories and their prefixes can be added, removed, or changed.
- **Responsive Class Organization**: Specialized organization for viewport/breakpoint classes (sm:, md:, lg:, etc.) that can be similarly customized.
- **Dynamic Expression Preservation**: Maintains dynamic expressions (template literals, conditionals) intact while organizing static classes into categories.
- **Flexible-Line Formatting**: Configure single-line or multi-line formatting with customizable thresholds. Configurable for both Tailwind classes and non-class attributes.
- **Range Formatting**: Format selections without disrupting surrounding code structure.
- **Full Document Formatting**: Format the entire document with the provided command (_Format Tailwind Classes_) or the built-in VS Code formatter command (_format Document with..._).
- **Format on Save**: Can be set as the default formatter for files through VS Code, with built-in Prettier integration.

[1.0.0]: https://github.com/myhtica/tailwind-formatter/releases/tag/v1.0.0
