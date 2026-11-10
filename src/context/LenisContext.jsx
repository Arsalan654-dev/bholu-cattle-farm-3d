import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap-setup.js'
import { useSettings } from './SettingsContext.jsx'

const LenisContext = createContext(null)

export function LenisProvider({ children }) {
  const { reduced } = useSettings()
  const lenisRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined
    const lenis = new Lenis({
      duration: 1.18,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.35,
      wheelMultiplier: 1,
    })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const api = {
    get lenis() {
      return lenisRef.current
    },
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
    scrollTo: (target, opts) => {
      if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.2, ...opts })
      else window.scrollTo({ top: typeof target === 'number' ? target : 0, behavior: 'auto' })
    },
  }

  return <LenisContext.Provider value={api}>{children}</LenisContext.Provider>
}

export function useLenis() {
  const ctx = useContext(LenisContext)
  if (!ctx) throw new Error('useLenis must be used inside LenisProvider')
  return ctx
}
