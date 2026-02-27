# Changelog

## v0.2.0 (2026-02-27)

### MCP Server
- `npx human-intervention-project mcp` starts an MCP server
- Tools: `hip_check`, `hip_self_test`, `hip_log`
- Resource: `hip://protocol`
- Prompt template: `hip-review`
- Logs self-test results to `~/.hip/logs/` as date-stamped JSON
- Zero-config setup for Claude Desktop, Claude Code, VS Code
- Uses stdio transport (standard for local MCP servers)

### Dependencies
- Added `@modelcontextprotocol/sdk` (^1.27.1)
- Added `zod` (^3.24.0)

## v0.1.0 (2026-02-26)

### 🚀 Initial Release
- Core protocol: 4-item self-test checklist
- User trigger: "show your self-test"
- CLI tool: `npx hip init` with auto-detection
- Integration files for Claude, Cursor, GitHub Copilot
- Generic system prompt template
- Experiment framework with before/after comparison
- First experiment question sets

### Design Decisions
- Protocol kept under 10 lines for maximum adoption
- CLI auto-detects environment, appends to existing config files
- No ranking, no scoring — pattern recording only
- Named after Evangelion's Human Instrumentality Project (but reversed)
