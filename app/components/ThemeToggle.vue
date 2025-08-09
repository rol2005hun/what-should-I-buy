<template>
    <button @click="uiStore.toggleTheme()" class="theme-toggle" :title="$t('theme.toggle')">
        <span class="theme-toggle-icon">{{ currentIcon }}</span>
        <span class="theme-toggle-label">{{ currentLabel }}</span>
    </button>
</template>

<script setup lang="ts">
const uiStore = useUIStore();
const { t } = useNuxtApp().$i18n;

const currentIcon = computed(() => {
    switch (uiStore.theme) {
        case 'light': return '☀️';
        case 'dark': return '🌙';
        case 'auto': return '🌗';
        default: return '☀️';
    }
});

const currentLabel = computed(() => {
    switch (uiStore.theme) {
        case 'light': return t('theme.light');
        case 'dark': return t('theme.dark');
        case 'auto': return t('theme.auto');
        default: return t('theme.light');
    }
});
</script>

<style lang="scss">
@use '@/assets/scss/components/Toggles';
</style>