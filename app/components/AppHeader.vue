<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { activeHeadings, updateHeadings } = useScrollspy();

const isModalOpen = ref(false)

const items = computed(() => [
  {
    label: "Услуги",
    to: "#section",
    active: activeHeadings.value.includes("section"),
  },
  {
    label: "Прайс-лист",
    to: "#projects",
    active: activeHeadings.value.includes("projects"),
  },
  {
    label: "Отзывы",
    to: "#reviews",
    active: activeHeadings.value.includes("reviews"),
  },
]);

nuxtApp.hooks.hookOnce("page:finish", () => {
  updateHeadings(
    [
      document.querySelector("#section"),
      document.querySelector("#projects"),
      document.querySelector("#reviews"),
    ].filter(Boolean) as Element[],
  );
});

function openModal() {
  isModalOpen.value = true
}
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <template #right>
      <UNavigationMenu :items="items" variant="link" class="hidden lg:block" />

      <UButton label="Консультация" variant="subtle" class="hidden lg:block" @click="openModal" />

      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      <UButton class="mt-4" label="Консультация" variant="subtle" block @click="openModal" />
      
      <!-- Копирайт и юридическая информация -->
      <div class="absolute bottom-0 left-0 right-0 pt-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div class="flex flex-col items-center gap-2 text-center px-4 pb-4">
          <AppCopyright />
          <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            ИП Лебедев Андрей Владимирович<br />
            ИНН 526098859192<br />
            ОГРН 325527500022552
          </p>
        </div>
      </div>
    </template>
  </UHeader>

  <ConsultationModal v-model="isModalOpen" />
</template>
