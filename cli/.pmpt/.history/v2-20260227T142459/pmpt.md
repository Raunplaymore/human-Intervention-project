# human-intervention-project

## Product Idea
HIP is an open-source protocol and CLI/MCP tool that makes AI pause, check its assumptions, and protect human judgment before every response.

## Additional Context
Existing project with established codebase.
- Project structure: templates/
- PMPT tracking path: `cli/.pmpt`

## Features
- [x] Existing project features

## Architecture Decisions
- Keep protocol text as a single source of truth in `cli/templates/protocol.md`.
- Share runtime constants (CLI version + protocol version + protocol body) via `cli/lib/core.cjs`.
- Reuse shared constants from both `cli/bin/hip.js` and `cli/bin/mcp-server.mjs` to remove drift.

## Implementation Plan
- [x] Step 1: Create shared core module and wire CLI/MCP to it.
- [ ] Step 2: Add focused tests for core loading/version parsing and command regression checks.
- [ ] Step 3: Polish docs and release prep (version sync, changelog, package verification).

## Progress
- [x] Project setup
- [x] Core features implementation
- [ ] Testing & polish

## Snapshot Log
### v1 - Initial Setup
- Project initialized with pmpt

### v2 - Architecture Finalized
- Development tracking confirmed in `cli/.pmpt`.
- Chosen architecture: single protocol source + shared core constants module for CLI/MCP.

### v3 - Step 1 Implemented
- Added `cli/lib/core.cjs` to centralize `CLI_VERSION`, `PROTOCOL_VERSION`, and `PROTOCOL`.
- Updated `cli/bin/hip.js` and `cli/bin/mcp-server.mjs` to consume shared core values.
- Updated `cli/package.json` `files` field to include `lib/` for package publishing safety.

---
*This document tracks your project progress. Update it as you build.*
*AI instructions are in `pmpt.ai.md` — paste that into your AI tool.*
