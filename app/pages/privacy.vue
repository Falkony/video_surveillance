<script setup lang="ts">
useSeoMeta({
  title: 'Политика конфиденциальности',
  description: 'Политика конфиденциальности и обработки персональных данных'
})
</script>

<template>
  <div class="flex-1 flex flex-col min-h-full">
    <UContainer class="py-16 flex-1 flex flex-col">
      <div class="max-w-4xl mx-auto flex-1 flex flex-col">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Политика в отношении обработки персональных данных
        </h1>
        
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <!-- Здесь будет текст политики конфиденциальности -->
          <p class="text-gray-600 dark:text-gray-400">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati magnam quia debitis dicta ipsam facere similique alias dolorum, consequatur maxime blanditiis repellendus nulla modi cum omnis odio autem at harum.
          </p>
        </div>

        <div class="mt-12">
          <UButton
            to="/"
            icon="i-lucide-arrow-left"
            variant="outline"
            color="neutral"
          >
            Вернуться на главную
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
