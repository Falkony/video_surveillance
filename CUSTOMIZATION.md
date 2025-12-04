# Руководство по настройке

## Быстрая настройка контента

### 1. Основная информация

Откройте `content/index.yml` и измените базовую информацию:

```yaml
seo:
  title: Ваше название компании
  description: Ваше описание
title: Ваш заголовок [с акцентом]{.text-primary}
description: Подзаголовок для вашей компании
```

### 2. Тарифы

Настройте тарифные планы в секции `pricing`:

```yaml
pricing:
  plans:
    - title: Название тарифа
      description: Описание тарифа
      price: от 25 000 ₽
      features:
        - Особенность 1
        - Особенность 2
```

### 3. Отзывы

Измените отзывы клиентов в секции `testimonials`:

```yaml
testimonials:
  items:
    - quote: Текст отзыва
      user:
        name: Имя клиента
        description: Должность
```

### 4. Контактная информация

В `app/components/AppFooter.vue` обновите контакты:

```vue
<UButton
  to="tel:+79999999999"  <!-- Ваш телефон -->
  icon="i-lucide-phone"
/>
<UButton
  to="mailto:info@example.ru"  <!-- Ваш email -->
  icon="i-lucide-mail"
/>
```

### 5. Цветовая схема

В `app/app.config.ts` измените цвета:

```typescript
colors: {
  primary: 'blue', // blue, green, red, orange, purple, etc.
  neutral: 'neutral'
}
```

Доступные цвета:
- `blue` - Синий (по умолчанию для видеонаблюдения)
- `green` - Зеленый
- `red` - Красный
- `orange` - Оранжевый
- `purple` - Фиолетовый
- `cyan` - Голубой
- `amber` - Янтарный

### 6. Логотип

Логотип находится в `app/components/AppLogo.vue`. Вы можете:
- Заменить SVG на свой
- Использовать изображение: `<img src="/logo.png" alt="Logo" />`
- Изменить текст

### 7. Навигация

Измените пункты меню в `app/components/AppHeader.vue`:

```typescript
const items = computed(() => [
  { label: "Ваш пункт 1", to: "#section1" },
  { label: "Ваш пункт 2", to: "#section2" },
])
```

## Часто задаваемые вопросы

### Как изменить изображения?

Поместите свои изображения в папку `public/images/` и обновите пути в `content/index.yml`.

### Как добавить новую секцию?

1. Добавьте данные в `content/index.yml`
2. Добавьте компонент в `app/pages/index.vue`
3. Обновите схему в `content.config.ts` при необходимости

### Как изменить шрифты?

Добавьте Google Fonts в `app/app.vue` или используйте локальные шрифты в `app/assets/css/main.css`.

### Как добавить аналитику?

Установите модуль Nuxt Google Analytics или добавьте скрипты в `app/app.vue`.

## Дополнительная помощь

- [Документация Nuxt](https://nuxt.com/docs)
- [Документация Nuxt UI](https://ui.nuxt.com/docs)
- [Документация Nuxt Content](https://content.nuxt.com/docs)

