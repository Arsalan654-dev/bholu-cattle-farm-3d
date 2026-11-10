export const lerp = (a, b, t) => a + (b - a) * t

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export function getPrefs() {
  if (typeof window === 'undefined') {
    return { reduced: false, touch: false, quality: 'high' }
  }
  const reduced =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const touch =
    window.matchMedia('(pointer: coarse)').matches ||
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency || 4
  let quality = 'high'
  if (reduced) quality = 'low'
  else if (touch || cores <= 4) quality = 'medium'
  return { reduced, touch, quality }
}

export function supportsWebGL() {
  if (typeof window === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    )
  } catch {
    return false
  }
}

export const QUALITY = {
  high: { dpr: 2, segments: 96, particles: 900, grid: true, transmission: true, frameloop: 'always' },
  medium: { dpr: 1.6, segments: 64, particles: 380, grid: true, transmission: false, frameloop: 'always' },
  low: { dpr: 1, segments: 48, particles: 0, grid: false, transmission: false, frameloop: 'demand' },
}

/* structure-identical wave paths for liquid morphs (viewBox 1440 x 900) */
export function waveEdgePath(seed, amp) {
  const a = (i) => amp * Math.sin((i + seed * 2.13) * 1.61)
  const b = (i) => amp * Math.cos((i + seed * 1.17) * 2.31)
  const pts = []
  for (let i = 0; i <= 4; i++) {
    const x = i * 360
    pts.push(`C ${x - 240} ${90 + a(i * 3 + 1)} ${x - 120} ${10 - b(i * 2 + 1)} ${x} ${46 + a(i * 5)}`)
  }
  return [
    `M0 96 L0 30 ${pts.join(' ')} L1440 60 L1440 0 Z`,
    `M0 104 L0 44 ${pts.join(' ')} L1440 70 L1440 0 Z`,
  ]
}
