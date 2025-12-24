<script setup lang="ts">
const config = useRuntimeConfig();
const metrikaId = config.public.yandexMetrikaId;

// Инициализация Яндекс.Метрики только на клиенте
onMounted(() => {
  if (!metrikaId || !import.meta.client) return;

  // Загрузка скрипта Яндекс.Метрики
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.innerHTML = `
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(${metrikaId}, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true,
      ecommerce:"dataLayer"
    });
  `;
  document.head.appendChild(script);

  // Добавление noscript
  const noscript = document.createElement('noscript');
  const div = document.createElement('div');
  const img = document.createElement('img');
  img.src = `https://mc.yandex.ru/watch/${metrikaId}`;
  img.style.position = 'absolute';
  img.style.left = '-9999px';
  img.alt = '';
  div.appendChild(img);
  noscript.appendChild(div);
  document.body.appendChild(noscript);
});
</script>

<template>
  <div v-if="metrikaId" />
</template>

