# 🚀 Быстрая шпаргалка по деплою

## Краткая последовательность команд

### 1️⃣ На сервере: Установка ПО (один раз)

```bash
# Подключение
ssh root@ваш_ip

# Обновление системы
sudo apt update && sudo apt upgrade -y

# Node.js через nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# pnpm и PM2
npm install -g pnpm pm2

# Git, Nginx, Certbot
sudo apt install git nginx certbot python3-certbot-nginx -y
```

### 2️⃣ Загрузка проекта

```bash
# Создание директории
cd /var/www
sudo mkdir -p video-surveillance
sudo chown -R $USER:$USER video-surveillance
cd video-surveillance

# Загрузка через Git
git clone https://github.com/your-repo/video-surveillance.git .

# ИЛИ с локального компьютера через SCP:
# scp -r D:\Work\additional\video_surveillance root@ip:/var/www/video-surveillance/
```

### 3️⃣ Настройка .env

```bash
nano .env
```

```env
NUXT_TELEGRAM_BOT_TOKEN=ваш_токен
NUXT_TELEGRAM_CHAT_ID=ваш_chat_id
NUXT_PUBLIC_SITE_URL=https://yourdomain.ru
```

### 4️⃣ Сборка и запуск

```bash
pnpm install
pnpm build
pm2 start .output/server/index.mjs --name video-surveillance
pm2 save
pm2 startup
```

### 5️⃣ Nginx конфигурация

```bash
sudo nano /etc/nginx/sites-available/video-surveillance
```

```nginx
server {
    listen 80;
    server_name yourdomain.ru www.yourdomain.ru;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/video-surveillance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6️⃣ SSL сертификат

```bash
sudo certbot --nginx -d yourdomain.ru -d www.yourdomain.ru
```

### 7️⃣ Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## ✅ Готово!

Откройте: `https://yourdomain.ru`

---

## 🔄 Обновление проекта

```bash
cd /var/www/video-surveillance
git pull
pnpm install
pnpm build
pm2 restart video-surveillance
```

## 📝 Полезные команды

```bash
pm2 status              # Статус
pm2 logs                # Логи
pm2 restart all         # Перезапуск
sudo systemctl restart nginx  # Перезапуск Nginx
```

---

Подробная инструкция в **DEPLOYMENT_GUIDE.md**

