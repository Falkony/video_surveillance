<script setup lang="ts">
const colorMode = useColorMode();
const config = useRuntimeConfig();

const color = computed(() =>
  colorMode.value === "dark" ? "#171717" : "white",
);

const siteUrl = config.public.siteUrl || 'https://nnvss.ru';

useHead({
  titleTemplate: '%s | Видеонаблюдение в Нижнем Новгороде',
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
    { name: "format-detection", content: "telephone=no" },
    { name: "author", content: "ИП Лебедев Андрей Владимирович" },
    { name: "copyright", content: "© 2025 nnvss.ru" },
    { name: "robots", content: "index, follow" },
    { name: "googlebot", content: "index, follow" },
    { name: "yandex", content: "index, follow" },
    { name: "geo.region", content: "RU-NIZ" },
    { name: "geo.placename", content: "Нижний Новгород" },
    { name: "geo.position", content: "56.326887;44.005986" },
    { name: "ICBM", content: "56.326887, 44.005986" },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
    { rel: "canonical", href: siteUrl },
  ],
  htmlAttrs: {
    lang: "ru",
  },
});

useSeoMeta({
  ogType: "website",
  ogLocale: "ru_RU",
  ogSiteName: "Видеонаблюдение в Нижнем Новгороде",
  ogImage: `${siteUrl}/og-image.jpg`,
  ogImageWidth: "1200",
  ogImageHeight: "630",
  ogImageType: "image/jpeg",
  twitterCard: "summary_large_image",
  twitterImage: `${siteUrl}/og-image.jpg`,
  twitterSite: "@nnvss_ru",
});
</script>

<template>
  <UApp :toaster="{ expand: false }">
    <AppHeader />

    <UMain>
      <NuxtPage />
    </UMain>

    <AppFooter />
  </UApp>
</template>
