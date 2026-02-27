const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGE_PATH = path.join(ROOT_DIR, 'package.json');
const PROTOCOL_PATH = path.join(ROOT_DIR, 'templates', 'protocol.md');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readProtocol() {
  return fs.readFileSync(PROTOCOL_PATH, 'utf8').trimEnd() + '\n';
}

function parseProtocolVersion(protocolText) {
  const match = protocolText.match(/Human Intervention Project (v[\d.]+)/);
  return match ? match[1] : 'unknown';
}

const packageJson = readJson(PACKAGE_PATH);
const PROTOCOL = readProtocol();

module.exports = {
  CLI_VERSION: packageJson.version,
  PROTOCOL_VERSION: parseProtocolVersion(PROTOCOL),
  PROTOCOL,
};
