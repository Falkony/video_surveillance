<script setup lang="ts">
// Данные о сертификатах
const certificates = [
  {
    image: '/images/dahua_certs/1.jpg',
    person: 'Андрей Лебедев',
    title: 'DHCA - DoLynk',
    description: 'Cloud Management System Certified Associate'
  },
  {
    image: '/images/dahua_certs/2.jpg',
    person: 'Пётр Лаптев',
    title: 'DHCA - DoLynk',
    description: 'Cloud Management System Certified Associate'
  },
  {
    image: '/images/dahua_certs/3.jpg',
    person: 'Алексей Ватулин',
    title: 'DHCA - DoLynk',
    description: 'Cloud Management System Certified Associate'
  },
  {
    image: '/images/dahua_certs/4.jpg',
    person: 'Андрей Лебедев',
    title: 'DHCP - IPVSS',
    description: 'IP Video Surveillance System Certified Professional'
  },
  {
    image: '/images/dahua_certs/5.jpg',
    person: 'Алексей Ватулин',
    title: 'DHCP - IPVSS',
    description: 'IP Video Surveillance System Certified Professional'
  },
  {
    image: '/images/dahua_certs/6.jpg',
    person: 'Пётр Лаптев',
    title: 'DHCP - IPVSS',
    description: 'IP Video Surveillance System Certified Professional'
  },
];

// Lightbox состояние
const isLightboxOpen = ref(false);
const currentIndex = ref(0);

const openLightbox = (index: number) => {
  currentIndex.value = index;
  isLightboxOpen.value = true;
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
};

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % certificates.length;
};

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + certificates.length) % certificates.length;
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
  <div class="certificates-gallery">
    <!-- Сетка сертификатов -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      <div
        v-for="(cert, index) in certificates"
        :key="index"
        class="group relative cursor-pointer"
        @click="openLightbox(index)"
      >
        <!-- Карточка сертификата -->
        <div class="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-500 hover:border-primary/50 dark:hover:border-primary/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
          <!-- Изображение -->
          <div class="aspect-[3/4] overflow-hidden">
            <img
              :src="cert.image"
              :alt="`Сертификат Dahua - ${cert.person}`"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          
          <!-- Overlay при наведении -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div class="text-white font-bold text-sm mb-1">{{ cert.person }}</div>
              <div class="text-primary-300 text-xs font-medium">{{ cert.title }}</div>
            </div>
            
            <!-- Иконка увеличения -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
              <UIcon name="i-lucide-zoom-in" class="w-6 h-6 text-white" />
            </div>
          </div>
          
          <!-- Градиентный фон снизу для читаемости текста в overlay -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isLightboxOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div 
            class="absolute inset-0 bg-black/90 backdrop-blur-sm"
            @click="closeLightbox"
          />
          
          <!-- Modal Content -->
          <div class="relative z-10 w-full max-w-4xl">
            <!-- Кнопка закрытия -->
            <button
              @click="closeLightbox"
              class="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
            >
              <UIcon name="i-lucide-x" class="w-6 h-6 text-white" />
            </button>

            <!-- Изображение -->
            <div class="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
              <img
                :src="certificates[currentIndex].image"
                :alt="`Сертификат Dahua - ${certificates[currentIndex].person}`"
                class="w-full h-auto max-h-[80vh] object-contain"
              />
              
              <!-- Информация о сертификате -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div class="text-white font-bold text-lg">{{ certificates[currentIndex].person }}</div>
                <div class="text-primary-300 font-medium">{{ certificates[currentIndex].title }}</div>
                <div class="text-gray-300 text-sm">{{ certificates[currentIndex].description }}</div>
              </div>
            </div>

            <!-- Кнопки навигации -->
            <button
              @click.stop="prevImage"
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
            >
              <UIcon name="i-lucide-chevron-left" class="w-8 h-8 text-white" />
            </button>
            
            <button
              @click.stop="nextImage"
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
            >
              <UIcon name="i-lucide-chevron-right" class="w-8 h-8 text-white" />
            </button>

            <!-- Счётчик -->
            <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {{ currentIndex + 1 }} / {{ certificates.length }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.certificates-gallery {
  width: 100%;
}
</style>
