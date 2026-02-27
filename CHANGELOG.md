# Changelog

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
