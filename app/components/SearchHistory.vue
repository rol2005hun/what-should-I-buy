<template>
    <div v-if="hasSearchHistory" class="search-history">
        <h3 class="search-history-title">{{ $t('search.recentSearches') }}</h3>
        <div class="search-history-list">
            <div v-for="(query, index) in recentSearches" :key="index" class="search-history-item"
                :class="{ 'animate-slide-in': index < 3 }" :style="{ animationDelay: `${index * 50}ms` }">
                <button @click="$emit('selectSearch', query)" class="search-history-button">
                    <span class="search-history-icon">🕐</span>
                    <span class="search-history-query">{{ query }}</span>
                </button>
                <button @click="removeSearch(query)" class="search-history-remove" :title="$t('search.removeFromHistory')">
                    ×
                </button>
            </div>
        </div>
        <button @click="clearHistory" class="search-history-clear">
            {{ $t('search.clearHistory') }}
        </button>
    </div>
</template>

<script setup lang="ts">
const uiStore = useUIStore();
const { searchHistory } = storeToRefs(uiStore);

const emit = defineEmits<{
    selectSearch: [query: string]
}>();

const recentSearches = computed(() => {
    return searchHistory.value.slice(0, 5);
});

const hasSearchHistory = computed(() => {
    return searchHistory.value && searchHistory.value.length > 0;
});

function removeSearch(query: string) {
    uiStore.removeFromSearchHistory(query);
}

function clearHistory() {
    uiStore.clearSearchHistory();
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/SearchHistory';
</style>
