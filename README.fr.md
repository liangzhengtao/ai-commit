[English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md)
n<div align="center">

<img src=".banner.svg" width="100%" alt="banner">

</div>


<div align="center">

# 🤖 `aic` — Générateur de messages de commit IA

**L'IA écrit vos messages de commit. Vous n'avez qu'à valider.**

Pas de clé API. Pas de service cloud. Pas d'abonnement.  
Intelligence locale pure qui analyse vos modifications staged et génère instantanément des messages conformes aux [Conventional Commits](https://www.conventionalcommits.org/).

[![npm version](https://img.shields.io/npm/v/ai-commit.svg)](https://www.npmjs.com/package/ai-commit)
[![CI](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/liangzhengtao/ai-commit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

</div>

---

## ✨ Pourquoi `aic` ?

Vous êtes déjà resté devant `git commit` sans savoir quoi écrire ? `aic` met fin à ça pour toujours.

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

**C'est tout.** `aic` a analysé le diff, détecté les nouveaux fichiers, identifié le langage et généré un commit Conventional parfait — le tout en millisecondes, entièrement hors ligne.

---

## 🚀 Démarrage rapide

### Utilisation unique (sans installation)

```bash
npx ai-commit
```

### Installation globale

```bash
npm install -g ai-commit
```

Puis utilisez-le partout :

```bash
git add .
aic
```

L'alias court `aic` fonctionne partout — c'est la même commande que `ai-commit`.

---

## 📖 Utilisation

### Basique

```bash
# Staging de vos modifications, puis :
aic

# Ou utilisez le nom complet :
ai-commit
```

### Avec des options

```bash
# Forcer un type de commit spécifique
aic --type feat

# Ajouter un scope
aic --scope auth

# Aperçu sans commit
aic --dry-run

# Utiliser un message personnalisé (contourne l'IA)
aic -m "votre message personnalisé"

# Ignorer les hooks git
aic --no-verify

# Auto-commit sans confirmation
aic --yes

# Sortie au format JSON (pour les pipelines CI)
aic --json
```

---

## ⚙️ Options

| Option | Abréviation | Description | Défaut |
|--------|-------------|-------------|--------|
| `--type <type>` | `-t` | Forcer le type de commit | Détecté auto. |
| `--scope <scope>` | `-s` | Définir le scope du commit | Détecté auto. |
| `--message <msg>` | `-m` | Message personnalisé (ignore l'IA) | — |
| `--dry-run` | `-d` | Aperçu uniquement, pas de commit | `false` |
| `--no-verify` | — | Ignorer les hooks git | `false` |
| `--yes` | `-y` | Ignorer l'invite de confirmation | `false` |
| `--json` | — | Sortie au format JSON | `false` |
| `--version` | `-V` | Afficher la version | — |
| `--help` | `-h` | Afficher l'aide | — |

---

## 🧠 Comment ça fonctionne

`aic` utilise une **analyse de diff basée sur des règles** — pas de clé API, pas d'appels réseau, pas de LLM. Voici ce qui se passe quand vous l'exécutez :

```
┌─────────────────────────────────────────────────────┐
│  1. Lecture des modifications staged (git diff --cached)│
│  2. Analyse du diff → détection fichiers ajoutés/supprimés/modifiés│
│  3. Détection du langage via l'extension des fichiers │
│  4. Classification du type de changement selon les motifs de fichiers :│
│     • Nouveaux .ts/.tsx/.js/.jsx → feat              │
│     • Fichiers de test (*.test.*, __tests__/) → test  │
│     • Fichiers Markdown → docs                        │
│     • package.json → chore                            │
│     • .github/ → ci                                   │
│     • Motifs liés aux bugs → fix                      │
│     • Par défaut → refactor                           │
│  5. Détection du scope depuis le répertoire commun    │
│  6. Génération d'une description en langage naturel   │
│  7. Mise en forme en Conventional Commit              │
│  8. Affichage dans une belle interface terminal       │
└─────────────────────────────────────────────────────┘
```

### Règles de classification

| Motif | Type détecté |
|-------|-------------|
| Nouveaux fichiers `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs` | `feat` |
| `*.test.*`, `*.spec.*`, `__tests__/`, `test/`, `tests/` | `test` |
| `*.md`, `*.mdx`, `docs/`, `CHANGELOG`, `LICENSE` | `docs` |
| `package.json`, `yarn.lock`, `pnpm-lock.yaml` | `chore` |
| `.github/`, `.gitlab-ci`, `.circleci/` | `ci` |
| `*.css`, `*.scss`, `*.sass`, `*.less` | `style` |
| `webpack`, `rollup`, `vite`, `tsconfig` | `build` |
| Fichiers avec `fix`, `bug`, `hotfix` dans le nom | `fix` |
| Tout le reste | `refactor` |

---

## 📋 Conventional Commits

`aic` génère des messages conformes à la spécification [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>[optionnel scope]: <description>

[optionnel body]
```

### Types

| Type | Quand l'utiliser |
|------|-----------------|
| `feat` | Une nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `style` | Mise en forme, points-virgules manquants, etc. |
| `refactor` | Modification de code sans correction de bug ni ajout de fonctionnalité |
| `perf` | Amélioration des performances |
| `test` | Ajout ou correction de tests |
| `chore` | Processus de build ou outils auxiliaires |
| `ci` | Configuration CI |
| `build` | Modifications du système de build |

### Exemples

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

## 🔧 Intégration CI

Utilisez `aic` dans votre pipeline CI pour générer automatiquement les messages de commit :

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

### Sortie JSON pour les pipelines

```bash
$ aic --json
{
  "message": "feat(auth): add OAuth2 login flow",
  "files": ["src/auth/oauth.ts", "src/auth/callback.ts"],
  "dryRun": false
}
```

---

## 🛠️ Développement

```bash
# Cloner le dépôt
git clone https://github.com/liangzhengtao/ai-commit.git
cd ai-commit

# Installer les dépendances
npm install

# Lancer les tests
npm test

# Essayer localement
node bin/cli.js
```

---

## Voir aussi

| Projet | Description |
|--------|-------------|
| [**awesome-ai-rules**](https://github.com/liangzhengtao/awesome-ai-rules) | 20 règles de codage IA en production |
| [**vibe-check**](https://github.com/liangzhengtao/vibe-check) | `npx vibe-check` — Notez la préparation IA de votre projet |
| [**awesome-mcp-servers**](https://github.com/liangzhengtao/awesome-mcp-servers) | Serveurs MCP pour Cursor, Claude Code et Kimi Code |

## 🤝 Contribuer

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour les directives.

```bash
# Fork & cloner, puis :
git checkout -b feat/my-feature
# Faire des modifications...
npm test
git add .
aic  # testez-le ! 🐕
```

---

## 📄 Licence

MIT © [liangzhengtao](https://github.com/liangzhengtao)

---

## ❓ FAQ

### `aic` envoie-t-il mon code à un serveur ?

**Non.** `aic` est 100% hors ligne. Toute l'analyse se fait localement avec une correspondance de motifs basée sur des règles. Pas de clé API, pas de requêtes réseau, pas de télémétrie.

### Pourquoi des règles plutôt qu'un LLM ?

Trois raisons :
1. **Vitesse** — Résultats en millisecondes, pas en secondes
2. **Confidentialité** — Votre code ne quitte jamais votre machine
3. **Fiabilité** — Pas de limites de débit, pas de coûts API, pas de pannes

Les versions futures pourraient offrir une intégration LLM optionnelle en complément, mais le moteur basé sur des règles restera toujours par défaut.

### Puis-je personnaliser les types de commit ?

Pas encore, mais c'est prévu. Voir [CHANGELOG.md](CHANGELOG.md) pour les fonctionnalités prévues.

### Fonctionne-t-il avec les hooks git ?

Oui ! Par défaut, `aic` exécute `git commit` qui déclenche normalement vos hooks. Utilisez `--no-verify` pour les ignorer.

### Et si je veux modifier le message avant de committer ?

C'est le comportement par défaut ! Après que `aic` suggère un message, vous pouvez :
- Appuyer sur **Entrée** pour committer tel quel
- Appuyer sur **E** pour modifier le message de manière interactive
- Appuyer sur **C** pour annuler

### Puis-je l'utiliser dans un monorepo ?

Oui. `aic` détecte automatiquement le scope à partir de vos chemins de fichiers. Si tous les fichiers modifiés sont dans `packages/auth/`, il suggérera `(auth)` comme scope.

### Quelle version de Node.js est nécessaire ?

Node.js 16 ou supérieur.

---

<div align="center">

**[⬆ Retour en haut](README.fr.md)

</div>

---
