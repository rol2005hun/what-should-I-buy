<template>
    <div class="layout-toggle">
        <button @click="toggleLayout" class="layout-toggle-button" :title="$t('layout.toggle')"
            :aria-label="$t('layout.toggle')">
            <div class="layout-toggle-icon-container">
                <Transition name="flip" mode="out-in">
                    <component :is="currentIcon" :key="uiStore.layout" class="layout-toggle-icon" />
                </Transition>
            </div>
            <span class="layout-toggle-label">{{ $t(`layout.${uiStore.layout}`) }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import GridIcon from './icons/GridIcon.vue';
import ListIcon from './icons/ListIcon.vue';

const uiStore = useUIStore();

const currentIcon = computed(() => {
    return uiStore.layout === 'grid' ? GridIcon : ListIcon;
});

function toggleLayout() {
    uiStore.toggleLayout();
}
</script>

<style lang="scss">
@use '@/assets/scss/components/Toggles';
</style>