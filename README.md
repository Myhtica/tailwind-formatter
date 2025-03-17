# Tailwind Formatter - Class Organization, Your Way

Wrestling with messy class strings or opinionated formatting styles? Tailwind Formatter lets you enjoy neatly categorized, consistently formatted Tailwind classes that make your JSX/TSX code more readable and maintainable — _your way_.

Organize your Tailwind classes exactly how you want them!

## Features

- **Customizable Class Organization**: Group Tailwind classes by customizable prefix-based categories. Categories and their prefixes can be added, removed, or changed.

- **Responsive Class Organization**: Specialized organization for viewport/breakpoint classes (sm:, md:, lg:, etc.) that can be similarly customized.

- **Dynamic Expression Support**: Separate handling for static classes and dynamic expressions (template literals, conditionals)

- **Flexible-Line Formatting**: Configure single-line or multi-line formatting with customizable thresholds

- **Range Formatting**: Format selections without disrupting surrounding code structure

- **Full Document Formatting**: Format the entire document with the provided command (_Format Tailwind Classes_) or the built-in VS Code formatter command (_format Document with..._)

- **Format on Save**: Can be set as the default formatter for files through VS Code, with built-in Prettier integration

## Getting Started

1. Install the extension from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=myhtica-tailwind-formatter).
2. Check below on the extension's formatting options, settings, and class organization.
3. Modify the extension settings to create your own preferred formatting style.
4. Format your classes — the way you want to!

## Formatting Options

- **Format Selection**: Select JSX code, right-click and select "Format Selection"

![Format Selection Demo for Tailwind Formatter](images/docs/format-selection-demo.gif)

- **Format Document**: Right-click in a JSX/TSX file and select "Format Document"

![Format Document Demo for Tailwind Formatter](images/docs/format-document-demo.gif)

- **Command Palette**: Open the VS Code Command Palette (press Ctrl+Shift+P or ⌘+Shift+P) and search for "Format Tailwind Classes"

![Format Command Demo for Tailwind Formatter](images/docs/format-command-demo.gif)

### Format On Save

To enable automatic formatting when saving files:

1. Open VS Code settings

2. Search for "Format on Save" and enable it

3. Search for "Default Formatter" and select "Tailwind Formatter"

You can also place the following inside of your workspace's VS Code `settings.json` file:

```
{
  "editor.defaultFormatter": "myhtica.tailwind-formatter",
  "editor.formatOnSave": true
}
```

### Important: Range Formatting vs. Document Formatting

The extension handles range (selection) formatting differently from full document formatting:

**Range Formatting**

Range formatting (selecting part of your code and formatting just that section) has several important requirements to work correctly:

- **Complete JSX elements are required** - your selection must include both opening and closing tags

- **Include leading indentation** - your selection must include all whitespace before the JSX elements, not just start at the `<` character

**Example of correct selection for range formatting:**

```jsx
<div className="p-4 m-2 text-center"></div>
```

**Example of incorrect selection for range formatting:**

```jsx
<div className="p-4 m-2 text-center">
```

_Note_: **Prettier is not applied** during range formatting to preserve the original structure.

**Full Document Formatting**

- Formats all Tailwind classes in the document

- Applies Prettier and post-processing for consistent code style (for cases where formatting class names affects the surrounding code structure)

**When to use each approach:**

- **Range Formatting**: Use when wanting to organize specific Tailwind classes without affecting the surrounding code structure. Recommended to start with this approach to safely format specific sections of your code.

- **Full Document Formatting**: Use this when you want comprehensive formatting across your entire file. Best for new files or when you're ready to standardize all Tailwind classes.

- **Format on Save**: Convenient for ongoing projects but use with caution. While powerful for maintaining consistency, it may produce unexpected results in complex documents. Consider testing thoroughly before enabling project-wide.

## Extension Settings

| Setting                                               | Description                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| `tailwindFormatter.classes.categories`                | Categories for grouping Tailwind CSS classes                    |
| `tailwindFormatter.classes.uncategorizedPosition`     | Where to place uncategorized static classes                     |
| `tailwindFormatter.viewports.breakpoints`             | Viewport breakpoints to group classes by                        |
| `tailwindFormatter.viewports.grouping`                | How to group viewport-specific classes                          |
| `tailwindFormatter.formatting.multiLineThreshold`     | Format classes on multiple lines when width exceeds this number |
| `tailwindFormatter.formatting.alwaysUseSingleLine`    | Always format classes on a single line                          |
| `tailwindFormatter.indentation.usesTabs`              | Use tabs for indentation instead of spaces                      |
| `tailwindFormatter.indentation.tabSize`               | Number of spaces to use for indentation                         |
| `tailwindFormatter.prettier.useProjectPrettierConfig` | Use your project's Prettier config if available                 |
| `tailwindFormatter.prettier.config`                   | Prettier configuration for the extension                        |

## Class Organization

The extension organizes classes in three main ways:

### 1. Categories

Classes are grouped by user-defined categories. Each category is defined by a space-separated list of prefixes that determine what classes belong to that category.

When configuring category prefixes in `tailwindFormatter.classes.categories`, follow these guidelines for accurate class matching:

**For hyphenated classes**: Add the prefix with a trailing hyphen (e.g., `p-`, `m-`, `w-`)

**For standalone classes**: Include the exact class name (e.g., `block`, `container`, `hidden`)

**For variant prefixes**: Add the full prefix with a colon (e.g., `hover:`, `focus:`, `dark:`)

_Note_:

- Categories are used to group both static and _simple dynamic_ Tailwind classes (e.g. _bg-${color}_). Complex dynamic classes with ternaries or expressions are handled separately.

- Specificity takes precedence for all prefix cases. For example, if there exists a general `hover:` prefix for _Category 1_ and a more specific `hover:bg-` prefix in _Category 2_, classes like `hover:bg-blue-500` will be categorized under _Category 2_ because it has a more specific (longer) matching prefix.

**Example Configuration:**

```json
"tailwindFormatter.classes.categories": {
  "Layout": "container flex grid block inline hidden visible z-",
  "Sizing": "w- h- min- max-",
  "Spacing": "p- m- space-",
  "Typography": "text- font- leading- tracking-",
  "Background": "bg- from- via- to-",
  "Borders": "border rounded- divide-",
  "Effects": "shadow- opacity- transition- transform-"
}
```

This produces neatly organized classes:

```jsx
className={`
  flex items-center justify-between  /* Layout */
  w-full h-12                        /* Sizing */
  p-4 m-2                            /* Spacing */
  text-gray-800 font-medium          /* Typography */
  bg-white                           /* Background */
  border-b border-gray-200           /* Borders */
  shadow-sm                          /* Effects */
`}
```

You can organize categories however makes sense for your project. The extension provides a default configuration that works well for most projects, but you're encouraged to customize it for your specific needs.

### 2. Viewport/Responsive Classes

Responsive classes (sm:, md:, lg:, etc.) are handled separately from categories through dedicated viewport settings:

- `tailwindFormatter.viewports.breakpoints`: Define your breakpoint prefixes in order (e.g., ["sm", "md", "lg"])

- `tailwindFormatter.viewports.grouping`: Choose how to group viewport-specific classes:

  - `"separate"` (default): Groups all classes for the same viewport together on one line

  - `"separate-categorized"`: Separates by viewport first, then applies category organization within each viewport group

  - `"inline"`: Groups by category first, then places viewport variations inline within each category

For example:

**With `"separate"` grouping (default):**

```jsx
className={`
  p-4 m-2 text-sm
  sm:p-3 sm:m-3 sm:text-base
  lg:p-4 lg:m-4 lg:text-lg
`}
```

**With `"separate-categorized"` grouping:**

```jsx
className={`
  p-4 m-2
  text-sm
  sm:p-3 sm:m-3
  sm:text-base
  lg:p-4 lg:m-4
  lg:text-lg
`}
```

**With `"inline"` grouping:**

```jsx
className={`
  p-4 sm:p-3 lg:p-4
  m-2 sm:m-3 lg:m-4
  text-sm sm:text-base lg:text-lg
`}
```

### 3. Dynamic Classes

Dynamic classes (using template literals, conditionals, or function calls) are also handled separately from static categories. Static classes are always placed before dynamic classes to ensure reliable style application. This follows CSS source order precedence:

```jsx
className={`
  text-gray-500 p-4                  /* Static base styles */
  ${isActive ? 'text-blue-500' : ''} /* Dynamic modifiers */
`}
```

## Prettier Integration

The extension comes with Prettier built-in to ensure consistent formatting. To customize Prettier formatting, you can:

- Use your project's `.prettierrc` file (if it exists) by enabling `tailwindFormatter.prettier.useProjectPrettierConfig` (enabled by default)

- Customize Prettier settings directly through the `tailwindFormatter.prettier.config` extension setting

_Note_: You don't need to install Prettier in your project - it's already included with the extension. The extension will read your `.prettierrc` configuration file if present, but uses its own Prettier installation. However, it does not directly interact with or extract settings from an external Prettier extension installed in VS Code.

## Known Issues

- [ *WARNING* ] Range formatting requires complete JSX elements with leading indentation
- [ *WARNING* ] Range formatting doesn't apply Prettier (by design, to preserve structure)

## Release Notes

See the [CHANGELOG](CHANGELOG.md) for details on all releases.

### 1.0.0

- Initial release of Tailwind Formatter.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT open source license. See [LICENSE.md](LICENSE.md).

## Sponsor

If you liked this extension or it helped you or your team for a project, please consider donating/sponsoring! It would be a huge help for me as a struggling new grad! Thank you!

---

**Enjoy formatting your Tailwind classes!**
