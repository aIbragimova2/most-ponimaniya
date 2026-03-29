import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages: сайт лежит в подпапке /most-ponimaniya/
// Локально (vite dev) base остаётся "/"
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/most-ponimaniya/' : '/',
  plugins: [vue()],
}))
