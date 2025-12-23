<script setup lang="ts">
const columns = [
  {
    label: "Информация",
    children: [
      {
        label: "Наши проекты",
        to: "#projects",
      },
      {
        label: "Прайс-лист",
        to: "#projects",
      },
      {
        label: "Отзывы клиентов",
        to: "#reviews",
      },
      {
        label: "О компании",
        to: "#section",
      },
    ],
  },
  {
    label: "Контакты",
    children: [
      {
        label: "+7 904 782 9997",
        to: "tel:+79047829997",
        icon: "i-lucide-phone",
      },
      {
        label: "vss@nn-video.ru",
        to: "mailto:vss@nn-video.ru",
        icon: "i-lucide-mail",
      },
      {
        label: "@summer_andy",
        to: "https://t.me/summer_andy",
        icon: "i-simple-icons-telegram",
        target: "_blank",
      },
    ],
  },
];
</script>

<template>
  <USeparator icon="i-lucide-camera" class="h-px z-10 relative" />

  <footer class="relative overflow-hidden bg-gray-50 dark:bg-gray-950">
    <!-- Декоративные фоновые элементы -->
    <div class="hidden lg:block absolute rounded-full left-1/4 top-0 size-[400px] bg-primary/10 blur-[120px] -z-10" />
    <div class="hidden lg:block absolute rounded-full right-1/4 bottom-0 size-[400px] bg-primary/5 blur-[120px] -z-10" />
    
    <!-- Основной контент футера -->
    <UContainer class="py-12 md:py-16">
      <div class="flex flex-col md:flex-row justify-center gap-8 md:gap-20 max-w-5xl mx-auto">
        <!-- Колонка 1: О компании -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left flex-1">
          <div class="mb-3">
            <AppLogo />
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Профессиональные системы видеонаблюдения и безопасности для вашего дома и бизнеса
          </p>
          <div class="flex flex-wrap gap-2 justify-center md:justify-start">
            <UBadge color="primary" variant="subtle" size="sm">
              <UIcon name="i-lucide-award" class="w-3 h-3 mr-1" />
              <span class="hidden md:inline">7+ лет</span>
              <span class="md:hidden">7+ лет на рынке</span>
            </UBadge>
            <UBadge color="green" variant="subtle" size="sm">
              <UIcon name="i-lucide-briefcase" class="w-3 h-3 mr-1" />
              500+ проектов
            </UBadge>
          </div>
        </div>

        <!-- Колонка 2: Информация и Контакты -->
        <div class="grid grid-cols-2 gap-6 md:gap-12 flex-1 px-2 md:px-0">
          <!-- Информация -->
          <div class="flex flex-col items-start text-left px-5">
            <h3 class="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-3 md:mb-4">Информация</h3>
            <ul class="space-y-2">
              <li v-for="item in columns[0].children" :key="item.label">
                <ULink 
                  :to="item.to" 
                  class="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1 md:gap-2 group"
                >
                  <UIcon name="i-lucide-chevron-right" class="w-3 h-3 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  <span class="break-words">{{ item.label }}</span>
                </ULink>
              </li>
            </ul>
          </div>

          <!-- Контакты -->
          <div class="flex flex-col items-start text-left px-5">
            <h3 class="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-3 md:mb-4">Контакты</h3>
            <ul class="space-y-2">
              <li v-for="item in columns[1].children" :key="item.label">
                <ULink 
                  :to="item.to" 
                  :target="item.target"
                  class="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1 md:gap-2"
                >
                  <UIcon v-if="item.icon" :name="item.icon" class="w-3 h-3 flex-shrink-0" />
                  <span class="break-words">{{ item.label }}</span>
                </ULink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Копирайт -->
    <div class="border-t border-gray-200 dark:border-gray-800">
      <UContainer class="py-4 md:py-6">
        <div class="flex flex-col items-center gap-2 text-center px-4">
          <AppCopyright />
          <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            ИП Лебедев Андрей Владимирович<br class="sm:hidden" />
            <span class="hidden sm:inline"> | </span>
            ИНН 526098859192<br class="sm:hidden" />
            <span class="hidden sm:inline"> | </span>
            ОГРН 325527500022552
          </p>
        </div>
      </UContainer>
    </div>
  </footer>
</template>
