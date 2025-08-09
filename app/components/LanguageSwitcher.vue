<template>
    <div class="language-selector">
        <button @click="toggleDropdown" @blur="closeDropdown" class="language-selector-button" type="button">
            {{ currentLanguageLabel }}
            <span>{{ isOpen ? '▲' : '▼' }}</span>
        </button>

        <div v-show="isOpen" class="language-selector-dropdown" :class="{ 'language-selector-dropdown--open': isOpen }">
            <div v-for="locale in locales" :key="locale.code" @mousedown="selectLanguage(locale.code)"
                class="language-selector-option">
                {{ locale.name }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();
const isOpen = ref(false);

const currentLanguageLabel = computed(() => {
    const current = locales.value.find(l => l.code === locale.value);
    return current?.name || 'English';
});

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
    setTimeout(() => {
        isOpen.value = false;
    }, 150);
};

const selectLanguage = (langCode: 'en' | 'hu') => {
    setLocale(langCode);
    isOpen.value = false;
};
</script>

<style lang="scss">
@use '@/assets/scss/components/LanguageSelector';
</style>