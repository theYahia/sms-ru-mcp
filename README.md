# @theyahia/sms-ru-mcp

MCP-сервер для SMS.RU API — отправка SMS, проверка статуса, баланс. **3 инструмента.**

[![npm](https://img.shields.io/npm/v/@theyahia/sms-ru-mcp)](https://www.npmjs.com/package/@theyahia/sms-ru-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Часть серии [Russian API MCP](https://github.com/theYahia/russian-mcp) (50 серверов) by [@theYahia](https://github.com/theYahia).

## Установка

### Claude Desktop

```json
{
  "mcpServers": {
    "sms-ru": {
      "command": "npx",
      "args": ["-y", "@theyahia/sms-ru-mcp"],
      "env": { "SMS_RU_API_ID": "your-api-id" }
    }
  }
}
```

### Claude Code

```bash
claude mcp add sms-ru -e SMS_RU_API_ID=your-api-id -- npx -y @theyahia/sms-ru-mcp
```

### VS Code / Cursor

```json
{ "servers": { "sms-ru": { "command": "npx", "args": ["-y", "@theyahia/sms-ru-mcp"], "env": { "SMS_RU_API_ID": "your-api-id" } } } }
```

> Требуется `SMS_RU_API_ID`. Получите на [sms.ru](https://sms.ru).

## Инструменты (3)

| Инструмент | Описание |
|------------|----------|
| `send_sms` | Отправить SMS |
| `check_status` | Проверить статус SMS |
| `get_balance` | Баланс аккаунта |

## Примеры

```
Отправь SMS на 79001234567 с текстом "Привет"
Проверь статус сообщения 123456
Какой баланс на SMS.RU
```

## Лицензия

MIT
