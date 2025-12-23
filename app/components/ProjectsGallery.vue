<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, EffectCreative, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const modules = [Navigation, EffectCreative, Pagination];

// Генерируем массив с путями к 50 изображениям
const images = Array.from({ length: 50 }, (_, i) => `/images/examples/${i + 1}.${i === 49 ? 'png' : 'jpg'}`);

// Swiper ref
const swiperInstance = ref<any>(null);

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper;
};

const goNext = () => {
  swiperInstance.value?.slideNext();
};

const goPrev = () => {
  swiperInstance.value?.slidePrev();
};

// Lightbox состояние
const isLightboxOpen = ref(false);
const currentImageIndex = ref(0);

const openLightbox = (index: number) => {
  currentImageIndex.value = index;
  
  // Предзагружаем изображение перед открытием модалки
  const img = new Image();
  img.src = images[index];
  img.onload = () => {
    isLightboxOpen.value = true;
  };
  
  // Если изображение уже в кеше, откроем сразу
  if (img.complete) {
    isLightboxOpen.value = true;
  }
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
};

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.length) % images.length;
};

// Обработка клавиатуры
const handleKeydown = (e: KeyboardEvent) => {
  if (!isLightboxOpen.value) return;
  
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="relative h-full">
    <!-- Заголовок -->
    <div class="mb-8 min-h-[44px] flex items-end">
      <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Примеры работ
      </h3>
    </div>

    <!-- Слайдер с эффектом cards -->
    <div class="relative">
      <Swiper
        @swiper="onSwiper"
        :modules="modules"
        :slides-per-view="1"
        :space-between="20"
        :loop="true"
        :speed="600"
        :effect="'creative'"
        :creative-effect="{
          prev: {
            shadow: false,
            translate: ['-10%', 0, -1],
            opacity: 0,
          },
          next: {
            translate: ['100%', 0, 0],
            opacity: 0,
          },
        }"
        :pagination="{
          clickable: true,
          dynamicBullets: true,
        }"
        class="projects-swiper"
      >
        <SwiperSlide
          v-for="(image, index) in images"
          :key="index"
          class="swiper-slide-custom"
        >
          <div 
            class="relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer"
            @click="openLightbox(index)"
          >
            <div class="aspect-[3/2] overflow-hidden">
              <NuxtImg
                :src="image"
                :alt="`Пример работы ${index + 1}`"
                class="w-full h-full object-cover"
                loading="lazy"
                format="webp"
                quality="85"
              />
            </div>
            
            <!-- Overlay с иконкой лупы при наведении -->
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
                <UIcon name="i-lucide-zoom-in" class="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Кнопки навигации для слайдера -->
      <button 
        class="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 transition-colors flex items-center justify-center shadow-lg group cursor-pointer"
        @click.stop="goPrev"
      >
        <UIcon name="i-lucide-chevron-left" class="w-6 h-6 text-gray-800 dark:text-white group-hover:scale-110 transition-transform" />
      </button>
      
      <button 
        class="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 transition-colors flex items-center justify-center shadow-lg group cursor-pointer"
        @click.stop="goNext"
      >
        <UIcon name="i-lucide-chevron-right" class="w-6 h-6 text-gray-800 dark:text-white group-hover:scale-110 transition-transform" />
      </button>

      <!-- Декоративные элементы -->
      <div class="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
      <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />
    </div>

    <!-- Lightbox Modal через Teleport -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isLightboxOpen" class="fixed inset-0 z-[9999] flex items-center justify-center">
          <!-- Backdrop -->
          <div 
            class="absolute inset-0 bg-black/80 backdrop-blur-sm"
            @click="closeLightbox"
          />
          
          <!-- Modal Content -->
          <div class="relative z-10 w-full max-w-5xl mx-4 bg-gray-900 dark:bg-gray-950 rounded-xl shadow-2xl">
            <!-- Кнопка закрытия -->
            <button
              @click="closeLightbox"
              class="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <UIcon name="i-lucide-x" class="w-6 h-6 text-white" />
            </button>

            <!-- Изображение -->
            <div class="relative flex items-center justify-center p-4 min-h-[500px]">
              <img
                v-if="isLightboxOpen"
                :src="images[currentImageIndex]"
                :alt="`Пример работы ${currentImageIndex + 1}`"
                class="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.projects-swiper {
  width: 100%;
  height: auto;
  padding-bottom: 50px;
}

.projects-swiper :deep(.swiper-pagination) {
  bottom: 10px;
}

.projects-swiper :deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: rgba(var(--color-primary-500), 0.3);
  opacity: 1;
  transition: all 0.3s ease;
}

.projects-swiper :deep(.swiper-pagination-bullet-active) {
  background: rgb(var(--color-primary-500));
  width: 24px;
  border-radius: 4px;
}

.swiper-slide-custom {
  height: auto;
}
</style>

