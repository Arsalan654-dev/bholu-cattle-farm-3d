import { createContext, useContext, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { gsap } from '../lib/gsap-setup.js'
import { waveEdgePath } from '../lib/motion.js'
import { useSettings } from './SettingsContext.jsx'

const TransitionContext = createContext(null)
export const transitions = {
  coverDone: null,
  stageDone: null,
}

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const { reduced } = useSettings()
  const busy = useRef(false)
  const curtain = useRef(null)
  const topEdge = useRef(null)
  const bottomEdge = useRef(null)
  const word = useRef(null)

  const go = (to) => {
    if (busy.current) return
    if (window.location.hash.slice(1) === to) return
    busy.current = true
    const el = curtain.current
    const [, topB] = waveEdgePath(2, 30)
    const [, botB] = waveEdgePath(7, 34)

    const t0 = performance.now()
    const cover = () =>
      new Promise((res) => {
        gsap.to(el, { yPercent: 0, duration: reduced ? 0.01 : 0.6, ease: 'power3.inOut', onComplete: res })
      })
    const stage = () =>
      new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)))

    ;(async () => {
      gsap.set(el, { display: 'flex', yPercent: 108 })
      gsap.set(word.current, { yPercent: 60, opacity: 0 })
      if (!reduced) {
        gsap.to(topEdge.current, { attr: { d: topB }, duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
        gsap.to(bottomEdge.current, { attr: { d: botB }, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
        gsap.fromTo(word.current, { yPercent: 70 }, { yPercent: 0, opacity: 1, duration: 0.5, delay: 0.25 })
      }
      await cover()
      navigate(to)
      await stage()
      transitions.stageDone?.()
      if (reduced) {
        gsap.set(el, { display: 'none' })
        busy.current = false
        return
      }
      gsap.to(el, {
        yPercent: -115,
        duration: 0.75,
        delay: 0.05,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.killTweensOf([topEdge.current, bottomEdge.current])
          gsap.set(el, { display: 'none', clearProps: 'transform' })
          busy.current = false
        },
      })
    })()
  }

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div className="milk-curtain" ref={curtain} aria-hidden="true">
        <svg className="milk-curtain__edge milk-curtain__edge--top" viewBox="0 0 1440 130" preserveAspectRatio="none">
          <path ref={topEdge} d={waveEdgePath(2, 30)[0]} />
        </svg>
        <div className="milk-curtain__body">
          <span className="milk-curtain__word" ref={word}>
            BHOLU
          </span>
        </div>
        <svg className="milk-curtain__edge milk-curtain__edge--bottom" viewBox="0 0 1440 130" preserveAspectRatio="none">
          <path ref={bottomEdge} d={waveEdgePath(7, 34)[0]} />
        </svg>
      </div>
    </TransitionContext.Provider>
  )
}

export function TLink({ to, children, className, onClick, ...rest }) {
  const { go } = useContext(TransitionContext)
  return (
    <Link
      to={to}
      className={className}
      {...rest}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        onClick?.()
        go(to)
      }}
    >
      {children}
    </Link>
  )
}

export function useTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('useTransition must be used inside TransitionProvider')
  return ctx
}
