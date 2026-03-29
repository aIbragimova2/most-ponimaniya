<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
</script>

<template>
  <SiteHeader />
  <main class="main">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
.main {
  flex: 1;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.75rem max(1rem, env(safe-area-inset-left, 0px)) 3rem
    max(1rem, env(safe-area-inset-right, 0px));
  padding-bottom: calc(3rem + env(safe-area-inset-bottom, 0px));
}

@media (max-width: 900px) and (orientation: landscape) {
  .main {
    padding-top: 1rem;
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
  }
}

@media (max-width: 380px) {
  .main {
    padding-left: max(0.85rem, env(safe-area-inset-left, 0px));
    padding-right: max(0.85rem, env(safe-area-inset-right, 0px));
  }
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity var(--dur-med) var(--ease-soft),
    transform var(--dur-med) var(--ease-out);
}

.page-enter-from {
  opacity: 0;
  transform: translate3d(0, 10px, 0);
}

.page-leave-to {
  opacity: 0;
  transform: translate3d(0, -6px, 0);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.01ms linear;
  }

  .page-enter-from,
  .page-leave-to {
    transform: none;
  }
}
</style>
