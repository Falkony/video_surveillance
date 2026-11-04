# nnvss.ru — лендинг видеонаблюдения и СКУД

Статический лендинг на **Astro + Tailwind CSS 4**. Все страницы собираются в готовый HTML
(поисковики видят контент без выполнения JS), Node-сервер нужен только для формы заявки
`/api/consultation`, которая отправляет сообщение в Telegram.

## Команды

```bash
npm install        # зависимости
npm run dev        # разработка, http://localhost:4321
npm run build      # сборка в dist/
npm run preview    # запуск собранной версии локально
npm run check      # проверка типов
```

Нужен Node.js 22.23+.

## Переменные окружения

Скопируйте `.env.example` в `.env`:

| Переменная | Когда нужна | Описание |
| --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | в рантайме | токен бота для заявок |
| `TELEGRAM_CHAT_ID` | в рантайме | чат, куда приходят заявки |
| `TELEGRAM_API_URL` | в рантайме | необязательно: прокси для Bot API, если `api.telegram.org` недоступен с сервера |
| `PUBLIC_YANDEX_METRIKA_ID` | при сборке | ID счётчика Метрики; без него счётчик не вставляется |
| `PORT`, `HOST` | в рантайме | адрес Node-сервера (по умолчанию 3000 / 0.0.0.0) |

Старые имена `NUXT_TELEGRAM_BOT_TOKEN` / `NUXT_TELEGRAM_CHAT_ID` тоже поддерживаются.

## Где что лежит

```
src/
├── data/
│   ├── site.ts        # контакты, реквизиты, меню
│   ├── landing.ts     # тексты, прайс, отзывы, сертификаты, SEO title/description
│   └── schema.ts      # Schema.org (JSON-LD) для главной
├── components/        # секции страницы, модалка, лайтбокс, YandexMetrika.astro
├── layouts/BaseLayout.astro  # <head>: мета-теги, canonical, OG, Метрика
├── pages/
│   ├── index.astro
│   ├── privacy.astro
│   ├── 404.astro
│   └── api/consultation.ts   # приём заявок → Telegram
├── assets/images/     # фото работ, сертификаты, hero — Astro сам делает webp нужных размеров
└── styles/global.css
public/                # robots.txt, favicon, og-image, logo
```

**Поменять цены, тексты или отзывы** — правьте `src/data/landing.ts`.

**Добавить фото работ** — сначала ужмите исходники, затем пересоберите сайт:

```bash
npm run images -- путь/к/новым/фото src/assets/images/examples 1920
```

Галерея подхватывает все `.jpg` из `src/assets/images/examples` по порядку номеров в имени.

## Цели Метрики

В интерфейсе Метрики создайте цели типа «JavaScript-событие»:

- `consultation_open` — открыта форма заявки
- `consultation_sent` — заявка отправлена
- `phone_click` — клик по телефону

## Деплой (VPS + PM2)

Всё делает [deploy.sh](deploy.sh) — и первую установку, и обновления:

```bash
./deploy.sh                # git pull → npm ci → сборка → перезапуск → проверка
sudo ./deploy.sh --nginx   # + конфиг nginx (gzip, кэш /_astro, www → без www)
sudo ./deploy.sh --ssl     # + HTTPS через certbot
./deploy.sh --rollback     # вернуть предыдущую сборку
```

Скрипт собирает новую версию в отдельную папку и подменяет старую только после
успешной сборки, затем проверяет, что главная, API заявок, robots и sitemap отвечают.
Если проверка не прошла — автоматически откатывается. При любой ошибке пишет,
на каком шаге и какой командой она случилась, и что проверить.
