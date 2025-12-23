<script setup lang="ts">
interface PriceItem {
  service: string;
  price: string;
}

interface PriceCategory {
  name: string;
  icon: string;
  items: PriceItem[];
}

interface Props {
  categories: PriceCategory[];
  note?: string;
}

const props = defineProps<Props>();

const activeCategory = ref(0);
</script>

<template>
  <div class="relative h-full">
    <!-- Заголовок -->
    <div class="mb-8 min-h-[44px] flex items-end">
      <div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Прайс-лист
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Прозрачные цены без скрытых платежей
        </p>
      </div>
    </div>

    <!-- Табы категорий -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="(category, index) in categories"
        :key="index"
        @click="activeCategory = index"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium',
          activeCategory === index
            ? 'bg-primary text-white shadow-lg shadow-primary/30'
            : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
        ]"
      >
        <UIcon :name="category.icon" class="w-4 h-4" />
        <span class="hidden sm:inline">{{ category.name }}</span>
      </button>
    </div>

    <!-- Список цен -->
    <div class="mb-8 min-h-[360px]">
      <TransitionGroup name="price-list" mode="out-in">
        <div
          :key="activeCategory"
          class="grid grid-cols-1 gap-3"
        >
          <div
            v-for="(item, index) in categories[activeCategory].items"
            :key="`item-${index}`"
            class="group relative p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
          >
            <!-- Декоративная линия слева -->
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div class="flex items-center justify-between gap-4">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                  {{ item.service }}
                </p>
              </div>
              <div class="flex-shrink-0">
                <p class="text-base font-bold text-primary whitespace-nowrap">
                  {{ item.price }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Примечание -->
    <div v-if="note" class="p-4 rounded-xl bg-primary/5 border border-primary/20">
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <UIcon name="i-lucide-info" class="w-4 h-4 text-primary" />
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            {{ note }}
          </p>
        </div>
      </div>
    </div>

    <!-- Кнопка консультации -->
    <div class="mt-6">
      <UButton
        label="Получить расчёт"
        icon="i-lucide-calculator"
        trailing
        color="primary"
        size="lg"
        block
        class="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
        @click="$emit('open-modal')"
      />
    </div>

    <!-- Декоративные элементы -->
    <div class="absolute -top-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
    <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/5 rounded-full blur-3xl -z-10" />
  </div>
</template>

<style scoped>
/* Анимация появления элементов */
.price-list-enter-active {
  transition: all 0.25s ease-out;
}

.price-list-leave-active {
  transition: all 0.2s ease-in;
  position: absolute;
  width: 100%;
}

.price-list-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.price-list-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}

.price-list-move {
  transition: transform 0.25s ease;
}
</style>

