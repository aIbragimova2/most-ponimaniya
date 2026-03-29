<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { recommendationBlocks as blocks } from '../data/recommendationBlocks'

const index = ref(0)
const swipeHintDismissed = ref(false)
const pagerEl = ref<HTMLElement | null>(null)

const total = computed(() => blocks.length)
const canPrev = computed(() => index.value > 0)
const canNext = computed(() => index.value < total.value - 1)

function go(delta: number) {
  const next = index.value + delta
  index.value = Math.max(0, Math.min(total.value - 1, next))
  swipeHintDismissed.value = true
}

async function goTo(i: number) {
  index.value = Math.max(0, Math.min(total.value - 1, i))
  swipeHintDismissed.value = true
  await nextTick()
  pagerEl.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

/* ——— свайп ——— */
const SWIPE_MIN = 56
let startX = 0
let startY = 0
let activePointer = false

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  activePointer = true
  startX = e.clientX
  startY = e.clientY
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)
}

function onPointerUp(e: PointerEvent) {
  if (!activePointer) return
  activePointer = false
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (Math.abs(dx) < SWIPE_MIN) return
  if (Math.abs(dx) < Math.abs(dy) * 1.1) return

  if (dx < 0 && canNext.value) go(1)
  else if (dx > 0 && canPrev.value) go(-1)
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    go(-1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    go(1)
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="rec">
    <header class="rec__head">
      <h1>Рекомендации: как чуть смягчить отношения</h1>
      <p class="rec__lead">
        Ниже — содержание из {{ total }} коротких советов. Нажми пункт — откроется нужная «страница». Можно
        листать свайпом влево-вправо или стрелками.
      </p>
    </header>

    <nav class="toc-nav" aria-label="Содержание советов">
      <details class="toc-nav__box" open>
        <summary class="toc-nav__summary">Содержание</summary>
        <p class="toc-nav__hint">Все темы по порядку — нажми, чтобы перейти.</p>
        <ol class="toc-nav__list">
          <li v-for="(b, i) in blocks" :key="i" class="toc-nav__item">
            <button
              type="button"
              class="toc-nav__btn"
              :class="{ 'toc-nav__btn--active': i === index }"
              @click="goTo(i)"
            >
              <span class="toc-nav__num">{{ i + 1 }}.</span>
              <span class="toc-nav__text">{{ b.title }}</span>
            </button>
          </li>
        </ol>
      </details>
    </nav>

    <div
      ref="pagerEl"
      class="pager"
      role="region"
      aria-roledescription="карусель"
      aria-label="Советы по страницам"
      tabindex="0"
    >
      <div
        class="pager__viewport"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="activePointer = false"
      >
        <div class="pager__track" :style="{ transform: `translateX(-${index * 100}%)` }">
          <article v-for="(b, i) in blocks" :key="i" class="card" :aria-hidden="i !== index">
            <p class="card__meta">Страница {{ i + 1 }} из {{ total }}</p>
            <h2 class="card__title">{{ b.title }}</h2>
            <p v-for="(p, j) in b.body" :key="j" class="card__p">{{ p }}</p>
          </article>
        </div>
      </div>

      <p v-if="!swipeHintDismissed" class="pager__hint" aria-hidden="true">Свайп влево — следующий совет</p>

      <div class="pager__controls">
        <button type="button" class="nav-btn" :disabled="!canPrev" aria-label="Предыдущая страница" @click="go(-1)">
          ←
        </button>
        <div class="dots-wrap">
          <div class="dots" role="tablist" aria-label="Номер страницы">
            <button
              v-for="(_, i) in blocks"
              :key="i"
              type="button"
              role="tab"
              class="dots__btn"
              :class="{ 'dots__btn--on': i === index }"
              :aria-selected="i === index"
              :title="`${i + 1}. ${blocks[i]?.title ?? ''}`"
              :aria-label="`Страница ${i + 1}: ${blocks[i]?.title ?? ''}`"
              @click="goTo(i)"
            />
          </div>
          <p class="dots__caption">{{ index + 1 }} / {{ total }}</p>
        </div>
        <button type="button" class="nav-btn" :disabled="!canNext" aria-label="Следующая страница" @click="go(1)">
          →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rec__lead {
  max-width: 48rem;
  margin: 0;
  font-size: 1.05rem;
}

.rec__head {
  margin-bottom: 1rem;
}

/* ——— Содержание ——— */
.toc-nav {
  margin-bottom: 1.25rem;
}

.toc-nav__box {
  background: var(--color-bg-soft);
  border: 1px solid rgba(74, 55, 40, 0.14);
  border-radius: var(--radius-lg);
  padding: 0.35rem 1rem 1rem;
  box-shadow: 0 4px 18px rgba(74, 55, 40, 0.06);
}

.toc-nav__summary {
  cursor: pointer;
  font-weight: 800;
  font-size: 1.05rem;
  color: var(--color-brown);
  padding: 0.65rem 0 0.35rem;
  list-style: none;
}

.toc-nav__summary::-webkit-details-marker {
  display: none;
}

.toc-nav__summary::before {
  content: '▸ ';
  display: inline-block;
  transition: transform 0.2s ease;
  margin-right: 0.25rem;
}

.toc-nav__box[open] .toc-nav__summary::before {
  transform: rotate(90deg);
}

.toc-nav__hint {
  margin: 0 0 0.65rem;
  font-size: 0.92rem;
  color: var(--color-brown-mid);
}

.toc-nav__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-height: min(42vh, 320px);
  overflow-y: auto;
  padding-right: 0.25rem;
}

.toc-nav__btn {
  width: 100%;
  text-align: left;
  display: flex;
  gap: 0.4rem;
  align-items: center;
  min-height: 44px;
  padding: 0.5rem 0.6rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.35);
  color: var(--color-brown);
  font: inherit;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.toc-nav__btn:hover {
  background: rgba(74, 55, 40, 0.08);
  border-color: rgba(74, 55, 40, 0.12);
}

.toc-nav__btn--active {
  background: var(--color-brown);
  color: var(--color-text-on-dark);
  border-color: var(--color-brown);
  font-weight: 700;
}

.toc-nav__num {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 0.88rem;
  opacity: 0.9;
}

.toc-nav__btn--active .toc-nav__num {
  opacity: 1;
}

.toc-nav__text {
  flex: 1;
  line-height: 1.4;
  font-size: 0.95rem;
}

.pager {
  outline: none;
}

.pager:focus-visible {
  box-shadow: 0 0 0 3px rgba(74, 55, 40, 0.35);
  border-radius: var(--radius-lg);
}

.pager__viewport {
  overflow: hidden;
  border-radius: var(--radius-lg);
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.pager__viewport:active {
  cursor: grabbing;
}

.pager__track {
  display: flex;
  width: 100%;
  transition: transform 0.38s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@media (prefers-reduced-motion: reduce) {
  .pager__track {
    transition: none;
  }
}

.card {
  flex: 0 0 100%;
  min-width: 0;
  background: var(--color-bg-soft);
  border: 1px solid rgba(74, 55, 40, 0.12);
  border-radius: var(--radius-lg);
  padding: 1.35rem 1.4rem 1.5rem;
  box-shadow: 0 4px 20px rgba(74, 55, 40, 0.06);
  min-height: min(52vh, 420px);
  display: flex;
  flex-direction: column;
}

.card__meta {
  margin: 0 0 0.75rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-brown-mid);
  opacity: 0.9;
}

.card__title {
  margin: 0 0 0.85rem;
  font-size: 1.28rem;
}

.card__p {
  margin: 0 0 0.85rem;
  font-size: 1.05rem;
  line-height: 1.58;
}

.card__p:last-child {
  margin-bottom: 0;
}

.pager__hint {
  text-align: center;
  font-size: 0.88rem;
  color: var(--color-brown-mid);
  margin: 0.65rem 0 0;
  opacity: 0.85;
}

.pager__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.dots-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  flex: 1;
  max-width: min(100%, 280px);
}

.dots {
  display: flex;
  gap: 0.28rem;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 0.2rem 0;
  scrollbar-width: thin;
  max-width: 100%;
}

.dots__caption {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-brown-mid);
}

.nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--color-brown);
  background: var(--color-bg-soft);
  color: var(--color-brown);
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s ease,
    color 0.15s ease;
  flex-shrink: 0;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-brown);
  color: var(--color-bg-soft);
}

.nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.dots__btn {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(74, 55, 40, 0.28);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease;
  flex-shrink: 0;
}

.dots__btn:hover {
  background: rgba(74, 55, 40, 0.45);
}

.dots__btn--on {
  background: var(--color-brown);
  transform: scale(1.2);
}

@media (max-width: 900px) and (orientation: landscape) {
  .rec__head {
    margin-bottom: 0.65rem;
  }

  .rec__head h1 {
    font-size: 1.35rem;
  }

  .rec__lead {
    font-size: 0.95rem;
    line-height: 1.45;
  }

  .toc-nav__list {
    max-height: min(28vh, 200px);
  }

  .card {
    min-height: auto;
    padding: 1rem 1.1rem 1.15rem;
  }

  .card__title {
    font-size: 1.12rem;
  }

  .card__p {
    font-size: 0.98rem;
    line-height: 1.5;
  }

  .pager__hint {
    margin: 0.35rem 0 0;
    font-size: 0.82rem;
  }

  .pager__controls {
    margin-top: 0.65rem;
  }
}

@media (max-width: 480px) and (orientation: portrait) {
  .card {
    min-height: min(48dvh, 380px);
  }
}
</style>
