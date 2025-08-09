interface UIStoreState {
    theme: 'light' | 'dark' | 'auto';
    language: 'en' | 'hu';
    layout: 'grid' | 'list';
    searchHistory: string[];
    preferences: {
        maxResults: number;
        enableAnimations: boolean;
        compactMode: boolean;
        showConfidence: boolean;
        autoSave: boolean;
    };
}

export const useUIStore = defineStore('ui', {
    state: (): UIStoreState => {
        let initialTheme: 'light' | 'dark' | 'auto' = 'light';
        let initialLanguage: 'en' | 'hu' = 'en';
        let initialLayout: 'grid' | 'list' = 'grid';
        let initialSearchHistory: string[] = [];

        if (import.meta.server) {
            const themeCookie = useCookie('ui-theme', { default: () => 'light' });
            const languageCookie = useCookie('ui-language', { default: () => 'en' });
            const layoutCookie = useCookie('ui-layout', { default: () => 'grid' });
            const searchHistoryCookie = useCookie('ui-search-history', { default: () => '[]' });

            initialTheme = themeCookie.value as 'light' | 'dark' | 'auto';
            initialLanguage = languageCookie.value as 'en' | 'hu';
            initialLayout = layoutCookie.value as 'grid' | 'list';

            // Server oldalon is ugyanazzal a logikával kezeljük
            try {
                if (Array.isArray(searchHistoryCookie.value)) {
                    initialSearchHistory = [...searchHistoryCookie.value];
                } else if (searchHistoryCookie.value && searchHistoryCookie.value !== '[]') {
                    const parsed = JSON.parse(searchHistoryCookie.value);
                    if (Array.isArray(parsed)) {
                        initialSearchHistory = parsed;
                    }
                }
            } catch {
                initialSearchHistory = [];
            }
        }

        return {
            theme: initialTheme,
            language: initialLanguage,
            layout: initialLayout,
            searchHistory: initialSearchHistory,
            preferences: {
                maxResults: 3,
                enableAnimations: true,
                compactMode: false,
                showConfidence: true,
                autoSave: true
            }
        };
    },

    getters: {
        isDark: (state) => {
            if (state.theme === 'auto') {
                return import.meta.client ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
            }
            return state.theme === 'dark';
        },

        recentSearches: (state) => {
            return state.searchHistory.slice(-5).reverse();
        }
    },

    actions: {
        setTheme(theme: 'light' | 'dark' | 'auto') {
            this.theme = theme;
            if (import.meta.client) {
                useCookie('ui-theme').value = theme;
                this.applyTheme();
            }
        },

        setLanguage(language: 'en' | 'hu') {
            this.language = language;
            if (import.meta.client) {
                useCookie('ui-language').value = language;
            }
        },

        setLayout(layout: 'grid' | 'list') {
            this.layout = layout;
            if (import.meta.client) {
                useCookie('ui-layout').value = layout;
            }
        },

        toggleTheme() {
            const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
            const currentIndex = themes.indexOf(this.theme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            if (nextTheme) {
                this.setTheme(nextTheme);
            }
        },

        toggleLayout() {
            this.setLayout(this.layout === 'grid' ? 'list' : 'grid');
        },

        addToSearchHistory(query: string) {
            if (query.trim() && !this.searchHistory.includes(query)) {
                this.searchHistory.push(query);
                if (this.searchHistory.length > 20) {
                    this.searchHistory = this.searchHistory.slice(-20);
                }
                if (import.meta.client) {
                    localStorage.setItem('ui-search-history', JSON.stringify(this.searchHistory));
                    useCookie('ui-search-history').value = JSON.stringify(this.searchHistory);
                }
            }
        },

        removeFromSearchHistory(query: string) {
            const index = this.searchHistory.indexOf(query);
            if (index > -1) {
                this.searchHistory.splice(index, 1);
                if (import.meta.client) {
                    localStorage.setItem('ui-search-history', JSON.stringify(this.searchHistory));
                    useCookie('ui-search-history').value = JSON.stringify(this.searchHistory);
                }
            }
        },

        clearSearchHistory() {
            this.searchHistory = [];
            if (import.meta.client) {
                localStorage.setItem('ui-search-history', JSON.stringify(this.searchHistory));
                useCookie('ui-search-history').value = JSON.stringify(this.searchHistory);
            }
        },

        updatePreferences(preferences: Partial<typeof this.preferences>) {
            this.preferences = { ...this.preferences, ...preferences };
            this.persistPreferences();
        },

        initializeTheme() {
            if (import.meta.client) {
                this.applyTheme();

                if (this.theme === 'auto') {
                    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    mediaQuery.addEventListener('change', () => {
                        this.applyTheme();
                    });
                }
            }
        },

        initializeFromStorage() {
            if (import.meta.client) {
                // Csak a theme alkalmazására van szükség client oldalon
                // A search history már server oldalon betöltődött
                this.applyTheme();
            }
        },

        persistPreferences() {
            if (import.meta.client && this.preferences.autoSave) {
                useCookie('ui-preferences').value = JSON.stringify(this.preferences);
            }
        },

        applyTheme() {
            if (import.meta.client) {
                const html = document.documentElement;
                let finalTheme: string;

                if (this.theme === 'auto') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    finalTheme = prefersDark ? 'dark' : 'light';
                } else {
                    finalTheme = this.theme;
                }

                html.setAttribute('data-theme', finalTheme);
            }
        }
    }
});