<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import type { QuizQuestion } from '../data/questionsParents'
import { bandFromPercent, scoreToPercent } from '../utils/quiz'
import type { ResultBand } from '../utils/quiz'
import { getParentsResult, getTeensResult } from '../data/resultTexts'

const props = defineProps<{
  variant: 'parents' | 'teens'
  title: string
  intro: string
  questions: QuizQuestion[]
}>()

const storageKey = computed(() => `family-quiz-${props.variant}`)

type Stored = {
  percent: number
  band: ResultBand
  at: string
}

const answers = ref<Record<string, number>>({})
const step = ref(0)
const finished = ref(false)
const showingStored = ref(false)
const lastStored = ref<Stored | null>(null)

const maxTotal = computed(() => props.questions.length * 3)

const current = computed(() => props.questions[step.value])

const totalScore = computed(() => {
  let s = 0
  for (const q of props.questions) {
    const v = answers.value[q.id]
    if (v !== undefined) s += v
  }
  return s
})

const percentFresh = computed(() => scoreToPercent(totalScore.value, maxTotal.value))
const bandFresh = computed<ResultBand>(() => bandFromPercent(percentFresh.value))

const displayPercent = computed(() =>
  showingStored.value && lastStored.value ? lastStored.value.percent : percentFresh.value,
)

const displayBand = computed<ResultBand>(() =>
  showingStored.value && lastStored.value ? lastStored.value.band : bandFresh.value,
)

const resultBlock = computed(() =>
  props.variant === 'parents' ? getParentsResult(displayBand.value) : getTeensResult(displayBand.value),
)

function loadStored() {
  try {
    const raw = localStorage.getItem(storageKey.value)
    if (!raw) {
      lastStored.value = null
      return
    }
    lastStored.value = JSON.parse(raw) as Stored
  } catch {
    lastStored.value = null
  }
}

function saveResult() {
  const payload: Stored = {
    percent: percentFresh.value,
    band: bandFresh.value,
    at: new Date().toISOString(),
  }
  localStorage.setItem(storageKey.value, JSON.stringify(payload))
  lastStored.value = payload
}

onMounted(() => {
  loadStored()
})

watch(storageKey, () => loadStored())

function selectScore(score: number) {
  const q = current.value
  if (!q) return
  answers.value = { ...answers.value, [q.id]: score }
}

function next() {
  if (step.value < props.questions.length - 1) {
    step.value += 1
    return
  }
  showingStored.value = false
  finished.value = true
  saveResult()
}

function prev() {
  if (step.value > 0) step.value -= 1
}

function restart() {
  answers.value = {}
  step.value = 0
  finished.value = false
  showingStored.value = false
}

function clearHistory() {
  localStorage.removeItem(storageKey.value)
  lastStored.value = null
}

function showLastAgain() {
  showingStored.value = true
  finished.value = true
}

const canNext = computed(() => {
  const q = current.value
  if (!q) return false
  return answers.value[q.id] !== undefined
})

const progressLabel = computed(() => `${step.value + 1} / ${props.questions.length}`)
</script>

<template>
  <div class="quiz">
    <header class="quiz__head">
      <h1>{{ title }}</h1>
      <p class="quiz__intro">{{ intro }}</p>
    </header>

    <div v-if="lastStored && !finished" class="banner">
      <p>
        Сохранён прошлый результат:
        <strong>{{ lastStored.percent }}%</strong>
        ({{ new Date(lastStored.at).toLocaleString('ru-RU') }}).
      </p>
      <div class="banner__actions">
        <button type="button" class="btn btn--ghost" @click="showLastAgain">Посмотреть результат</button>
        <button type="button" class="btn btn--ghost" @click="clearHistory">Сбросить сохранение</button>
      </div>
    </div>

    <section v-if="!finished" class="panel" aria-live="polite">
      <div class="panel__top">
        <span class="panel__progress">Вопрос {{ progressLabel }}</span>
        <div
          class="meter"
          role="progressbar"
          :aria-valuenow="step + 1"
          :aria-valuemin="1"
          :aria-valuemax="questions.length"
        >
          <div class="meter__fill" :style="{ width: `${((step + 1) / questions.length) * 100}%` }" />
        </div>
      </div>

      <h2 class="panel__q">{{ current?.text }}</h2>

      <ul v-if="current" class="opts" role="list">
        <li v-for="(opt, idx) in current.options" :key="idx">
          <button
            type="button"
            class="opt"
            :class="{ 'opt--on': answers[current.id] === opt.score }"
            @click="selectScore(opt.score)"
          >
            <span class="opt__radio" aria-hidden="true" />
            <span class="opt__label">{{ opt.label }}</span>
          </button>
        </li>
      </ul>

      <div class="nav-row">
        <button type="button" class="btn btn--ghost" :disabled="step === 0" @click="prev">Назад</button>
        <button type="button" class="btn" :disabled="!canNext" @click="next">
          {{ step < questions.length - 1 ? 'Дальше' : 'Завершить и показать результат' }}
        </button>
      </div>
    </section>

    <article v-else class="result">
      <div class="result__score">
        <p class="result__label">Условный индекс взаимопонимания</p>
        <p class="result__num">{{ displayPercent }}%</p>
        <p class="result__hint">
          Это не диагноз, а ориентир по ответам. Ниже — что может мешать и что можно попробовать сделать.
        </p>
      </div>

      <div class="result__body">
        <h2 class="result__title">{{ resultBlock.title }}</h2>
        <p class="result__lead">{{ resultBlock.lead }}</p>

        <h3 class="result__h3">Что может быть непросто</h3>
        <ul class="result__ul">
          <li v-for="(x, i) in resultBlock.problems" :key="i">{{ x }}</li>
        </ul>

        <h3 class="result__h3">Что можно сделать по шагам</h3>
        <ol class="result__ol">
          <li v-for="(x, i) in resultBlock.steps" :key="i">{{ x }}</li>
        </ol>
      </div>

      <div class="result__actions">
        <button type="button" class="btn" @click="restart">Пройти заново</button>
        <RouterLink to="/rekomendacii" class="btn btn--ghost">К рекомендациям</RouterLink>
      </div>
    </article>
  </div>
</template>

<style scoped>
.quiz__intro {
  max-width: 46rem;
  margin: 0;
  font-size: 1.05rem;
}

.banner {
  background: var(--color-bg-soft);
  border: 1px solid rgba(74, 55, 40, 0.15);
  border-radius: var(--radius-md);
  padding: 1rem 1.15rem;
  margin-bottom: 1.25rem;
}

.banner p {
  margin: 0 0 0.75rem;
}

.banner__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.panel {
  background: var(--color-brown);
  color: var(--color-text-on-dark);
  border-radius: var(--radius-lg);
  padding: 1.35rem 1.25rem 1.5rem;
  box-shadow: var(--shadow-soft);
}

.panel__top {
  margin-bottom: 1rem;
}

.panel__progress {
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.45rem;
  opacity: 0.95;
}

.meter {
  height: 8px;
  background: rgba(231, 221, 211, 0.25);
  border-radius: 999px;
  overflow: hidden;
}

.meter__fill {
  height: 100%;
  background: var(--color-bg);
  border-radius: 999px;
  transition: width 0.25s ease;
}

.panel__q {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  color: #fff;
  font-weight: 700;
}

.opts {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.opt {
  width: 100%;
  text-align: left;
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(231, 221, 211, 0.35);
  background: rgba(231, 221, 211, 0.08);
  color: var(--color-text-on-dark);
  font: inherit;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.opt:hover {
  background: rgba(231, 221, 211, 0.16);
}

.opt--on {
  border-color: var(--color-bg);
  background: rgba(231, 221, 211, 0.22);
}

.opt__radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(231, 221, 211, 0.8);
  flex-shrink: 0;
  margin-top: 2px;
}

.opt--on .opt__radio {
  border-color: #fff;
  box-shadow: inset 0 0 0 4px var(--color-brown);
  background: var(--color-bg);
}

.opt__label {
  flex: 1;
  line-height: 1.45;
}

.nav-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.35rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.15rem;
  border-radius: var(--radius-md);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  border: 2px solid transparent;
}

.panel .btn:not(.btn--ghost) {
  background: var(--color-bg-soft);
  color: var(--color-brown);
  border-color: rgba(231, 221, 211, 0.6);
}

.panel .btn:not(.btn--ghost):hover:not(:disabled) {
  filter: brightness(1.03);
}

.result__actions .btn:not(.btn--ghost),
.quiz .banner .btn:not(.btn--ghost) {
  background: var(--color-brown);
  color: var(--color-text-on-dark);
  border-color: rgba(74, 55, 40, 0.35);
}

.result__actions .btn:not(.btn--ghost):hover,
.quiz .banner .btn:not(.btn--ghost):hover {
  filter: brightness(1.06);
}

.btn:hover {
  filter: brightness(1.04);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn--ghost {
  background: transparent;
  color: var(--color-text-on-dark);
  border: 2px solid rgba(231, 221, 211, 0.55);
}

.panel .btn--ghost {
  color: var(--color-bg-soft);
  border-color: rgba(231, 221, 211, 0.45);
}

.result__actions .btn--ghost {
  color: var(--color-brown);
  border-color: var(--color-brown);
}

.quiz .banner .btn--ghost {
  color: var(--color-brown);
  border-color: var(--color-brown);
  background: rgba(255, 255, 255, 0.35);
}

.result {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.result__score {
  background: var(--color-brown);
  color: var(--color-text-on-dark);
  border-radius: var(--radius-lg);
  padding: 1.35rem 1.25rem;
  box-shadow: var(--shadow-soft);
}

.result__label {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  opacity: 0.92;
}

.result__num {
  margin: 0;
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 800;
  letter-spacing: 0.02em;
}

.result__hint {
  margin: 0.5rem 0 0;
  font-size: 0.98rem;
  line-height: 1.5;
  opacity: 0.95;
}

.result__body {
  background: var(--color-bg-soft);
  border-radius: var(--radius-lg);
  padding: 1.35rem 1.35rem 1.5rem;
  border: 1px solid rgba(74, 55, 40, 0.12);
}

.result__title {
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
}

.result__lead {
  margin: 0 0 1rem;
  font-size: 1.05rem;
}

.result__h3 {
  margin: 1rem 0 0.5rem;
  font-size: 1.05rem;
}

.result__ul,
.result__ol {
  margin: 0 0 0.5rem;
  padding-left: 1.25rem;
}

.result__li,
.result__ul li,
.result__ol li {
  margin-bottom: 0.45rem;
  line-height: 1.55;
}

.result__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

@media (max-width: 900px) and (orientation: landscape) {
  .quiz__head h1 {
    font-size: 1.35rem;
  }

  .quiz__intro {
    font-size: 0.95rem;
  }

  .panel {
    padding: 1rem 1rem 1.15rem;
  }

  .panel__q {
    font-size: 1.05rem;
  }

  .opt {
    padding: 0.55rem 0.7rem;
  }

  .opt__label {
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .result__num {
    font-size: 2.25rem;
  }

  .result__body {
    padding: 1rem 1.05rem 1.15rem;
  }
}
</style>
