export function initTilt(scope, selector = '[data-tilt]', max = 6) {
  if (!scope || typeof window === 'undefined') return () => {}
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || calm) return () => {}
  const els = scope.querySelectorAll(selector)
  const cleanups = []
  els.forEach((el) => {
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`
    }
    const onLeave = () => {
      el.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1)'
      el.style.transform = ''
      setTimeout(() => {
        el.style.transition = ''
      }, 700)
    }
    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    cleanups.push(() => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    })
  })
  return () => cleanups.forEach((fn) => fn())
}
