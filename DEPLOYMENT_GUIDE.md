# 🚀 Руководство по деплою на VPS сервер

## Требования

- VPS сервер (Ubuntu 20.04/22.04 или выше)
- Доменное имя
- SSH доступ к серверу
- Root или sudo права

## 📋 План действий

1. Настройка сервера (Node.js, PM2, Nginx)
2. Настройка домена
3. Загрузка проекта на сервер
4. Настройка переменных окружения
5. Сборка и запуск
6. Настройка SSL (HTTPS)
7. Автозапуск

---

## Шаг 1: Подключение к серверу

```bash
# Подключитесь к серверу по SSH
ssh root@ваш_ip_адрес
# или
ssh username@ваш_ip_адрес

# Если используете SSH ключ:
ssh -i path/to/key.pem root@ваш_ip_адрес
```

---

## Шаг 2: Установка необходимого ПО

### 2.1 Обновление системы

```bash
# Обновите пакеты
sudo apt update && sudo apt upgrade -y
```

### 2.2 Установка Node.js (через nvm)

```bash
# Установка nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Перезагрузите конфигурацию
source ~/.bashrc

# Установка Node.js LTS
nvm install --lts
nvm use --lts

# Проверка
node -v  # должно показать v20.x.x или v22.x.x
npm -v
```

### 2.3 Установка pnpm

```bash
npm install -g pnpm
pnpm -v
```

### 2.4 Установка PM2 (менеджер процессов)

```bash
npm install -g pm2
pm2 -v
```

### 2.5 Установка Git

```bash
sudo apt install git -y
git --version
```

### 2.6 Установка Nginx

```bash
sudo apt install nginx -y
sudo systemctl status nginx
```

---

## Шаг 3: Загрузка проекта на сервер

### Вариант А: Через Git (рекомендуется)

#### Для публичного репозитория:

```bash
# Перейдите в директорию для проектов
cd /var/www

# Создайте директорию для проекта
sudo mkdir -p video-surveillance
sudo chown -R $USER:$USER video-surveillance
cd video-surveillance

# Клонируйте репозиторий
git clone https://github.com/Falkony/video-surveillance.git .
```

#### Для приватного репозитория:

Сначала создайте Personal Access Token (PAT) на GitHub:

1. Зайдите на GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Нажмите "Generate new token (classic)"
3. Дайте имя токену (например: "VPS Deploy")
4. Выберите срок действия
5. Выберите права: `repo` (полный доступ к репозиториям)
6. Нажмите "Generate token"
7. **ВАЖНО**: Скопируйте токен сразу! Он больше не будет показан.

Затем клонируйте с использованием токена:

```bash
cd /var/www/video-surveillance

# Способ 1: Токен в URL (быстро, но токен будет в истории команд)
git clone https://ВАШ_ТОКЕН@github.com/Falkony/video_surveillance.git .

# Способ 2: Через git credential (безопаснее)
git clone https://github.com/Falkony/video_surveillance.git .
# При запросе username введите ваш GitHub username
# При запросе password введите ваш PAT токен (не пароль!)

# Способ 3: Настройка credential helper (самый безопасный)
git config --global credential.helper store
git clone https://github.com/Falkony/video_surveillance.git .
# При запросе username и password (введите токен как пароль)
# Токен сохранится и больше не будет запрашиваться
```

**Примечание**: После клонирования рекомендуется удалить токен из истории команд:

```bash
history -c  # Очистить историю текущей сессии
```

### Вариант Б: Загрузка через SCP/SFTP

**С вашего локального компьютера:**

```bash
# Создайте архив проекта (исключая node_modules)
cd D:\Work\additional\video_surveillance
tar -czf project.tar.gz --exclude='node_modules' --exclude='.nuxt' --exclude='.output' --exclude='.git' .

# Загрузите на сервер
scp project.tar.gz root@ваш_ip:/var/www/video-surveillance/

# Подключитесь к серверу и распакуйте
ssh root@ваш_ip
cd /var/www/video-surveillance
tar -xzf project.tar.gz
rm project.tar.gz
```

### Вариант В: Через FileZilla/WinSCP

1. Скачайте [FileZilla](https://filezilla-project.org/) или [WinSCP](https://winscp.net/)
2. Подключитесь к серверу (SFTP, порт 22)
3. Загрузите файлы проекта в `/var/www/video-surveillance/`

---

## Шаг 4: Настройка переменных окружения

```bash
cd /var/www/video-surveillance

# Создайте файл .env
nano .env
```

Вставьте ваши переменные:

```env
# Telegram Bot
NUXT_TELEGRAM_BOT_TOKEN=ваш_токен
NUXT_TELEGRAM_CHAT_ID=ваш_chat_id

# Контакты
NUXT_PUBLIC_PHONE=+79999999999
NUXT_PUBLIC_EMAIL=info@yourdomain.ru
NUXT_PUBLIC_TELEGRAM=https://t.me/yourusername
NUXT_PUBLIC_SITE_NAME=Видеонаблюдение
NUXT_PUBLIC_SITE_URL=https://yourdomain.ru
```

Сохраните: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## Шаг 5: Установка зависимостей и сборка

```bash
cd /var/www/video-surveillance

# Установка зависимостей
pnpm install

# Сборка проекта для production
pnpm build

# Проверка что сборка прошла успешно
ls -la .output
```

---

## Шаг 6: Запуск приложения через PM2

### 6.1 Создайте файл конфигурации PM2

```bash
nano ecosystem.config.cjs
```

Вставьте:

```javascript
module.exports = {
  apps: [{
    name: 'video-surveillance',
    script: '.output/server/index.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    }
  }]
}
```

### 6.2 Запустите приложение

```bash
# Запуск
pm2 start ecosystem.config.cjs

# Проверка статуса
pm2 status

# Просмотр логов
pm2 logs video-surveillance

# Остановка (если нужно)
pm2 stop video-surveillance

# Перезапуск
pm2 restart video-surveillance
```

### 6.3 Настройка автозапуска PM2

```bash
# Сохраните текущий список процессов
pm2 save

# Создайте startup скрипт
pm2 startup

# Выполните команду, которую выведет pm2 startup
# Пример: sudo env PATH=$PATH:/home/user/.nvm/versions/node/v20.x.x/bin...
```

---

## Шаг 7: Настройка Nginx

### 7.1 Создайте конфигурацию для вашего сайта

```bash
sudo nano /etc/nginx/sites-available/video-surveillance
```

Вставьте конфигурацию:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name yourdomain.ru www.yourdomain.ru;
    
    # Логи
    access_log /var/log/nginx/video-surveillance-access.log;
    error_log /var/log/nginx/video-surveillance-error.log;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.2 Активируйте конфигурацию

```bash
# Создайте символическую ссылку
sudo ln -s /etc/nginx/sites-available/video-surveillance /etc/nginx/sites-enabled/

# Проверьте конфигурацию
sudo nginx -t

# Перезапустите Nginx
sudo systemctl restart nginx
```

---

## Шаг 8: Настройка DNS

В панели управления вашего регистратора доменов добавьте A-записи:

```
Тип    Имя    Значение              TTL
A      @      ваш_ip_сервера        3600
A      www    ваш_ip_сервера        3600
```

Подождите 5-30 минут для распространения DNS.

**Проверка:**
```bash
# С вашего компьютера
ping yourdomain.ru
```

---

## Шаг 9: Настройка SSL (HTTPS) с Let's Encrypt

### 9.1 Установка Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 9.2 Получение SSL сертификата

```bash
sudo certbot --nginx -d yourdomain.ru -d www.yourdomain.ru
```

Следуйте инструкциям:
- Введите email
- Согласитесь с условиями (Y)
- Выберите redirect на HTTPS (2)

### 9.3 Проверка автообновления

```bash
sudo certbot renew --dry-run
```

Certbot автоматически настроит обновление сертификата каждые 90 дней.

---

## Шаг 10: Настройка Firewall

```bash
# Установка UFW (если не установлен)
sudo apt install ufw -y

# Разрешите SSH (ВАЖНО!)
sudo ufw allow OpenSSH

# Разрешите HTTP и HTTPS
sudo ufw allow 'Nginx Full'

# Включите firewall
sudo ufw enable

# Проверка статуса
sudo ufw status
```

---

## 🎉 Готово! Проверьте сайт

Откройте в браузере: `https://yourdomain.ru`

---

## 📝 Полезные команды

### PM2

```bash
pm2 list                    # Список процессов
pm2 logs video-surveillance # Просмотр логов
pm2 restart video-surveillance # Перезапуск
pm2 stop video-surveillance    # Остановка
pm2 delete video-surveillance  # Удаление
pm2 monit                      # Мониторинг
```

### Nginx

```bash
sudo systemctl status nginx   # Статус
sudo systemctl restart nginx  # Перезапуск
sudo systemctl reload nginx   # Перезагрузка конфигурации
sudo nginx -t                 # Проверка конфигурации
tail -f /var/log/nginx/video-surveillance-error.log  # Логи
```

### Обновление проекта

```bash
cd /var/www/video-surveillance

# Если через Git
git pull origin main

# Установка новых зависимостей (если есть)
pnpm install

# Пересборка
pnpm build

# Перезапуск
pm2 restart video-surveillance
```

---

## 🔧 Решение проблем

### Ошибка загрузки Google Fonts: "Will retry in 1000ms"

**Ошибка**: `https://fonts.googleapis.com/css2. Will retry in 1000ms. 3 retries left.`

**Причина**: Сервер не может подключиться к Google Fonts (блокировка, проблемы с сетью, файрвол).

**Решение**: Проект уже настроен для использования локальных шрифтов через `@fontsource/inter`. Шрифты будут загружаться из `node_modules`, а не из интернета.

Если проблема все еще возникает:

```bash
cd /var/www/video-surveillance

# Убедитесь, что зависимости установлены
pnpm install

# Очистите кеш и пересоберите
rm -rf .nuxt .output node_modules/.cache
pnpm build

# Перезапустите приложение
pm2 restart video-surveillance
```

Проверьте, что в `nuxt.config.ts` установлено:

```javascript
ui: {
  fonts: false
}
```

### Ошибка при клонировании Git: "Invalid username or token"

**Ошибка**: `remote: Invalid username or token. Password authentication is not supported for Git operations.`

**Причина**: GitHub больше не поддерживает аутентификацию по паролю с августа 2021 года.

**Решение**:

1. Создайте Personal Access Token (PAT):
   - Зайдите на https://github.com/settings/tokens
   - Нажмите "Generate new token (classic)"
   - Выберите права `repo`
   - Скопируйте созданный токен

2. Используйте токен вместо пароля:

```bash
# Если уже пытались клонировать - удалите папку
rm -rf /var/www/video-surveillance/*

# Клонируйте с токеном
cd /var/www/video-surveillance
git clone https://ВАШ_ТОКЕН@github.com/username/repository.git .

# Или настройте credential helper
git config --global credential.helper store
git clone https://github.com/username/repository.git .
# При запросе username: введите ваш GitHub username
# При запросе password: введите токен (НЕ пароль!)
```

3. Для будущих операций git pull/push:

```bash
# Если используете credential helper, токен сохранится автоматически
# Или обновите remote URL с токеном:
git remote set-url origin https://ВАШ_ТОКЕН@github.com/username/repository.git
```

### Приложение не запускается

```bash
# Проверьте логи PM2
pm2 logs video-surveillance --lines 100

# Проверьте порт
sudo netstat -tulpn | grep :3000

# Попробуйте запустить вручную
node .output/server/index.mjs
```

### Nginx показывает 502 Bad Gateway

```bash
# Убедитесь что приложение запущено
pm2 status

# Проверьте логи Nginx
sudo tail -f /var/log/nginx/video-surveillance-error.log

# Перезапустите все
pm2 restart video-surveillance
sudo systemctl restart nginx
```

### SSL не работает

```bash
# Проверьте сертификат
sudo certbot certificates

# Обновите сертификат
sudo certbot renew

# Проверьте конфигурацию Nginx
sudo nginx -t
```

### Недостаточно памяти

```bash
# Проверьте использование памяти
free -h

# Настройте swap (если нет)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 🔐 Безопасность

### 1. Отключите вход по паролю (только SSH ключи)

```bash
sudo nano /etc/ssh/sshd_config
```

Измените:
```
PasswordAuthentication no
```

```bash
sudo systemctl restart ssh
```

### 2. Смените SSH порт (опционально)

```bash
sudo nano /etc/ssh/sshd_config
```

Измените:
```
Port 2222
```

```bash
sudo systemctl restart ssh
sudo ufw allow 2222/tcp
```

Теперь подключайтесь: `ssh -p 2222 root@ip`

### 3. Установите Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📊 Мониторинг

### Установка htop

```bash
sudo apt install htop -y
htop
```

### PM2 мониторинг

```bash
pm2 monit
```

### Логирование

```bash
# PM2 логи
pm2 logs video-surveillance

# Nginx логи
tail -f /var/log/nginx/video-surveillance-access.log
tail -f /var/log/nginx/video-surveillance-error.log
```

---

## 🚀 CI/CD (автоматический деплой)

### Создайте скрипт деплоя

```bash
nano /var/www/video-surveillance/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/video-surveillance
git pull origin main
pnpm install
pnpm build
pm2 restart video-surveillance
echo "Deploy completed!"
```

```bash
chmod +x deploy.sh
```

Теперь для обновления просто запускайте:
```bash
./deploy.sh
```

### GitHub Actions (опционально)

Создайте `.github/workflows/deploy.yml` в вашем репозитории:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/video-surveillance
            ./deploy.sh
```

---

## 📚 Дополнительные ресурсы

- [Nuxt Deployment Docs](https://nuxt.com/docs/getting-started/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/ru/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## ✅ Чеклист перед запуском

- [ ] Node.js и pnpm установлены
- [ ] PM2 установлен и настроен автозапуск
- [ ] Nginx установлен и настроен
- [ ] Файл .env создан с правильными значениями
- [ ] Проект собран (`pnpm build`)
- [ ] PM2 запущен (`pm2 start`)
- [ ] DNS настроен правильно
- [ ] SSL сертификат установлен
- [ ] Firewall настроен
- [ ] Сайт открывается по домену с HTTPS

---

**Готово! Ваш сайт теперь на продакшене!** 🎉

Если возникнут вопросы - проверьте раздел "Решение проблем" или логи приложения.

