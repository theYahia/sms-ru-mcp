import { z } from "zod";
import { smsRuGet } from "../client.js";

export const sendSmsSchema = z.object({
  to: z.string().describe("Номер получателя (формат 79XXXXXXXXX)"),
  msg: z.string().describe("Текст сообщения"),
  from: z.string().optional().describe("Имя отправителя (если одобрено)"),
});

export async function handleSendSms(params: z.infer<typeof sendSmsSchema>): Promise<string> {
  const p: Record<string, string> = {
    to: params.to,
    msg: params.msg,
  };
  if (params.from) p.from = params.from;

  const result = await smsRuGet("sms/send", p);
  return JSON.stringify(result, null, 2);
}

export const checkStatusSchema = z.object({
  sms_id: z.string().describe("ID сообщения для проверки статуса"),
});

export async function handleCheckStatus(params: z.infer<typeof checkStatusSchema>): Promise<string> {
  const result = await smsRuGet("sms/status", {
    sms_id: params.sms_id,
  });
  return JSON.stringify(result, null, 2);
}

export const getBalanceSchema = z.object({});

export async function handleGetBalance(_params: z.infer<typeof getBalanceSchema>): Promise<string> {
  const result = await smsRuGet("my/balance");
  return JSON.stringify(result, null, 2);
}
