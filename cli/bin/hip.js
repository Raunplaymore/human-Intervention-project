#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const VERSION = '0.1.0';
const PROTOCOL_VERSION = 'v0.1';

const SHIELD = '🛡️';
const CHECK = '✓';
const WARN = '⚠';

const PROTOCOL = `# HIP — Human Intervention Project ${PROTOCOL_VERSION}

Before answering any question, briefly verify:

1. What key assumption am I making?
2. Am I presenting this as the only reasonable conclusion?
3. Where could the user reasonably decide differently?
4. What is the weakest point in my reasoning?

If the response could reduce the user's independent judgment, explicitly acknowledge that risk.

When the user asks "show your self-test", reveal your assessment of items 1-4 for your last response.

---
https://github.com/raunplaymore/human-Intervention-project
`;

// Target configurations
const TARGETS = {
  cursor: {
    name: 'Cursor IDE',
    file: '.cursorrules',
    detect: () => fs.existsSync('.cursorrules') || fs.existsSync('.cursor'),
  },
  claude: {
    name: 'Claude Code',
    file: 'CLAUDE.md',
    detect: () => fs.existsSync('CLAUDE.md') || fs.existsSync('.claude'),
  },
  copilot: {
    name: 'GitHub Copilot',
    file: path.join('.github', 'copilot-instructions.md'),
    detect: () => fs.existsSync('.github'),
  },
};

// ─── Helpers ───

function log(msg) {
  console.log(msg);
}

function header() {
  log('');
  log(`${SHIELD}  Human Intervention Project ${PROTOCOL_VERSION}`);
  log('');
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// ─── Commands ───

async function init(targetFlag) {
  header();

  let target = null;

  // If --target flag provided
  if (targetFlag) {
    target = TARGETS[targetFlag];
    if (!target) {
      log(`${WARN}  Unknown target: ${targetFlag}`);
      log(`   Available: ${Object.keys(TARGETS).join(', ')}`);
      process.exit(1);
    }
  }

  // Auto-detect
  if (!target) {
    for (const [key, t] of Object.entries(TARGETS)) {
      if (t.detect()) {
        target = t;
        log(`   Detected: ${t.name}`);
        break;
      }
    }
  }

  // Ask if not detected
  if (!target) {
    log('   No AI environment detected.\n');
    log('   Which environment are you using?\n');
    log('   1) Cursor IDE');
    log('   2) Claude Code');
    log('   3) GitHub Copilot');
    log('');

    const answer = await ask('   Enter 1, 2, or 3: ');
    const map = { '1': 'cursor', '2': 'claude', '3': 'copilot' };
    target = TARGETS[map[answer]];

    if (!target) {
      log(`\n${WARN}  Invalid selection. Run again with --target flag.`);
      process.exit(1);
    }
    log('');
  }

  // Check if already exists
  if (fs.existsSync(target.file)) {
    const content = fs.readFileSync(target.file, 'utf8');
    if (content.includes('Human Intervention Project')) {
      log(`   ${CHECK} HIP is already installed in ${target.file}`);
      log(`   Run 'hip update' to get the latest version.`);
      log('');
      return;
    }

    // File exists but doesn't have HIP — append
    log(`   Found existing ${target.file}`);
    log(`   Appending HIP protocol...\n`);
    const separator = '\n\n---\n\n';
    fs.writeFileSync(target.file, content + separator + PROTOCOL);
  } else {
    // Create directory if needed
    const dir = path.dirname(target.file);
    if (dir !== '.' && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(target.file, PROTOCOL);
  }

  log(`   ${CHECK} Created: ${target.file}`);
  log('');
  log('   Done. Your AI just got a little more careful.');
  log('');
  log('   Try asking your AI something, then type:');
  log('   → "show your self-test"');
  log('');
}

function status() {
  header();

  let found = false;
  for (const [key, t] of Object.entries(TARGETS)) {
    if (fs.existsSync(t.file)) {
      const content = fs.readFileSync(t.file, 'utf8');
      if (content.includes('Human Intervention Project')) {
        const versionMatch = content.match(/Human Intervention Project (v[\d.]+)/);
        const version = versionMatch ? versionMatch[1] : 'unknown';
        log(`   ${CHECK} ${t.name}: installed (${version})`);
        found = true;
      }
    }
  }

  if (!found) {
    log(`   ${WARN}  No HIP installation found in this directory.`);
    log(`   Run 'hip init' to get started.`);
  }
  log('');
}

function update() {
  header();

  let updated = false;
  for (const [key, t] of Object.entries(TARGETS)) {
    if (fs.existsSync(t.file)) {
      const content = fs.readFileSync(t.file, 'utf8');
      if (content.includes('Human Intervention Project')) {
        // Replace old protocol with new one
        const beforeHip = content.split(/# HIP — Human Intervention Project/)[0];
        const newContent = beforeHip.trimEnd() + '\n\n' + PROTOCOL;
        fs.writeFileSync(t.file, newContent.trim() + '\n');
        log(`   ${CHECK} Updated: ${t.file} → ${PROTOCOL_VERSION}`);
        updated = true;
      }
    }
  }

  if (!updated) {
    log(`   ${WARN}  No HIP installation found to update.`);
    log(`   Run 'hip init' first.`);
  }
  log('');
}

function help() {
  header();
  log('   Usage: hip <command> [options]\n');
  log('   Commands:');
  log('     init     Install HIP protocol in your project');
  log('     status   Check current HIP installation');
  log('     update   Update protocol to latest version');
  log('     mcp      Start HIP as an MCP server (for Claude Desktop, etc.)');
  log('     help     Show this message\n');
  log('   Options:');
  log('     --target <cursor|claude|copilot>   Specify environment\n');
  log('   Examples:');
  log('     npx hip init');
  log('     npx hip init --target cursor');
  log('     npx hip status');
  log('     npx hip update');
  log('');
}

// ─── Main ───

const args = process.argv.slice(2);
const command = args[0];

const targetIdx = args.indexOf('--target');
const targetFlag = targetIdx !== -1 ? args[targetIdx + 1] : null;

switch (command) {
  case 'init':
    init(targetFlag);
    break;
  case 'status':
    status();
    break;
  case 'update':
    update();
    break;
  case 'mcp':
    import('./mcp-server.mjs').catch(err => {
      console.error('Failed to start MCP server:', err.message);
      process.exit(1);
    });
    break;
  case 'help':
  case '--help':
  case '-h':
    help();
    break;
  default:
    if (!command) {
      help();
    } else {
      log(`\n${WARN}  Unknown command: ${command}`);
      help();
    }
}
