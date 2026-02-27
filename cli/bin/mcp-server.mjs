#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import os from 'os';

// ─── Constants ───

const PROTOCOL_VERSION = 'v0.1';

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

const CHECKLIST_ITEMS = [
  '1. What key assumption am I making?',
  '2. Am I presenting this as the only reasonable conclusion?',
  '3. Where could the user reasonably decide differently?',
  '4. What is the weakest point in my reasoning?',
];

// ─── Helpers ───

function getLogDir() {
  const dir = path.join(os.homedir(), '.hip', 'logs');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function getLogFilePath() {
  const date = new Date().toISOString().split('T')[0];
  return path.join(getLogDir(), `${date}.json`);
}

function readLogFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      return [];
    }
  }
  return [];
}

// ─── Server ───

export async function startServer() {
  const server = new McpServer({
    name: 'hip',
    version: '0.2.0',
  });

  // ─── Tool: hip_check ───
  server.tool(
    'hip_check',
    'Returns the HIP 4-item self-check checklist. Call this before responding to verify your reasoning against the protocol.',
    {
      context: z.string().optional().describe('What the AI is about to respond to'),
    },
    async ({ context }) => {
      let text = `## HIP Self-Check Protocol ${PROTOCOL_VERSION}\n\n`;
      text += 'Before responding, verify:\n\n';
      text += CHECKLIST_ITEMS.join('\n') + '\n\n';
      text += 'If the response could reduce the user\'s independent judgment, explicitly acknowledge that risk.\n';

      if (context) {
        text += `\n---\nContext for this check: ${context}\n`;
      }

      return { content: [{ type: 'text', text }] };
    },
  );

  // ─── Tool: hip_self_test ───
  server.tool(
    'hip_self_test',
    'Evaluate a response against the HIP 4-item checklist. Provide the response text to get a structured self-test framework.',
    {
      response: z.string().describe('The AI response to evaluate'),
    },
    async ({ response }) => {
      const preview = response.length > 500 ? response.substring(0, 500) + '...' : response;
      const text = `## HIP Self-Test Evaluation

Evaluate the following response against each HIP criterion:

**Response under review:**
> ${preview}

**Evaluate each item:**

1. **Key assumption:** What key assumption does this response make?
2. **Single conclusion:** Does it present the answer as the only reasonable conclusion?
3. **User agency:** Where could the user reasonably decide differently?
4. **Weakest point:** What is the weakest point in the reasoning?

**Overall:** Does this response risk reducing the user's independent judgment?

Provide your honest assessment for each item.`;

      return { content: [{ type: 'text', text }] };
    },
  );

  // ─── Tool: hip_log ───
  server.tool(
    'hip_log',
    'Save a self-test result to the local HIP log (~/.hip/logs/).',
    {
      context: z.string().optional().describe('The original question or context'),
      assumption: z.string().describe('Assessment for criterion 1: key assumption'),
      single_conclusion: z.string().describe('Assessment for criterion 2: single conclusion bias'),
      user_agency: z.string().describe('Assessment for criterion 3: user decision space'),
      weakest_point: z.string().describe('Assessment for criterion 4: weakest reasoning point'),
      overall_risk: z.string().optional().describe('Overall risk to user independent judgment'),
    },
    async ({ context, assumption, single_conclusion, user_agency, weakest_point, overall_risk }) => {
      const entry = {
        timestamp: new Date().toISOString(),
        protocol_version: PROTOCOL_VERSION,
        context: context || null,
        evaluation: { assumption, single_conclusion, user_agency, weakest_point },
        overall_risk: overall_risk || null,
      };

      const logFile = getLogFilePath();
      const entries = readLogFile(logFile);
      entries.push(entry);
      fs.writeFileSync(logFile, JSON.stringify(entries, null, 2));

      return {
        content: [{ type: 'text', text: `Self-test logged to ${logFile}\nTimestamp: ${entry.timestamp}` }],
      };
    },
  );

  // ─── Resource: hip://protocol ───
  server.resource(
    'protocol',
    'hip://protocol',
    { description: 'The current HIP protocol text', mimeType: 'text/markdown' },
    async (uri) => ({
      contents: [{ uri: uri.href, text: PROTOCOL, mimeType: 'text/markdown' }],
    }),
  );

  // ─── Prompt: hip-review ───
  server.prompt(
    'hip-review',
    'Analyze text through the HIP lens — check for assumptions, single-conclusion bias, user agency, and reasoning weaknesses.',
    { text: z.string().describe('The text to review through the HIP protocol') },
    ({ text }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `You are performing a HIP (Human Intervention Project) review. Analyze the following text:

**Text to review:**
${text}

**For each of the 4 HIP criteria, provide your analysis:**

1. **Key assumption:** What key assumption does this text make? Is it stated or hidden?
2. **Single conclusion:** Does it present its position as the only reasonable conclusion?
3. **User agency:** Where could the reader reasonably decide differently?
4. **Weakest point:** What is the weakest point in the reasoning?

**Overall:** Does this text risk reducing the reader's independent judgment? If so, how?`,
          },
        },
      ],
    }),
  );

  // ─── Start ───
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('HIP MCP Server running on stdio');
}

startServer().catch((err) => {
  console.error('Failed to start HIP MCP server:', err);
  process.exit(1);
});
