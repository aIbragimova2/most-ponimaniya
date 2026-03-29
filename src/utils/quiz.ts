export function scoreToPercent(total: number, maxTotal: number): number {
  if (maxTotal <= 0) return 0
  return Math.round((total / maxTotal) * 100)
}

export type ResultBand = 'high' | 'mid' | 'low' | 'critical'

export function bandFromPercent(p: number): ResultBand {
  if (p >= 75) return 'high'
  if (p >= 50) return 'mid'
  if (p >= 30) return 'low'
  return 'critical'
}
