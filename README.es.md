[English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [العربية](README.ar.md) | [한국어](README.ko.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [Deutsch](README.de.md)
n<div align="center">

<img src=".banner.svg" width="100%" alt="banner">

</div>


<div align="center">

# 🤖 `aic` — Generador de mensajes de commit con IA

**La IA escribe tus mensajes de commit. Tú solo revisas y confirmas.**

Sin claves API. Sin servicios en la nube. Sin suscripciones.  
Inteligencia local que analiza tus cambios staged y genera mensajes [Conventional Commits](https://www.conventionalcommits.org/) al instante.

[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
[![CI](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

</div>

---

## ✨ ¿Por qué `aic`?

¿Alguna vez te quedaste mirando `git commit` sin saber qué escribir? `aic` acaba con eso para siempre.

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

**Eso es todo.** `aic` analizó el diff, detectó archivos nuevos, identificó el lenguaje y generó un commit Conventional perfecto — todo en milisegundos, completamente offline.

---

## 🚀 Inicio rápido

### Uso único (sin instalar)

```bash
npx ai-commit
```

### Instalación global

```bash
npm install -g ai-commit
```

Luego úsalo en cualquier lugar:

```bash
git add .
aic
```

El alias corto `aic` funciona en todas partes — es el mismo comando que `ai-commit`.

---

## 📖 Uso

### Básico

```bash
# Staging de tus cambios, luego:
aic

# O usa el nombre completo:
ai-commit
```

### Con opciones

```bash
# Forzar un tipo de commit específico
aic --type feat

# Agregar un scope
aic --scope auth

# Vista previa sin commitear
aic --dry-run

# Usar un mensaje personalizado (saltea la IA)
aic -m "tu mensaje personalizado"

# Saltar hooks de git
aic --no-verify

# Auto-commit sin confirmación
aic --yes

# Salida en JSON (para pipelines CI)
aic --json
```

---

## ⚙️ Opciones

| Opción | Abreviatura | Descripción | Por defecto |
|--------|-------------|-------------|-------------|
| `--type <type>` | `-t` | Forzar tipo de commit | Auto-detectado |
| `--scope <scope>` | `-s` | Definir scope del commit | Auto-detectado |
| `--message <msg>` | `-m` | Mensaje personalizado (saltea la IA) | — |
| `--dry-run` | `-d` | Solo vista previa, sin commit | `false` |
| `--no-verify` | — | Saltar hooks de git | `false` |
| `--yes` | `-y` | Saltar prompt de confirmación | `false` |
| `--json` | — | Salida en formato JSON | `false` |
| `--version` | `-V` | Mostrar versión | — |
| `--help` | `-h` | Mostrar ayuda | — |

---

## 🧠 Cómo funciona

`aic` utiliza **análisis de diff basado en reglas** — sin claves API, sin llamadas de red, sin LLMs. Esto es lo que sucede al ejecutarlo:

```
┌─────────────────────────────────────────────────────┐
│  1. Leer cambios staged (git diff --cached)         │
│  2. Parsear diff → detectar archivos nuevos/eliminados/modificados│
│  3. Detectar lenguajes por extensión de archivo     │
│  4. Clasificar tipo de cambio por patrones de archivo:│
│     • Nuevos .ts/.tsx/.js/.jsx → feat               │
│     • Archivos de test (*.test.*, __tests__/) → test │
│     • Archivos Markdown → docs                       │
│     • package.json → chore                           │
│     • .github/ → ci                                  │
│     • Patrones relacionados con bugs → fix           │
│     • Por defecto → refactor                         │
│  5. Detectar scope del directorio común              │
│  6. Generar descripción en lenguaje natural          │
│  7. Formatear como Conventional Commit               │
│  8. Mostrar en hermosa interfaz de terminal          │
└─────────────────────────────────────────────────────┘
```

### Reglas de clasificación

| Patrón | Tipo detectado |
|--------|---------------|
| Nuevos archivos `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs` | `feat` |
| `*.test.*`, `*.spec.*`, `__tests__/`, `test/`, `tests/` | `test` |
| `*.md`, `*.mdx`, `docs/`, `CHANGELOG`, `LICENSE` | `docs` |
| `package.json`, `yarn.lock`, `pnpm-lock.yaml` | `chore` |
| `.github/`, `.gitlab-ci`, `.circleci/` | `ci` |
| `*.css`, `*.scss`, `*.sass`, `*.less` | `style` |
| `webpack`, `rollup`, `vite`, `tsconfig` | `build` |
| Archivos con `fix`, `bug`, `hotfix` en el nombre | `fix` |
| Todo lo demás | `refactor` |

---

## 📋 Conventional Commits

`aic` genera mensajes siguiendo la especificación [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[opcional scope]: <description>

[opcional body]
```

### Tipos

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Una nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `style` | Formato, punto y coma faltantes, etc. |
| `refactor` | Cambio de código que no corrige un bug ni agrega una funcionalidad |
| `perf` | Mejora de rendimiento |
| `test` | Agregar o corregir tests |
| `chore` | Proceso de build o herramientas auxiliares |
| `ci` | Configuración CI |
| `build` | Cambios en el sistema de build |

### Ejemplos

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

## 🔧 Integración CI

Usa `aic` en tu pipeline CI para generar mensajes de commit automáticamente:

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

### Salida JSON para pipelines

```bash
$ aic --json
{
  "message": "feat(auth): add OAuth2 login flow",
  "files": ["src/auth/oauth.ts", "src/auth/callback.ts"],
  "dryRun": false
}
```

---

## 🛠️ Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/liangzhengtao/ai-commit.git
cd ai-commit

# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Probar localmente
node bin/cli.js
```

---

## Ver también

| Proyecto | Descripción |
|----------|-------------|
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 20 reglas de codificación con IA para producción |
| [**vibe-check**](https://github.com/liangzhengtao/vibe-check) | `npx vibe-check` — Evalúa la preparación de IA de tu proyecto |
| [**awesome-mcp-servers**](https://github.com/liangzhengtao/awesome-mcp-servers) | Servidores MCP para Cursor, Claude Code y Kimi Code |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para las directrices.

```bash
# Fork & clonar, luego:
git checkout -b feat/my-feature
# Hacer cambios...
npm test
git add .
aic  # ¡pruébalo! 🐕
```

---

## 📄 Licencia

MIT © [liangzhengtao](https://github.com/liangzhengtao)

---

## ❓ FAQ

### ¿`aic` envía mi código a algún servidor?

**No.** `aic` es 100% offline. Todo el análisis se hace localmente usando coincidencia de patrones basada en reglas. Sin claves API, sin peticiones de red, sin telemetría.

### ¿Por qué reglas en vez de un LLM?

Tres razones:
1. **Velocidad** — Resultados en milisegundos, no en segundos
2. **Privacidad** — Tu código nunca sale de tu máquina
3. **Fiabilidad** — Sin límites de tasa, sin costos de API, sin caídas

Versiones futuras podrían ofrecer integración LLM opcional como mejora, pero el motor basado en reglas siempre será el predeterminado.

### ¿Puedo personalizar los tipos de commit?

Todavía no, pero está en el roadmap. Ver [CHANGELOG.md](CHANGELOG.md) para las funcionalidades planificadas.

### ¿Funciona con hooks de git?

¡Sí! Por defecto, `aic` ejecuta `git commit` que dispara tus hooks normalmente. Usa `--no-verify` para saltarlos.

### ¿Qué pasa si quiero editar el mensaje antes de commitear?

¡Ese es el comportamiento por defecto! Después de que `aic` sugiere un mensaje, puedes:
- Presionar **Enter** para commitear tal cual
- Presionar **E** para editar el mensaje de forma interactiva
- Presionar **C** para cancelar

### ¿Puedo usarlo en un monorepo?

Sí. `aic` detecta automáticamente el scope de tus rutas de archivos. Si todos los archivos modificados están en `packages/auth/`, sugerirá `(auth)` como scope.

### ¿Qué versión de Node.js necesito?

Node.js 16 o superior.

---

<div align="center">

**[⬆ Volver arriba](README.es.md)

</div>

---
