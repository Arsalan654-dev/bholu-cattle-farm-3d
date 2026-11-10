import { useEffect, useRef } from 'react'
import { ScrollTrigger, gsap } from '../lib/gsap-setup.js'
import { initTilt } from '../lib/tilt.js'
import { useSettings } from '../context/SettingsContext.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Clip from '../components/Clip.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { V } from '../data/videos.js'

const TITLE = 'Milk is not made.'
const TITLE2 = 'It is raised.'

export default function Manifesto() {
  const { reduced, touch } = useSettings()
  const rootRef = useRef(null)

  useEffect(() => {
    if (reduced || touch) return undefined
    return initTilt(rootRef.current, '.manifesto__clip', 5)
  }, [reduced, touch])

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return undefined
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const cleanups = []
    const ctx = gsap.context(() => {
      const bg = root.querySelector('.manifesto__bg')
      if (bg) {
        gsap.fromTo(
          bg,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: root, start: 'top 82%' },
          },
        )
        gsap.fromTo(
          bg,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }
      const bgClip = root.querySelector('.manifesto__bg .clip')
      if (bgClip && fine) {
        const xTo = gsap.quickTo(bgClip, 'xPercent', { duration: 0.8, ease: 'power3.out' })
        const yTo = gsap.quickTo(bgClip, 'yPercent', { duration: 0.8, ease: 'power3.out' })
        const onMove = (e) => {
          const r = root.getBoundingClientRect()
          xTo(((e.clientX - r.left) / r.width - 0.5) * 6)
          yTo(((e.clientY - r.top) / r.height - 0.5) * 6)
        }
        root.addEventListener('pointermove', onMove, { passive: true })
        cleanups.push(() => root.removeEventListener('pointermove', onMove))
      }
      const card = root.querySelector('.manifesto__clip')
      const cardVid = card ? card.querySelector('video') : null
      if (card && cardVid && fine) {
        const onEnter = () => {
          gsap.to(cardVid, { playbackRate: 1.9, scale: 1.06, duration: 0.7, ease: 'power3.out', overwrite: 'auto' })
        }
        const onLeave = () => {
          gsap.to(cardVid, { playbackRate: 1, scale: 1, duration: 0.7, ease: 'power3.out', overwrite: 'auto' })
        }
        card.addEventListener('pointerenter', onEnter)
        card.addEventListener('pointerleave', onLeave)
        cleanups.push(() => {
          card.removeEventListener('pointerenter', onEnter)
          card.removeEventListener('pointerleave', onLeave)
        })
      }
      gsap.fromTo(
        root.querySelectorAll('[data-scrubw]'),
        { opacity: 0.12, y: 42 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.045,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top 72%', end: '70% 55%', scrub: 0.6 },
        },
      )
      gsap.from(root.querySelectorAll('[data-rise]'), {
        y: 44,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 78%' },
      })
      gsap.fromTo(
        root.querySelector('.manifesto__clip'),
        { y: 74, scale: 1.05, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.querySelector('.manifesto__clip'), start: 'top 86%' },
        },
      )
      gsap.from('.mfact', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.querySelector('.manifesto__facts'), start: 'top 85%' },
      })
    }, root)
    return () => {
      cleanups.forEach((fn) => fn())
      ctx.revert()
    }
  }, [reduced])

  return (
    <section className="sec sec--milk manifesto" ref={rootRef}>
      <div className="manifesto__bg" aria-hidden="true">
        <Clip src={V.grazing} poster="/images/feed.webp" fill alt="" />
      </div>
      <div className="container">
        <SectionHead label="01 — Manifesto">
          {TITLE.split(' ').map((w, i) => (
            <span key={i} data-scrubw>
              {w}
            </span>
          ))}
          <span className="red" data-scrubw>
            MILK.
          </span>
          <br />
          {TITLE2.split(' ').map((w, i) => (
            <span key={i} data-scrubw>
              {w}
            </span>
          ))}
          <span className="red" data-scrubw>
            RAISED.
          </span>
        </SectionHead>

        <div className="manifesto__row">
          <p className="mono" data-rise>
            ( Our farm. Our cows. Our responsibility. )
          </p>
          <div className="manifesto__copy">
            <p data-rise>
              At Bholu, milk begins in soil, sunlight and grass — never in a machine. Our HF cows
              live on our own farm, fed with chemical-free, farm-grown feed, sheltered in a calm,
              stress-free environment.
            </p>
            <p data-rise>
              Only then — and only then — does that milk become the milk on your table. Untouched by
              hand, sealed in closed systems, and delivered within hours of milking.
            </p>
            <TLink to="/about" className="manifesto__link" data-cursor="view" data-cursor-label="READ">
              Read the full story
              <ArrowRight size={16} />
            </TLink>
          </div>
        </div>

        <div className="manifesto__clip" data-cursor="view" data-cursor-label="FARM">
          <Clip src={V.yogurt} poster="/images/hero-1.webp" fill alt="Bholu farm milk and yogurt on the table" />
          <span className="manifesto__clip-tag g-label">Milk on your table</span>
        </div>

        <div className="manifesto__facts">
          {[
            { v: '0', s: '', l: 'Added Hormones' },
            { v: '100', s: '%', l: 'Farm-Grown Feed' },
            { v: '24', s: 'H', l: 'Udder To Doorstep' },
          ].map((f) => (
            <div className="manifesto__fact mfact" key={f.l}>
              <b>
                {f.v}
                <i>{f.s}</i>
              </b>
              <span>{f.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
