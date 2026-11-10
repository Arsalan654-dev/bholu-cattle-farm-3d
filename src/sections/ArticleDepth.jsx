import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, gsap } from '../lib/gsap-setup.js'
import { initTilt } from '../lib/tilt.js'
import { useSettings } from '../context/SettingsContext.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Clip from '../components/Clip.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { V } from '../data/videos.js'

const ITEMS = [
  { tag: 'RECOVERY', title: 'Milk and muscle recovery — a natural post-workout drink' },
  { tag: 'SLEEP', title: 'Milk and better sleep — can dairy really help you rest?' },
  { tag: 'SKINCARE', title: 'Milk-based skincare — DIY recipes for glowing skin' },
  { tag: 'GUT HEALTH', title: 'Gut health — three simple tips from the farm' },
]
const IMAGES = ['/images/article-1.jpg', '/images/article-2.jpg', '/images/article-3.webp', '/images/article-4.webp']
const VIDEOS = [V.flex1, null, V.cleanser, null]

export default function ArticleDepth() {
  const { reduced, touch } = useSettings()
  const rootRef = useRef(null)
  const layoutRef = useRef(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const [desktop, setDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 901px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const on = () => setDesktop(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    if (reduced || touch || !desktop) return undefined
    return initTilt(rootRef.current, '.journal__media', 5)
  }, [reduced, touch, desktop])

  useEffect(() => {
    if (reduced || touch || !desktop) return undefined
    const root = rootRef.current
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.journal__card')
      cards.forEach((card, i) => {
        if (i === 0) gsap.set(card, { opacity: 1, scale: 1, filter: 'blur(0px)' })
        else gsap.set(card, { opacity: 0.95, scale: 0.86, yPercent: i * 3.2, filter: 'blur(10px)', zIndex: 10 - i })
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          zIndex: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: () => `${i * 26}% top`,
            end: () => `${i * 26 + 26}% top`,
            scrub: 0.5,
            onUpdate: (self) => {
              if (self.progress > 0.5 && activeRef.current !== i) {
                activeRef.current = i
                setActive(i)
              }
            },
          },
        })
        gsap.to(i > 0 ? cards[i - 1] : cards[0], {
          opacity: 0.55,
          scale: 0.8,
          filter: 'blur(9px)',
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: () => `${i * 26}% top`,
            end: () => `${i * 26 + 26}% top`,
            scrub: 0.5,
          },
        })
      })

      gsap.from('.journal__item', {
        x: -50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: layoutRef.current, start: 'top 80%' },
      })
      gsap.from('.journal__card:first-child', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: layoutRef.current, start: 'top 62%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced, touch, desktop])

  return (
    <section className="sec sec--dark journal" ref={rootRef}>
      <div className="container">
        <SectionHead label="05 — Journal" lede="Notes from the farm — wellness, motherhood and everything milk can quietly do for you.">
          Notes from the <span className="red">farm.</span>
        </SectionHead>

        {desktop && !reduced && !touch ? (
          <div className="journal__layout" ref={layoutRef}>
            <div className="journal__list">
              {ITEMS.map((it, i) => (
                <div key={it.tag} className={`journal__item ${active === i ? 'is-on' : ''}`}>
                  <b className="mono">0{i + 1}</b>
                  <h3>{it.title}</h3>
                  <span className="mono">{it.tag}</span>
                </div>
              ))}
            </div>
            <div className="journal__media">
              {IMAGES.map((src, i) => (
                <div className="journal__card ph" key={src}>
                  {VIDEOS[i] ? (
                    <Clip src={VIDEOS[i]} poster={src} alt={ITEMS[i].title} />
                  ) : (
                    <img src={src} alt={ITEMS[i].title} loading="lazy" />
                  )}
                  <span className="journal__tag g-label glass">{ITEMS[i].tag}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="stack-simple">
            {ITEMS.map((it, i) => (
              <article className="card-simple" key={it.tag}>
                <div className="card-simple__media">
                  {VIDEOS[i] ? (
                    <Clip src={VIDEOS[i]} poster={IMAGES[i]} alt={it.title} />
                  ) : (
                    <img src={IMAGES[i]} alt={it.title} loading="lazy" />
                  )}
                </div>
                <div>
                  <span className="card-simple__num">0{i + 1} — {it.tag}</span>
                  <h3>{it.title}</h3>
                  <TLink to="/articles" className="manifesto__link">
                    Read More <ArrowRight size={15} />
                  </TLink>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
