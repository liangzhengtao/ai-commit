<div align="center">

[English](#english) | [中文](#中文)

</div>

---

<a name="english"></a>

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
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 20 production-ready AI coding rules |
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

**[⬆ Back to top](#english)**

</div>

---

<a name="中文"></a>

<div align="center">

# 🤖 `aic` — AI Commit Message 生成器

**AI 写 commit message，你只需要确认。**

无需 API key，无需云服务，无需订阅。  
纯本地智能分析暂存区变更，瞬间生成符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范的 commit message。

[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
[![CI](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

</div>

---

## ✨ 为什么用 `aic`？

还在对着 `git commit` 发呆不知道写什么？`aic` 彻底解决这个问题。

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

**就这么简单。** `aic` 分析 diff、检测新增文件、识别编程语言，然后生成一条完美的 Conventional Commit —— 全部在毫秒内完成，全程离线。

---

## 🚀 快速开始

### 一次性使用（无需安装）

```bash
npx ai-commit
```

### 全局安装

```bash
npm install -g ai-commit
```

安装后随时使用：

```bash
git add .
aic
```

短别名 `aic` 在任何地方都能用，它和 `ai-commit` 是同一个命令。

---

## 📖 用法

### 基本用法

```bash
# 暂存更改后运行：
aic

# 或使用全名：
ai-commit
```

### 常用选项

```bash
# 强制指定 commit 类型
aic --type feat

# 添加作用域
aic --scope auth

# 仅预览，不提交
aic --dry-run

# 使用自定义 message（跳过 AI 生成）
aic -m "你的自定义 message"

# 跳过 git hooks
aic --no-verify

# 跳过确认，直接提交
aic --yes

# 输出 JSON 格式（用于 CI 流水线）
aic --json
```

---

## ⚙️ 选项

| 选项 | 简写 | 说明 | 默认值 |
|------|------|------|--------|
| `--type <type>` | `-t` | 强制指定 commit 类型 | 自动检测 |
| `--scope <scope>` | `-s` | 设置 commit 作用域 | 自动检测 |
| `--message <msg>` | `-m` | 自定义 message（跳过 AI） | — |
| `--dry-run` | `-d` | 仅预览，不提交 | `false` |
| `--no-verify` | — | 跳过 git hooks | `false` |
| `--yes` | `-y` | 跳过确认提示 | `false` |
| `--json` | — | 以 JSON 格式输出 | `false` |
| `--version` | `-V` | 显示版本号 | — |
| `--help` | `-h` | 显示帮助 | — |

---

## 🧠 工作原理

`aic` 使用**基于规则的 diff 分析** —— 无需 API key，无需网络请求，无需 LLM。运行时的处理流程：

```
┌─────────────────────────────────────────────────────┐
│  1. 读取暂存区变更 (git diff --cached)               │
│  2. 解析 diff → 检测新增/删除/修改的文件              │
│  3. 根据文件扩展名检测编程语言                        │
│  4. 根据文件模式分类变更类型：                        │
│     • 新增 .ts/.tsx/.js/.jsx 文件 → feat             │
│     • 测试文件 (*.test.*, __tests__/) → test         │
│     • Markdown 文件 → docs                           │
│     • package.json → chore                           │
│     • .github/ → ci                                  │
│     • 含 bug 相关命名的文件 → fix                     │
│     • 其他 → refactor                                │
│  5. 从公共目录检测作用域                              │
│  6. 生成自然语言描述                                  │
│  7. 格式化为 Conventional Commit                      │
│  8. 在终端中美观展示                                  │
└─────────────────────────────────────────────────────┘
```

### 分类规则

| 文件模式 | 检测到的类型 |
|---------|-------------|
| 新增 `.ts`、`.tsx`、`.js`、`.jsx`、`.py`、`.go`、`.rs` 文件 | `feat` |
| `*.test.*`、`*.spec.*`、`__tests__/`、`test/`、`tests/` | `test` |
| `*.md`、`*.mdx`、`docs/`、`CHANGELOG`、`LICENSE` | `docs` |
| `package.json`、`yarn.lock`、`pnpm-lock.yaml` | `chore` |
| `.github/`、`.gitlab-ci`、`.circleci/` | `ci` |
| `*.css`、`*.scss`、`*.sass`、`*.less` | `style` |
| `webpack`、`rollup`、`vite`、`tsconfig` | `build` |
| 文件名含 `fix`、`bug`、`hotfix` | `fix` |
| 其他 | `refactor` |

---

## 📋 Conventional Commits 规范

`aic` 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范生成 message：

```
<类型>[可选的作用域]: <描述>

[可选的正文]
```

### 类型

| 类型 | 适用场景 |
|------|---------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 仅文档变更 |
| `style` | 格式调整（不影响代码逻辑） |
| `refactor` | 重构（非新功能、非 bug 修复） |
| `perf` | 性能优化 |
| `test` | 添加或修改测试 |
| `chore` | 构建流程或辅助工具变更 |
| `ci` | CI 配置变更 |
| `build` | 构建系统变更 |

### 示例

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

## 🔧 CI 集成

在 CI 流水线中使用 `aic` 自动生成 commit message：

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

### JSON 输出（用于流水线）

```bash
$ aic --json
{
  "message": "feat(auth): add OAuth2 login flow",
  "files": ["src/auth/oauth.ts", "src/auth/callback.ts"],
  "dryRun": false
}
```

---

## 🛠️ 开发

```bash
# 克隆仓库
git clone https://github.com/liangzhengtao/ai-commit.git
cd ai-commit

# 安装依赖
npm install

# 运行测试
npm test

# 本地试用
node bin/cli.js
```

---

## 相关项目

| 项目 | 说明 |
|------|------|
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 20 个生产级 AI 编码规则 |
| [**vibe-check**](https://github.com/liangzhengtao/vibe-check) | `npx vibe-check` — 评估项目的 AI 就绪度 |
| [**awesome-mcp-servers**](https://github.com/liangzhengtao/awesome-mcp-servers) | 适用于 Cursor、Claude Code 和 Kimi Code 的 MCP servers |

## 🤝 贡献

欢迎提交 PR！请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解贡献指南。

```bash
# Fork 并克隆，然后：
git checkout -b feat/my-feature
# 做修改...
npm test
git add .
aic  # 自己先用起来！🐕
```

---

## 📄 许可证

MIT © [liangzhengtao](https://github.com/liangzhengtao)

---

## ❓ 常见问题

### `aic` 会把我的代码发送到服务器吗？

**不会。** `aic` 100% 离线运行。所有分析都在本地通过规则匹配完成，无需 API key，无网络请求，无遥测数据。

### 为什么用规则而不是 LLM？

三个原因：
1. **速度快** —— 毫秒级出结果，不是秒级
2. **隐私安全** —— 代码永远不离开你的电脑
3. **稳定可靠** —— 没有速率限制、没有 API 费用、不会宕机

未来版本可能会提供可选的 LLM 增强功能，但基于规则的引擎将始终是默认方案。

### 能自定义 commit 类型吗？

暂不支持，但已在规划中。查看 [CHANGELOG.md](CHANGELOG.md) 了解计划中的功能。

### 支持 git hooks 吗？

支持！默认情况下，`aic` 执行 `git commit`，会正常触发你的 hooks。使用 `--no-verify` 可跳过。

### 提交前能编辑 message 吗？

这就是默认行为！`aic` 建议 message 后，你可以：
- 按 **Enter** 直接提交
- 按 **E** 交互式编辑 message
- 按 **C** 取消

### 能在 monorepo 中使用吗？

可以。`aic` 会自动从文件路径检测作用域。如果所有变更文件都在 `packages/auth/` 下，它会建议 `(auth)` 作为作用域。

### 需要什么版本的 Node.js？

Node.js 16 或更高版本。

---

<div align="center">

**[⬆ 回到顶部](#中文)**

</div>
