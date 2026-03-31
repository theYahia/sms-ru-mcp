#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { sendSmsSchema, handleSendSms, checkStatusSchema, handleCheckStatus, getBalanceSchema, handleGetBalance } from "./tools/sms.js";

const server = new McpServer({
  name: "sms-ru-mcp",
  version: "1.0.0",
});

server.tool(
  "send_sms",
  "Отправить SMS через SMS.RU.",
  sendSmsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleSendSms(params) }] }),
);

server.tool(
  "check_status",
  "Проверить статус отправленного SMS.",
  checkStatusSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCheckStatus(params) }] }),
);

server.tool(
  "get_balance",
  "Проверить баланс аккаунта SMS.RU.",
  getBalanceSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetBalance(params) }] }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[sms-ru-mcp] Сервер запущен. 3 инструмента. Требуется SMS_RU_API_ID.");
}

main().catch((error) => {
  console.error("[sms-ru-mcp] Ошибка:", error);
  process.exit(1);
});
