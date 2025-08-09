<template>
  <div class="product-card" :class="`product-card--${layout}`">
    <div class="product-card-header">
      <div class="product-card-placeholder">📦</div>
      <div class="product-card-badge">
        {{ index + 1 }}
      </div>
    </div>

    <div class="product-card-content">
      <h3 class="product-card-title">{{ product.name }}</h3>
      <p class="product-card-description">{{ product.reason }}</p>

      <div class="product-card-meta">
        <div v-if="product.confidence" class="product-card-score">
          <span class="product-card-score-icon">⭐</span>
          {{ Math.round(product.confidence * 100) }}%
        </div>
        <div class="product-card-discussions">
          <span class="product-card-discussions-icon">💬</span>
          {{ $t('product.confidence') }}
        </div>
      </div>

      <div v-if="product.categories?.length" class="product-card-tags">
        <span v-for="category in product.categories" :key="category" class="product-card-tag">
          {{ category }}
        </span>
      </div>
    </div>

    <div class="product-card-actions">
      <button v-if="product.link" @click="openLink(product.link!)"
        class="product-card-button product-card-button--primary">
        <span class="product-card-button-icon">🔗</span>
        {{ $t('product.viewMore') }}
      </button>
      <button @click="shareProduct" class="product-card-button product-card-button--ghost" :title="$t('product.share')">
        <span class="product-card-button-icon">📤</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductSuggestion } from '#shared/types';

interface Props {
  product: ProductSuggestion;
  index: number;
  layout: 'grid' | 'list';
}

const props = defineProps<Props>();

const confidenceClass = computed(() => {
  if (!props.product.confidence) return '';
  const confidence = props.product.confidence;
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.6) return 'medium';
  return 'low';
});

function openLink(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function shareProduct() {
  if (navigator.share) {
    navigator.share({
      title: props.product.name,
      text: props.product.reason,
      url: props.product.link || window.location.href
    });
  } else {
    const text = `${props.product.name}: ${props.product.reason}${props.product.link ? ` - ${props.product.link}` : ''}`;
    navigator.clipboard.writeText(text);
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/ProductCard';
</style>