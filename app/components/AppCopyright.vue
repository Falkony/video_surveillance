<template>
  <div class="text-sm text-muted text-center">
    © {{ currentYear }} NNVSS. Все права защищены.
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>
