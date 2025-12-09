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
    label: "Возможности",
    to: "#features",
    active:
      activeHeadings.value.includes("features") &&
      !activeHeadings.value.includes("pricing"),
  },
  {
    label: "Прайс-лист",
    to: "#pricing",
    active: activeHeadings.value.includes("pricing"),
  },
  {
    label: "Отзывы",
    to: "#testimonials",
    active:
      activeHeadings.value.includes("testimonials") &&
      !activeHeadings.value.includes("pricing"),
  },
]);

nuxtApp.hooks.hookOnce("page:finish", () => {
  updateHeadings(
    [
      document.querySelector("#section"),
      document.querySelector("#features"),
      document.querySelector("#pricing"),
      document.querySelector("#testimonials"),
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
    </template>
  </UHeader>

  <ConsultationModal v-model="isModalOpen" />
</template>
