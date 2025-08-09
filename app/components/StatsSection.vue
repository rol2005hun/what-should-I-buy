<template>
    <div class="stats-section">
        <div class="stats-section-container">
            <div class="stats-section-grid">
                <div class="stats-section-card animate-fade-in" style="animation-delay: 0.1s">
                    <div class="stats-section-icon">🔍</div>
                    <div class="stats-section-content">
                        <div class="stats-section-number">{{ formattedSearches }}</div>
                        <div class="stats-section-label">{{ $t('stats.totalSearches') }}</div>
                    </div>
                </div>

                <div class="stats-section-card animate-fade-in" style="animation-delay: 0.2s">
                    <div class="stats-section-icon">💬</div>
                    <div class="stats-section-content">
                        <div class="stats-section-number">{{ formattedPosts }}</div>
                        <div class="stats-section-label">{{ $t('stats.discussions') }}</div>
                    </div>
                </div>

                <div class="stats-section-card animate-fade-in" style="animation-delay: 0.3s">
                    <div class="stats-section-icon">📦</div>
                    <div class="stats-section-content">
                        <div class="stats-section-number">{{ formattedProducts }}</div>
                        <div class="stats-section-label">{{ $t('stats.products') }}</div>
                    </div>
                </div>

                <div class="stats-section-card animate-fade-in" style="animation-delay: 0.4s">
                    <div class="stats-section-icon">⭐</div>
                    <div class="stats-section-content">
                        <div class="stats-section-number">{{ accuracy }}%</div>
                        <div class="stats-section-label">{{ $t('stats.accuracy') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const searchCount = ref(150234);
const postsAnalyzed = ref(1247890);
const productsFound = ref(523456);
const accuracy = ref(98.7);

const formattedSearches = computed(() => formatNumber(searchCount.value));
const formattedPosts = computed(() => formatNumber(postsAnalyzed.value));
const formattedProducts = computed(() => formatNumber(productsFound.value));

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

onMounted(() => {
    animateNumbers();
});

function animateNumbers() {
    const duration = 2000;
    const start = Date.now();

    const startSearches = 0;
    const startPosts = 0;
    const startProducts = 0;
    const startAccuracy = 0;

    const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        searchCount.value = Math.floor(150234 * easeOut);
        postsAnalyzed.value = Math.floor(1247890 * easeOut);
        productsFound.value = Math.floor(523456 * easeOut);
        accuracy.value = Math.floor(98.7 * easeOut * 10) / 10;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}
</script>

<style lang="scss">
@use '@/assets/scss/components/Widgets';
</style>