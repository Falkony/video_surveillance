// Находит chat_id для MAX_CHAT_ID: напишите боту в MAX (или добавьте его в группу
// и напишите там), затем запустите `npm run max:chat-id`. Токен берётся из .env.
import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'

const fileEnv = existsSync('.env') ? parseEnv(readFileSync('.env', 'utf8')) : {}
const token = process.env.MAX_BOT_TOKEN || fileEnv.MAX_BOT_TOKEN
const apiUrl = (process.env.MAX_API_URL || fileEnv.MAX_API_URL || 'https://platform-api.max.ru').replace(/\/$/, '')

if (!token) {
  console.error('MAX_BOT_TOKEN не задан — впишите его в .env')
  process.exit(1)
}

const res = await fetch(`${apiUrl}/updates?limit=100&timeout=0`, {
  headers: { Authorization: token },
  signal: AbortSignal.timeout(15_000)
})
const data = await res.json().catch(() => ({}))
if (!res.ok) {
  console.error(`MAX API ответил ${res.status}: ${data.code ?? ''} ${data.message ?? ''}`)
  process.exit(1)
}

const chats = new Map()
for (const update of data.updates ?? []) {
  const message = update.message
  const chatId = message?.recipient?.chat_id ?? update.chat_id
  if (!chatId) continue
  chats.set(chatId, {
    type: message?.recipient?.chat_type ?? 'dialog',
    from: message?.sender?.name ?? update.user?.name ?? '',
    text: message?.body?.text ?? `(${update.update_type})`
  })
}

if (!chats.size) {
  console.log('Новых сообщений нет. Напишите боту в MAX что-нибудь (или нажмите «Начать») и запустите ещё раз.')
  process.exit(0)
}

console.log('Чаты, где боту писали недавно:\n')
for (const [chatId, c] of chats) {
  console.log(`  MAX_CHAT_ID=${chatId}   ${c.type}, ${c.from}: ${String(c.text).slice(0, 40)}`)
}
console.log('\nСкопируйте нужную строку в .env')
