import { lazy, Suspense, useCallback, useEffect, useRef } from 'react'
import { useSettings } from '../context/SettingsContext.jsx'
import { gsap } from '../lib/gsap-setup.js'
import Magnetic from '../components/Magnetic.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import Clip from '../components/Clip.jsx'
import { V } from '../data/videos.js'

const MilkOrb = lazy(() => import('../scene/MilkOrb.jsx'))

export default function Hero() {
  const { reduced } = useSettings()
  const rootRef = useRef(null)
  const orbReady = useRef(null)

  const handleOrb = useCallback((api) => {
    orbReady.current = api
    if (!api || reduced) return
    gsap
      .timeline()
      .to(api.intro.current, { value: 1, duration: 2.8, ease: 'power3.out', overwrite: true }, 0)
      .to(api.cam, { z: 7.8, y: 0.5, duration: 3.4, ease: 'power3.out', overwrite: true, onComplete: () => { api.intro.current.done = true } }, 0)
      .fromTo(
        api.mat,
        { envMapIntensity: 0 },
        { envMapIntensity: 1.25, duration: 2.6, ease: 'power2.out', overwrite: true },
        0.15,
      )
  }, [reduced])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        root.querySelectorAll('[data-herofade]'),
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 1.05, stagger: 0.09 },
        0.15,
      )
      tl.from(
        root.querySelectorAll('[data-word]'),
        { yPercent: 118, rotate: 5, duration: 1.5, stagger: 0.1, ease: 'power4.out' },
        0.3,
      )
      tl.from(root.querySelector('.hero__scroll span'), { scaleX: 0, duration: 1.3 }, 1.35)
      if (orbReady.current) handleOrb(orbReady.current)
    }, root)
    return () => ctx.revert()
  }, [reduced, handleOrb])

  return (
    <section className="hero" ref={rootRef}>
      <div className="hero__bg" aria-hidden="true">
        <Clip src={V.splash} fill alt="" />
      </div>
      <div className="hero__canvas">
        <Suspense fallback={null}>
          {!reduced && <MilkOrb onReady={handleOrb} />}
        </Suspense>
      </div>

      <div className="container hero__copy">
        <div className="hero__top">
          <span className="mono" data-herofade>
            ARS Animated 3D × Bholu Farms — Karachi
          </span>
          <span className="hero__side" data-herofade>
            Interactive case study
          </span>
        </div>

        <h1 className="hero__title">
          <span className="wline">
            <span data-word>PURE</span>
            <span data-word className="red">MILK.</span>
          </span>
          <span className="wline">
            <span data-word>PURE</span>
            <span data-word className="red">ORIGIN.</span>
          </span>
        </h1>

        <div className="hero__sub">
          <p className="hero__lede" data-herofade>
            Fresh from one farm. Never from a factory. 100% organic milk — closed, hygienic
            processing, delivered to your doorstep in Karachi.
          </p>
          <div className="hero__ctas" data-herofade>
            <Magnetic strength={0.24}>
              <TLink to="/shop" className="btn" data-cursor="view" data-cursor-label="SHOP">
                Shop Fresh Milk
                <ArrowRight size={15} />
              </TLink>
            </Magnetic>
            <TLink to="/about" className="hero__textlink">
              Our story
            </TLink>
          </div>
        </div>

        <div className="hero__foot" data-herofade>
          <div className="hero__facts">
            <span className="hero__fact">
              <i />
              100% Organic
            </span>
            <span className="hero__fact">
              <i />
              No Added Hormones
            </span>
            <span className="hero__fact">
              <i />
              Farm To Home
            </span>
          </div>
          <span className="hero__scroll">
            Scroll
            <span />
          </span>
        </div>
      </div>
    </section>
  )
}
