<script setup lang="ts">
const columns = [
  {
    label: "Услуги",
    children: [
      {
        label: "Видеонаблюдение для дома",
      },
      {
        label: "Видеонаблюдение для бизнеса",
      },
      {
        label: "Обслуживание систем",
      },
      {
        label: "Модернизация",
      },
    ],
  },
  {
    label: "Решения",
    children: [
      {
        label: "IP-камеры",
      },
      {
        label: "Облачное хранилище",
      },
      {
        label: "Мобильное приложение",
      },
      {
        label: "Аналитика",
      },
    ],
  },
  {
    label: "Компания",
    children: [
      {
        label: "О нас",
      },
      {
        label: "Наши проекты",
      },
      {
        label: "Контакты",
      },
      {
        label: "Блог",
      },
    ],
  },
];

const toast = useToast();

const email = ref("");
const loading = ref(false);

function onSubmit() {
  loading.value = true;

  toast.add({
    title: "Спасибо за подписку!",
    description: "Вы успешно подписались на нашу рассылку.",
  });
  
  // Сброс формы после короткой задержки
  setTimeout(() => {
    email.value = "";
    loading.value = false;
  }, 1000);
}
</script>

<template>
  <USeparator icon="i-lucide-camera" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="Подпишитесь на новости и акции"
                size="lg"
              >
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  placeholder="Введите ваш email"
                  required
                >
                  <template #trailing>
                    <UButton type="submit" size="xs" label="Подписаться" :loading="loading" />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <AppCopyright />
    </template>

    <template #right>
      <UButton
        to="tel:+79999999999"
        icon="i-lucide-phone"
        aria-label="Позвонить"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="mailto:info@videosurveillance.ru"
        icon="i-lucide-mail"
        aria-label="Написать email"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://t.me/videosurveillance"
        target="_blank"
        icon="i-simple-icons-telegram"
        aria-label="Telegram"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
