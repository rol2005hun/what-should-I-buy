<template>
    <div class="home-page">
        <div class="hero-background"></div>

        <div class="container">
            <header class="header animate-fade-in">
                <div class="header-content">
                    <div class="logo-section">
                        <div class="logo-icon">🔍</div>
                        <div>
                            <h1 class="app-title">{{ $t('app.title') }}</h1>
                            <p class="app-subtitle">{{ $t('app.description') }}</p>
                        </div>
                    </div>
                    <p class="app-description">{{ $t('app.extendedDescription') }}</p>
                </div>
                <div class="header-actions">
                    <ThemeToggle />
                    <LanguageSwitcher />
                </div>
            </header>

            <main class="main-content">
                <section class="search-section animate-slide-up">
                    <div class="search-container">
                        <div class="search-form card glass">
                            <form @submit.prevent="handleSearch">
                                <div class="search-input-group">
                                    <div class="search-icon">🔍</div>
                                    <input v-model="searchQuery" type="text" :placeholder="$t('search.placeholder')"
                                        class="input large search-input" :disabled="searchStore.isLoading" required />
                                    <button type="submit" class="btn primary large search-btn"
                                        :disabled="searchStore.isLoading || !searchQuery.trim()"
                                        :class="{ loading: searchStore.isLoading }">
                                        <span class="btn-text">{{ $t('search.button') }}</span>
                                    </button>
                                </div>
                            </form>

                            <div class="search-suggestions"
                                v-if="searchSuggestions.length > 0 && !searchStore.isLoading">
                                <p class="suggestions-title">{{ $t('search.popularSearches') }}</p>
                                <div class="suggestions-list">
                                    <button v-for="suggestion in searchSuggestions" :key="suggestion"
                                        @click="searchQuery = suggestion; handleSearch()" class="suggestion-chip">
                                        {{ suggestion }}
                                    </button>
                                </div>
                            </div>

                            <!-- Search History Component -->
                            <SearchHistory v-if="!searchStore.isLoading && !searchStore.results.length"
                                @selectSearch="(query) => { searchQuery = query; handleSearch(); }" />
                        </div>
                    </div>
                </section>

                <Transition name="fade" mode="out-in">
                    <section v-if="searchStore.isLoading" class="loading-section">
                        <div class="loading-content">
                            <div class="loading-animation">
                                <div class="loading-spinner-modern"></div>
                                <div class="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                            <h3 class="loading-title">{{ $t('search.loadingTitle') }}</h3>
                            <p class="loading-text">{{ $t('search.loading') }}</p>
                            <div class="loading-progress">
                                <div class="progress-bar"></div>
                            </div>
                        </div>
                    </section>

                    <section v-else-if="searchStore.error" class="error-section">
                        <div class="error-content card">
                            <div class="error-icon">⚠️</div>
                            <h3 class="error-title">{{ $t('search.errorTitle') }}</h3>
                            <p class="error-message">{{ searchStore.error }}</p>
                            <div class="error-actions">
                                <button @click="searchStore.clearResults()" class="btn secondary">
                                    {{ $t('search.tryAgain') }}
                                </button>
                                <button @click="handleSearch()" class="btn primary">
                                    {{ $t('search.retry') }}
                                </button>
                            </div>
                        </div>
                    </section>

                    <section v-else-if="searchStore.results.length > 0" class="results-section">
                        <div class="results-header">
                            <div class="results-title-section">
                                <h2 class="results-title">{{ $t('results.title') }}</h2>
                                <span class="results-count">{{ searchStore.results.length }} {{ $t('results.found')
                                    }}</span>
                            </div>
                            <p class="results-description">{{ $t('results.suggestions') }}</p>

                            <div class="results-controls">
                                <div class="view-toggle">
                                    <button @click="uiStore.setLayout('grid')" class="btn ghost"
                                        :class="{ active: uiStore.layout === 'grid' }">
                                        ⊞ {{ $t('layout.grid') }}
                                    </button>
                                    <button @click="uiStore.setLayout('list')" class="btn ghost"
                                        :class="{ active: uiStore.layout === 'list' }">
                                        ☰ {{ $t('layout.list') }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="products-container" :class="`layout-${uiStore.layout}`">
                            <ProductCard v-for="(product, index) in searchStore.results" :key="index" :product="product"
                                :index="index" :layout="uiStore.layout" class="animate-slide-up"
                                :style="{ animationDelay: `${index * 100}ms` }" />
                        </div>

                        <div class="results-footer">
                            <button @click="searchStore.clearResults()" class="btn ghost">
                                {{ $t('search.newSearch') }}
                            </button>
                        </div>
                    </section>

                    <section v-else-if="searchStore.currentQuery" class="no-results-section">
                        <div class="no-results-content card text-center">
                            <div class="no-results-icon">🔍</div>
                            <h3 class="no-results-title">{{ $t('search.noResultsTitle') }}</h3>
                            <p class="no-results-text">{{ $t('search.noResults') }}</p>
                            <div class="no-results-suggestions">
                                <p>{{ $t('search.tryThese') }}</p>
                                <div class="suggestions-list">
                                    <button v-for="suggestion in fallbackSuggestions" :key="suggestion"
                                        @click="searchQuery = suggestion; handleSearch()" class="suggestion-chip">
                                        {{ suggestion }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </Transition>
            </main>

            <!-- Stats Section -->
            <StatsSection />

            <footer class="app-footer">
                <div class="footer-container">
                    <div class="footer-main">
                        <div class="footer-brand">
                            <div class="footer-logo">
                                <div class="logo-icon">🛒</div>
                                <span class="logo-text">{{ $t('app.title') }}</span>
                            </div>
                            <p class="footer-description">
                                {{ $t('app.extendedDescription') }}
                            </p>
                            <div class="footer-features">
                                <span class="feature-badge">🤖 {{ $t('footer.features.ai') }}</span>
                                <span class="feature-badge">💬 {{ $t('footer.features.reddit') }}</span>
                                <span class="feature-badge">⚡ {{ $t('footer.features.realtime') }}</span>
                            </div>
                        </div>

                        <div class="footer-section">
                            <h3 class="section-title">{{ $t('footer.sections.links') }}</h3>
                            <div class="footer-links">
                                <a href="#" class="footer-link">{{ $t('footer.about') }}</a>
                                <a href="#" class="footer-link">{{ $t('footer.privacy') }}</a>
                                <a href="#" class="footer-link">{{ $t('footer.contact') }}</a>
                                <a href="#" class="footer-link">{{ $t('footer.help') }}</a>
                            </div>
                        </div>

                        <div class="footer-section footer-stats">
                            <h3 class="section-title">{{ $t('footer.sections.stats') }}</h3>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <span class="stat-number">10K+</span>
                                    <span class="stat-label">{{ $t('footer.stats.searches') }}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">50K+</span>
                                    <span class="stat-label">{{ $t('footer.stats.discussions') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="footer-bottom">
                        <p class="footer-text">
                            {{ $t('footer.poweredBy') }} • 
                            <span class="highlight">{{ $t('footer.madeWith') }}</span>
                        </p>
                        <div class="footer-social">
                            <span class="social-text">{{ $t('footer.followUs') }}</span>
                            <div class="social-links">
                                <a href="#" class="social-link" :title="$t('footer.social.github')">
                                    <span>🔗</span>
                                </a>
                                <a href="#" class="social-link" :title="$t('footer.social.reddit')">
                                    <span>📱</span>
                                </a>
                                <a href="#" class="social-link" :title="$t('footer.social.contact')">
                                    <span>✉️</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
const searchStore = useSearchStore();
const uiStore = useUIStore();
const { locale } = useI18n();

const searchQuery = ref('');

const searchSuggestions = computed(() => {
    return [
        $t('search.suggestions.laptop'),
        $t('search.suggestions.headphones'),
        $t('search.suggestions.smartphone'),
        $t('search.suggestions.keyboard'),
        $t('search.suggestions.monitor')
    ];
});

const fallbackSuggestions = computed(() => {
    return [
        $t('search.fallback.gamingLaptop'),
        $t('search.fallback.wirelessHeadphones'),
        $t('search.fallback.mechanicalKeyboard'),
        $t('search.fallback.monitor4k'),
        $t('search.fallback.budgetSmartphone')
    ];
});

async function handleSearch() {
    if (!searchQuery.value.trim()) return;

    const query = searchQuery.value.trim();
    uiStore.addToSearchHistory(query);
    await searchStore.searchProducts(query, undefined, locale.value);
}

onMounted(() => {
    searchStore.clearResults();
    if (import.meta.client) {
        uiStore.initializeFromStorage();
    }
});

useSeoMeta({
    title: 'Reddit Product Advisor - AI-Powered Product Recommendations',
    description: 'Discover the best products based on real Reddit discussions. Get AI-powered recommendations from thousands of user experiences.',
    keywords: 'reddit, products, recommendations, AI, reviews, tech, gadgets',
    ogTitle: 'Reddit Product Advisor',
    ogDescription: 'Find the best products based on Reddit discussions',
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image'
});
</script>

<style lang="scss">
@use '@/assets/scss/pages/index';
</style>