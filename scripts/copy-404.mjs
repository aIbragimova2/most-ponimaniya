/**
 * GitHub Pages отдаёт 404 для прямых ссылок вида /repo/kniga.
 * Дубликат index.html как 404.html позволяет загрузить SPA и отработать роутеру.
 */
import { copyFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const index = join(root, 'dist', 'index.html')
const dest = join(root, 'dist', '404.html')

if (!existsSync(index)) {
  console.error('copy-404: dist/index.html not found. Run vite build first.')
  process.exit(1)
}

copyFileSync(index, dest)
console.log('copy-404: dist/404.html created (SPA fallback for GitHub Pages)')
