#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  sendSmsSchema, handleSendSms,
  checkStatusSchema, handleCheckStatus,
  getBalanceSchema, handleGetBalance,
  getCostSchema, handleGetCost,
  getSendersSchema, handleGetSenders,
} from "./tools/sms.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "sms-ru-mcp",
    version: "1.1.0",
  });

  server.tool(
    "send_sms",
    "Отправить SMS через SMS.RU. Принимает номер (79XXXXXXXXX), текст, опционально имя отправителя.",
    sendSmsSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleSendSms(params) }] }),
  );

  server.tool(
    "check_status",
    "Проверить статус отправленного SMS по его ID.",
    checkStatusSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleCheckStatus(params) }] }),
  );

  server.tool(
    "get_balance",
    "Проверить баланс аккаунта SMS.RU.",
    getBalanceSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetBalance(params) }] }),
  );

  server.tool(
    "get_cost",
    "Рассчитать стоимость SMS до отправки. Принимает номер и текст сообщения.",
    getCostSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetCost(params) }] }),
  );

  server.tool(
    "get_senders",
    "Получить список одобренных имён отправителей на аккаунте SMS.RU.",
    getSendersSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetSenders(params) }] }),
  );

  return server;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--http")) {
    const { StreamableHTTPServerTransport } = await import(
      "@modelcontextprotocol/sdk/server/streamableHttp.js"
    );
    const http = await import("node:http");
    const port = parseInt(process.env.PORT || "8080", 10);

    const server = createServer();

    const httpServer = http.createServer(async (req, res) => {
      if (req.url === "/mcp" && req.method === "POST") {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
        });
        res.on("close", () => { transport.close(); });
        await server.connect(transport);
        await transport.handleRequest(req, res);
      } else if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok" }));
      } else {
        res.writeHead(404).end();
      }
    });

    httpServer.listen(port, () => {
      console.error(`[sms-ru-mcp] HTTP на порту ${port} — POST /mcp`);
    });
    return;
  }

  // Default: stdio transport
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[sms-ru-mcp] Сервер запущен. 5 инструментов. Требуется SMS_RU_API_ID.");
}

main().catch((error) => {
  console.error("[sms-ru-mcp] Ошибка:", error);
  process.exit(1);
});
