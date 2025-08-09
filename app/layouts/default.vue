<template>
  <div id="default-layout">
    <slot />
  </div>
</template>

<style scoped lang="scss">
#default-layout {
  min-height: 100vh;
  background-color: var(--background-color);
}
</style>