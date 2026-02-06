<script setup lang="ts">
import { MaskInput } from 'maska'

const isOpen = defineModel<boolean>({ default: false })

const form = reactive({
  name: '',
  phone: '',
  message: '',
  consent: false
})

const phoneInputRef = ref<{ $el: HTMLElement } | null>(null)
let maskInstance: MaskInput | null = null

function initMask() {
  if (phoneInputRef.value?.$el) {
    const input = phoneInputRef.value.$el.querySelector('input')
    if (input && !maskInstance) {
      maskInstance = new MaskInput(input, { mask: '+7(###)-###-##-##', eager: true })
    }
  }
}

watch(isOpen, (open) => {
  if (open) {
    nextTick(() => {
      setTimeout(initMask, 50) // Небольшая задержка для рендера модалки
    })
  } else {
    maskInstance?.destroy()
    maskInstance = null
  }
})

onUnmounted(() => {
  maskInstance?.destroy()
})

const loading = ref(false)
const toast = useToast()

const validate = (state: any) => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Имя обязательно для заполнения' })
  if (!state.phone) errors.push({ path: 'phone', message: 'Телефон обязателен для заполнения' })
  // Проверяем, что введены все 11 цифр (полный номер в формате +7(xxx)-xxx-xx-xx)
  if (state.phone && state.phone.replace(/\D/g, '').length < 11) {
    errors.push({ path: 'phone', message: 'Введите полный номер телефона' })
  }
  if (!state.consent) errors.push({ path: 'consent', message: 'Необходимо дать согласие на обработку данных' })
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
    form.consent = false
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
            ref="phoneInputRef"
            v-model="form.phone"
            placeholder="+7(___)-___-__-__"
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

        <UFormField name="consent">
          <UCheckbox
            v-model="form.consent"
            :disabled="loading"
          >
            <template #label>
              <span class="text-sm">
                Я даю согласие на обработку персональных данных в соответствии с
                <NuxtLink to="/privacy" class="text-primary-500 hover:text-primary-600 underline">политикой конфиденциальности</NuxtLink>
              </span>
            </template>
          </UCheckbox>
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
          :disabled="!form.consent"
          @click="onSubmit(close)"
        >
          Отправить
        </UButton>
      </div>
    </template>
  </UModal>
</template>

