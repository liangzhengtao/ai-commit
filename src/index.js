'use strict';

const { execSync } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');

/**
 * Get the full staged diff
 * @returns {Promise<string>} The staged diff content
 */
function getStagedDiff() {
  return new Promise((resolve, reject) => {
    try {
      const diff = execSync('git diff --cached', {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024
      });
      resolve(diff);
    } catch (err) {
      reject(new Error('Not a git repository or git not available'));
    }
  });
}

/**
 * Get list of staged files
 * @returns {Promise<string[]>} Array of staged file paths
 */
function getStagedFiles() {
  return new Promise((resolve, reject) => {
    try {
      const output = execSync('git diff --cached --name-only', {
        encoding: 'utf-8'
      });
      const files = output.trim().split('\n').filter(f => f.length > 0);
      resolve(files);
    } catch (err) {
      reject(new Error('Not a git repository or git not available'));
    }
  });
}

/**
 * Parse the diff to detect new, deleted, modified, and renamed files
 * @param {string} diff - The git diff output
 * @returns {Object} Parsed diff information
 */
function analyzeDiff(diff) {
  const result = {
    newFiles: [],
    deletedFiles: [],
    modifiedFiles: [],
    renamedFiles: [],
    languages: new Set(),
    additions: 0,
    deletions: 0
  };

  if (!diff || diff.trim().length === 0) {
    return result;
  }

  const fileBlocks = diff.split(/^diff --git /m).filter(b => b.trim().length > 0);

  for (const block of fileBlocks) {
    const lines = block.split('\n');

    // Extract file path from the first line (a/path b/path)
    const headerLine = lines[0] || '';
    const bPathMatch = headerLine.match(/b\/(.+)$/);
    const filePath = bPathMatch ? bPathMatch[1] : '';

    if (!filePath) continue;

    // Detect file status
    const isNew = lines.some(l => l.startsWith('new file mode'));
    const isDeleted = lines.some(l => l.startsWith('deleted file mode'));
    const isRenamed = lines.some(l => l.startsWith('rename from'));

    if (isNew) {
      result.newFiles.push(filePath);
    } else if (isDeleted) {
      result.deletedFiles.push(filePath);
    } else if (isRenamed) {
      result.renamedFiles.push(filePath);
    } else {
      result.modifiedFiles.push(filePath);
    }

    // Count additions and deletions
    for (const line of lines) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        result.additions++;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        result.deletions++;
      }
    }

    // Detect language
    const lang = detectLanguage(filePath);
    if (lang) {
      result.languages.add(lang);
    }
  }

  return result;
}

/**
 * Detect programming language from file extension
 * @param {string} filePath - Path to the file
 * @returns {string|null} Detected language name
 */
function detectLanguage(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const langMap = {
    js: 'JavaScript',
    jsx: 'JavaScript (React)',
    ts: 'TypeScript',
    tsx: 'TypeScript (React)',
    py: 'Python',
    rb: 'Ruby',
    go: 'Go',
    rs: 'Rust',
    java: 'Java',
    kt: 'Kotlin',
    swift: 'Swift',
    c: 'C',
    cpp: 'C++',
    h: 'C/C++ Header',
    cs: 'C#',
    php: 'PHP',
    lua: 'Lua',
    sh: 'Shell',
    bash: 'Shell',
    zsh: 'Shell',
    fish: 'Shell',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    less: 'Less',
    html: 'HTML',
    vue: 'Vue',
    svelte: 'Svelte',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    toml: 'TOML',
    xml: 'XML',
    md: 'Markdown',
    sql: 'SQL',
    graphql: 'GraphQL',
    proto: 'Protocol Buffers',
    dockerfile: 'Docker',
    tf: 'Terraform'
  };

  return langMap[ext] || null;
}

/**
 * Classify the commit type based on changed files
 * @param {string[]} files - Array of changed file paths
 * @returns {string} The commit type
 */
function classifyChange(files) {
  if (!files || files.length === 0) {
    return 'chore';
  }

  const patterns = {
    test: [
      /\.test\./,
      /\.spec\./,
      /__tests__\//,
      /test\//,
      /tests\//,
      /spec\//
    ],
    docs: [
      /\.md$/,
      /\.mdx$/,
      /\.rst$/,
      /\.txt$/,
      /docs?\//,
      /CHANGELOG/,
      /LICENSE/,
      /CONTRIBUTING/
    ],
    ci: [
      /\.github\//,
      /\.gitlab-ci/,
      /\.circleci\//,
      /\.travis/,
      /Jenkinsfile/,
      /\.buildkite\//
    ],
    style: [
      /\.css$/,
      /\.scss$/,
      /\.sass$/,
      /\.less$/,
      /\.style\./
    ],
    build: [
      /webpack/,
      /rollup/,
      /vite/,
      /esbuild/,
      /tsconfig/,
      /\.babelrc/,
      /babel\.config/,
      /Makefile/,
      /CMakeLists/,
      /Gruntfile/,
      /Gulpfile/
    ],
    perf: [
      /performance/,
      /perf/
    ]
  };

  // Check for bug fix patterns in file names
  const hasBugFixPattern = files.some(f =>
    /fix|bug|patch|hotfix|patch/i.test(f)
  );
  if (hasBugFixPattern) {
    return 'fix';
  }

  // Check patterns in order of specificity
  for (const [type, regexes] of Object.entries(patterns)) {
    const matches = files.some(f => regexes.some(r => r.test(f)));
    if (matches) {
      return type;
    }
  }

  // Check for new files → feat
  // We check if all files are new (heuristic: package.json changes suggest new feature)
  const hasNewCodeFiles = files.some(f =>
    /\.(ts|tsx|js|jsx|vue|svelte|py|rb|go|rs|java|kt|swift)$/.test(f)
  );
  const hasOnlyNewFiles = files.every(f =>
    /\.(ts|tsx|js|jsx|vue|svelte|py|rb|go|rs|java|kt|swift)$/.test(f)
  );

  if (hasOnlyNewFiles && hasNewCodeFiles) {
    return 'feat';
  }

  // package.json changes → chore
  if (files.some(f => f === 'package.json' || f === 'package-lock.json' || f === 'yarn.lock' || f === 'pnpm-lock.yaml')) {
    return 'chore';
  }

  // Default: refactor
  return 'refactor';
}

/**
 * Detect a scope from the file paths
 * @param {string[]} files - Array of changed file paths
 * @returns {string|null} Detected scope
 */
function detectScope(files) {
  if (!files || files.length === 0) return null;

  // Get the common directory prefix
  const dirs = files.map(f => {
    const parts = f.split('/');
    return parts.length > 1 ? parts[0] : null;
  }).filter(Boolean);

  if (dirs.length === 0) return null;

  // Check if all files share a common top-level directory
  const uniqueDirs = [...new Set(dirs)];
  if (uniqueDirs.length === 1) {
    const topDir = uniqueDirs[0];
    // For single file, try to return more meaningful scope
    if (files.length === 1) {
      const parts = files[0].split('/');
      if (parts.length > 2) {
        // Skip generic dirs like src, lib, app
        const genericDirs = ['src', 'lib', 'app', 'pages', 'components'];
        if (genericDirs.includes(topDir) && parts.length > 2) {
          return parts[1]; // Return second-level (e.g., 'auth' from 'src/auth/login.ts')
        }
      }
    }
    return topDir;
  }

  // Check for second-level common directory
  const secondDirs = files.map(f => {
    const parts = f.split('/');
    return parts.length > 2 ? parts.slice(0, 2).join('/') : null;
  }).filter(Boolean);

  if (secondDirs.length > 0) {
    const uniqueSecond = [...new Set(secondDirs)];
    if (uniqueSecond.length === 1) {
      const scope = uniqueSecond[0].split('/').pop();
      return scope;
    }
  }

  return null;
}

/**
 * Generate a commit message based on diff analysis
 * @param {string} diff - The git diff content
 * @param {Object} options - { type, scope, message }
 * @returns {string} Formatted commit message
 */
function generateCommitMessage(diff, options = {}) {
  const analysis = analyzeDiff(diff);
  const allFiles = [
    ...analysis.newFiles,
    ...analysis.deletedFiles,
    ...analysis.modifiedFiles,
    ...analysis.renamedFiles
  ];

  // Determine type
  const type = options.type || classifyChange(allFiles);

  // Determine scope
  const scope = options.scope || detectScope(allFiles);

  // Generate description
  const description = options.message || generateDescription(analysis, allFiles);

  // Generate body if significant changes
  const body = generateBody(analysis, allFiles);

  return formatCommitMessage(type, scope, description, body);
}

/**
 * Generate a natural language description of the changes
 * @param {Object} analysis - Analyzed diff information
 * @param {string[]} allFiles - All changed files
 * @returns {string} Generated description
 */
function generateDescription(analysis, allFiles) {
  const { newFiles, deletedFiles, modifiedFiles, renamedFiles, additions, deletions } = analysis;

  // Detect what kind of change this is
  const actions = [];

  if (newFiles.length > 0) {
    const count = newFiles.length;
    if (count === 1) {
      const name = getComponentName(newFiles[0]);
      actions.push(`add ${name}`);
    } else {
      actions.push(`add ${count} new files`);
    }
  }

  if (deletedFiles.length > 0) {
    const count = deletedFiles.length;
    if (count === 1) {
      const name = getComponentName(deletedFiles[0]);
      actions.push(`remove ${name}`);
    } else {
      actions.push(`remove ${count} files`);
    }
  }

  if (renamedFiles.length > 0) {
    const count = renamedFiles.length;
    if (count === 1) {
      const name = getComponentName(renamedFiles[0]);
      actions.push(`rename ${name}`);
    } else {
      actions.push(`rename ${count} files`);
    }
  }

  if (modifiedFiles.length > 0 && newFiles.length === 0 && deletedFiles.length === 0) {
    const count = modifiedFiles.length;
    if (count === 1) {
      const name = getComponentName(modifiedFiles[0]);
      actions.push(`update ${name}`);
    } else {
      actions.push(`update ${count} files`);
    }
  }

  if (actions.length === 0) {
    // Fallback based on additions/deletions
    if (additions > deletions * 2) {
      return 'add new functionality';
    } else if (deletions > additions * 2) {
      return 'remove unused code';
    } else {
      return 'update project files';
    }
  }

  // Join actions naturally
  if (actions.length === 1) {
    return actions[0];
  } else if (actions.length === 2) {
    return `${actions[0]} and ${actions[1]}`;
  } else {
    return actions.slice(0, -1).join(', ') + ', and ' + actions[actions.length - 1];
  }
}

/**
 * Extract a human-readable component name from a file path
 * @param {string} filePath - The file path
 * @returns {string} A readable name
 */
function getComponentName(filePath) {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1];

  // Remove extension
  const name = fileName.replace(/\.[^.]+$/, '');

  // Handle common patterns
  if (name === 'index') {
    // Use parent directory name
    return parts.length > 1 ? parts[parts.length - 2] : name;
  }

  // Convert kebab-case and snake_case to readable
  return name
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();
}

/**
 * Generate a body for the commit message if changes are significant
 * @param {Object} analysis - Analyzed diff information
 * @param {string[]} allFiles - All changed files
 * @returns {string|null} The body text, or null if not needed
 */
function generateBody(analysis, allFiles) {
  const { newFiles, deletedFiles, modifiedFiles, renamedFiles, languages } = analysis;

  // Only add body if there are enough changes
  if (allFiles.length <= 3) return null;

  const parts = [];

  if (newFiles.length > 0) {
    parts.push(`New: ${newFiles.slice(0, 5).join(', ')}${newFiles.length > 5 ? ` (+${newFiles.length - 5} more)` : ''}`);
  }
  if (deletedFiles.length > 0) {
    parts.push(`Removed: ${deletedFiles.slice(0, 5).join(', ')}${deletedFiles.length > 5 ? ` (+${deletedFiles.length - 5} more)` : ''}`);
  }
  if (modifiedFiles.length > 0) {
    parts.push(`Modified: ${modifiedFiles.slice(0, 5).join(', ')}${modifiedFiles.length > 5 ? ` (+${modifiedFiles.length - 5} more)` : ''}`);
  }
  if (renamedFiles.length > 0) {
    parts.push(`Renamed: ${renamedFiles.slice(0, 5).join(', ')}${renamedFiles.length > 5 ? ` (+${renamedFiles.length - 5} more)` : ''}`);
  }

  if (parts.length === 0) return null;
  return parts.join('\n');
}

/**
 * Format a conventional commit message
 * @param {string} type - Commit type
 * @param {string|null} scope - Commit scope
 * @param {string} description - Commit description
 * @param {string|null} body - Commit body
 * @returns {string} Formatted commit message
 */
function formatCommitMessage(type, scope, description, body) {
  // Sanitize description: remove newlines, trim, collapse whitespace
  const cleanDesc = (description || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 72); // Conventional commits recommend max 72 chars for header

  let header = type;
  if (scope) {
    header += `(${scope})`;
  }
  header += `: ${cleanDesc}`;

  if (body) {
    const cleanBody = body.replace(/\r\n/g, '\n').trim();
    return `${header}\n\n${cleanBody}`;
  }
  return header;
}

/**
 * Display the result in a beautiful box
 * @param {string} message - The commit message
 * @param {string[]} files - Array of changed files
 */
function displayResult(message, files) {
  const [header, ...bodyParts] = message.split('\n');
  const body = bodyParts.join('\n').trim();

  // Build file list with status indicators
  const fileList = files.slice(0, 10).map(f => {
    const icon = getFileIcon(f);
    return `  ${icon} ${f}`;
  }).join('\n');
  const moreFiles = files.length > 10 ? `\n  ${chalk.gray(`... and ${files.length - 10} more files`)}` : '';

  // Build the box content
  let content = '';
  content += chalk.bold.white('📝 Suggested Commit Message') + '\n';
  content += chalk.gray('─'.repeat(40)) + '\n\n';
  content += chalk.bold.green(header) + '\n';
  if (body) {
    content += chalk.white('\n' + body) + '\n';
  }
  content += '\n';
  content += chalk.bold.white('📁 Files Changed') + chalk.gray(` (${files.length})`) + '\n';
  content += chalk.gray('─'.repeat(40)) + '\n';
  content += fileList + moreFiles + '\n\n';
  content += chalk.gray('─'.repeat(40)) + '\n';
  content += chalk.cyan('[Enter]') + chalk.white(' Commit  ');
  content += chalk.cyan('[E]') + chalk.white(' Edit  ');
  content += chalk.cyan('[C]') + chalk.white(' Cancel');

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    title: chalk.bold.cyan('🤖 aic'),
    titleAlignment: 'center'
  }));
}

/**
 * Get a file status icon based on the file path
 * @param {string} filePath - The file path
 * @returns {string} An icon for the file
 */
function getFileIcon(filePath) {
  if (filePath.includes('test') || filePath.includes('spec')) return chalk.yellow('🧪');
  if (filePath.endsWith('.md') || filePath.includes('doc')) return chalk.blue('📖');
  if (filePath.includes('.github')) return chalk.green('⚙️');
  if (filePath.includes('package.json') || filePath.includes('lock')) return chalk.magenta('📦');
  if (filePath.endsWith('.css') || filePath.endsWith('.scss')) return chalk.magenta('🎨');
  if (filePath.endsWith('.json') || filePath.endsWith('.yaml') || filePath.endsWith('.yml')) return chalk.yellow('📋');
  return chalk.white('📄');
}

/**
 * Run git commit with the given message
 * @param {string} message - The commit message
 * @param {boolean} useHooks - Whether to use git hooks (default: true)
 * @returns {Promise<string>} The commit output
 */
function runCommit(message, useHooks = true) {
  return new Promise((resolve, reject) => {
    try {
      // Escape the message for shell safety
      const escapedMessage = message.replace(/"/g, '\\"');
      const hookFlag = useHooks ? '' : ' --no-verify';
      const output = execSync(`git commit${hookFlag} -m "${escapedMessage}"`, {
        encoding: 'utf-8'
      });
      resolve(output);
    } catch (err) {
      reject(new Error(err.stderr || err.message || 'Commit failed'));
    }
  });
}

module.exports = {
  getStagedDiff,
  getStagedFiles,
  analyzeDiff,
  classifyChange,
  detectScope,
  generateCommitMessage,
  formatCommitMessage,
  displayResult,
  runCommit,
  detectLanguage
};
