import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useSettings } from '../context/SettingsContext.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import Magnetic from '../components/Magnetic.jsx'
import Clip from '../components/Clip.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { V } from '../data/videos.js'

const MilkOrb = lazy(() => import('../scene/MilkOrb.jsx'))

export default function FinalCta() {
  const { reduced } = useSettings()
  const rootRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setMounted(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true)
          io.disconnect()
        }
      },
      { rootMargin: '40% 0px' },
    )
    if (rootRef.current) io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <section className="final" ref={rootRef}>
      <div className="final__bg" aria-hidden="true">
        <Clip src={V.logo} fill alt="" />
      </div>
      <div className="final__canvas">
        {mounted && !reduced && (
          <Suspense fallback={null}>
            <MilkOrb variant="cta" fallbackClass="orb-cta" />
          </Suspense>
        )}
      </div>

      <div className="container final__inner">
        <span className="g-label">06 — Contact</span>
        <h2 className="final__title">
          Pureness,
          <br />
          <span className="red">delivered.</span>
        </h2>
        <div className="final__meta">
          <span>
            <i />
            Free home delivery — Karachi
          </span>
          <span>
            <i />
            +92 324 8285533
          </span>
        </div>
        <div className="final__ctas">
          <Magnetic strength={0.26}>
            <TLink to="/shop" className="btn btn--light" data-cursor="view" data-cursor-label="SHOP">
              Shop Fresh Milk
              <ArrowRight size={15} />
            </TLink>
          </Magnetic>
          <Magnetic strength={0.26}>
            <TLink to="/contact" className="btn btn--ghost" data-cursor="view" data-cursor-label="CONTACT">
              Contact Bholu Farm
            </TLink>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
