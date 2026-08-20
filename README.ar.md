[English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [العربية](README.ar.md) | [한국어](README.ko.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [Deutsch](README.de.md)

<div align="center">

<img src=".banner.svg" width="100%" alt="banner">

</div>


<div align="center">

# 🤖 `aic` — مولّد رسائل الارتباط بالذكاء الاصطناعي

**الذكاء الاصطناعي يكتب رسائل الارتباط لك. أنت فقط تراجع وتؤكد.**

لا حاجة لمفاتيح API. لا خدمات سحابية. لا اشتراكات.
ذكاء محلي خالص يحلل تغييراتك ويولّد رسائل [Conventional Commits](https://www.conventionalcommits.org/) فوراً.

[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
[![CI](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

</div>

---

## ✨ لماذا `aic`؟

هل سبق أن نظرت إلى `git commit` وتسألت ماذا تكتب؟ `aic` ينهي ذلك إلى الأبد.

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

**هذا كل شيء.** حلل `aic` الفرق، واكتشف الملفات الجديدة، وحدد اللغة، وولّد رسالة Conventional Commit مثالية — كل ذلك في أجزاء من الثانية، وبدون اتصال بالإنترنت.

---

## 🚀 البدء السريع

### استخدام لمرة واحدة (بدون تثبيت)

```bash
npx ai-commit
```

### التثبيت العالمي

```bash
npm install -g ai-commit
```

ثم استخدمه في أي مكان:

```bash
git add .
aic
```

الاختصار `aic` يعمل في كل مكان — إنه نفس الأمر `ai-commit`.

---

## 📖 الاستخدام

### الأساسي

```bash
# جهّز تغييراتك، ثم:
aic

# أو استخدم الاسم الكامل:
ai-commit
```

### مع الخيارات

```bash
# فرض نوع ارتباط محدد
aic --type feat

# إضافة نطاق
aic --scope auth

# معاينة بدون ارتباط
aic --dry-run

# استخدام رسالة مخصصة (يتخطى الذكاء الاصطناعي)
aic -m "رسالتك المخصصة"

# تخطي خطافات git
aic --no-verify

# ارتباط تلقائي بدون تأكيد
aic --yes

# الإخراج كـ JSON (خطوط CI)
aic --json
```

---

## ⚙️ الخيارات

| الخيار | الاختصار | الوصف | الافتراضي |
|--------|----------|-------|-----------|
| `--type <type>` | `-t` | فرض نوع الارتباط | كشف تلقائي |
| `--scope <scope>` | `-s` | تحديد نطاق الارتباط | كشف تلقائي |
| `--message <msg>` | `-m` | رسالة مخصصة (يتخطى AI) | — |
| `--dry-run` | `-d` | معاينة فقط، بدون ارتباط | `false` |
| `--no-verify` | — | تخطي خطافات git | `false` |
| `--yes` | `-y` | تخطي مطالبة التأكيد | `false` |
| `--json` | — | إخراج النتيجة كـ JSON | `false` |
| `--version` | `-V` | إظهار الإصدار | — |
| `--help` | `-h` | إظهار المساعدة | — |

---

## 🧠 كيف يعمل

يستخدم `aic` **تحليل الفروقات القائم على القواعد** — لا حاجة لمفاتيح API، لا اتصالات بالشبكة، لا نماذج LLM. إليك ما يحدث عند تشغيله:

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

### قواعد التصنيف

| النمط | النوع المكتشف |
|-------|---------------|
| ملفات `.ts`، `.tsx`، `.js`، `.jsx`، `.py`، `.go`، `.rs` الجديدة | `feat` |
| `*.test.*`، `*.spec.*`، `__tests__/`، `test/`، `tests/` | `test` |
| `*.md`، `*.mdx`، `docs/`، `CHANGELOG`، `LICENSE` | `docs` |
| `package.json`، `yarn.lock`، `pnpm-lock.yaml` | `chore` |
| `.github/`، `.gitlab-ci`، `.circleci/` | `ci` |
| `*.css`، `*.scss`، `*.sass`، `*.less` | `style` |
| `webpack`، `rollup`، `vite`، `tsconfig` | `build` |
| ملفات تحتوي `fix`، `bug`، `hotfix` في الاسم | `fix` |
| كل شيء آخر | `refactor` |

---

## 📋 Conventional Commits

يولّد `aic` رسائل وفقاً لمواصفة [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]
```

### الأنواع

| النوع | متى يُستخدم |
|-------|-------------|
| `feat` | ميزة جديدة |
| `fix` | إصلاح خطأ |
| `docs` | توثيق فقط |
| `style` | تنسيق، فواصل منقوطة مفقودة، إلخ |
| `refactor` | تغيير كود لا يُصلح خطأً ولا يُضيف ميزة |
| `perf` | تحسين الأداء |
| `test` | إضافة أو إصلاح اختبارات |
| `chore` | عملية بناء أو أدوات مساعدة |
| `ci` | إعداد CI |
| `build` | تغييرات نظام البناء |

### أمثلة

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

## 🔧 التكامل مع CI

استخدم `aic` في خط CI الخاص بك لتوليد رسائل الارتباط تلقائياً:

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

### إخراج JSON للخطوط

```bash
$ aic --json
{
  "message": "feat(auth): add OAuth2 login flow",
  "files": ["src/auth/oauth.ts", "src/auth/callback.ts"],
  "dryRun": false
}
```

---

## 🛠️ التطوير

```bash
# استنساخ المستودع
git clone https://github.com/liangzhengtao/ai-commit.git
cd ai-commit

# تثبيت التبعيات
npm install

# تشغيل الاختبارات
npm test

# جرّبه محلياً
node bin/cli.js
```

---

## انظر أيضاً

| المشروع | الوصف |
|---------|-------|
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 20 قالب قواعد برمجة ذكية |
| [**vibe-check**](https://github.com/liangzhengtao/vibe-check) | `npx vibe-check` — قيّم جاهزية مشروعك للذكاء الاصطناعي |
| [**awesome-mcp-servers**](https://github.com/liangzhengtao/awesome-mcp-servers) | خوادم MCP لـ Cursor و Claude Code و Kimi Code |

## 🤝 المساهمة

نرحب بالمساهمات! يرجى الاطلاع على [CONTRIBUTING.md](CONTRIBUTING.md) للإرشادات.

```bash
# Fork واستنسخ، ثم:
git checkout -b feat/my-feature
# أجرِ التغييرات...
npm test
git add .
aic  # جرّبه على نفسك! 🐕
```

---

## 📄 الترخيص

MIT © [liangzhengtao](https://github.com/liangzhengtao)

---

## ❓ أسئلة شائعة

### هل يرسل `aic` شيفرتي إلى أي خادم؟

**لا.** يعمل `aic` بدون اتصال بالإنترنت 100%. كل التحليل يتم محلياً باستخدام مطابقة الأنماط القائمة على القواعد. لا حاجة لمفاتيح API، لا طلبات شبكة، لا تحليلات.

### لماذا القواعد بدلاً من LLM؟

ثلاثة أسباب:
1. **السرعة** — نتائج في أجزاء من الثانية، لا ثوانٍ
2. **الخصوصية** — شيفرتك لا تغادر جهازك أبداً
3. **الموثوقية** — لا حدود للمعدل، لا تكاليف API، لا انقطاعات

قد تقدم الإصدارات المستقبلية تكاملاً اختيارياً مع LLM كتحسين، لكن محرك القواعد سيكون دائماً الافتراضي.

### هل يمكنني تخصيص أنواع الارتباط؟

ليس بعد، لكنه في خطة التطوير. انظر [CHANGELOG.md](CHANGELOG.md) للميزات المخططة.

### هل يعمل مع خطافات git؟

نعم! بشكل افتراضي، ينفذ `aic` أمر `git commit` الذي يُفعّل خطافاتك بشكل طبيعي. استخدم `--no-verify` لتخطيها.

### ماذا لو أردت تعديل الرسالة قبل الارتباط؟

هذا هو السلوك الافتراضي! بعد أن يقترح `aic` رسالة، يمكنك:
- اضغط **Enter** للارتباط كما هي
- اضغط **E** لتعديل الرسالة تفاعلياً
- اضغط **C** للإلغاء

### هل يمكن استخدامه في monorepo؟

نعم. يكتشف `aic` النطاق تلقائياً من مسارات ملفاتك. إذا كانت جميع الملفات المعدلة في `packages/auth/`، فسيقترح `(auth)` كنطاق.

### ما إصدار Node.js المطلوب؟

Node.js 16 أو أعلى.

---

<div align="center">

**[⬆ العودة للأعلى](README.md)**

</div>

---
