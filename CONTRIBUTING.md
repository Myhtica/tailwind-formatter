# Contributing to Tailwind Formatter

First off, thank you for considering contributing to Tailwind Formatter! As a solo developer project (so far), any help is greatly appreciated.

## About This Project

Tailwind Formatter started as a tool I built to solve my own frustrations with messy Tailwind class strings on a personal project of mine. I'm sharing it with the community in hopes it helps others too.

While I view it as a mostly complete project, improvements, additions, and bug-fixes to the extension are very much welcome. As a new open source maintainer, I'm learning as I go, so please be patient and constructive!

## How Can I Contribute?

### Reporting Bugs

If you encounter a bug, please create an issue with:

- A clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable
- Your environment (VS Code version, OS, etc.)

### Suggesting Enhancements

Have an idea to make Tailwind Formatter better? Open an issue describing:

- The feature you'd like to see
- Why it would be useful
- How you envision it working

### Pull Requests

Pull requests are welcome! Here's how to submit one:

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Create a new branch: `git checkout -b new-branch-name`
4. Make your changes and add corresponding tests
5. Run tests: `npm test`
6. Run linter: `npm run lint`
7. Commit your changes with a descriptive message
8. Push to your fork and submit a pull request

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [VS Code](https://code.visualstudio.com/)

### Getting Started

1. Clone your fork of the repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run compile`
4. Launch the extension in debug mode using VS Code's Run and Debug view

### Development Commands

- `npm run watch` - Watch for changes and automatically rebuild
- `npm test` - Run tests
- `npm run lint` - Check for code issues
- `npm run format` - Format code with Prettier
- `npm run package` - Package the extension for distribution

## Pull Request Guidelines

- Update documentation if you're changing functionality
- Keep pull requests focused on a single topic
- Add tests for new features or bug fixes
- Follow the existing code style
- Write clear commit messages

## Code of Conduct

Please always be respectful and considerate of others.

If you have any questions, feel free to reach out: dev@myhtica.com

---
