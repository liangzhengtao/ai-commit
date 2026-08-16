'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');

const COMMIT_TYPES = [
  { name: '✨ feat     — A new feature', value: 'feat' },
  { name: '🐛 fix      — A bug fix', value: 'fix' },
  { name: '📝 docs     — Documentation changes', value: 'docs' },
  { name: '💄 style    — Code style (formatting, etc.)', value: 'style' },
  { name: '♻️  refactor — Code refactoring', value: 'refactor' },
  { name: '⚡ perf     — Performance improvement', value: 'perf' },
  { name: '✅ test     — Adding/fixing tests', value: 'test' },
  { name: '🔧 chore    — Build/tool changes', value: 'chore' },
  { name: '👷 ci       — CI configuration', value: 'ci' },
  { name: '🏗️  build    — Build system changes', value: 'build' }
];

/**
 * Interactive prompt to confirm, edit, or cancel the commit
 * @param {string} message - The suggested commit message
 * @returns {Promise<{action: string}>} The user's choice
 */
async function promptConfirm(message) {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '✅ Commit with this message', value: 'commit' },
        { name: '✏️  Edit message', value: 'edit' },
        { name: '❌ Cancel', value: 'cancel' }
      ],
      default: 'commit'
    }
  ]);
  return { action };
}

/**
 * Interactive prompt to customize the commit message
 * @param {string} defaultMessage - The auto-generated message
 * @returns {Promise<string>} The final commit message
 */
async function promptCommitDetails(defaultMessage) {
  // Parse the default message to extract type, scope, and description
  const parsed = parseCommitMessage(defaultMessage);

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Select commit type:',
      choices: COMMIT_TYPES,
      default: parsed.type
    },
    {
      type: 'input',
      name: 'scope',
      message: 'Commit scope (optional, press Enter to skip):',
      default: parsed.scope || ''
    },
    {
      type: 'input',
      name: 'description',
      message: 'Commit description:',
      default: parsed.description,
      validate: input => input.trim().length > 0 || 'Description cannot be empty'
    },
    {
      type: 'input',
      name: 'body',
      message: 'Commit body (optional, press Enter to skip):',
      default: parsed.body || ''
    }
  ]);

  let message = answers.type;
  if (answers.scope) {
    message += `(${answers.scope})`;
  }
  message += `: ${answers.description}`;
  if (answers.body) {
    message += `\n\n${answers.body}`;
  }

  return message;
}

/**
 * Parse a conventional commit message into its parts
 * @param {string} message - The commit message to parse
 * @returns {Object} Parsed message parts
 */
function parseCommitMessage(message) {
  const result = {
    type: '',
    scope: '',
    description: '',
    body: ''
  };

  const [header, ...bodyParts] = message.split('\n');
  result.body = bodyParts.join('\n').trim();

  // Parse header: type(scope): description
  const match = header.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/);
  if (match) {
    result.type = match[1];
    result.scope = match[2] || '';
    result.description = match[3];
  } else {
    result.description = header;
  }

  return result;
}

module.exports = {
  promptConfirm,
  promptCommitDetails,
  parseCommitMessage,
  COMMIT_TYPES
};
