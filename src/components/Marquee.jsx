import { useEffect, useRef } from 'react'
import { useSettings } from '../context/SettingsContext.jsx'
import { ScrollTrigger, gsap } from '../lib/gsap-setup.js'

export default function Marquee({ items = [], light = false, base = 60 }) {
  const { reduced } = useSettings()
  const trackRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    const list = [...items, ...items]

    let tween
    if (reduced) {
      gsap.set(track, { xPercent: 0 })
    } else {
      tween = gsap.to(track, {
        xPercent: -50,
        duration: base,
        ease: 'none',
        repeat: -1,
      })
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          if (!tween) return
          const v = Math.abs(self.getVelocity() || 0)
          const mult = Math.min(4, 1 + v / 900)
          tween.timeScale(self.getVelocity() < 0 ? -mult : mult)
        },
      })
      return () => {
        tween.kill()
        st.kill()
      }
    }
    return () => tween?.kill()
  }, [items, base, reduced])

  return (
    <div className={`marquee ${light ? 'marquee--light' : ''}`} ref={rootRef} aria-hidden="true">
      <div className="marquee__track" ref={trackRef}>
        {[...items, ...items].map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`}>
            {item}
            <span className="marquee__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
