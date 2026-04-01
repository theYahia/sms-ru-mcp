# SMS.RU API MCP Server

MCP-сервер для SMS.RU API (https://sms.ru/, api_id param).

## Переменные окружения
- SMS_RU_API_ID (обязательно)

## Инструменты (5)
- send_sms — отправить SMS
- check_status — проверить статус по sms_id
- get_balance — баланс аккаунта
- get_cost — рассчитать стоимость SMS
- get_senders — список одобренных отправителей

## Транспорт
- stdio (по умолчанию)
- Streamable HTTP (--http, порт 8080 или PORT)