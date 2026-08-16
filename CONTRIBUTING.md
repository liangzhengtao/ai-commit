# Contributing to `aic`

Thank you for your interest in contributing to `aic`! This document provides guidelines and information for contributors.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/OWNER/ai-commit.git
   cd ai-commit
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create** a new branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development

### Running Locally

```bash
# Run the CLI directly
node bin/cli.js

# With options
node bin/cli.js --dry-run
node bin/cli.js --type feat
```

### Running Tests

```bash
npm test
```

All tests must pass before submitting a PR.

## Commit Guidelines

We practice what we preach! Use `aic` to generate your commit messages:

```bash
git add .
aic
```

Or follow [Conventional Commits](https://www.conventionalcommits.org/) manually:

```
feat(scope): add new feature
fix(scope): fix bug
docs: update documentation
test: add tests
chore: update dependencies
```

## Pull Request Process

1. **Update** the README.md if you're adding/changing features
2. **Update** the CHANGELOG.md with your changes
3. **Ensure** all tests pass: `npm test`
4. **Request** a review from a maintainer

### PR Title Format

Use the same Conventional Commits format:

```
feat: add Python language detection
fix: handle empty diff gracefully
docs: update FAQ section
```

## Code Style

- Use `'use strict';` at the top of every file
- Use `const` by default, `let` when reassignment is needed
- Add JSDoc comments for all exported functions
- Keep functions small and focused
- Use meaningful variable names

## Adding New Language Detection

To add support for a new programming language:

1. Open `src/index.js`
2. Find the `detectLanguage` function
3. Add the extension-to-language mapping in the `langMap` object:
   ```js
   const langMap = {
     // ... existing entries
     ext: 'LanguageName'
   };
   ```

## Adding New Commit Type Classification

To add new file pattern matching:

1. Open `src/index.js`
2. Find the `classifyChange` function
3. Add patterns to the `patterns` object:
   ```js
   const patterns = {
     // ... existing entries
     newtype: [
       /pattern1/,
       /pattern2/
     ]
   };
   ```

## Reporting Bugs

Open an issue with:

- **Description**: What happened vs. what you expected
- **Steps to Reproduce**: Minimal steps to trigger the bug
- **Environment**: Node.js version, OS, git version
- **Sample Diff**: If related to diff parsing, include the diff

## Feature Requests

Open an issue with:

- **Description**: What you'd like and why
- **Use Case**: When would this be useful
- **Proposed Solution**: If you have one

## Questions?

Open an issue with the `question` label or start a discussion.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
