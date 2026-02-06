#!/bin/bash

# Скрипт для обновления проекта на сервере
# Использование: ./update-server.sh

echo "🚀 Начинаем обновление проекта..."

# Остановить приложение
echo "⏸️  Остановка приложения..."
pm2 stop video-surveillance

# Получить последние изменения
echo "📥 Получение последних изменений..."
git pull origin master

# Установить новые зависимости
echo "📦 Установка зависимостей..."
pnpm install

# Очистить старые сборки
echo "🧹 Очистка кеша..."
rm -rf .nuxt .output node_modules/.cache

# Пересобрать проект
echo "🔨 Сборка проекта..."
pnpm build

# Запустить приложение
echo "▶️  Запуск приложения..."
pm2 start video-surveillance

# Сохранить список процессов
pm2 save

# Показать статус
echo "✅ Обновление завершено!"
echo ""
pm2 status
echo ""
echo "📋 Последние 20 строк логов:"
pm2 logs video-surveillance --lines 20 --nostream

