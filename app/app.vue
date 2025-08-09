<template>
  <div id="app" :data-theme="currentTheme">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const uiStore = useUIStore();

const currentTheme = computed(() => {
  if (uiStore.theme === 'auto') {
    if (import.meta.client) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return uiStore.theme;
});

useHead({
  htmlAttrs: {
    'data-theme': currentTheme
  }
});

onMounted(() => {
  uiStore.initializeFromStorage();
});
</script>

<style lang="scss">
@use '@/assets/scss/main.scss';
</style>