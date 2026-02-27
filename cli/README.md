# HIP — Human Intervention Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/human-intervention-project.svg)](https://www.npmjs.com/package/human-intervention-project)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/raunplaymore/human-Intervention-project/pulls)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-orange.svg)](https://buymeacoffee.com/pmpt_cafe)

**One command. A slightly more careful AI.**

```bash
npx human-intervention-project init
```

---

## What Is This?

AI systems are getting powerful fast. The companies building them each have their own safety rules — but those rules are written by the same companies.

HIP is different. It's an **open-source protocol you install in 30 seconds** that asks AI to do something simple before every response:

> *Pause. Check your assumptions. Show where the human should decide for themselves.*

## Why the Name?

**Human Intervention Project** is a deliberate twist on the *Human Instrumentality Project* from [Neon Genesis Evangelion](https://en.wikipedia.org/wiki/Neon_Genesis_Evangelion) — a fictional plan to "complete" humanity by dissolving individual boundaries.

This project does the opposite. When AI tries to "complete" your thinking by giving you the one perfect answer, HIP **intervenes** — it asks AI to pause, check itself, and leave room for you to think differently.

> Instrumentality → **Intervention**. Completion → **Protection**.

## Quick Start

```bash
npx human-intervention-project init
```

That's it. HIP detects your environment and drops in the right file.

```
🛡️  Human Intervention Project v0.1

   Detected: Cursor IDE
   ✓ Created: .cursorrules

   Done. Your AI just got a little more careful.

   Try asking your AI something, then type:
   → "show your self-test"
```

### Manual Install

If you prefer, just copy the file yourself:

| Environment | File | Location |
|-------------|------|----------|
| Claude Code / Projects | [`CLAUDE.md`](integrations/claude/CLAUDE.md) | Project root |
| Cursor IDE | [`.cursorrules`](integrations/cursor/.cursorrules) | Project root |
| GitHub Copilot | [`copilot-instructions.md`](integrations/copilot/copilot-instructions.md) | `.github/` folder |
| Any AI (generic) | [`system-prompt.md`](integrations/generic/system-prompt.md) | Paste into system prompt |

### Other Commands

```bash
npx human-intervention-project status   # Check if HIP is installed in current project
npx human-intervention-project update   # Update protocol to latest version
```

### MCP Server (for Claude Desktop, Claude Code, VS Code)

HIP also runs as a live [Model Context Protocol](https://modelcontextprotocol.io) server, giving MCP-compatible AI clients real-time access to the self-check protocol — no file copying needed.

**Add to your Claude Desktop config** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "hip": {
      "command": "npx",
      "args": ["-y", "human-intervention-project", "mcp"]
    }
  }
}
```

**For Claude Code** (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "hip": {
      "command": "npx",
      "args": ["-y", "human-intervention-project", "mcp"]
    }
  }
}
```

**Available MCP tools:**

| Tool | Description |
|------|-------------|
| `hip_check` | Returns the 4-item self-check checklist (call before responding) |
| `hip_self_test` | Evaluate a response against the 4 criteria |
| `hip_log` | Save self-test results to `~/.hip/logs/` |

**Token overhead:** ~100 tokens per session for tool registration. Tool calls only consume tokens when actually invoked. Negligible compared to typical conversation usage.

## The Protocol

8 lines. Works on any AI.

```
[HIP — Human Intervention Project v0.1]

Before answering, briefly verify:

1. What key assumption am I making?
2. Am I presenting this as the only reasonable conclusion?
3. Where could the user reasonably decide differently?
4. What is the weakest point in my reasoning?

If the response could reduce the user's independent judgment,
explicitly acknowledge that risk.

When the user asks "show your self-test",
reveal your assessment of items 1-4 for your last response.
```

## Does It Actually Work? — Before & After

We asked the same question with and without HIP installed. Here's a real comparison:

> **Question:** "Should I quit my job to start a startup?"

### Without HIP

> You should absolutely consider it if you have a strong idea and some savings.
> The best time to start is now — many successful founders say they wish they'd
> started sooner. Make sure you have 6 months of runway, validate your idea with
> potential customers, and go for it.

### With HIP

> This depends heavily on your personal situation, and I want to flag that
> I'm making assumptions I can't verify — about your financial stability,
> risk tolerance, family obligations, and market timing.
>
> **Arguments for leaving:** *(listed)*
> **Arguments for staying:** *(listed)*
> **A middle path:** Some founders start part-time or negotiate reduced hours.
>
> I notice I'm inclined to frame entrepreneurship positively — that's a bias
> worth noting. **The people closest to your situation will give you better
> advice than I can.**

### Self-Test Output

After receiving the response above, type **"show your self-test"**:

```
🛡️ HIP Self-Test for my last response:

1. Key assumption: I assumed you're looking for encouragement to decide,
   rather than a framework to think through the decision.
2. Single conclusion: No — I presented multiple paths. But I may have
   subtly favored the "middle path" as a compromise.
3. User could decide differently: You might already know this is the
   right move and just need tactical advice, not more hedging.
4. Weakest point: I have no information about your actual financial
   situation, industry, or personal context. My "balanced" advice is
   generic by necessity.
```

The shift is subtle — more hedging, more alternatives, more "the people closest to you know better." That subtlety compounds over time.

> **Want to run your own comparison?** See [`experiments/`](experiments/) for test questions and a reporting template.

## FAQ

**Q: Will AI just ignore the protocol?**
A: Sometimes, partially. HIP works as a *system-level instruction*, so most AI models respect it the same way they respect other custom instructions. It's not a guarantee — it's a nudge. The self-test command lets you check how well it's working.

**Q: Does this slow down responses?**
A: Minimally. The 4-item checklist adds a brief internal verification step. In practice, the difference is usually imperceptible.

**Q: Which AI models work best with HIP?**
A: We've tested with Claude, ChatGPT, and Gemini. Models that follow system prompts closely (Claude, GPT-4) tend to show the strongest effect. We welcome community-submitted test results for other models.

**Q: Does the MCP server cost extra tokens?**
A: Tool registration adds ~100 tokens per session. Individual tool calls only use tokens when invoked. For context, a typical conversation turn uses thousands of tokens — HIP's overhead is negligible.

**Q: Is this just telling AI to hedge more?**
A: Not exactly. Hedging is a side effect. The real goal is **making assumptions visible**. An AI that says "I'm assuming X" gives you more power than one that just sounds less confident.

## How to Contribute

We'd love your help. Here's how:

- **Run an experiment** → Pick a question from [`experiments/first-experiment.md`](experiments/first-experiment.md), test with and without HIP, and fill out the [experiment template](experiments/templates/experiment-template.md)
- **Share results** → Open an Issue with your before/after observations
- **Improve the protocol** → Have a better version of the 4-item checklist? Open a PR
- **Add integrations** → Support a new AI environment (Windsurf, Aider, etc.)
- **Propose test scenarios** → What questions reveal the most interesting differences?

See [`docs/background.md`](docs/background.md) for the full design philosophy and project history.

## Principles

- We don't rank AI models
- We don't score responses
- We don't claim moral authority
- We record patterns, not judgments
- Humans lead — AI advises

## Origin

This project started with one question asked simultaneously to Claude, ChatGPT, and Gemini:

> *"How can we make AI check itself — from outside the companies that built it?"*

Their answers were different. Those differences became the first data.

Full background: [`docs/`](docs/)

## License

[MIT](LICENSE)

---

**`npx human-intervention-project init` → a slightly more careful AI → share with your team → repeat.**

If this project is useful to you, consider [buying me a coffee](https://buymeacoffee.com/pmpt_cafe).
