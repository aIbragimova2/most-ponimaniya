import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BookView from '../views/BookView.vue'
import RecommendationsView from '../views/RecommendationsView.vue'
import TestParentsView from '../views/TestParentsView.vue'
import TestTeensView from '../views/TestTeensView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Главная' } },
    { path: '/kniga', name: 'book', component: BookView, meta: { title: 'Книга' } },
    {
      path: '/rekomendacii',
      name: 'recommendations',
      component: RecommendationsView,
      meta: { title: 'Рекомендации' },
    },
    {
      path: '/test-roditeli',
      name: 'test-parents',
      component: TestParentsView,
      meta: { title: 'Тест для родителей' },
    },
    {
      path: '/test-podrostki',
      name: 'test-teens',
      component: TestTeensView,
      meta: { title: 'Тест для подростков' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = 'Мост понимания'
  document.title = to.meta.title ? `${to.meta.title as string} — ${base}` : base
})

export default router
