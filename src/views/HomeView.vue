<script setup lang="ts">
import { RouterLink } from 'vue-router'

const cards = [
  {
    to: '/kniga',
    title: 'Книга',
    text: 'Читать простым языком: как бывают отношения с родителями и что с этим делают обычные люди.',
    tag: 'читать',
    img: '/images/card-book.svg',
    imgAlt: 'Иконка: открытая книга',
  },
  {
    to: '/rekomendacii',
    title: 'Рекомендации',
    text: 'Советы по шагам — листай как страницы. Без морали и давления, только идеи, которые можно попробовать.',
    tag: 'советы',
    img: '/images/card-tips.svg',
    imgAlt: 'Иконка: подсказка',
  },
  {
    to: '/test-roditeli',
    title: 'Тест для родителей',
    text: 'Отдельная анкета для взрослых: как вы чувствуете контакт с ребёнком и где узкие места.',
    tag: 'тест',
    img: '/images/card-parents.svg',
    imgAlt: 'Иконка: взрослый и ребёнок',
  },
  {
    to: '/test-podrostki',
    title: 'Тест для подростков',
    text: 'Отдельная анкета для подростков: как тебе дома и слышат ли твои чувства.',
    tag: 'тест',
    img: '/images/card-teen.svg',
    imgAlt: 'Иконка: подросток',
  },
]
</script>

<template>
  <div class="home">
    <section class="hero" aria-labelledby="home-title">
      <div class="hero__content">
        <p class="hero__badge">Школьный проект</p>
        <h1 id="home-title" class="hero__title">Мост понимания</h1>
        <p class="hero__topic">
          Влияние взаимоотношений с родителями на развитие личности
        </p>
        <p class="hero__lead">
          Здесь собраны простые тексты, листаемые советы и два разных теста — для родителей и для подростков.
          Ничего лишнего: только то, с чем реально сталкиваются семьи.
        </p>
      </div>
      <div class="hero__figure">
        <img
          class="hero__img"
          src="/images/hero-bridge.svg"
          width="480"
          height="360"
          alt=""
          decoding="async"
          fetchpriority="high"
        />
        <p class="hero__caption">Связь между поколениями — не всегда прямая дорога, но её можно беречь.</p>
      </div>
    </section>

    <section class="why" aria-labelledby="why-title">
      <h2 id="why-title" class="why__title">Зачем этот проект</h2>
      <div class="why__grid">
        <div class="why__card">
          <h3 class="why__h">Чем полезен</h3>
          <p class="why__p">
            Он собирает в одном месте простые объяснения и идеи без нравоучений: легче понять, что происходит в
            семье, и что можно сделать уже сейчас. Отдельные тесты для родителей и подростков помогают честно
            посмотреть на связь — каждому со своей стороны.
          </p>
        </div>
        <div class="why__card">
          <h3 class="why__h">Почему это важно</h3>
          <p class="why__p">
            От того, как мы общаемся дома, зависит многое: уверенность в себе, умение договариваться, справляться
            со стрессом. Это не «мелочь на фоне оценок» — это фундамент, на котором потом строится взрослая жизнь.
            Говорить об этом вслух — нормально и полезно.
          </p>
        </div>
      </div>
    </section>

    <section class="sections" aria-labelledby="sections-title">
      <div class="sections__head">
        <h2 id="sections-title" class="sections__title">Куда зайти</h2>
        <p class="sections__sub">Выбери раздел — откроется отдельная страница.</p>
      </div>

      <div class="grid">
        <RouterLink v-for="c in cards" :key="c.to" :to="c.to" class="card">
          <div class="card__visual">
            <img class="card__pic" :src="c.img" :alt="c.imgAlt" width="120" height="100" loading="lazy" />
          </div>
          <div class="card__main">
            <span class="card__tag">{{ c.tag }}</span>
            <h3 class="card__title">{{ c.title }}</h3>
            <p class="card__text">{{ c.text }}</p>
            <span class="card__cta">
              Открыть
              <span class="card__arrow" aria-hidden="true">→</span>
            </span>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes home-rise {
  from {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes home-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes home-pop {
  from {
    opacity: 0;
    transform: translate3d(0, 12px, 0) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

.home {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* ——— Герой ——— */
.hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
  align-items: center;
  padding: 1.5rem 1.35rem 1.75rem;
  border-radius: var(--radius-lg);
  background:
    radial-gradient(120% 90% at 100% 0%, rgba(74, 55, 40, 0.09) 0%, transparent 55%),
    radial-gradient(80% 80% at 0% 100%, rgba(74, 55, 40, 0.06) 0%, transparent 50%),
    linear-gradient(165deg, #f2ebe3 0%, #e7ddd3 100%);
  border: 1px solid rgba(74, 55, 40, 0.1);
  box-shadow: 0 12px 40px rgba(74, 55, 40, 0.08);
  animation: home-fade-in var(--dur-slow) var(--ease-out) both;
}

.hero__content > * {
  animation: home-rise 0.6s var(--ease-out) both;
}

.hero__content > *:nth-child(1) {
  animation-delay: 0.04s;
}
.hero__content > *:nth-child(2) {
  animation-delay: 0.1s;
}
.hero__content > *:nth-child(3) {
  animation-delay: 0.16s;
}
.hero__content > *:nth-child(4) {
  animation-delay: 0.22s;
}

@media (min-width: 880px) {
  .hero {
    grid-template-columns: minmax(0, 1fr) minmax(280px, 440px);
    gap: 2rem;
    padding: 2rem 2rem 2.25rem;
  }
}

.hero__badge {
  margin: 0 0 0.5rem;
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-brown-mid);
}

.hero__title {
  margin: 0 0 0.5rem;
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-brown);
  line-height: 1.1;
}

.hero__topic {
  margin: 0 0 1rem;
  font-family: var(--font-book, Georgia, serif);
  font-size: clamp(1.05rem, 2.2vw, 1.2rem);
  font-weight: 600;
  color: var(--color-brown-mid);
  line-height: 1.35;
  max-width: 36rem;
}

.hero__lead {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 38rem;
  color: var(--color-text-on-light);
}

.hero__figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  animation: home-pop 0.65s var(--ease-out) 0.18s both;
}

.hero__img {
  width: 100%;
  max-width: 420px;
  height: auto;
  display: block;
  border-radius: calc(var(--radius-lg) - 6px);
  box-shadow: 0 16px 48px rgba(74, 55, 40, 0.12);
  transition: transform var(--dur-med) var(--ease-soft);
}

@media (hover: hover) and (pointer: fine) {
  .hero:hover .hero__img {
    transform: translate3d(0, -2px, 0);
  }
}

.hero__caption {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  text-align: center;
  color: var(--color-brown-mid);
  max-width: 22rem;
}

/* ——— Зачем проект ——— */
.why {
  padding: 1.35rem 1.25rem 1.5rem;
  border-radius: var(--radius-lg);
  background: #f2ebe3;
  border: 1px solid rgba(74, 55, 40, 0.1);
  box-shadow: 0 8px 28px rgba(74, 55, 40, 0.06);
  animation: home-rise 0.55s var(--ease-out) both;
  animation-delay: 0.08s;
}

.why__title {
  margin: 0 0 1.1rem;
  font-size: 1.35rem;
  text-align: center;
  color: var(--color-brown);
}

.why__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.15rem;
}

@media (min-width: 720px) {
  .why__grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.35rem;
  }
}

.why__card {
  margin: 0;
  padding: 1rem 1.1rem 1.15rem;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(74, 55, 40, 0.08);
  animation: home-rise 0.5s var(--ease-out) both;
}

.why__card:nth-child(1) {
  animation-delay: 0.2s;
}

.why__card:nth-child(2) {
  animation-delay: 0.3s;
}

.why__h {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  color: var(--color-brown);
}

.why__p {
  margin: 0;
  font-size: 0.96rem;
  line-height: 1.55;
  color: var(--color-text-on-light);
}

/* ——— Сетка карточек ——— */
.sections__head {
  margin-bottom: 1rem;
  animation: home-rise 0.5s var(--ease-out) both;
  animation-delay: 0.12s;
}

.sections__title {
  margin: 0 0 0.35rem;
  font-size: 1.45rem;
  color: var(--color-brown);
}

.sections__sub {
  margin: 0;
  font-size: 0.98rem;
  color: var(--color-brown-mid);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.15rem;
}

.card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: var(--color-bg-soft);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(74, 55, 40, 0.12);
  box-shadow: 0 6px 24px rgba(74, 55, 40, 0.07);
  transition:
    transform var(--dur-fast) var(--ease-soft),
    box-shadow var(--dur-fast) var(--ease-soft),
    border-color var(--dur-fast) var(--ease-soft),
    opacity var(--dur-fast) ease;
  animation: home-rise 0.5s var(--ease-out) both;
}

.card:nth-child(1) {
  animation-delay: 0.18s;
}
.card:nth-child(2) {
  animation-delay: 0.26s;
}
.card:nth-child(3) {
  animation-delay: 0.34s;
}
.card:nth-child(4) {
  animation-delay: 0.42s;
}

@media (hover: hover) and (pointer: fine) {
  .card:hover {
    transform: translate3d(0, -4px, 0);
    box-shadow: 0 16px 44px rgba(74, 55, 40, 0.14);
    border-color: rgba(74, 55, 40, 0.22);
  }
}

@media (hover: none) {
  .card:active {
    opacity: 0.94;
    transform: scale(0.99);
  }
}

.card:focus-visible {
  outline: 3px solid rgba(74, 55, 40, 0.35);
  outline-offset: 2px;
}

.card__visual {
  background: linear-gradient(180deg, rgba(74, 55, 40, 0.07) 0%, #f2ebe3 100%);
  padding: 1.25rem 1rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(74, 55, 40, 0.08);
}

.card__pic {
  width: min(100%, 140px);
  height: auto;
  object-fit: contain;
  transition: transform var(--dur-med) var(--ease-soft);
}

@media (hover: hover) and (pointer: fine) {
  .card:hover .card__pic {
    transform: scale(1.04);
  }
}

.card__main {
  padding: 1.1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex: 1;
}

.card__tag {
  align-self: flex-start;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-brown-mid);
}

.card__title {
  margin: 0;
  font-size: 1.22rem;
  color: var(--color-brown);
  line-height: 1.2;
}

.card__text {
  margin: 0;
  flex: 1;
  font-size: 0.94rem;
  line-height: 1.52;
  color: var(--color-text-on-light);
}

.card__cta {
  margin-top: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--color-brown);
}

.card__arrow {
  transition: transform var(--dur-fast) var(--ease-soft);
}

@media (hover: hover) and (pointer: fine) {
  .card:hover .card__arrow {
    transform: translate3d(4px, 0, 0);
  }
}

@media (max-width: 900px) and (orientation: landscape) {
  .home {
    gap: 1.5rem;
  }

  .hero {
    padding: 1.1rem 1.1rem 1.25rem;
  }

  .hero__img {
    max-width: 300px;
  }

  .hero__caption {
    font-size: 0.82rem;
  }

  .grid {
    gap: 0.75rem;
  }

  .why {
    padding: 1rem 1rem 1.1rem;
  }

  .why__title {
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) and (orientation: portrait) {
  .hero__lead {
    font-size: 1rem;
  }

  .home {
    gap: 1.85rem;
  }
}

@media (max-width: 380px) {
  .home {
    gap: 1.6rem;
  }

  .hero {
    padding: 1.25rem 1rem 1.45rem;
  }

  .why {
    padding: 1.15rem 1rem 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero,
  .hero__content > *,
  .hero__figure,
  .why,
  .why__card,
  .sections__head,
  .card {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .hero__img {
    transition: none;
  }
}
</style>
