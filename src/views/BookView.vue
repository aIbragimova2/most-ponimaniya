<script setup lang="ts">
import { ref } from 'vue'
import { bookChapters } from '../data/bookChapters'

const activeId = ref(bookChapters[0]?.id ?? '')

function pick(id: string) {
  activeId.value = id
  const el = document.getElementById(`chapter-${id}`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="book-page">
    <header class="page-head">
      <h1>Книга: про родителей и подростков без лишней воды</h1>
      <p class="page-head__sub">
        Листай главы слева или читай подряд. Тон специально простой — как разговор, а не учебник.
      </p>
    </header>

    <div class="book-layout">
      <aside class="toc" aria-label="Оглавление">
        <p class="toc__label">Оглавление</p>
        <ol class="toc__list">
          <li v-for="(ch, idx) in bookChapters" :key="ch.id">
            <button type="button" class="toc__btn" :class="{ 'toc__btn--on': ch.id === activeId }" @click="pick(ch.id)">
              <span class="toc__num">{{ idx + 1 }}.</span>
              {{ ch.title }}
            </button>
          </li>
        </ol>
      </aside>

      <div class="book-shell">
        <div class="book-shell__inner">
          <article
            v-for="ch in bookChapters"
            :id="`chapter-${ch.id}`"
            :key="ch.id"
            class="chapter"
            @mouseenter="activeId = ch.id"
          >
            <h2 class="chapter__title">{{ ch.title }}</h2>
            <p v-for="(p, i) in ch.paragraphs" :key="i" class="chapter__p">{{ p }}</p>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-head__sub {
  max-width: 48rem;
  margin: 0;
  font-size: 1.05rem;
}

.book-layout {
  display: grid;
  grid-template-columns: minmax(200px, 260px) 1fr;
  gap: 1.25rem;
  align-items: start;
}

@media (max-width: 820px) {
  .book-layout {
    grid-template-columns: 1fr;
  }
}

/* Телефон в альбоме: больше высоты под текст книги, оглавление компактнее */
@media (max-width: 900px) and (orientation: landscape) {
  .book-page {
    gap: 1rem;
  }

  .page-head h1 {
    font-size: 1.35rem;
  }

  .page-head__sub {
    font-size: 0.95rem;
  }

  .toc {
    position: relative;
    top: auto;
    max-height: min(36dvh, 220px);
    overflow-y: auto;
    padding: 0.75rem 0.9rem;
  }

  .book-shell {
    padding: 0.85rem;
  }

  .book-shell__inner {
    max-height: min(calc(100dvh - 11rem), 560px);
    padding: 1rem 1rem 1.25rem;
  }

  .chapter__title {
    font-size: 1.15rem;
  }

  .chapter__p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) and (orientation: portrait) {
  .book-shell__inner {
    max-height: min(68dvh, 720px);
  }
}

.toc {
  position: sticky;
  top: 0.75rem;
  padding: 1rem 1.1rem;
  background: var(--color-bg-soft);
  border-radius: var(--radius-md);
  border: 1px solid rgba(74, 55, 40, 0.1);
}

.toc__label {
  margin: 0 0 0.5rem;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-brown-mid);
}

.toc__list {
  margin: 0;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.toc__btn {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  font: inherit;
  color: var(--color-brown);
  cursor: pointer;
  padding: 0.35rem 0;
  border-radius: var(--radius-sm);
}

.toc__btn:hover {
  text-decoration: underline;
}

.toc__btn--on {
  font-weight: 700;
}

.toc__num {
  font-weight: 700;
  margin-right: 0.25rem;
}

.book-shell {
  background: var(--color-brown);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-soft);
}

.book-shell__inner {
  background: var(--color-bg-soft);
  color: var(--color-text-on-light);
  border-radius: calc(var(--radius-lg) - 8px);
  padding: 1.5rem 1.35rem 2rem;
  font-family: var(--font-book);
  max-height: min(70vh, 720px);
  overflow-y: auto;
}

.chapter + .chapter {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(74, 55, 40, 0.12);
}

.chapter__title {
  font-family: var(--font-ui);
  font-size: 1.35rem;
  margin: 0 0 1rem;
  color: var(--color-brown);
}

.chapter__p {
  margin: 0 0 1rem;
  font-size: 1.06rem;
  line-height: 1.65;
}

.chapter__p:last-child {
  margin-bottom: 0;
}
</style>
