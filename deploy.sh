#!/usr/bin/env bash
# =============================================================================
#  Деплой nnvss.ru (Astro + Node + PM2): первая установка и обновления.
#
#  Использование (на сервере):
#    ./deploy.sh                 — скачать master, собрать, перезапустить
#    ./deploy.sh --nginx         — то же + настроить nginx (нужен root/sudo)
#    ./deploy.sh --nginx --ssl   — то же + выпустить HTTPS-сертификат через certbot
#    ./deploy.sh --rollback      — вернуть предыдущую сборку
#
#  Первая установка «с нуля» (каталога ещё нет):
#    curl -fsSL https://raw.githubusercontent.com/Falkony/video_surveillance/master/deploy.sh -o deploy.sh
#    bash deploy.sh
#
#  Настройки можно переопределить переменными окружения:
#    APP_DIR=/var/www/video-surveillance BRANCH=master DOMAIN=nnvss.ru ./deploy.sh
#    CERTBOT_EMAIL=you@example.com ./deploy.sh --ssl   — почта для писем Let's Encrypt
#
#  При любой ошибке скрипт останавливается и пишет: на каком шаге, какая
#  команда упала, с каким кодом, и что проверить.
# =============================================================================

set -Eeuo pipefail

APP_NAME="video-surveillance"
REPO_URL="${REPO_URL:-https://github.com/Falkony/video_surveillance.git}"
BRANCH="${BRANCH:-master}"
DOMAIN="${DOMAIN:-nnvss.ru}"
MIN_NODE="22.23.4"

# Если скрипт лежит внутри git-репозитория проекта — работаем там,
# иначе ставим в стандартный каталог
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -z "${APP_DIR:-}" ]]; then
  if [[ -f "$SCRIPT_DIR/astro.config.mjs" && -d "$SCRIPT_DIR/.git" ]]; then
    APP_DIR="$SCRIPT_DIR"
  else
    APP_DIR="/var/www/video-surveillance"
  fi
fi

WITH_NGINX=0
WITH_SSL=0
ROLLBACK=0

# ----------------------------------------------------------------------------
#  Вывод и обработка ошибок
# ----------------------------------------------------------------------------
if [[ -t 1 ]]; then
  C_RED=$'\e[1;31m'; C_GREEN=$'\e[1;32m'; C_YELLOW=$'\e[1;33m'; C_BLUE=$'\e[1;34m'; C_DIM=$'\e[2m'; C_RESET=$'\e[0m'
else
  C_RED=''; C_GREEN=''; C_YELLOW=''; C_BLUE=''; C_DIM=''; C_RESET=''
fi

STEP="подготовка"
STEP_NUM=0
HINT=""
SWITCHED=0   # новая сборка уже подменила старую — при ошибке откатываем

step() {
  STEP_NUM=$((STEP_NUM + 1))
  STEP="$1"
  HINT="${2:-}"
  echo
  echo "${C_BLUE}▶ [$STEP_NUM] $STEP${C_RESET}"
}

info() { echo "  $*"; }
ok()   { echo "  ${C_GREEN}✔${C_RESET} $*"; }
warn() { echo "  ${C_YELLOW}⚠ $*${C_RESET}"; }

# Осознанная остановка с понятным сообщением (не через trap)
die() {
  trap - ERR
  echo
  echo "${C_RED}✖ Деплой остановлен на шаге [$STEP_NUM] «$STEP»${C_RESET}"
  echo "${C_RED}  $1${C_RESET}"
  [[ -n "${2:-}" ]] && echo "  ${C_YELLOW}Что сделать:${C_RESET} $2"
  maybe_rollback
  exit 1
}

on_error() {
  local code=$1 line=$2 cmd=$3
  trap - ERR
  echo
  echo "${C_RED}✖ Ошибка на шаге [$STEP_NUM] «$STEP»${C_RESET}"
  echo "${C_RED}  Команда:${C_RESET} $cmd"
  echo "${C_RED}  Код выхода:${C_RESET} $code   ${C_DIM}(deploy.sh, строка $line)${C_RESET}"
  [[ -n "$HINT" ]] && echo "  ${C_YELLOW}Что проверить:${C_RESET} $HINT"
  echo "  ${C_DIM}Подробности — в выводе команды выше.${C_RESET}"
  maybe_rollback
  exit "$code"
}
trap 'on_error $? $LINENO "$BASH_COMMAND"' ERR

maybe_rollback() {
  if [[ "$SWITCHED" == 1 && -d "$APP_DIR/dist-old" ]]; then
    echo
    echo "${C_YELLOW}↩ Возвращаю предыдущую сборку, чтобы сайт продолжил работать...${C_RESET}"
    cd "$APP_DIR"
    rm -rf dist-failed
    mv dist dist-failed
    mv dist-old dist
    if pm2 restart "$APP_NAME" --update-env >/dev/null 2>&1; then
      echo "  ${C_GREEN}✔${C_RESET} Откат выполнен. Неудачная сборка сохранена в dist-failed/"
    else
      echo "  ${C_RED}✖ Откат не удался — запустите вручную: pm2 restart $APP_NAME${C_RESET}"
    fi
  fi
}

need_root() {
  [[ $EUID -eq 0 ]] || die "Этот шаг требует прав root." "Запустите: sudo $0 $*"
}

# Читает значение переменной из .env (без source — чтобы спецсимволы в токенах ничего не сломали)
env_get() {
  local value
  value="$(grep -E "^[[:space:]]*$1=" "$APP_DIR/.env" 2>/dev/null | tail -n1 | cut -d= -f2- || true)"
  value="${value%\"}"; value="${value#\"}"; value="${value%\'}"; value="${value#\'}"
  printf '%s' "$value"
}

version_ge() { [[ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -n1)" == "$2" ]]; }

# ----------------------------------------------------------------------------
#  Шаги
# ----------------------------------------------------------------------------
check_tools() {
  step "Проверка окружения" "установите недостающие программы и запустите скрипт снова"

  local missing=()
  for tool in git node npm curl; do
    command -v "$tool" >/dev/null 2>&1 || missing+=("$tool")
  done
  [[ ${#missing[@]} -eq 0 ]] || die "Не найдены программы: ${missing[*]}" \
    "Ubuntu/Debian: sudo apt install -y git curl; Node.js — через nvm или nodesource"

  local node_version
  node_version="$(node -p 'process.versions.node')"
  version_ge "$node_version" "$MIN_NODE" || die "Node.js $node_version слишком старый, нужен $MIN_NODE или новее." \
    "обновите Node.js (nvm install node) и перезапустите скрипт"
  ok "Node.js $node_version, npm $(npm -v), git $(git --version | awk '{print $3}')"

  if ! command -v pm2 >/dev/null 2>&1; then
    HINT="если нет прав на глобальную установку — запустите через sudo или поставьте Node через nvm"
    info "PM2 не найден — устанавливаю глобально..."
    npm install -g pm2
  fi
  ok "PM2 $(pm2 -v 2>/dev/null | tail -n1)"
}

fetch_code() {
  step "Получение кода (ветка $BRANCH)" "проверьте доступ к $REPO_URL и что ветка $BRANCH существует"

  if [[ -d "$APP_DIR/.git" ]]; then
    cd "$APP_DIR"
    # Lock-файлы мог переписать сам менеджер пакетов при установке — это не правки
    local lockfile
    for lockfile in pnpm-lock.yaml package-lock.json; do
      if git ls-files --error-unmatch "$lockfile" >/dev/null 2>&1; then
        git checkout -q -- "$lockfile"
      fi
    done
    # Изменения прав файлов (chmod) не считаем локальными правками
    if ! git -c core.fileMode=false diff --quiet HEAD --; then
      git -c core.fileMode=false status --short
      die "На сервере есть локальные изменения в файлах проекта (список выше) — git pull их перезапишет или упадёт." \
        "сохраните нужное и сбросьте: cd $APP_DIR && git stash   (или git checkout -- .)"
    fi
    git fetch --prune origin "$BRANCH"
    git checkout -q "$BRANCH"
    HINT="либо ветка на сервере разошлась с GitHub (если локальные коммиты не нужны: git reset --hard origin/$BRANCH), либо неотслеживаемые файлы мешают обновлению — git назвал их выше, удалите или перенесите их"
    git merge --ff-only -q "origin/$BRANCH"
  elif [[ -d "$APP_DIR" && -n "$(ls -A "$APP_DIR")" ]]; then
    # Каталог уже есть, но это не git-репозиторий — обычно в нём лежит только
    # скачанный deploy.sh (и, может быть, .env). Разворачиваем репозиторий поверх.
    local entry extra=()
    for entry in "$APP_DIR"/* "$APP_DIR"/.[!.]*; do
      [[ -e "$entry" ]] || continue
      case "${entry##*/}" in deploy.sh | .env) ;; *) extra+=("${entry##*/}") ;; esac
    done
    if [[ ${#extra[@]} -gt 0 ]]; then
      printf '%s\n' "${extra[@]}"
      die "Каталог $APP_DIR не пуст и не является git-репозиторием (файлы выше) — не буду их перезаписывать." \
        "перенесите эти файлы или укажите другой каталог: APP_DIR=/путь ./deploy.sh"
    fi
    cd "$APP_DIR"
    git init -q
    git remote add origin "$REPO_URL"
    git fetch -q origin "$BRANCH"
    git checkout -q -f -B "$BRANCH" "origin/$BRANCH"
    git branch -q --set-upstream-to="origin/$BRANCH"
  else
    HINT="проверьте, что каталог $(dirname "$APP_DIR") существует и доступен на запись"
    mkdir -p "$(dirname "$APP_DIR")"
    git clone -q --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
  fi
  ok "Коммит $(git log -1 --format='%h — %s (%cr)')"

  # Остатки старой версии на Nuxt
  local leftovers=()
  for path in .nuxt .output .data .nitro pnpm-lock.yaml pnpm-workspace.yaml; do
    [[ -e "$path" ]] && leftovers+=("$path")
  done
  if [[ ${#leftovers[@]} -gt 0 ]]; then
    rm -rf "${leftovers[@]}"
    ok "Удалены остатки Nuxt: ${leftovers[*]}"
  fi
}

check_env() {
  step "Проверка .env" "проверьте синтаксис .env: строки вида КЛЮЧ=значение"

  if [[ ! -f .env ]]; then
    cp .env.example .env
    warn "Файла .env не было — создан из .env.example. Заполните его: nano $APP_DIR/.env"
  fi

  # Переезд со старых имён переменных (Nuxt)
  if [[ -z "$(env_get PUBLIC_YANDEX_METRIKA_ID)" && -n "$(env_get NUXT_PUBLIC_YANDEX_METRIKA_ID)" ]]; then
    printf '\nPUBLIC_YANDEX_METRIKA_ID=%s\n' "$(env_get NUXT_PUBLIC_YANDEX_METRIKA_ID)" >> .env
    ok "PUBLIC_YANDEX_METRIKA_ID перенесён из NUXT_PUBLIC_YANDEX_METRIKA_ID"
  fi

  # Заявки теперь уходят в MAX — добавляем пустые ключи, если .env создан по старому примеру
  if ! grep -qE '^[[:space:]]*MAX_BOT_TOKEN=' .env; then
    printf '\n# Бот MAX для заявок с формы (chat_id: npm run max:chat-id)\nMAX_BOT_TOKEN=\nMAX_CHAT_ID=\n' >> .env
    info "В .env добавлены ключи MAX_BOT_TOKEN и MAX_CHAT_ID"
  fi

  local token chat metrika
  token="$(env_get MAX_BOT_TOKEN)"
  chat="$(env_get MAX_CHAT_ID)"
  metrika="$(env_get PUBLIC_YANDEX_METRIKA_ID)"
  PORT="$(env_get PORT)"; PORT="${PORT:-3000}"

  if [[ -n "$token" && -n "$chat" ]]; then
    ok "MAX для заявок настроен (чат $chat)"
  elif [[ -n "$token" ]]; then
    warn "MAX_CHAT_ID не задан — напишите боту в MAX и выполните: cd $APP_DIR && npm run max:chat-id"
  else
    warn "MAX_BOT_TOKEN / MAX_CHAT_ID не заданы — форма заявки будет отвечать ошибкой"
  fi
  if [[ -n "$(env_get TELEGRAM_BOT_TOKEN)$(env_get NUXT_TELEGRAM_BOT_TOKEN)" ]]; then
    info "Переменные TELEGRAM_* больше не используются — заявки уходят в MAX, их можно удалить из .env"
  fi
  if [[ -n "$metrika" ]]; then
    ok "Яндекс.Метрика: счётчик $metrika"
  else
    warn "PUBLIC_YANDEX_METRIKA_ID не задан — сайт соберётся без Метрики"
  fi
  ok "Порт приложения: $PORT"
}

install_deps() {
  step "Установка зависимостей (npm ci)" "если ошибка в sharp — нужен доступ в интернет к github.com/npm; при нехватке памяти добавьте swap"
  npm ci --no-audit --no-fund --loglevel=error
  ok "Зависимости установлены"
}

build() {
  step "Сборка сайта" "ошибка в коде или данных — смотрите сообщение Astro выше; сайт при этом продолжает работать на старой версии"
  rm -rf dist-new
  # Построчный лог оптимизации ~200 картинок скрываем, ошибки и итог остаются
  ASTRO_OUT_DIR=dist-new npm run build --silent 2>&1 | grep -v --line-buffered '/_astro/.*(before:'
  [[ -f dist-new/server/entry.mjs && -f dist-new/client/index.html ]] \
    || die "Сборка завершилась, но в dist-new нет server/entry.mjs или client/index.html." "запустите npm run build вручную и посмотрите вывод"
  ok "Собрано: $(du -sh dist-new | cut -f1)"
}

switch_build() {
  step "Подмена сборки" "проверьте права на запись в $APP_DIR"
  rm -rf dist-old dist-failed
  [[ -d dist ]] && mv dist dist-old
  mv dist-new dist
  SWITCHED=1
  ok "Новая сборка в dist/, предыдущая сохранена в dist-old/"
}

restart_app() {
  step "Запуск через PM2" "посмотрите логи: pm2 logs $APP_NAME --lines 50"
  mkdir -p logs

  # Путь к скрипту текущего процесса PM2 (если он есть)
  local current_script
  current_script="$(pm2 jlist 2>/dev/null | node -e '
    let s = ""; process.stdin.on("data", d => s += d).on("end", () => {
      try { const p = JSON.parse(s).find(p => p.name === process.argv[1]); console.log(p ? p.pm2_env.pm_exec_path : "") }
      catch { console.log("") }
    })' "$APP_NAME")"

  if [[ "${current_script//\\//}" == *"/dist/server/entry.mjs" ]]; then
    pm2 reload ecosystem.config.cjs --update-env >/dev/null
    ok "Процесс $APP_NAME перезапущен"
  else
    # Старый процесс (Nuxt, cluster-режим) или его нет — пересоздаём с новыми настройками
    [[ -n "$current_script" ]] && { pm2 delete "$APP_NAME" >/dev/null; info "Старый процесс ($current_script) удалён"; }
    pm2 start ecosystem.config.cjs >/dev/null
    ok "Процесс $APP_NAME запущен"
  fi
}

health_check() {
  step "Проверка, что сайт отвечает" "сайт не поднялся — логи: pm2 logs $APP_NAME --lines 50"
  local url="http://127.0.0.1:$PORT"
  local attempt
  for attempt in $(seq 1 20); do
    if curl -fsS --max-time 3 "$url/" 2>/dev/null | grep -q '<h1'; then
      ok "Главная страница отдаётся ($url/)"
      break
    fi
    [[ $attempt -eq 20 ]] && { pm2 logs "$APP_NAME" --lines 30 --nostream || true; die "Главная страница не ответила за 20 секунд." "смотрите логи выше"; }
    sleep 1
  done

  local api_code
  api_code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -X POST -H 'Content-Type: application/json' -d '{}' "$url/api/consultation" || true)"
  [[ "$api_code" == "400" ]] || die "API заявок ответило кодом $api_code вместо 400 на пустой запрос." "pm2 logs $APP_NAME --lines 50"
  ok "API заявок работает"

  local code
  for path in /privacy /robots.txt /sitemap-index.xml; do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$url$path" || true)"
    [[ "$code" == "200" ]] || die "$path отвечает кодом $code вместо 200." "pm2 logs $APP_NAME --lines 50"
  done
  ok "/privacy, robots.txt и sitemap отдаются"
  SWITCHED=0
}

setup_autostart() {
  step "Автозапуск PM2 после перезагрузки сервера" "выполните вручную: pm2 startup и команду, которую он выведет"
  pm2 save >/dev/null
  ok "Список процессов сохранён (pm2 save)"

  if systemctl list-unit-files 2>/dev/null | grep -q "^pm2-$(id -un)\.service"; then
    ok "Автозапуск уже настроен (pm2-$(id -un).service)"
  elif [[ $EUID -eq 0 ]]; then
    pm2 startup systemd -u root --hp "$HOME" >/dev/null
    ok "Автозапуск настроен (pm2-root.service)"
  else
    warn "Автозапуск не настроен. Выполните команду, которую выведет: pm2 startup"
  fi
}

setup_nginx() {
  step "Настройка nginx для $DOMAIN" "проверьте конфиг: sudo nginx -t"
  need_root --nginx
  command -v nginx >/dev/null 2>&1 || die "nginx не установлен." "sudo apt install -y nginx"

  local conf="/etc/nginx/sites-available/$DOMAIN"
  local marker="# managed by deploy.sh (nnvss.ru)"

  # Домен уже обслуживает другой конфиг (например, настроенный вручную вместе с certbot)
  local other
  other="$(grep -rlE "server_name[^;]*[[:space:]]$DOMAIN([[:space:];]|$)" /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null \
    | while read -r f; do [[ "$(readlink -f "$f")" == "$(readlink -f "$conf" 2>/dev/null)" ]] || echo "$f"; done | head -n1 || true)"

  if [[ -n "$other" ]]; then
    warn "$DOMAIN уже настроен в $other — не создаю второй конфиг, чтобы не было конфликта."
    if grep -q "127.0.0.1:$PORT\|localhost:$PORT" "$other"; then
      ok "В нём уже проксирование на порт $PORT — менять ничего не нужно"
    else
      warn "Проверьте, что в $other есть: proxy_pass http://127.0.0.1:$PORT;"
    fi
  elif [[ -f "$conf" ]] && ! grep -qF "$marker" "$conf"; then
    warn "$conf уже существует и создан не этим скриптом — не трогаю его."
    info "Убедитесь, что в нём: proxy_pass http://127.0.0.1:$PORT;  Чтобы скрипт перезаписал конфиг — удалите его."
  else
    [[ -f "$conf" ]] && cp "$conf" "$conf.bak.$(date +%s)"
    cat > "$conf" <<NGINX
$marker
upstream nnvss_app {
    server 127.0.0.1:$PORT;
    keepalive 16;
}

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # www → без www (одно зеркало для поисковиков)
    if (\$host = www.$DOMAIN) {
        return 301 \$scheme://$DOMAIN\$request_uri;
    }

    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/xml application/javascript application/json image/svg+xml;

    client_max_body_size 1m;

    # Хэшированные ассеты Astro — кэш на год
    location /_astro/ {
        proxy_pass http://nnvss_app;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://nnvss_app;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX
    ln -sf "$conf" "/etc/nginx/sites-enabled/$DOMAIN"
    ok "Конфиг записан: $conf"
  fi

  HINT="nginx -t покажет строку с ошибкой; предыдущий конфиг сохранён как $conf.bak.*"
  nginx -t
  systemctl reload nginx
  ok "nginx перезагружен"

  if [[ "$WITH_SSL" == 1 ]]; then
    step "HTTPS-сертификат (certbot)" "DNS $DOMAIN и www.$DOMAIN должны указывать на этот сервер, порт 80 открыт"
    command -v certbot >/dev/null 2>&1 || die "certbot не установлен." "sudo apt install -y certbot python3-certbot-nginx"
    local email_args=(--register-unsafely-without-email)
    [[ -n "${CERTBOT_EMAIL:-}" ]] && email_args=(-m "$CERTBOT_EMAIL")
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --redirect --non-interactive --agree-tos --keep-until-expiring "${email_args[@]}"
    ok "HTTPS настроен, HTTP перенаправляется на HTTPS"
  fi
}

rollback() {
  step "Откат на предыдущую сборку" "проверьте, что каталог $APP_DIR/dist-old существует"
  cd "$APP_DIR"
  [[ -d dist-old ]] || die "Предыдущей сборки нет (dist-old отсутствует)." "откат возможен только после хотя бы одного деплоя этим скриптом"
  rm -rf dist-failed
  mv dist dist-failed
  mv dist-old dist
  pm2 restart "$APP_NAME" --update-env >/dev/null
  ok "Откат выполнен. Текущая (откаченная) сборка — в dist-failed/"
}

# ----------------------------------------------------------------------------
#  Всё тело — в функции: bash прочитает его целиком до запуска,
#  поэтому git pull, обновляющий этот же файл, не сломает выполнение
# ----------------------------------------------------------------------------
main() {
  for arg in "$@"; do
    case "$arg" in
      --nginx) WITH_NGINX=1 ;;
      --ssl) WITH_SSL=1; WITH_NGINX=1 ;;
      --rollback) ROLLBACK=1 ;;
      -h|--help) sed -n '2,22p' "${BASH_SOURCE[0]}"; exit 0 ;;
      *) die "Неизвестный параметр: $arg" "./deploy.sh --help" ;;
    esac
  done

  echo "${C_BLUE}Деплой $DOMAIN → $APP_DIR${C_RESET}"

  if [[ "$ROLLBACK" == 1 ]]; then
    rollback
    exit 0
  fi

  local started=$SECONDS
  check_tools
  fetch_code
  check_env
  install_deps
  build
  switch_build
  restart_app
  health_check
  setup_autostart
  [[ "$WITH_NGINX" == 1 ]] && setup_nginx

  echo
  echo "${C_GREEN}✔ Готово за $((SECONDS - started)) с. Сайт работает на порту $PORT.${C_RESET}"
  echo "  Логи:   pm2 logs $APP_NAME"
  echo "  Откат:  $APP_DIR/deploy.sh --rollback"
}

main "$@"
