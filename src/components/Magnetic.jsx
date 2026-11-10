import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap-setup.js'
import { useSettings } from '../context/SettingsContext.jsx'

export default function Magnetic({ children, strength = 0.3, className = '' }) {
  const { reduced, touch } = useSettings()
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || touch) return undefined
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, touch, strength])

  return (
    <span ref={ref} className={`magnetic ${className}`} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </span>
  )
}
