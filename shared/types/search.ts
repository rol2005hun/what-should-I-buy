export interface SearchRequest {
    query: string;
    language: string;
    filters?: SearchFilters;
}

export interface SearchResponse {
    suggestions: import('./product').ProductSuggestion[];
    totalResults?: number;
    searchTime?: number;
}

export interface SearchFilters {
    priceRange?: 'low' | 'medium' | 'high';
    categories?: string[];
    sortBy?: 'relevance' | 'popularity' | 'price';
}