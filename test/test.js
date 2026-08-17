'use strict';

const assert = require('assert');

// Import modules under test
const {
  analyzeDiff,
  classifyChange,
  formatCommitMessage,
  detectScope,
  detectLanguage,
  generateCommitMessage
} = require('../src/index');
const { parseCommitMessage } = require('../src/prompts');

let passed = 0;
let failed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
  } catch (err) {
    failed++;
    console.log(`  \x1b[31m✗\x1b[0m ${name}`);
    console.log(`    ${err.message}`);
  }
}

function assertDeepEqual(actual, expected, msg) {
  assert.deepStrictEqual(actual, expected, msg || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function assertEqual(actual, expected, msg) {
  assert.strictEqual(actual, expected, msg || `Expected "${expected}", got "${actual}"`);
}

function assertTrue(value, msg) {
  assert.ok(value, msg || `Expected truthy value, got ${value}`);
}

console.log('\n\x1b[1mRunning ai-commit tests...\x1b[0m\n');

// ═══════════════════════════════════════════════════════════════
// Test Group: analyzeDiff
// ═══════════════════════════════════════════════════════════════
console.log('\x1b[1m  analyzeDiff\x1b[0m');

const sampleDiff = `diff --git a/src/auth/oauth.ts b/src/auth/oauth.ts
new file mode 100644
index 0000000..abc1234
--- /dev/null
+++ b/src/auth/oauth.ts
@@ -0,0 +1,15 @@
+import { Router } from 'express';
+
+export function oauthRoutes(): Router {
+  const router = Router();
+  router.get('/login', (req, res) => {
+    res.redirect('/oauth/authorize');
+  });
+  return router;
+}
diff --git a/README.md b/README.md
index 1111111..2222222 100644
--- a/README.md
+++ b/README.md
@@ -1,3 +1,5 @@
 # My Project
 
+## Installation
+
+Run npm install
`;

test('should detect new files in diff', () => {
  const result = analyzeDiff(sampleDiff);
  assertTrue(result.newFiles.includes('src/auth/oauth.ts'), 'Should detect oauth.ts as new');
});

test('should detect modified files in diff', () => {
  const result = analyzeDiff(sampleDiff);
  assertTrue(result.modifiedFiles.includes('README.md'), 'Should detect README.md as modified');
});

test('should count additions and deletions', () => {
  const result = analyzeDiff(sampleDiff);
  assertTrue(result.additions > 0, 'Should have additions');
  assertTrue(typeof result.deletions === 'number', 'Should have a deletions count');
});

test('should detect languages from file extensions', () => {
  const result = analyzeDiff(sampleDiff);
  assertTrue(result.languages.has('TypeScript'), 'Should detect TypeScript');
  assertTrue(result.languages.has('Markdown'), 'Should detect Markdown');
});

test('should handle empty diff', () => {
  const result = analyzeDiff('');
  assertDeepEqual(result.newFiles, [], 'Should have no new files');
  assertDeepEqual(result.deletedFiles, [], 'Should have no deleted files');
  assertDeepEqual(result.modifiedFiles, [], 'Should have no modified files');
  assertEqual(result.additions, 0, 'Should have zero additions');
});

test('should detect deleted files', () => {
  const delDiff = `diff --git a/src/old.ts b/src/old.ts
deleted file mode 100644
index abc1234..0000000
--- a/src/old.ts
+++ /dev/null
@@ -1,3 +0,0 @@
-export function old() {
-  return true;
-}`;
  const result = analyzeDiff(delDiff);
  assertTrue(result.deletedFiles.includes('src/old.ts'), 'Should detect deleted file');
});

test('should detect renamed files', () => {
  const renameDiff = `diff --git a/src/old-name.ts b/src/new-name.ts
similarity index 95%
rename from src/old-name.ts
rename to src/new-name.ts
index abc1234..def5678 100644
--- a/src/old-name.ts
+++ b/src/new-name.ts
@@ -1 +1 @@
-old content
+new content`;
  const result = analyzeDiff(renameDiff);
  assertTrue(result.renamedFiles.includes('src/new-name.ts'), 'Should detect renamed file');
});

// ═══════════════════════════════════════════════════════════════
// Test Group: classifyChange
// ═══════════════════════════════════════════════════════════════
console.log('\n\x1b[1m  classifyChange\x1b[0m');

test('should classify new TS/JS files as feat', () => {
  const files = ['src/components/Button.tsx', 'src/utils/helpers.ts'];
  assertEqual(classifyChange(files), 'feat');
});

test('should classify new JSX files as feat', () => {
  const files = ['src/App.jsx'];
  assertEqual(classifyChange(files), 'feat');
});

test('should classify test files as test', () => {
  const files = ['src/auth.test.ts', 'src/utils.spec.js'];
  assertEqual(classifyChange(files), 'test');
});

test('should classify test directory files as test', () => {
  const files = ['test/auth.js', 'tests/utils.ts'];
  assertEqual(classifyChange(files), 'test');
});

test('should classify markdown files as docs', () => {
  const files = ['README.md', 'docs/guide.md'];
  assertEqual(classifyChange(files), 'docs');
});

test('should classify package.json changes as chore', () => {
  const files = ['package.json'];
  assertEqual(classifyChange(files), 'chore');
});

test('should classify lock file changes as chore', () => {
  const files = ['package-lock.json'];
  assertEqual(classifyChange(files), 'chore');
});

test('should classify GitHub workflow files as ci', () => {
  const files = ['.github/workflows/ci.yml'];
  assertEqual(classifyChange(files), 'ci');
});

test('should classify CSS files as style', () => {
  const files = ['src/styles/main.css', 'src/theme.scss'];
  assertEqual(classifyChange(files), 'style');
});

test('should classify build config files as build', () => {
  const files = ['webpack.config.js'];
  assertEqual(classifyChange(files), 'build');
});

test('should default to refactor for mixed changes', () => {
  const files = ['src/utils/helper.js', 'src/lib/core.js'];
  // When all files are code files with no test/docs pattern → feat
  // But if mixed with non-code, it should be refactor
  const result = classifyChange(['src/data.json', 'src/config.yaml']);
  assertEqual(result, 'refactor');
});

test('should return chore for empty file list', () => {
  assertEqual(classifyChange([]), 'chore');
});

test('should classify files with "fix" in name as fix', () => {
  const files = ['src/bugfix-login.ts'];
  assertEqual(classifyChange(files), 'fix');
});

// ═══════════════════════════════════════════════════════════════
// Test Group: formatCommitMessage
// ═══════════════════════════════════════════════════════════════
console.log('\n\x1b[1m  formatCommitMessage\x1b[0m');

test('should format type and description', () => {
  const msg = formatCommitMessage('feat', null, 'add login page');
  assertEqual(msg, 'feat: add login page');
});

test('should format with scope', () => {
  const msg = formatCommitMessage('fix', 'auth', 'resolve token expiry');
  assertEqual(msg, 'fix(auth): resolve token expiry');
});

test('should format with body', () => {
  const msg = formatCommitMessage('feat', 'api', 'add endpoint', 'Added GET /users endpoint');
  assertTrue(msg.startsWith('feat(api): add endpoint'), 'Should start with header');
  assertTrue(msg.includes('Added GET /users endpoint'), 'Should include body');
  assertTrue(msg.includes('\n\n'), 'Should have blank line between header and body');
});

test('should format without body when null', () => {
  const msg = formatCommitMessage('docs', null, 'update README');
  assertEqual(msg, 'docs: update README');
  assertFalse(msg.includes('\n\n'), 'Should not have blank line without body');
});

// ═══════════════════════════════════════════════════════════════
// Test Group: detectScope
// ═══════════════════════════════════════════════════════════════
console.log('\n\x1b[1m  detectScope\x1b[0m');

test('should detect scope from common directory', () => {
  const files = ['src/auth/login.ts', 'src/auth/callback.ts'];
  assertEqual(detectScope(files), 'src');
});

test('should return null for files in different directories', () => {
  const files = ['src/a.ts', 'lib/b.ts', 'test/c.ts'];
  assertEqual(detectScope(files), null);
});

test('should return null for root-level files', () => {
  const files = ['package.json', 'tsconfig.json'];
  assertEqual(detectScope(files), null);
});

// ═══════════════════════════════════════════════════════════════
// Test Group: detectLanguage
// ═══════════════════════════════════════════════════════════════
console.log('\n\x1b[1m  detectLanguage\x1b[0m');

test('should detect TypeScript', () => assertEqual(detectLanguage('app.ts'), 'TypeScript'));
test('should detect JavaScript', () => assertEqual(detectLanguage('app.js'), 'JavaScript'));
test('should detect Python', () => assertEqual(detectLanguage('main.py'), 'Python'));
test('should detect Rust', () => assertEqual(detectLanguage('lib.rs'), 'Rust'));
test('should detect Go', () => assertEqual(detectLanguage('main.go'), 'Go'));
test('should return null for unknown extensions', () => assertEqual(detectLanguage('data.xyz'), null));

// ═══════════════════════════════════════════════════════════════
// Test Group: parseCommitMessage (from prompts.js)
// ═══════════════════════════════════════════════════════════════
console.log('\n\x1b[1m  parseCommitMessage\x1b[0m');

test('should parse type, scope, and description', () => {
  const result = parseCommitMessage('feat(auth): add OAuth2 login');
  assertEqual(result.type, 'feat');
  assertEqual(result.scope, 'auth');
  assertEqual(result.description, 'add OAuth2 login');
});

test('should parse message without scope', () => {
  const result = parseCommitMessage('docs: update README');
  assertEqual(result.type, 'docs');
  assertEqual(result.scope, '');
  assertEqual(result.description, 'update README');
});

test('should parse message with body', () => {
  const result = parseCommitMessage('feat: add endpoint\n\nAdded GET /users endpoint');
  assertEqual(result.type, 'feat');
  assertEqual(result.description, 'add endpoint');
  assertEqual(result.body, 'Added GET /users endpoint');
});

test('should handle malformed message gracefully', () => {
  const result = parseCommitMessage('just a plain message');
  assertEqual(result.description, 'just a plain message');
});

// ═══════════════════════════════════════════════════════════════
// Test Group: generateCommitMessage (integration)
// ═══════════════════════════════════════════════════════════════
console.log('\n\x1b[1m  generateCommitMessage\x1b[0m');

test('should generate a valid conventional commit from diff', () => {
  const diff = `diff --git a/src/utils.ts b/src/utils.ts
new file mode 100644
--- /dev/null
+++ b/src/utils.ts
@@ -0,0 +1,3 @@
+export function hello() {
+  return 'world';
+}`;
  const msg = generateCommitMessage(diff);
  assertTrue(msg.match(/^\w+(\(.+\))?:\s+.+$/), `Should be valid conventional commit: "${msg}"`);
});

test('should respect provided type option', () => {
  const diff = `diff --git a/test/a.ts b/test/a.ts
new file mode 100644
--- /dev/null
+++ b/test/a.ts
@@ -0,0 +1 @@
+export const a = 1;`;
  const msg = generateCommitMessage(diff, { type: 'feat' });
  assertTrue(msg.startsWith('feat'), `Should start with feat: "${msg}"`);
});

test('should respect provided scope option', () => {
  const diff = `diff --git a/src/a.ts b/src/a.ts
new file mode 100644
--- /dev/null
+++ b/src/a.ts
@@ -0,0 +1 @@
+export const a = 1;`;
  const msg = generateCommitMessage(diff, { scope: 'core' });
  assertTrue(msg.includes('(core)'), `Should include scope: "${msg}"`);
});

// ═══════════════════════════════════════════════════════════════
// Helper: assertFalse (since Node assert doesn't have it)
// ═══════════════════════════════════════════════════════════════
function assertFalse(value, msg) {
  assert.ok(!value, msg || `Expected falsy value, got ${value}`);
}

// ═══════════════════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(50));
if (failed === 0) {
  console.log(`\x1b[32m\x1b[1m  ✓ ${passed}/${total} tests passed\x1b[0m\n`);
  process.exit(0);
} else {
  console.log(`\x1b[31m\x1b[1m  ✗ ${failed}/${total} tests failed\x1b[0m\n`);
  process.exit(1);
}
// test change
