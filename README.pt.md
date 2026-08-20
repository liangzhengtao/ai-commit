[English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [العربية](README.ar.md) | [한국어](README.ko.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [Deutsch](README.de.md)

<div align="center">

<img src=".banner.svg" width="100%" alt="banner">

</div>


<div align="center">

# 🤖 `aic` — Gerador de Mensagens de Commit com IA

**A IA escreve suas mensagens de commit. Você só revisa e confirma.**

Sem chaves de API. Sem serviços na nuvem. Sem assinaturas.
Inteligência puramente local que analisa suas alterações staged e gera mensagens [Conventional Commits](https://www.conventionalcommits.org/) instantaneamente.

[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
[![CI](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

</div>

---

## ✨ Por que `aic`?

Já ficou olhando para `git commit` sem saber o que escrever? `aic` acaba com isso para sempre.

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

**É isso aí.** O `aic` analisou o diff, detectou novos arquivos, identificou a linguagem e gerou um Conventional Commit perfeito — tudo em milissegundos, completamente offline.

---

## 🚀 Início Rápido

### Uso único (sem instalação)

```bash
npx ai-commit
```

### Instalação global

```bash
npm install -g ai-commit
```

Depois use em qualquer lugar:

```bash
git add .
aic
```

O atalho `aic` funciona em todo lugar — é o mesmo comando que `ai-commit`.

---

## 📖 Uso

### Básico

```bash
# Faça stage das suas alterações, depois:
aic

# Ou use o nome completo:
ai-commit
```

### Com Opções

```bash
# Forçar um tipo de commit específico
aic --type feat

# Adicionar um escopo
aic --scope auth

# Visualizar sem commitar
aic --dry-run

# Usar mensagem personalizada (ignora a IA)
aic -m "sua mensagem personalizada"

# Pular git hooks
aic --no-verify

# Auto-commit sem confirmação
aic --yes

# Saída como JSON (para pipelines CI)
aic --json
```

---

## ⚙️ Opções

| Opção | Atalho | Descrição | Padrão |
|-------|--------|-----------|--------|
| `--type <type>` | `-t` | Forçar tipo de commit | Auto-detectado |
| `--scope <scope>` | `-s` | Definir escopo do commit | Auto-detectado |
| `--message <msg>` | `-m` | Mensagem personalizada (ignora AI) | — |
| `--dry-run` | `-d` | Apenas visualizar, não commitar | `false` |
| `--no-verify` | — | Pular git hooks | `false` |
| `--yes` | `-y` | Pular prompt de confirmação | `false` |
| `--json` | — | Saída como JSON | `false` |
| `--version` | `-V` | Mostrar versão | — |
| `--help` | `-h` | Mostrar ajuda | — |

---

## 🧠 Como Funciona

O `aic` usa **análise de diff baseada em regras** — sem chaves de API, sem chamadas de rede, sem LLMs. Veja o que acontece ao executá-lo:

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

### Regras de Classificação

| Padrão | Tipo Detectado |
|--------|---------------|
| Novos arquivos `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs` | `feat` |
| `*.test.*`, `*.spec.*`, `__tests__/`, `test/`, `tests/` | `test` |
| `*.md`, `*.mdx`, `docs/`, `CHANGELOG`, `LICENSE` | `docs` |
| `package.json`, `yarn.lock`, `pnpm-lock.yaml` | `chore` |
| `.github/`, `.gitlab-ci`, `.circleci/` | `ci` |
| `*.css`, `*.scss`, `*.sass`, `*.less` | `style` |
| `webpack`, `rollup`, `vite`, `tsconfig` | `build` |
| Arquivos com `fix`, `bug`, `hotfix` no nome | `fix` |
| Todo o resto | `refactor` |

---

## 📋 Conventional Commits

O `aic` gera mensagens seguindo a especificação [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]
```

### Tipos

| Tipo | Quando Usar |
|------|-------------|
| `feat` | Uma nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `style` | Formatação, ponto e vírgula ausente, etc. |
| `refactor` | Mudança de código que não corrige bug nem adiciona funcionalidade |
| `perf` | Melhoria de desempenho |
| `test` | Adicionar ou corrigir testes |
| `chore` | Processo de build ou ferramentas auxiliares |
| `ci` | Configuração de CI |
| `build` | Alterações no sistema de build |

### Exemplos

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

## 🔧 Integração com CI

Use o `aic` no seu pipeline de CI para gerar mensagens de commit automaticamente:

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

### Saída JSON para Pipelines

```bash
$ aic --json
{
  "message": "feat(auth): add OAuth2 login flow",
  "files": ["src/auth/oauth.ts", "src/auth/callback.ts"],
  "dryRun": false
}
```

---

## 🛠️ Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/liangzhengtao/ai-commit.git
cd ai-commit

# Instale as dependências
npm install

# Execute os testes
npm test

# Experimente localmente
node bin/cli.js
```

---

## Veja Também

| Projeto | Descrição |
|---------|-----------|
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 20 regras de programação com IA para produção |
| [**vibe-check**](https://github.com/liangzhengtao/vibe-check) | `npx vibe-check` — Avalie a preparação do seu projeto para IA |
| [**awesome-mcp-servers**](https://github.com/liangzhengtao/awesome-mcp-servers) | Servidores MCP para Cursor, Claude Code e Kimi Code |

## 🤝 Contribuição

Contribuições são bem-vindas! Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes.

```bash
# Fork & clone, depois:
git checkout -b feat/my-feature
# Faça as alterações...
npm test
git add .
aic  # Use ele mesmo! 🐕
```

---

## 📄 Licença

MIT © [liangzhengtao](https://github.com/liangzhengtao)

---

## ❓ FAQ

### O `aic` envia meu código para algum servidor?

**Não.** O `aic` é 100% offline. Toda a análise acontece localmente usando correspondência de padrões baseada em regras. Sem chaves de API, sem requisições de rede, sem telemetria.

### Por que baseado em regras ao invés de um LLM?

Três razões:
1. **Velocidade** — Resultados em milissegundos, não em segundos
2. **Privacidade** — Seu código nunca sai da sua máquina
3. **Confiabilidade** — Sem limites de taxa, sem custos de API, sem quedas

Versões futuras podem oferecer integração opcional com LLM como melhoria, mas o mecanismo baseado em regras sempre será o padrão.

### Posso personalizar os tipos de commit?

Ainda não, mas está no roteiro. Veja [CHANGELOG.md](CHANGELOG.md) para funcionalidades planejadas.

### Funciona com git hooks?

Sim! Por padrão, o `aic` executa `git commit` que dispara seus hooks normalmente. Use `--no-verify` para pular.

### E se eu quiser editar a mensagem antes de commitar?

Esse é o comportamento padrão! Depois que o `aic` sugere uma mensagem, você pode:
- Pressionar **Enter** para commitar como está
- Pressionar **E** para editar a mensagem interativamente
- Pressionar **C** para cancelar

### Posso usar em um monorepo?

Sim. O `aic` detecta automaticamente o escopo dos caminhos dos seus arquivos. Se todos os arquivos alterados estiverem em `packages/auth/`, ele sugerirá `(auth)` como escopo.

### Qual versão do Node.js é necessária?

Node.js 16 ou superior.

---

<div align="center">

**[⬆ Voltar ao topo](README.md)**

</div>

---
