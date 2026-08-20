[English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [العربية](README.ar.md) | [한국어](README.ko.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [Deutsch](README.de.md)

<div align="center">

<img src=".banner.svg" width="100%" alt="banner">

</div>


<div align="center">

# 🤖 `aic` — AI 커밋 메시지 생성기

**AI가 커밋 메시지를 작성합니다. 여러분은 검토하고 확인만 하세요.**

API 키 불필요. 클라우드 서비스 불필요. 구독 불필요.
스테이징된 변경 사항을 분석하여 [Conventional Commits](https://www.conventionalcommits.org/) 메시지를 즉시 생성하는 순수 온디바이스 인텔리전스입니다.

[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
[![CI](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

</div>

---

## ✨ `aic`를 써야 하는 이유

`git commit` 앞에서 뭘 써야 할지 고민한 적 있으신가요? `aic`가 그 문제를 영원히 해결합니다.

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

**이게 전부입니다.** `aic`는 diff를 분석하고, 새 파일을 감지하고, 언어를 식별하고, 완벽한 Conventional Commit을 생성합니다 — 모두 밀리초 단위로, 완전 오프라인에서.

---

## 🚀 빠른 시작

### 일회성 사용 (설치 없이)

```bash
npx ai-commit
```

### 전역 설치

```bash
npm install -g ai-commit
```

어디서든 사용:

```bash
git add .
aic
```

짧은 별칭 `aic`는 어디서든 작동합니다 — `ai-commit`와 동일한 명령어입니다.

---

## 📖 사용법

### 기본

```bash
# 변경 사항을 스테이징한 후:
aic

# 또는 전체 이름 사용:
ai-commit
```

### 옵션과 함께 사용

```bash
# 특정 커밋 타입 강제 지정
aic --type feat

# 범위 추가
aic --scope auth

# 커밋 없이 미리보기
aic --dry-run

# 커스텀 메시지 사용 (AI 우회)
aic -m "커스텀 메시지"

# git 훅 건너뛰기
aic --no-verify

# 확인 없이 자동 커밋
aic --yes

# JSON으로 출력 (CI 파이프라인용)
aic --json
```

---

## ⚙️ 옵션

| 옵션 | 단축 | 설명 | 기본값 |
|------|------|------|--------|
| `--type <type>` | `-t` | 커밋 타입 강제 지정 | 자동 감지 |
| `--scope <scope>` | `-s` | 커밋 범위 설정 | 자동 감지 |
| `--message <msg>` | `-m` | 커스텀 메시지 (AI 건너뜀) | — |
| `--dry-run` | `-d` | 미리보기만, 커밋 안 함 | `false` |
| `--no-verify` | — | git 훅 건너뛰기 | `false` |
| `--yes` | `-y` | 확인 프롬프트 건너뛰기 | `false` |
| `--json` | — | 결과를 JSON으로 출력 | `false` |
| `--version` | `-V` | 버전 표시 | — |
| `--help` | `-h` | 도움말 표시 | — |

---

## 🧠 작동 방식

`aic`는 **규칙 기반 diff 분석**을 사용합니다 — API 키, 네트워크 호출, LLM이 필요 없습니다. 실행 시 일어나는 일:

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

### 분류 규칙

| 패턴 | 감지된 타입 |
|------|------------|
| 새 `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs` 파일 | `feat` |
| `*.test.*`, `*.spec.*`, `__tests__/`, `test/`, `tests/` | `test` |
| `*.md`, `*.mdx`, `docs/`, `CHANGELOG`, `LICENSE` | `docs` |
| `package.json`, `yarn.lock`, `pnpm-lock.yaml` | `chore` |
| `.github/`, `.gitlab-ci`, `.circleci/` | `ci` |
| `*.css`, `*.scss`, `*.sass`, `*.less` | `style` |
| `webpack`, `rollup`, `vite`, `tsconfig` | `build` |
| 이름에 `fix`, `bug`, `hotfix`가 포함된 파일 | `fix` |
| 기타 모든 것 | `refactor` |

---

## 📋 Conventional Commits

`aic`는 [Conventional Commits](https://www.conventionalcommits.org/) 사양에 따라 메시지를 생성합니다:

```
<type>[optional scope]: <description>

[optional body]
```

### 타입

| 타입 | 사용 시점 |
|------|----------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서만 변경 |
| `style` | 포맷팅, 세미콜론 누락 등 |
| `refactor` | 버그 수정이나 기능 추가가 아닌 코드 변경 |
| `perf` | 성능 개선 |
| `test` | 테스트 추가 또는 수정 |
| `chore` | 빌드 프로세스 또는 보조 도구 |
| `ci` | CI 설정 |
| `build` | 빌드 시스템 변경 |

### 예시

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

## 🔧 CI 통합

CI 파이프라인에서 `aic`를 사용하여 커밋 메시지를 자동 생성:

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

### 파이프라인용 JSON 출력

```bash
$ aic --json
{
  "message": "feat(auth): add OAuth2 login flow",
  "files": ["src/auth/oauth.ts", "src/auth/callback.ts"],
  "dryRun": false
}
```

---

## 🛠️ 개발

```bash
# 저장소 클론
git clone https://github.com/liangzhengtao/ai-commit.git
cd ai-commit

# 의존성 설치
npm install

# 테스트 실행
npm test

# 로컬에서 사용해보기
node bin/cli.js
```

---

## 관련 프로젝트

| 프로젝트 | 설명 |
|---------|------|
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 20개 프로덕션 AI 코딩 규칙 |
| [**vibe-check**](https://github.com/liangzhengtao/vibe-check) | `npx vibe-check` — 프로젝트의 AI 준비도 평가 |
| [**awesome-mcp-servers**](https://github.com/liangzhengtao/awesome-mcp-servers) | Cursor, Claude Code, Kimi Code용 MCP 서버 |

## 🤝 기여하기

기여를 환영합니다! 가이드라인은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참조하세요.

```bash
# Fork & clone, 그 다음:
git checkout -b feat/my-feature
# 변경 사항 작성...
npm test
git add .
aic  # 직접 사용해보세요! 🐕
```

---

## 📄 라이선스

MIT © [liangzhengtao](https://github.com/liangzhengtao)

---

## ❓ FAQ

### `aic`가 제 코드를 서버로 전송하나요?

**아닙니다.** `aic`는 100% 오프라인입니다. 모든 분석은 규칙 기반 패턴 매칭으로 로컬에서 이루어집니다. API 키, 네트워크 요청, 원격 측정이 없습니다.

### LLM 대신 규칙 기반을 사용하는 이유는?

세 가지 이유:
1. **속도** — 초가 아닌 밀리초 단위로 결과 반환
2. **개인정보** — 코드가 사용자의 기기를 떠나지 않음
3. **안정성** — 속도 제한, API 비용, 중단 없음

향후 버전에서는 선택적 LLM 통합이 제공될 수 있지만, 규칙 기반 엔진은 항상 기본값입니다.

### 커밋 타입을 커스터마이징할 수 있나요?

아직은 아니지만 로드맵에 있습니다. 계획된 기능은 [CHANGELOG.md](CHANGELOG.md)를 참조하세요.

### git 훅과 함께 작동하나요?

네! 기본적으로 `aic`는 `git commit`를 실행하며, 이는 훅을 정상적으로 트리거합니다. `--no-verify`로 건너뛸 수 있습니다.

### 커밋 전에 메시지를 편집하고 싶으면요?

그게 기본 동작입니다! `aic`가 메시지를 제안한 후:
- **Enter**를 누르면 그대로 커밋
- **E**를 누르면 메시지를 대화형으로 편집
- **C**를 누르면 취소

### monorepo에서 사용할 수 있나요?

네. `aic`는 파일 경로에서 범위를 자동 감지합니다. 변경된 파일이 모두 `packages/auth/`에 있으면 `(auth)`를 범위로 제안합니다.

### 필요한 Node.js 버전은?

Node.js 16 이상.

---

<div align="center">

**[⬆ 맨 위로 돌아가기](README.md)**

</div>

---
