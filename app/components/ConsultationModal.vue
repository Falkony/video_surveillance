<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false })

const form = reactive({
  name: '',
  phone: '',
  message: ''
})

const loading = ref(false)
const toast = useToast()

const validate = (state: any) => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Имя обязательно для заполнения' })
  if (!state.phone) errors.push({ path: 'phone', message: 'Телефон обязателен для заполнения' })
  if (state.phone && !/^[\d\s\+\-\(\)]+$/.test(state.phone)) {
    errors.push({ path: 'phone', message: 'Некорректный формат телефона' })
  }
  return errors
}

async function onSubmit(close: () => void) {
  loading.value = true
  
  try {
    // Отправка данных на сервер
    await $fetch('/api/consultation', {
      method: 'POST',
      body: {
        name: form.name,
        phone: form.phone,
        message: form.message
      }
    })
    
    toast.add({
      title: 'Заявка отправлена!',
      description: 'Мы свяжемся с вами в ближайшее время.',
      color: 'primary'
    })
    
    // Сброс формы
    form.name = ''
    form.phone = ''
    form.message = ''
    close()
  } catch (error: any) {
    console.error('Ошибка отправки:', error)
    toast.add({
      title: 'Ошибка отправки',
      description: error.data?.message || 'Не удалось отправить заявку. Попробуйте позже.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="isOpen" title="Получить консультацию">
    <template #body="{ close }">
      <UForm :state="form" :validate="validate" @submit="onSubmit(close)" class="space-y-4">
        <UFormField
          label="Ваше имя"
          name="name"
          required
        >
          <UInput
            v-model="form.name"
            placeholder="Иван Иванов"
            size="lg"
            :disabled="loading"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Телефон"
          name="phone"
          required
        >
          <UInput
            v-model="form.phone"
            placeholder="+7 (999) 123-45-67"
            type="tel"
            size="lg"
            :disabled="loading"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Сообщение"
          name="message"
          hint="Необязательно"
        >
          <UTextarea
            v-model="form.message"
            placeholder="Расскажите о ваших потребностях в видеонаблюдении..."
            :rows="4"
            size="lg"
            :disabled="loading"
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer="{ close }">
      <div class="flex gap-3 w-full">
        <UButton
          type="button"
          color="neutral"
          variant="outline"
          size="lg"
          block
          @click="close"
          :disabled="loading"
        >
          Закрыть
        </UButton>
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          :loading="loading"
          @click="onSubmit(close)"
        >
          Отправить
        </UButton>
      </div>
    </template>
  </UModal>
</template>

