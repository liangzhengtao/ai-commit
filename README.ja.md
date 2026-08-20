[English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md)
n<div align="center">

<img src=".banner.svg" width="100%" alt="banner">

</div>


<div align="center">

# 🤖 `aic` — AI Commit メッセージ生成ツール

**AI が commit メッセージを書きます。あなたは確認するだけ。**

API キー不要。クラウドサービス不要。サブスクリプション不要。  
ステージされた変更をローカルで即座に分析し、[Conventional Commits](https://www.conventionalcommits.org/) 規格に準拠した commit メッセージを生成します。

[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
[![CI](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

</div>

---

## ✨ なぜ `aic` なのか？

`git commit` の前で何を書くべきか途方に暮れたことはありませんか？`aic` がその悩みを完全に解消します。

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

**これだけ。** `aic` が diff を分析し、新しいファイルを検出し、プログラミング言語を特定して、完璧な Conventional Commit を生成——すべてミリ秒で、完全オフライン。

---

## 🚀 クイックスタート

### 一回限りの使用（インストール不要）

```bash
nx ai-commit
```

### グローバルインストール

```bash
npm install -g ai-commit
```

インストール後、どこからでも使えます：

```bash
git add .
aic
```

短いエイリアス `aic` はどこでも使えます——`ai-commit` と同じコマンドです。

---

## 📖 使い方

### 基本

```bash
# 変更をステージしてから実行：
aic

# またはフルネームで：
ai-commit
```

### オプション付き

```bash
# 特定のコミットタイプを強制指定
aic --type feat

# スコープを追加
aic --scope auth

# コミットせずにプレビュー
aic --dry-run

# カスタムメッセージを使用（AI をスキップ）
aic -m "カスタムメッセージ"

# git hooks をスキップ
aic --no-verify

# 確認なしで自動コミット
aic --yes

# JSON で出力（CI パイプライン向け）
aic --json
```

---

## ⚙️ オプション

| オプション | 短縮形 | 説明 | デフォルト |
|-----------|--------|------|----------|
| `--type <type>` | `-t` | コミットタイプを強制指定 | 自動検出 |
| `--scope <scope>` | `-s` | コミットスコープを設定 | 自動検出 |
| `--message <msg>` | `-m` | カスタムメッセージ（AI をスキップ） | — |
| `--dry-run` | `-d` | プレビューのみ、コミットしない | `false` |
| `--no-verify` | — | git hooks をスキップ | `false` |
| `--yes` | `-y` | 確認プロンプトをスキップ | `false` |
| `--json` | — | JSON 形式で出力 | `false` |
| `--version` | `-V` | バージョンを表示 | — |
| `--help` | `-h` | ヘルプを表示 | — |

---

## 🧠 仕組み

`aic` は**ルールベースの diff 分析**を使用します——API キー不要、ネットワーク呼び出しなし、LLM 不要。実行時の流れは以下の通りです：

```
┌─────────────────────────────────────────────────────┐
│  1. ステージされた変更を読み取り (git diff --cached)  │
│  2. diff を解析 → 新規/削除/変更ファイルを検出       │
│  3. ファイル拡張子からプログラミング言語を検出        │
│  4. ファイルパターンから変更タイプを分類：            │
│     • 新規 .ts/.tsx/.js/.jsx → feat                 │
│     • テストファイル (*.test.*, __tests__/) → test   │
│     • Markdown ファイル → docs                       │
│     • package.json → chore                           │
│     • .github/ → ci                                  │
│     • バグ関連パターン → fix                          │
│     • その他 → refactor                              │
│  5. 共通ディレクトリからスコープを検出               │
│  6. 自然言語の説明を生成                              │
│  7. Conventional Commit としてフォーマット            │
│  8. 美しいターミナル UI で表示                        │
└─────────────────────────────────────────────────────┘
```

### 分類ルール

| パターン | 検出タイプ |
|---------|----------|
| 新規 `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs` ファイル | `feat` |
| `*.test.*`, `*.spec.*`, `__tests__/`, `test/`, `tests/` | `test` |
| `*.md`, `*.mdx`, `docs/`, `CHANGELOG`, `LICENSE` | `docs` |
| `package.json`, `yarn.lock`, `pnpm-lock.yaml` | `chore` |
| `.github/`, `.gitlab-ci`, `.circleci/` | `ci` |
| `*.css`, `*.scss`, `*.sass`, `*.less` | `style` |
| `webpack`, `rollup`, `vite`, `tsconfig` | `build` |
| `fix`, `bug`, `hotfix` を含むファイル名 | `fix` |
| その他 | `refactor` |

---

## 📋 Conventional Commits

`aic` は [Conventional Commits](https://www.conventionalcommits.org/) 仕様に従ってメッセージを生成します：

```
<type>[optional scope]: <description>

[optional body]
```

### タイプ

| タイプ | 使用場面 |
|--------|---------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみ |
| `style` | フォーマット、セミコロンの欠落など |
| `refactor` | バグ修正や新機能追加ではないコード変更 |
| `perf` | パフォーマンス改善 |
| `test` | テストの追加または修正 |
| `chore` | ビルドプロセスまたは補助ツール |
| `ci` | CI 設定 |
| `build` | ビルドシステムの変更 |

### 例

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

## 🔧 CI 統合

CI パイプラインで `aic` を使用して commit メッセージを自動生成：

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

### パイプライン向け JSON 出力

```bash
$ aic --json
{
  "message": "feat(auth): add OAuth2 login flow",
  "files": ["src/auth/oauth.ts", "src/auth/callback.ts"],
  "dryRun": false
}
```

---

## 🛠️ 開発

```bash
# リポジトリをクローン
git clone https://github.com/liangzhengtao/ai-commit.git
cd ai-commit

# 依存関係をインストール
npm install

# テストを実行
npm test

# ローカルで試す
node bin/cli.js
```

---

## 関連プロジェクト

| プロジェクト | 説明 |
|-------------|------|
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 本番環境対応の AI コーディングルール 20 選 |
| [**vibe-check**](https://github.com/liangzhengtao/vibe-check) | `npx vibe-check` — プロジェクトの AI 準備度をスコアリング |
| [**awesome-mcp-servers**](https://github.com/liangzhengtao/awesome-mcp-servers) | Cursor、Claude Code、Kimi Code 向け MCP サーバー |

## 🤝 コントリビューション

コントリビューションを歓迎します！ガイドラインは [CONTRIBUTING.md](CONTRIBUTING.md) をご覧ください。

```bash
# Fork & クローン後：
git checkout -b feat/my-feature
# 変更を加える...
npm test
git add .
aic  # 自分で使おう！🐕
```

---

## 📄 ライセンス

MIT © [liangzhengtao](https://github.com/liangzhengtao)

---

## ❓ よくある質問

### `aic` はコードをどこかのサーバーに送信しますか？

**いいえ。** `aic` は 100% オフラインです。すべての分析はルールベースのパターンマッチングでローカル処理されます。API キー不要、ネットワークリクエストなし、テレメトリなし。

### なぜ LLM ではなくルールベースなのか？

3 つの理由があります：
1. **高速** — 秒単位ではなくミリ秒で結果が出ます
2. **プライバシー** — コードがパソコンの外に出ることはありません
3. **信頼性** — レート制限なし、API 費用なし、ダウンタイムなし

将来のバージョンではオプションの LLM 統合を提供する可能性がありますが、ルールベースエンジンは常にデフォルトのままです。

### コミットタイプをカスタマイズできますか？

まだできませんが、ロードマップに含まれています。予定されている機能については [CHANGELOG.md](CHANGELOG.md) をご覧ください。

### git hooks と連携しますか？

はい！デフォルトでは `aic` は `git commit` を実行するため、hooks が正常に動作します。`--no-verify` でスキップできます。

### コミット前にメッセージを編集したい場合は？

それがデフォルトの動作です！`aic` がメッセージを提案した後：
- **Enter** でそのままコミット
- **E** でメッセージをインタラクティブに編集
- **C** でキャンセル

### monorepo で使えますか？

はい。`aic` はファイルパスからスコープを自動検出します。変更されたファイルがすべて `packages/auth/` にある場合、`(auth)` をスコープとして提案します。

### どのバージョンの Node.js が必要ですか？

Node.js 16 以上。

---

<div align="center">

**[⬆ トップに戻る](README.ja.md)

</div>

---
