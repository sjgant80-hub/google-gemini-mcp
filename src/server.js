#!/usr/bin/env node
/**
 * google-gemini-mcp · MCP server for Google Gemini
 * Auto-generated wrapping 0 tools from OpenAPI.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { GoogleGemini } from '@ai-native-solutions/google-gemini-sdk';

const TOOLS = [];

const server = new Server({ name: 'google-gemini-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

const client = new GoogleGemini({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const method = req.params.name.replace('google-gemini_', '');
  if (typeof client[method] !== 'function') throw new Error('unknown tool: ' + req.params.name);
  const result = await client[method](req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

await server.connect(new StdioServerTransport());
console.error('google-gemini-mcp v1.0.0 · 0 tools ready');
