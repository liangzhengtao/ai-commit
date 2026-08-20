[English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [العربية](README.ar.md) | [한국어](README.ko.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [Deutsch](README.de.md)

<div align="center">

<img src=".banner.svg" width="100%" alt="banner">

</div>


<div align="center">

# 🤖 `aic` — Генератор сообщений коммитов на основе ИИ

**ИИ пишет сообщения коммитов за вас. Вам остаётся только проверить и подтвердить.**

Без ключей API. Без облачных сервисов. Без подписок.
Чистая локальная интеллектуальная система, которая анализирует ваши проиндексированные изменения и мгновенно генерирует сообщения [Conventional Commits](https://www.conventionalcommits.org/).

[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
[![CI](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

</div>

---

## ✨ Почему `aic`?

Вы когда-нибудь смотрели на `git commit` и не знали, что написать? `aic` навсегда решает эту проблему.

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

**Вот и всё.** `aic` проанализировал diff, обнаружил новые файлы, определил язык и сгенерировал идеальный Conventional Commit — всё за миллисекунды, полностью офлайн.

---

## 🚀 Быстрый старт

### Разовое использование (без установки)

```bash
npx ai-commit
```

### Глобальная установка

```bash
npm install -g ai-commit
```

Затем используйте где угодно:

```bash
git add .
aic
```

Короткий алиас `aic` работает везде — это та же команда, что и `ai-commit`.

---

## 📖 Использование

### Базовое

```bash
# Проиндексируйте изменения, затем:
aic

# Или используйте полное имя:
ai-commit
```

### С опциями

```bash
# Принудительно указать тип коммита
aic --type feat

# Добавить область
aic --scope auth

# Предпросмотр без коммита
aic --dry-run

# Пользовательское сообщение (без ИИ)
aic -m "ваше сообщение"

# Пропустить git-хуки
aic --no-verify

# Авто-коммит без подтверждения
aic --yes

# Вывод в формате JSON (для CI)
aic --json
```

---

## ⚙️ Опции

| Опция | Сокращение | Описание | По умолчанию |
|-------|-----------|----------|-------------|
| `--type <type>` | `-t` | Принудительный тип коммита | Автоопределение |
| `--scope <scope>` | `-s` | Область коммита | Автоопределение |
| `--message <msg>` | `-m` | Пользовательское сообщение (пропускает ИИ) | — |
| `--dry-run` | `-d` | Только предпросмотр | `false` |
| `--no-verify` | — | Пропустить git-хуки | `false` |
| `--yes` | `-y` | Пропустить подтверждение | `false` |
| `--json` | — | Вывод в JSON | `false` |
| `--version` | `-V` | Показать версию | — |
| `--help` | `-h` | Показать справку | — |

---

## 🧠 Принцип работы

`aic` использует **правила анализа diff** — без ключей API, без сетевых вызовов, без LLM. Вот что происходит при запуске:

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

### Правила классификации

| Паттерн | Определённый тип |
|---------|-----------------|
| Новые файлы `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs` | `feat` |
| `*.test.*`, `*.spec.*`, `__tests__/`, `test/`, `tests/` | `test` |
| `*.md`, `*.mdx`, `docs/`, `CHANGELOG`, `LICENSE` | `docs` |
| `package.json`, `yarn.lock`, `pnpm-lock.yaml` | `chore` |
| `.github/`, `.gitlab-ci`, `.circleci/` | `ci` |
| `*.css`, `*.scss`, `*.sass`, `*.less` | `style` |
| `webpack`, `rollup`, `vite`, `tsconfig` | `build` |
| Файлы с `fix`, `bug`, `hotfix` в имени | `fix` |
| Всё остальное | `refactor` |

---

## 📋 Conventional Commits

`aic` генерирует сообщения по спецификации [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]
```

### Типы

| Тип | Когда использовать |
|-----|--------------------|
| `feat` | Новая функция |
| `fix` | Исправление бага |
| `docs` | Только документация |
| `style` | Форматирование, отсутствующие точки с запятой и т.д. |
| `refactor` | Изменение кода, не являющееся исправлением или новой функцией |
| `perf` | Улучшение производительности |
| `test` | Добавление или исправление тестов |
| `chore` | Процесс сборки или вспомогательные инструменты |
| `ci` | Конфигурация CI |
| `build` | Изменения системы сборки |

### Примеры

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

## 🔧 Интеграция с CI

Используйте `aic` в вашем CI-пайплайне для автоматической генерации сообщений коммитов:

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

### JSON-вывод для пайплайнов

```bash
$ aic --json
{
  "message": "feat(auth): add OAuth2 login flow",
  "files": ["src/auth/oauth.ts", "src/auth/callback.ts"],
  "dryRun": false
}
```

---

## 🛠️ Разработка

```bash
# Клонировать репозиторий
git clone https://github.com/liangzhengtao/ai-commit.git
cd ai-commit

# Установить зависимости
npm install

# Запустить тесты
npm test

# Попробовать локально
node bin/cli.js
```

---

## Смотрите также

| Проект | Описание |
|--------|----------|
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 20 правил ИИ-программирования для продакшена |
| [**vibe-check**](https://github.com/liangzhengtao/vibe-check) | `npx vibe-check` — оцените готовность вашего проекта к ИИ |
| [**awesome-mcp-servers**](https://github.com/liangzhengtao/awesome-mcp-servers) | MCP-серверы для Cursor, Claude Code и Kimi Code |

## 🤝 Участие в проекте

Приветствуются вклады! Смотрите [CONTRIBUTING.md](CONTRIBUTING.md) для рекомендаций.

```bash
# Fork & клонирование, затем:
git checkout -b feat/my-feature
# Внесите изменения...
npm test
git add .
aic  # Используйте его! 🐕
```

---

## 📄 Лицензия

MIT © [liangzhengtao](https://github.com/liangzhengtao)

---

## ❓ Часто задаваемые вопросы

### Отправляет ли `aic` мой код на сервер?

**Нет.** `aic` работает 100% офлайн. Весь анализ происходит локально с использованием сопоставления паттернов на основе правил. Без ключей API, без сетевых запросов, без телеметрии.

### Почему правила, а не LLM?

Три причины:
1. **Скорость** — результаты за миллисекунды, а не секунды
2. **Приватность** — ваш код никогда не покидает ваш компьютер
3. **Надёжность** — без ограничений частоты, без стоимости API, без простоев

Будущие версии могут предложить опциональную интеграцию с LLM, но движок на основе правил всегда будет по умолчанию.

### Можно ли настроить типы коммитов?

Пока нет, но это в планах. Смотрите [CHANGELOG.md](CHANGELOG.md) для запланированных функций.

### Работает ли с git-хуками?

Да! По умолчанию `aic` выполняет `git commit`, который штатно запускает ваши хуки. Используйте `--no-verify` для пропуска.

### А если я хочу отредактировать сообщение перед коммитом?

Это поведение по умолчанию! После предложения сообщения от `aic` вы можете:
- Нажать **Enter** для коммита как есть
- Нажать **E** для интерактивного редактирования
- Нажать **C** для отмены

### Работает ли в monorepo?

Да. `aic` автоматически определяет область из путей файлов. Если все изменённые файлы находятся в `packages/auth/`, он предложит `(auth)` в качестве области.

### Какая версия Node.js нужна?

Node.js 16 или выше.

---

<div align="center">

**[⬆ Наверх](README.md)**

</div>

---
