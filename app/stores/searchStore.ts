import type { ProductSuggestion, SearchFilters } from '#shared/types';

interface SearchState {
  currentQuery: string;
  results: ProductSuggestion[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  searchTime: number;
  filters: SearchFilters;
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    currentQuery: '',
    results: [],
    isLoading: false,
    error: null,
    totalResults: 0,
    searchTime: 0,
    filters: {
      sortBy: 'relevance'
    }
  }),

  getters: {
    hasResults: (state) => state.results.length > 0,
    filteredResults: (state) => {
      let results = [...state.results];

      if (state.filters.priceRange) {
        results = results.filter(product =>
          product.priceRange === state.filters.priceRange
        );
      }

      if (state.filters.categories?.length) {
        results = results.filter(product =>
          product.categories?.some(cat =>
            state.filters.categories!.includes(cat)
          )
        );
      }

      switch (state.filters.sortBy) {
        case 'popularity':
          return results.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
        case 'price':
          return results.sort((a, b) => {
            const priceOrder = { low: 1, medium: 2, high: 3 };
            const aPrice = a.priceRange ? priceOrder[a.priceRange as keyof typeof priceOrder] : 0;
            const bPrice = b.priceRange ? priceOrder[b.priceRange as keyof typeof priceOrder] : 0;
            return aPrice - bPrice;
          });
        default:
          return results;
      }
    }
  },

  actions: {
    async searchProducts(query: string, filters?: SearchFilters, language?: string) {
      this.isLoading = true;
      this.error = null;
      this.currentQuery = query;

      if (filters) {
        this.filters = { ...this.filters, ...filters };
      }

      const startTime = Date.now();

      try {
        const response = await $fetch<{
          suggestions: ProductSuggestion[];
          totalResults?: number;
          searchTime?: number;
        }>('/api/search', {
          method: 'POST',
          body: {
            query,
            language,
            filters: this.filters
          }
        });

        this.results = response.suggestions.map((suggestion, index) => ({
          ...suggestion,
          confidence: suggestion.confidence || Math.random() * 0.4 + 0.6,
          categories: suggestion.categories || ['General'],
          priceRange: suggestion.priceRange || (['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any)
        }));

        this.totalResults = response.totalResults || this.results.length;
        this.searchTime = Date.now() - startTime;
      } catch (error) {
        this.error = 'Failed to fetch search results. Please try again.';
        this.results = [];
        this.totalResults = 0;
      } finally {
        this.isLoading = false;
      }
    },

    updateFilters(filters: Partial<SearchFilters>) {
      this.filters = { ...this.filters, ...filters };
    },

    clearResults() {
      this.results = [];
      this.currentQuery = '';
      this.error = null;
      this.totalResults = 0;
      this.searchTime = 0;
    },

    retryLastSearch(language?: string) {
      if (this.currentQuery) {
        return this.searchProducts(this.currentQuery, this.filters, language);
      }
    }
  }
});