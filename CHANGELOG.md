# Change Log

All notable changes to the "Tailwind Formatter" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [2.0.0] - 2025-04-16

### Added

- **Improved Multi-language Support**: Completely rebuilt the formatting engine to better support non-JSX/TSX languages:

  - Added dedicated regex-based formatter for HTML, Astro, Vue, Svelte, Blade, PHP, and Elixir
  - Maintained Babel's AST-based formatting for JSX/TSX files

- **Language-specific Prettier Integration**:

  - Added language-specific Prettier configurations for each supported language
  - Support for language-specific Prettier plugins like prettier-plugin-svelte, prettier-plugin-astro
  - Automatic plugin loading when available

- **UI Improvements**:

  - Added friendly warning system for non-JSX/TSX formatting that explains limitations
  - Option to suppress repeated warnings for non-JSX languages

- **Enhanced Utility Functions**:
  - New utility functions for regex-based class extraction and formatting
  - Added support for both single-line and multi-line class attributes in non-JSX files

### Changed

- **Architecture Overhaul**:

  - Completely restructured the formatting engine to support different formatting strategies
  - Separated formatter logic into dedicated modules for better maintainability
  - Refactored parser to support both AST and regex-based parsing approaches

- **Configuration System**:

  - Enhanced the configuration manager to handle language-specific settings
  - Improved Prettier configuration resolution and plugin handling
  - Better error handling and fallbacks for missing configurations

### Fixed

- Issues with formatting in non-JSX/TSX languages (in particular html self-closing tags)
- Indentation problems when using Prettier with non-standard languages
- Improved error handling for unsupported languages

### Documentation

- Updated README with changed information about multi-language support
- Expanded explanations about formatting limitations for non-JSX/TSX files

[2.0.0]: https://github.com/myhtica/tailwind-formatter/releases/tag/v2.0.0

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
