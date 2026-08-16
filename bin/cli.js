#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');
const inquirer = require('inquirer');
const path = require('path');
const pkg = require('../package.json');
const {
  getStagedDiff,
  getStagedFiles,
  generateCommitMessage,
  displayResult,
  runCommit
} = require('../src/index');
const { promptCommitDetails, promptConfirm } = require('../src/prompts');

program
  .name('aic')
  .description('AI-powered git commit message generator')
  .version(pkg.version)
  .option('-t, --type <type>', 'Commit type (feat/fix/refactor/docs/test/chore/ci/perf/style/build)')
  .option('-s, --scope <scope>', 'Commit scope')
  .option('-m, --message <message>', 'Custom commit message (bypasses AI generation)')
  .option('-d, --dry-run', 'Show generated message without committing')
  .option('--no-verify', 'Skip git hooks during commit')
  .option('--json', 'Output result as JSON')
  .option('-y, --yes', 'Skip confirmation prompt')
  .addHelpText('after', `
${chalk.bold('Examples:')}
  $ ${chalk.cyan('aic')}                          # Analyze staged changes and suggest message
  $ ${chalk.cyan('aic --type feat')}               # Force commit type to feat
  $ ${chalk.cyan('aic --scope auth')}              # Set scope to auth
  $ ${chalk.cyan('aic --dry-run')}                 # Preview message without committing
  $ ${chalk.cyan('aic -m "custom message"')}       # Use custom message directly
  $ ${chalk.cyan('aic --json')}                    # Output as JSON for CI pipelines
  $ ${chalk.cyan('aic --no-verify')}               # Skip pre-commit hooks

${chalk.bold('Conventional Commits:')}
  ${chalk.yellow('feat')}       A new feature
  ${chalk.yellow('fix')}        A bug fix
  ${chalk.yellow('docs')}       Documentation only changes
  ${chalk.yellow('style')}      Code style changes (formatting, semicolons, etc.)
  ${chalk.yellow('refactor')}   Code change that neither fixes a bug nor adds a feature
  ${chalk.yellow('perf')}       A code change that improves performance
  ${chalk.yellow('test')}       Adding or correcting tests
  ${chalk.yellow('chore')}      Build process or auxiliary tool changes
  ${chalk.yellow('ci')}         CI configuration changes
  ${chalk.yellow('build')}      Changes affecting build system
`)
  .parse(process.argv);

const opts = program.opts();

async function main() {
  console.log();
  console.log(chalk.bold.cyan('  🤖 aic — AI Commit Message Generator'));
  console.log(chalk.gray('  ─────────────────────────────────────'));
  console.log();

  // Step 1: Get staged changes
  const spinner = ora('Analyzing staged changes...').start();

  let stagedDiff, stagedFiles;
  try {
    stagedDiff = await getStagedDiff();
    stagedFiles = await getStagedFiles();
  } catch (err) {
    spinner.fail(chalk.red('Failed to read staged changes'));
    console.error(chalk.red(`  Error: ${err.message}`));
    process.exit(1);
  }

  if (stagedFiles.length === 0) {
    spinner.fail(chalk.yellow('No staged changes found'));
    console.log(chalk.gray('  Run `git add <files>` first, then try again.'));
    process.exit(0);
  }

  spinner.succeed(chalk.green(`Found ${stagedFiles.length} staged file(s)`));

  // Step 2: Generate commit message
  const options = {
    type: opts.type || null,
    scope: opts.scope || null,
    message: opts.message || null
  };

  let message;
  if (opts.message) {
    message = opts.message;
  } else {
    const genSpinner = ora('Generating commit message...').start();
    message = generateCommitMessage(stagedDiff, options);
    genSpinner.succeed(chalk.green('Commit message generated'));
  }

  // Step 3: JSON output mode (skip UI)
  if (opts.json) {
    console.log(JSON.stringify({
      message,
      type: opts.type || message.split('(')[0].split(':')[0].trim(),
      scope: opts.scope || null,
      files: stagedFiles,
      dryRun: !!opts.dryRun
    }, null, 2));
    if (opts.dryRun) process.exit(0);
    return;
  }

  // Step 4: Display result (non-JSON only)
  displayResult(message, stagedFiles);

  // Step 5: Dry run mode
  if (opts.dryRun) {
    console.log(chalk.gray('  (dry run — message not committed)'));
    console.log();
    process.exit(0);
  }

  // Step 6: Interactive confirmation or auto-commit
  if (!opts.yes) {
    const { action } = await promptConfirm(message);

    if (action === 'edit') {
      const edited = await promptCommitDetails(message);
      message = edited;
    } else if (action === 'cancel') {
      console.log(chalk.yellow('  Commit cancelled.'));
      process.exit(0);
    }
  }

  // Step 7: Commit
  const commitSpinner = ora('Committing...').start();
  try {
    const result = await runCommit(message, !opts.noVerify);
    commitSpinner.succeed(chalk.green('Committed successfully!'));
    console.log();
    console.log(chalk.gray('  ' + result.trim()));
    console.log();
  } catch (err) {
    commitSpinner.fail(chalk.red('Commit failed'));
    console.error(chalk.red(`  Error: ${err.message}`));
    process.exit(1);
  }
}

main().catch(err => {
  console.error(chalk.red(`\n  Unexpected error: ${err.message}\n`));
  process.exit(1);
});
