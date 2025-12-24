<script setup lang="ts">
const { isLoading } = useLoadingIndicator();

const appear = ref(false);
const appeared = ref(false);
const parallaxOffset = ref(0);

onMounted(() => {
  setTimeout(() => {
    appear.value = true;
    setTimeout(() => {
      appeared.value = true;
    }, 1000);
  }, 0);

  // Параллакс эффект
  const handleScroll = () => {
    parallaxOffset.value = window.scrollY * 0.5;
  };

  window.addEventListener('scroll', handleScroll);

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>

<template>
  <div
    class="absolute inset-0 w-full h-full overflow-hidden transition-all shrink-0 -z-10"
    :class="[
      isLoading ? 'animate-pulse' : appear ? '' : 'opacity-0',
      appeared ? 'duration-400' : 'duration-1000',
    ]"
  >
    <!-- Фоновое изображение -->
    <div class="absolute inset-0 w-full h-full">
      <div class="absolute inset-0 w-full h-full" :style="{ transform: `translateY(${parallaxOffset}px)` }">
        <img 
          src="/images/background.jpg" 
          alt="Профессиональные системы видеонаблюдения и безопасности" 
          class="w-full h-full object-cover scale-110"
        />
      </div>
      <!-- Затемнение с градиентом -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 dark:from-black/70 dark:via-black/60 dark:to-black/80"></div>
      
      <!-- Анимированные декоративные элементы -->
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/15 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
    </div>
  </div>
</template>
