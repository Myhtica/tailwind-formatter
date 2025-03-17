# Change Log

All notable changes to the "Tailwind Formatter" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [1.0.0] - 2025-03-13

- Initial Release of Tailwind Formatter

### Added

- **Customizable Class Organization**: Group Tailwind classes by customizable prefix-based categories. Categories and their prefixes can be added, removed, or changed.
- **Responsive Class Organization**: Specialized organization for viewport/breakpoint classes (sm:, md:, lg:, etc.) that can be similarly customized.
- **Dynamic Expression Support**: Separate handling for static classes and dynamic expressions (template literals, conditionals)
- **Flexible-Line Formatting**: Configure single-line or multi-line formatting with customizable thresholds
- **Range Formatting**: Format selections without disrupting surrounding code structure
- **Full Document Formatting**: Format the entire document with the provided command (_Format Tailwind Classes_) or the built-in VS Code formatter command (_format Document with..._)
- **Format on Save**: Can be set as the default formatter for files through VS Code, with built-in Prettier integration

[1.0.0]: https://github.com/myhtica/tailwind-formatter/releases/tag/v1.0.0
