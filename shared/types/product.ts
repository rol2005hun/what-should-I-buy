export interface ProductSuggestion {
    name: string;
    reason: string;
    link?: string;
    confidence?: number;
    categories?: string[];
    priceRange?: string;
}