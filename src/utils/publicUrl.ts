/**
 * URL к файлу из папки `public/` с учётом `base` (на GitHub Pages это /repo-name/).
 * Без этого `/images/...` уходит в корень домена и картинки не находятся.
 */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}
