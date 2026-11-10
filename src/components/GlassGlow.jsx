import { useEffect } from 'react'

export default function GlassGlow() {
  useEffect(() => {
    const onMove = (e) => {
      const g = e.target.closest?.('.glass')
      if (!g) return
      const r = g.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 100
      const y = ((e.clientY - r.top) / r.height) * 100
      g.style.setProperty('--gx', `${x}%`)
      g.style.setProperty('--gy', `${y}%`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
  return null
}
