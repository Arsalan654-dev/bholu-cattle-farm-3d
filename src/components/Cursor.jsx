import { useEffect, useRef } from 'react'
import { useSettings } from '../context/SettingsContext.jsx'
import { gsap } from '../lib/gsap-setup.js'

export default function Cursor() {
  const { reduced, touch } = useSettings()
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const pillRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    if (reduced || touch) return undefined
    document.documentElement.classList.add('cursor-off')
    const ring = ringRef.current
    const dot = dotRef.current
    const pill = pillRef.current
    const root = rootRef.current

    const pos = { x: -100, y: -100 }
    const smooth = { x: -100, y: -100 }
    let mode = 'idle'
    let label = ''
    let press = false
    let raf = 0
    let idle = true

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (idle) {
        idle = false
        gsap.fromTo([dot, ring], { opacity: 0 }, { opacity: 1, duration: 0.4 })
      }
    }

    const setMode = (m, l = '') => {
      if (m === mode && l === label) return
      mode = m
      label = l
      pill.textContent = l
      root.classList.toggle('is-view', m === 'view')
      root.classList.toggle('is-milk', m === 'milk')
    }

    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]')
      if (!t) {
        setMode('idle')
        return
      }
      const v = t.getAttribute('data-cursor')
      setMode(v, t.getAttribute('data-cursor-label') || '')
    }

    const loop = () => {
      smooth.x += (pos.x - smooth.x) * (mode === 'milk' ? 0.07 : 0.16)
      smooth.y += (pos.y - smooth.y) * (mode === 'milk' ? 0.07 : 0.16)
      gsap.set(root, { x: smooth.x, y: smooth.y })
      const sc = mode === 'link' || mode === 'view' ? 1.35 : 1
      const ps = press ? 0.72 : 1
      gsap.to(ring, { scale: sc * ps, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
      gsap.to(dot, { scale: 1.1 * ps, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onDown = () => {
      press = true
    }
    const onUp = () => {
      press = false
    }
    const onLeave = () => {
      idle = true
      gsap.to([dot, ring], { opacity: 0, duration: 0.35 })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('cursor-off')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, touch])

  if (reduced || touch) return null

  return (
    <div className="cursor" ref={rootRef} aria-hidden="true">
      <div className="cursor__ring" ref={ringRef} />
      <div className="cursor__dot" ref={dotRef} />
      <div className="cursor__pill" ref={pillRef} />
    </div>
  )
}
