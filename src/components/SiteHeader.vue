<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { publicUrl } from '../utils/publicUrl'

const route = useRoute()

const logoSrc = publicUrl('images/logo-mark.svg')

const links = [
  { to: '/', label: 'Главная' },
  { to: '/kniga', label: 'Книга' },
  { to: '/rekomendacii', label: 'Рекомендации' },
  { to: '/test-roditeli', label: 'Тест: родители' },
  { to: '/test-podrostki', label: 'Тест: подростки' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink to="/" class="header__brand">
        <img class="header__logo" :src="logoSrc" width="40" height="40" alt="" />
        <span class="header__brand-text">
          <span class="header__brand-title">Мост понимания</span>
          <span class="header__brand-sub">школьный проект</span>
        </span>
      </RouterLink>
      <nav class="nav" aria-label="Основное меню">
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="nav__link"
          :class="{ 'nav__link--active': isActive(l.to) }"
        >
          {{ l.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
@keyframes header-in {
  from {
    opacity: 0;
    transform: translate3d(0, -10px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.header {
  background: var(--color-brown);
  color: var(--color-text-on-dark);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-soft);
  animation: header-in 0.45s var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1)) both;
}

@media (prefers-reduced-motion: reduce) {
  .header {
    animation: none;
  }
}

.header__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: calc(1rem + env(safe-area-inset-top, 0px)) max(1.25rem, env(safe-area-inset-right, 0px)) 1.25rem
    max(1.25rem, env(safe-area-inset-left, 0px));
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header__brand {
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.65rem;
}

.header__logo {
  flex-shrink: 0;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.header__brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.header__brand-title {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
}

.header__brand-sub {
  font-size: 0.8rem;
  opacity: 0.85;
  font-weight: 600;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.75rem;
  align-items: center;
  justify-content: flex-end;
}

.nav__link {
  color: var(--color-bg-soft);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.92rem;
  padding: 0.45rem 0.7rem;
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition:
    background 0.18s var(--ease-soft, ease),
    transform 0.15s ease;
}

.nav__link:hover {
  background: rgba(231, 221, 211, 0.12);
  color: #fff;
}

.nav__link--active {
  background: rgba(231, 221, 211, 0.22);
  color: #fff;
}

@media (hover: hover) and (pointer: fine) {
  .nav__link:hover {
    transform: translate3d(0, -1px, 0);
  }
}

@media (hover: none) {
  .nav__link:active {
    opacity: 0.88;
    transform: scale(0.98);
  }
}

/* Телефон в альбоме: меню в одну прокручиваемую строку, не ломает вёрстку */
@media (max-width: 900px) and (orientation: landscape) {
  .header__inner {
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.65rem;
    padding-bottom: 0.85rem;
  }

  .header__brand {
    flex-shrink: 0;
  }

  .header__brand-title {
    font-size: 1rem;
  }

  .header__brand-sub {
    display: none;
  }

  .nav {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    justify-content: flex-start;
    gap: 0.25rem;
    padding-bottom: 2px;
    max-width: min(100%, 72vw);
    mask-image: linear-gradient(to right, #000 92%, transparent 100%);
  }

  .nav__link {
    font-size: 0.78rem;
    padding: 0.35rem 0.5rem;
    white-space: nowrap;
    flex-shrink: 0;
  }
}

/* Узкий портрет: чуть компактнее ссылки */
@media (max-width: 480px) and (orientation: portrait) {
  .nav__link {
    font-size: 0.85rem;
    padding: 0.35rem 0.55rem;
  }
}
</style>
