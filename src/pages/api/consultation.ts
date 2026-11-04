import type { APIRoute } from 'astro'

// Единственный динамический маршрут — обрабатывается Node-сервером
export const prerender = false

// Старые имена переменных (NUXT_*) поддерживаются, чтобы не переписывать .env на сервере
const env = (name: string) => process.env[name] ?? process.env[`NUXT_${name}`]

const json = (status: number, message: string) =>
  new Response(JSON.stringify({ success: status === 200, message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Простой лимит: не больше 5 заявок с одного IP за 10 минут
const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(t => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > LIMIT
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json(400, 'Некорректный запрос')
  }

  const name = String(body.name ?? '').trim().slice(0, 100)
  const phone = String(body.phone ?? '').trim()
  const message = String(body.message ?? '').trim().slice(0, 2000)
  const phoneDigits = phone.replace(/\D/g, '')

  // Заполненное скрытое поле — бот. Отвечаем «успехом», чтобы он не пробовал снова.
  if (body.company) return json(200, 'Заявка успешно отправлена')

  if (!name || phoneDigits.length !== 11) {
    return json(400, 'Укажите имя и полный номер телефона')
  }

  const ip = request.headers.get('x-real-ip') ?? clientAddress
  if (rateLimited(ip)) {
    return json(429, 'Слишком много заявок. Пожалуйста, позвоните нам.')
  }

  const token = env('TELEGRAM_BOT_TOKEN')
  const chatId = env('TELEGRAM_CHAT_ID')
  if (!token || !chatId) {
    console.error('[consultation] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы')
    return json(500, 'Не удалось отправить заявку. Позвоните нам, пожалуйста.')
  }

  const text = [
    '🆕 <b>Новая заявка с сайта</b>',
    '',
    `👤 <b>Имя:</b> ${escapeHtml(name)}`,
    `📱 <b>Телефон:</b> ${escapeHtml(phone)}`,
    ...(message ? [`💬 <b>Сообщение:</b> ${escapeHtml(message)}`] : []),
    '',
    `⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`
  ].join('\n')

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      signal: AbortSignal.timeout(10_000)
    })
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  } catch (error) {
    console.error('[consultation] Telegram API error:', error)
    return json(502, 'Не удалось отправить заявку. Позвоните нам, пожалуйста.')
  }

  return json(200, 'Заявка успешно отправлена')
}
