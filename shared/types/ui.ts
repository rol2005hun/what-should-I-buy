export interface UIState {
    theme: 'light' | 'dark' | 'auto';
    language: 'en' | 'hu';
    layout: 'grid' | 'list';
}

export interface AppConfig {
    maxResults: number;
    searchTimeout: number;
    enableAnalytics: boolean;
    enableDarkMode: boolean;
}