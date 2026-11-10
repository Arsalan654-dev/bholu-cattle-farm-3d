import { useEffect, useRef } from 'react'
import { ScrollTrigger, gsap } from '../lib/gsap-setup.js'
import { useSettings } from '../context/SettingsContext.jsx'
import Clip from '../components/Clip.jsx'
import { V } from '../data/videos.js'

export default function FarmBand() {
  const { reduced } = useSettings()
  const rootRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { yPercent: -10, scale: 1.14 },
        {
          yPercent: 10,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
      gsap.from('.farm__label', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 72%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="farm" ref={rootRef}>
      <div className="farm__img" ref={imgRef}>
        <Clip src={V.hillside} poster="/images/fresh-milk.webp" alt="Bholu farm — our herd and our land in Gadap, Karachi" />
      </div>
      <div className="farm__veil" />
      <span className="g-label farm__label glass">
        The Farm — Gadap, Karachi
      </span>
      <span className="mono farm__big">Our herd. Our land.</span>
    </section>
  )
}
