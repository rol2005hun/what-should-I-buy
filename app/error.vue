<template>
  <div class="error-page">
    <div class="container">
      <div class="error-content card text-center">
        <h1 class="error-title">{{ error.statusCode }}</h1>
        <p class="error-message">{{ error.statusMessage || 'An error occurred' }}</p>
        <p class="error-description">
          {{ getErrorDescription(error.statusCode) }}
        </p>
        <div class="error-actions">
          <button @click="handleError" class="btn primary">
            {{ error.statusCode === 404 ? 'Go Home' : 'Try Again' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode: number
    statusMessage?: string
  }
}

const props = defineProps<ErrorProps>()

function getErrorDescription(statusCode: number): string {
  switch (statusCode) {
    case 404:
      return "The page you're looking for doesn't exist."
    case 500:
      return "Something went wrong on our end. Please try again later."
    default:
      return "An unexpected error occurred."
  }
}

function handleError() {
  if (props.error.statusCode === 404) {
    navigateTo('/')
  } else {
    clearError({ redirect: '/' })
  }
}

useSeoMeta({
  title: `Error ${props.error.statusCode} - Reddit Product Advisor`,
  description: 'An error occurred while loading the page.'
})
</script>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.error-content {
  max-width: 500px;
  padding: 3rem 2rem;
}

.error-title {
  font-size: 4rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 1rem 0;
  line-height: 1;
}

.error-message {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.error-description {
  color: var(--text-muted);
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.error-actions {
  margin-top: 2rem;
}
</style>