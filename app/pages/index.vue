<script setup lang="ts">
const { data: page } = await useAsyncData("index", () =>
  queryCollection("content").first(),
);
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Страница не найдена",
    fatal: true,
  });
}

useSeoMeta({
  title: page.value.seo?.title || page.value.title,
  ogTitle: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
  ogDescription: page.value.seo?.description || page.value.description,
});

const isModalOpen = ref(false);

const scrollToSection = () => {
  const section = document.getElementById('section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<template>
  <div v-if="page" class="relative overflow-x-hidden">
    <div class="relative overflow-x-hidden hero-section min-h-screen flex items-center justify-center">
      <HeroBackground />
      
      <UPageHero
        :description="page.description"
        :ui="{
          container: 'relative z-10 px-4 sm:px-6 py-20 w-full max-w-7xl mx-auto',
          title: 'w-full px-4 text-center',
          description: 'px-4 text-center',
        }"
      >

        <template #title>
          <div class="animate-fade-in-up opacity-0" style="animation-delay: 0.2s;">
            <div class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span class="bg-gradient-to-r from-white via-blue-100 to-primary-300 bg-clip-text text-transparent drop-shadow-2xl">
                <MDC :value="page.title" unwrap="p" class="inline" />
              </span>
            </div>
          </div>
          <p v-if="page.subtitle" class="text-white/90 text-base sm:text-xl md:text-2xl lg:text-3xl font-medium mt-4 sm:mt-6 animate-fade-in-up opacity-0 drop-shadow-lg" style="animation-delay: 0.4s;">
            {{ page.subtitle }}
          </p>
        </template>

        <template #description>
          <p class="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl mx-auto animate-fade-in-up opacity-0 drop-shadow-md leading-relaxed" style="animation-delay: 0.6s;">{{ page.description }}</p>
        </template>

        <template #links>
          <div class="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up opacity-0" style="animation-delay: 0.8s;">
            <UButton
              v-for="(link, index) in page.hero.links"
              :key="index"
              :label="link.label"
              :icon="link.icon"
              :trailing="link.trailing"
              :color="link.color"
              :variant="link.variant"
              :size="link.size"
              @click="
                link.label === 'Получить консультацию'
                  ? (isModalOpen = true)
                  : null
              "
              :to="link.label !== 'Получить консультацию' ? link.to : undefined"
            />
          </div>
        </template>
      </UPageHero>
      
      <!-- Иконка скролла вниз -->
      <div class="absolute bottom-16 sm:bottom-32 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <a 
          href="#section" 
          class="flex flex-col items-center text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
          @click.prevent="scrollToSection"
        >
          <UIcon name="i-lucide-chevron-down" class="w-10 h-10 sm:w-12 sm:h-12" />
        </a>
      </div>
    </div>

    <UPageSection
      id="section"
      :title="page.section.title"
      :description="page.section.description"
      :ui="{
        title: 'text-center',
        description: 'text-center max-w-5xl mx-auto',
      }"
      class="relative overflow-hidden"
    >
      <!-- Декоративные фоновые элементы -->
      <div
        class="absolute rounded-full left-1/4 top-20 size-[400px] bg-primary/20 blur-[120px] -z-10"
      />
      <div
        class="absolute rounded-full right-1/4 bottom-20 size-[400px] bg-primary/15 blur-[120px] -z-10"
      />

      <template #title>
        <MDC :value="page.section.title" />
      </template>

      <UContainer class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(card, index) in page.section.cards"
            :key="index"
            class="group relative"
          >
            <!-- Карточка с эффектами -->
            <div
              class="relative h-full p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
            >
              <!-- Градиентный фон при наведении -->
              <div
                class="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <!-- Иконка с градиентом -->
              <div class="relative mb-6 flex justify-center">
                <div
                  class="relative p-4 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-500"
                >
                  <div
                    class="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <UIcon
                    :name="card.icon"
                    class="relative w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <!-- Заголовок -->
              <h3
                class="relative text-xl font-bold text-gray-900 dark:text-white mb-4 text-center group-hover:text-primary transition-colors duration-300"
              >
                {{ card.title }}
              </h3>

              <!-- Описание -->
              <p
                class="relative text-gray-600 dark:text-gray-400 leading-relaxed text-center"
              >
                {{ card.description }}
              </p>

              <!-- Декоративная линия снизу -->
              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent group-hover:w-3/4 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection
      id="features"
      :description="page.features.description"
      :features="page.features.features"
      :ui="{
        title: 'text-left @container relative flex',
        description: 'text-left',
      }"
      class="relative overflow-hidden"
    >
      <div
        class="absolute rounded-full -left-10 top-10 size-[300px] z-10 bg-primary opacity-30 blur-[200px]"
      />
      <div
        class="absolute rounded-full -right-10 -bottom-10 size-[300px] z-10 bg-primary opacity-30 blur-[200px]"
      />
      <template #title>
        <MDC :value="page.features.title" class="*:leading-9" />
        <div class="hidden @min-[1020px]:block">
          <UColorModeImage
            light="/images/light/line-2.svg"
            dark="/images/dark/line-2.svg"
            class="absolute top-0 right-0 size-full transform scale-95 translate-x-[70%]"
          />
        </div>
      </template>
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection
      id="steps"
      :description="page.steps.description"
      class="relative overflow-hidden"
    >
      <template #headline>
        <UColorModeImage
          light="/images/light/line-3.svg"
          dark="/images/dark/line-3.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24"
        />
      </template>
      <template #title>
        <MDC :value="page.steps.title" />
      </template>

      <template #features>
        <UPageCard
          v-for="(step, index) in page.steps.items"
          :key="index"
          class="group"
          :ui="{ container: 'p-4 sm:p-4', title: 'flex items-center gap-1' }"
        >
          <UColorModeImage
            v-if="step.image"
            :light="step.image?.light"
            :dark="step.image?.dark"
            :alt="step.title"
            class="size-full"
          />

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold">
              {{ step.title }}
            </span>
            <span class="text-sm text-muted">
              {{ step.description }}
            </span>
          </div>
        </UPageCard>
      </template>
    </UPageSection>

    <UPageSection
      id="pricing"
      class="mb-32 overflow-hidden"
      :title="page.pricing.title"
      :description="page.pricing.description"
      :plans="page.pricing.plans"
      :ui="{ title: 'text-left @container relative', description: 'text-left' }"
    >
      <template #title>
        <MDC :value="page.pricing.title" />

        <div class="hidden @min-[1120px]:block">
          <UColorModeImage
            light="/images/light/line-4.svg"
            dark="/images/dark/line-4.svg"
            class="absolute top-0 right-0 size-full transform translate-x-[60%]"
          />
        </div>
      </template>

      <UPricingPlans scale>
        <UPricingPlan
          v-for="(plan, index) in page.pricing.plans"
          :key="index"
          :title="plan.title"
          :description="plan.description"
          :price="plan.price"
          :billing-period="plan.billing_period"
          :billing-cycle="plan.billing_cycle"
          :highlight="plan.highlight"
          :scale="plan.highlight"
          variant="soft"
          :features="plan.features"
          :button="plan.button"
        />
      </UPricingPlans>
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection
      id="reviews"
      :title="page.reviews.title"
      :description="page.reviews.description"
      :ui="{
        title: 'text-center',
        description: 'text-center max-w-4xl mx-auto',
      }"
      class="relative overflow-hidden py-12"
    >
      <!-- Декоративные фоновые элементы -->
      <div
        class="absolute rounded-full left-1/4 top-20 size-[500px] bg-primary/10 blur-[150px] -z-10"
      />
      <div
        class="absolute rounded-full right-1/4 bottom-20 size-[500px] bg-primary/15 blur-[150px] -z-10"
      />

      <template #title>
        <MDC :value="page.reviews.title" />
      </template>

      <UContainer>
        <TestimonialsSlider :testimonials="page.reviews.items" />
      </UContainer>

      <!-- Статистика -->
      <UContainer>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold text-primary mb-2">500+</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Реализованных проектов</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary mb-2">98%</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Довольных клиентов</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary mb-2">7+</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Лет на рынке</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary mb-2">24/7</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Техподдержка</div>
          </div>
        </div>
      </UContainer>
    </UPageSection>

    <!-- <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection
      id="testimonials"
      :title="page.testimonials.title"
      :description="page.testimonials.description"
      :items="page.testimonials.items"
    >
      <template #headline>
        <UColorModeImage
          light="/images/light/line-5.svg"
          dark="/images/dark/line-5.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24"
        />
      </template>
      <template #title>
        <MDC :value="page.testimonials.title" />
      </template>

      <UContainer>
        <UPageColumns class="xl:columns-3">
          <UPageCard
            v-for="(testimonial, index) in page.testimonials.items"
            :key="index"
            variant="subtle"
            :description="testimonial.quote"
            :ui="{
              description:
                'before:content-[open-quote] after:content-[close-quote]',
            }"
          >
            <template #footer>
              <UUser v-bind="testimonial.user" size="xl" />
            </template>
          </UPageCard>
        </UPageColumns>
      </UContainer>
    </UPageSection> -->

    <USeparator />

    <UPageCTA
      :title="page.cta.title"
      :description="page.cta.description"
      variant="naked"
      class="overflow-hidden @container"
    >
      <template #title>
        <MDC :value="page.cta.title" />

        <div class="@max-[1280px]:hidden">
          <UColorModeImage
            light="/images/light/line-6.svg"
            dark="/images/dark/line-6.svg"
            class="absolute left-10 -top-10 sm:top-0 h-full"
          />
          <UColorModeImage
            light="/images/light/line-7.svg"
            dark="/images/dark/line-7.svg"
            class="absolute right-0 bottom-0 h-full"
          />
        </div>
      </template>

      <template #links>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <UButton
            label="Получить консультацию"
            icon="i-lucide-phone"
            trailing
            color="primary"
            size="xl"
            @click="isModalOpen = true"
          />
          <UButton
            label="Наши контакты"
            icon="i-lucide-mail"
            variant="subtle"
            size="xl"
            to="#pricing"
          />
        </div>
      </template>

      <LazyStarsBg />
    </UPageCTA>

    <ConsultationModal v-model="isModalOpen" />
  </div>
</template>

<style scoped>
.hero-section :deep(h1),
.hero-section :deep(h2),
.hero-section :deep(h3),
.hero-section :deep(p) {
  color: white !important;
  hyphens: none;
}

.hero-section :deep(.text-primary) {
  color: rgb(var(--color-primary-500)) !important;
}

.hero-section :deep(h1) {
  font-size: clamp(1.75rem, 5vw, 3rem);
  line-height: 1.3;
}
</style>
