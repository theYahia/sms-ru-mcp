const BASE_URL = "https://sms.ru";
const TIMEOUT = 10_000;
const MAX_RETRIES = 3;

export async function smsRuGet(path: string, params: Record<string, string> = {}): Promise<unknown> {
  const apiId = process.env.SMS_RU_API_ID;
  if (!apiId) throw new Error("SMS_RU_API_ID не задан");

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    const query = new URLSearchParams({ ...params, api_id: apiId, json: "1" });

    try {
      const response = await fetch(`${BASE_URL}/${path}?${query.toString()}`, {
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        return await response.json();
      }

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[sms-ru-mcp] ${response.status}, повтор через ${delay}мс (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      throw new Error(`SMS.RU HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) {
        console.error(`[sms-ru-mcp] Таймаут, повтор (${attempt}/${MAX_RETRIES})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("SMS.RU API: все попытки исчерпаны");
}
