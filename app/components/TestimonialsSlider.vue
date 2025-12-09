<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  company?: string;
}

const props = defineProps<{
  testimonials: Testimonial[];
}>();

const modules = [Pagination, EffectCoverflow];
</script>

<template>
  <div class="relative w-full testimonials-slider">
    <!-- Мобильная версия: 1 слайд -->
    <div class="block lg:hidden">
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="20"
        :pagination="{
          clickable: true,
          dynamicBullets: true,
        }"
        :loop="true"
        :auto-height="true"
        class="testimonials-swiper-mobile"
      >
        <SwiperSlide v-for="(testimonial, index) in testimonials" :key="index">
          <div class="p-8 pb-12 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl h-full">
            <!-- Рейтинг -->
            <div class="flex gap-1 mb-4">
              <svg
                v-for="star in 5"
                :key="star"
                class="w-5 h-5 text-yellow-500 fill-yellow-500"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            <!-- Цитата -->
            <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 italic line-clamp-[8]">
              "{{ testimonial.quote }}"
            </p>

            <!-- Автор -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div class="font-bold text-gray-900 dark:text-white">
                {{ testimonial.author }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ testimonial.role }}
              </div>
              <div v-if="testimonial.company" class="text-xs text-primary mt-1">
                {{ testimonial.company }}
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Десктопная версия: 3 слайда с эффектом coverflow -->
    <div class="hidden lg:block">
      <Swiper
        :modules="modules"
        :slides-per-view="3"
        :space-between="40"
        :centered-slides="true"
        :pagination="{
          clickable: true,
          dynamicBullets: true,
        }"
        :loop="true"
        :effect="'coverflow'"
        :coverflow-effect="{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2,
          slideShadows: false,
        }"
        :breakpoints="{
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 50,
          }
        }"
        class="testimonials-swiper-desktop"
      >
        <SwiperSlide v-for="(testimonial, index) in testimonials" :key="index">
          <div class="p-8 pb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl h-full transition-all duration-300 hover:border-primary dark:hover:border-primary">
            <!-- Рейтинг -->
            <div class="flex gap-1 mb-4">
              <svg
                v-for="star in 5"
                :key="star"
                class="w-5 h-5 text-yellow-500 fill-yellow-500"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            <!-- Цитата -->
            <p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6 italic line-clamp-6">
              "{{ testimonial.quote }}"
            </p>

            <!-- Автор -->
            <div class="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div>
                <div class="font-bold text-gray-900 dark:text-white">
                  {{ testimonial.author }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ testimonial.role }}
                </div>
                <div v-if="testimonial.company" class="text-xs text-primary mt-1">
                  {{ testimonial.company }}
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<style>
/* Стили для пагинации */
.testimonials-slider :deep(.swiper-pagination) {
  bottom: 0 !important;
  padding-top: 20px;
}

.testimonials-slider :deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: rgb(209 213 219);
  opacity: 1;
  transition: all 0.3s;
}

.dark .testimonials-slider :deep(.swiper-pagination-bullet) {
  background: rgb(75 85 99);
}

.testimonials-slider :deep(.swiper-pagination-bullet-active) {
  width: 32px;
  border-radius: 4px;
  background: rgb(var(--color-primary-500));
}

.testimonials-slider :deep(.swiper-pagination-bullet):hover {
  background: rgb(var(--color-primary-400));
}

/* Стили для мобильного swiper */
.testimonials-swiper-mobile {
  padding: 0 16px 50px;
}

/* Стили для десктопного swiper */
.testimonials-swiper-desktop {
  padding: 20px 40px 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.testimonials-swiper-desktop :deep(.swiper-slide) {
  transition: all 0.3s;
  width: auto !important;
}

.testimonials-swiper-desktop :deep(.swiper-slide-active) {
  transform: scale(1.05);
  z-index: 10;
}

.testimonials-swiper-desktop :deep(.swiper-slide:not(.swiper-slide-active)) {
  opacity: 0.6;
}
</style>

