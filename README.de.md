[English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [العربية](README.ar.md) | [한국어](README.ko.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [Deutsch](README.de.md)

<div align="center">

<img src=".banner.svg" width="100%" alt="banner">

</div>


<div align="center">

# 🤖 `aic` — KI-Commit-Message-Generator

**Die KI schreibt Ihre Commit-Nachrichten. Sie müssen nur prüfen und bestätigen.**

Keine API-Schlüssel. Keine Cloud-Dienste. Keine Abonnements.
Reine On-Device-Intelligenz, die Ihre staged Änderungen analysiert und sofort [Conventional Commits](https://www.conventionalcommits.org/) generiert.

[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
[![CI](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

</div>

---

## ✨ Warum `aic`?

Haben Sie schon einmal auf `git commit` gestarrt und gewusst, was Sie schreiben sollen? `aic` beendet das für immer.

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

**Das ist alles.** `aic` hat den Diff analysiert, neue Dateien erkannt, die Sprache identifiziert und einen perfekten Conventional Commit generiert — alles in Millisekunden, komplett offline.

---

## 🚀 Schnellstart

### Einmalige Nutzung (ohne Installation)

```bash
npx ai-commit
```

### Globale Installation

```bash
npm install -g ai-commit
```

Dann überall verwenden:

```bash
git add .
aic
```

Der Kurzalias `aic` funktioniert überall — es ist derselbe Befehl wie `ai-commit`.

---

## 📖 Verwendung

### Grundlagen

```bash
# Änderungen stagen, dann:
aic

# Oder den vollständigen Namen verwenden:
ai-commit
```

### Mit Optionen

```bash
# Bestimmten Commit-Typ erzwingen
aic --type feat

# Bereich hinzufügen
aic --scope auth

# Vorschau ohne Commit
aic --dry-run

# Benutzerdefinierte Nachricht (umgeht KI)
aic -m "Ihre benutzerdefinierte Nachricht"

# Git-Hooks überspringen
aic --no-verify

# Auto-Commit ohne Bestätigung
aic --yes

# Als JSON ausgeben (für CI-Pipelines)
aic --json
```

---

## ⚙️ Optionen

| Option | Kurz | Beschreibung | Standard |
|--------|------|-------------|----------|
| `--type <type>` | `-t` | Commit-Typ erzwingen | Auto-erkannt |
| `--scope <scope>` | `-s` | Commit-Bereich setzen | Auto-erkannt |
| `--message <msg>` | `-m` | Benutzerdefinierte Nachricht (umgeht KI) | — |
| `--dry-run` | `-d` | Nur Vorschau, kein Commit | `false` |
| `--no-verify` | — | Git-Hooks überspringen | `false` |
| `--yes` | `-y` | Bestätigungs-Prompt überspringen | `false` |
| `--json` | — | Ergebnis als JSON ausgeben | `false` |
| `--version` | `-V` | Version anzeigen | — |
| `--help` | `-h` | Hilfe anzeigen | — |

---

## 🧠 So funktioniert es

`aic` verwendet **regelbasierte Diff-Analyse** — keine API-Schlüssel, keine Netzwerkaufrufe, keine LLMs. Hier passiert beim Ausführen:

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

### Klassifizierungsregeln

| Muster | Erkannter Typ |
|--------|--------------|
| Neue `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs` Dateien | `feat` |
| `*.test.*`, `*.spec.*`, `__tests__/`, `test/`, `tests/` | `test` |
| `*.md`, `*.mdx`, `docs/`, `CHANGELOG`, `LICENSE` | `docs` |
| `package.json`, `yarn.lock`, `pnpm-lock.yaml` | `chore` |
| `.github/`, `.gitlab-ci`, `.circleci/` | `ci` |
| `*.css`, `*.scss`, `*.sass`, `*.less` | `style` |
| `webpack`, `rollup`, `vite`, `tsconfig` | `build` |
| Dateien mit `fix`, `bug`, `hotfix` im Namen | `fix` |
| Alles andere | `refactor` |

---

## 📋 Conventional Commits

`aic` generiert Nachrichten gemäß der [Conventional Commits](https://www.conventionalcommits.org/)-Spezifikation:

```
<type>[optional scope]: <description>

[optional body]
```

### Typen

| Typ | Wann verwenden |
|-----|----------------|
| `feat` | Eine neue Funktion |
| `fix` | Ein Bugfix |
| `docs` | Nur Dokumentation |
| `style` | Formatierung, fehlende Semikolons usw. |
| `refactor` | Code-Änderung, die weder Bugfix noch Feature ist |
| `perf` | Performance-Verbesserung |
| `test` | Tests hinzufügen oder reparieren |
| `chore` | Build-Prozess oder Hilfstools |
| `ci` | CI-Konfiguration |
| `build` | Änderungen am Build-System |

### Beispiele

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

## 🔧 CI-Integration

Verwenden Sie `aic` in Ihrer CI-Pipeline, um Commit-Nachrichten automatisch zu generieren:

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

### JSON-Ausgabe für Pipelines

```bash
$ aic --json
{
  "message": "feat(auth): add OAuth2 login flow",
  "files": ["src/auth/oauth.ts", "src/auth/callback.ts"],
  "dryRun": false
}
```

---

## 🛠️ Entwicklung

```bash
# Repository klonen
git clone https://github.com/liangzhengtao/ai-commit.git
cd ai-commit

# Abhängigkeiten installieren
npm install

# Tests ausführen
npm test

# Lokal ausprobieren
node bin/cli.js
```

---

## Siehe auch

| Projekt | Beschreibung |
|---------|-------------|
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 20 KI-Programmierregeln für die Produktion |
| [**vibe-check**](https://github.com/liangzhengtao/vibe-check) | `npx vibe-check` — Bewerten Sie die KI-Bereitschaft Ihres Projekts |
| [**awesome-mcp-servers**](https://github.com/liangzhengtao/awesome-mcp-servers) | MCP-Server für Cursor, Claude Code und Kimi Code |

## 🤝 Mitwirken

Beiträge sind willkommen! Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Richtlinien.

```bash
# Fork & Klonen, dann:
git checkout -b feat/my-feature
# Änderungen vornehmen...
npm test
git add .
aic  # Dogfooding! 🐕
```

---

## 📄 Lizenz

MIT © [liangzhengtao](https://github.com/liangzhengtao)

---

## ❓ FAQ

### Sendet `aic` meinen Code an einen Server?

**Nein.** `aic` ist zu 100% offline. Die gesamte Analyse erfolgt lokal mittels regelbasierter Mustererkennung. Keine API-Schlüssel, keine Netzwerkanfragen, keine Telemetrie.

### Warum regelbasiert statt eines LLM?

Drei Gründe:
1. **Geschwindigkeit** — Ergebnisse in Millisekunden, nicht Sekunden
2. **Datenschutz** — Ihr Code verlässt niemals Ihren Computer
3. **Zuverlässigkeit** — Keine Rate-Limits, keine API-Kosten, keine Ausfälle

Zukünftige Versionen können optionale LLM-Integration als Verbesserung bieten, aber die regelbasierte Engine wird immer der Standard sein.

### Kann ich die Commit-Typen anpassen?

Noch nicht, aber es ist auf der Roadmap. Siehe [CHANGELOG.md](CHANGELOG.md) für geplante Funktionen.

### Funktioniert es mit Git-Hooks?

Ja! Standardmäßig führt `aic` `git commit` aus, das Ihre Hooks normal auslöst. Verwenden Sie `--no-verify`, um sie zu überspringen.

### Was, wenn ich die Nachricht vor dem Commit bearbeiten möchte?

Das ist das Standardverhalten! Nachdem `aic` eine Nachricht vorschlägt, können Sie:
- **Enter** drücken, um wie vorgeschlagen zu committen
- **E** drücken, um die Nachricht interaktiv zu bearbeiten
- **C** drücken, um abzubrechen

### Funktioniert es in einem Monorepo?

Ja. `aic` erkennt automatisch den Bereich aus Ihren Dateipfaden. Wenn alle geänderten Dateien in `packages/auth/` liegen, wird es `(auth)` als Bereich vorschlagen.

### Welche Node.js-Version wird benötigt?

Node.js 16 oder höher.

---

<div align="center">

**[⬆ Nach oben](README.md)**

</div>

---
