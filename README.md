[English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md)
n<div align="center">

<img src=".banner.svg" width="100%" alt="banner">

</div>


<div align="center">

# 🤖 `aic` — AI Commit Message Generator

**AI writes your commit messages. You just review and confirm.**

No API keys. No cloud services. No subscriptions.  
Pure on-device intelligence that analyzes your staged changes and generates [Conventional Commits](https://www.conventionalcommits.org/) instantly.

[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
[![CI](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

</div>

---

## ✨ Why `aic`?

Ever stared at `git commit` wondering what to write? `aic` ends that forever.

```bash
$ git add .
$ aic

  🤖 aic — AI Commit Message Generator
  ─────────────────────────────────────

  ✓ Found 4 staged file(s)

  ╭──────────────────────────────────────────────────╮
  │                                                  │
  │  🤖 aic                                          │
  │                                                  │
  │  📝 Suggested Commit Message                     │
  │  ────────────────────────────────────            │
  │                                                  │
  │  feat(auth): add OAuth2 login flow               │
  │                                                  │
  │  📁 Files Changed (4)                            │
  │  ────────────────────────────────────            │
  │    📄 src/auth/oauth.ts                          │
  │    📄 src/auth/callback.ts                       │
  │    📄 src/routes/auth.ts                         │
  │    📦 package.json                               │
  │                                                  │
  │  ────────────────────────────────────            │
  │  [Enter] Commit  [E] Edit  [C] Cancel            │
  │                                                  │
  ╰──────────────────────────────────────────────────╯
```

**That's it.** `aic` analyzed the diff, detected new files, identified the language, and generated a perfect Conventional Commit — all in milliseconds, all offline.

---

## 🚀 Quick Start

### One-time use (no install)

```bash
npx ai-commit
```

### Global install

```bash
npm install -g ai-commit
```

Then use it anywhere:

```bash
git add .
aic
```

The short alias `aic` works everywhere — it's the same command as `ai-commit`.

---

## 📖 Usage

### Basic

```bash
# Stage your changes, then:
aic

# Or use the full name:
ai-commit
```

### With Options

```bash
# Force a specific commit type
aic --type feat

# Add a scope
aic --scope auth

# Preview without committing
aic --dry-run

# Use a custom message (bypasses AI)
aic -m "your custom message"

# Skip git hooks
aic --no-verify

# Auto-commit without confirmation
aic --yes

# Output as JSON (for CI pipelines)
aic --json
```

---

## ⚙️ Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--type <type>` | `-t` | Force commit type | Auto-detected |
| `--scope <scope>` | `-s` | Set commit scope | Auto-detected |
| `--message <msg>` | `-m` | Custom message (skips AI) | — |
| `--dry-run` | `-d` | Preview only, don't commit | `false` |
| `--no-verify` | — | Skip git hooks | `false` |
| `--yes` | `-y` | Skip confirmation prompt | `false` |
| `--json` | — | Output result as JSON | `false` |
| `--version` | `-V` | Show version | — |
| `--help` | `-h` | Show help | — |

---

## 🧠 How It Works

`aic` uses **rule-based diff analysis** — no API keys, no network calls, no LLMs. Here's what happens when you run it:

```
┌─────────────────────────────────────────────────────┐
│  1. Read staged changes (git diff --cached)         │
│  2. Parse diff → detect new/deleted/modified files  │
│  3. Detect languages from file extensions           │
│  4. Classify change type from file patterns:        │
│     • New .ts/.tsx/.js/.jsx files → feat            │
│     • Test files (*.test.*, __tests__/) → test      │
│     • Markdown files → docs                         │
│     • package.json → chore                          │
│     • .github/ → ci                                 │
│     • Bug-related patterns → fix                    │
│     • Default → refactor                            │
│  5. Detect scope from common directory              │
│  6. Generate natural language description           │
│  7. Format as Conventional Commit                   │
│  8. Display in beautiful terminal UI                │
└─────────────────────────────────────────────────────┘
```

### Classification Rules

| Pattern | Detected Type |
|---------|--------------|
| New `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs` files | `feat` |
| `*.test.*`, `*.spec.*`, `__tests__/`, `test/`, `tests/` | `test` |
| `*.md`, `*.mdx`, `docs/`, `CHANGELOG`, `LICENSE` | `docs` |
| `package.json`, `yarn.lock`, `pnpm-lock.yaml` | `chore` |
| `.github/`, `.gitlab-ci`, `.circleci/` | `ci` |
| `*.css`, `*.scss`, `*.sass`, `*.less` | `style` |
| `webpack`, `rollup`, `vite`, `tsconfig` | `build` |
| Files with `fix`, `bug`, `hotfix` in name | `fix` |
| Everything else | `refactor` |

---

## 📋 Conventional Commits

`aic` generates messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code change that doesn't fix a bug or add a feature |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `chore` | Build process or auxiliary tools |
| `ci` | CI configuration |
| `build` | Build system changes |

### Examples

```
feat(auth): add OAuth2 login flow
fix(api): handle null response from user endpoint
docs: update installation guide
refactor(utils): simplify date formatting functions
test(auth): add integration tests for login flow
chore: update dependencies to latest versions
ci: add Node 20 to test matrix
```

---

## 🔧 CI Integration

Use `aic` in your CI pipeline to auto-generate commit messages:

```yaml
# .github/workflows/auto-commit.yml
name: Auto Commit
on:
  push:
    branches: [main]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install aic
        run: npm install -g ai-commit
      
      - name: Run formatter
        run: npm run format
      
      - name: Commit changes
        run: |
          git add .
          aic --yes --json
        env:
          GIT_AUTHOR_NAME: CI Bot
          GIT_COMMITTER_NAME: CI Bot
```

### JSON Output for Pipelines

```bash
$ aic --json
{
  "message": "feat(auth): add OAuth2 login flow",
  "files": ["src/auth/oauth.ts", "src/auth/callback.ts"],
  "dryRun": false
}
```

---

## 🛠️ Development

```bash
# Clone the repo
git clone https://github.com/liangzhengtao/ai-commit.git
cd ai-commit

# Install dependencies
npm install

# Run tests
npm test

# Try it locally
node bin/cli.js
```

---

## See Also

| Project | Description |
|---------|-------------|
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 20 production AI coding rules |
| [**vibe-check**](https://github.com/liangzhengtao/vibe-check) | `npx vibe-check` — Score your project's AI-readiness |
| [**awesome-mcp-servers**](https://github.com/liangzhengtao/awesome-mcp-servers) | MCP servers for Cursor, Claude Code, and Kimi Code |

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork & clone, then:
git checkout -b feat/my-feature
# Make changes...
npm test
git add .
aic  # dogfood it! 🐕
```

---

## 📄 License

MIT © [liangzhengtao](https://github.com/liangzhengtao)

---

## ❓ FAQ

### Does `aic` send my code to any server?

**No.** `aic` is 100% offline. All analysis happens locally using rule-based pattern matching. No API keys, no network requests, no telemetry.

### Why rule-based instead of an LLM?

Three reasons:
1. **Speed** — Results in milliseconds, not seconds
2. **Privacy** — Your code never leaves your machine
3. **Reliability** — No rate limits, no API costs, no outages

Future versions may offer optional LLM integration as an enhancement, but the rule-based engine will always be the default.

### Can I customize the commit types?

Not yet, but it's on the roadmap. See [CHANGELOG.md](CHANGELOG.md) for planned features.

### Does it work with git hooks?

Yes! By default, `aic` runs `git commit` which triggers your hooks normally. Use `--no-verify` to skip them.

### What if I want to edit the message before committing?

That's the default behavior! After `aic` suggests a message, you can:
- Press **Enter** to commit as-is
- Press **E** to edit the message interactively
- Press **C** to cancel

### Can I use it in a monorepo?

Yes. `aic` automatically detects the scope from your file paths. If all changed files are in `packages/auth/`, it will suggest `(auth)` as the scope.

### What Node.js version do I need?

Node.js 16 or higher.

---

<div align="center">

**[⬆ Back to top](README.md)**

</div>

---
