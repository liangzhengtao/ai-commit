# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

- Initial release
- Rule-based diff analysis (no API key needed)
- Automatic commit type detection from file patterns:
  - New source files → `feat`
  - Test files → `test`
  - Documentation → `docs`
  - Package files → `chore`
  - CI configuration → `ci`
  - Style files → `style`
  - Build config → `build`
  - Bug-related patterns → `fix`
- Language detection from file extensions (TypeScript, JavaScript, Python, Go, Rust, and 30+ more)
- Automatic scope detection from common directory paths
- Natural language description generation from diff analysis
- Conventional Commits format output
- Interactive prompts for commit confirmation and editing
- Beautiful terminal UI with chalk, ora, and boxen
- JSON output mode for CI integration
- Dry-run mode for previewing messages
- Git hook support with `--no-verify` option
- Two CLI aliases: `ai-commit` and `aic`
- Complete test suite with 30+ tests
- Full documentation with examples

### Planned

- Custom commit type configuration via `.aicrc`
- LLM integration (optional, as enhancement to rule-based engine)
- Gitmoji support
- Multi-language commit messages (i18n)
- VS Code extension
- Pre-commit hook integration
- Commit history learning mode
