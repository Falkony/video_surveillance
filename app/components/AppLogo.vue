<template>
  <div class="flex items-center gap-2">
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="text-primary"
    >
      <!-- Корпус камеры -->
      <rect x="4" y="10" width="24" height="16" rx="2" fill="currentColor" />
      <rect x="6" y="12" width="20" height="12" rx="1" fill="white" fill-opacity="0.2" />
      
      <!-- Объектив -->
      <circle cx="16" cy="18" r="5" fill="white" fill-opacity="0.3" />
      <circle cx="16" cy="18" r="3" fill="currentColor" />
      <circle cx="16" cy="18" r="1.5" fill="white" fill-opacity="0.8" />
      
      <!-- Индикатор -->
      <circle cx="24" cy="14" r="1.5" fill="#ef4444" />
      
      <!-- Крепление -->
      <path d="M14 10 L14 6 L18 6 L18 10" stroke="currentColor" stroke-width="2" fill="none" />
    </svg>
    <span class="text-xl font-bold">Видеонаблюдение</span>
  </div>
</template>
