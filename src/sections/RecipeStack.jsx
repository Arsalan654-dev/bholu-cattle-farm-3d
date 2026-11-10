import { useEffect, useRef } from 'react'
import { ScrollTrigger, gsap } from '../lib/gsap-setup.js'
import { initTilt } from '../lib/tilt.js'
import { useSettings } from '../context/SettingsContext.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Clip from '../components/Clip.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import { RECIPES } from '../data/site.js'

const EXCERPTS = [
  'Kheer, served the way the farm remembers it — chilled cream, slow-cooked rice and a finish of pure Bholu milk.',
  'Preparing fresh farm milk, the traditional way — boiled once, cooled gently, kept rich and naturally sweet.',
  'The final presentation of rice kheer — a golden bowl made with Bholu farm fresh milk and a handful of dry fruit.',
  'Slow-cooked rice kheer in pure Bholu milk — the recipe passed down through generations.',
]

export default function RecipeStack() {
  const { reduced, touch } = useSettings()
  const rootRef = useRef(null)

  useEffect(() => {
    if (reduced || touch) return undefined
    return initTilt(rootRef.current, '.recipes__media', 5)
  }, [reduced, touch])

  useEffect(() => {
    if (reduced || touch) return undefined
    const root = rootRef.current
    const cards = gsap.utils.toArray('.recipes__card')
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i === 0) return
        const s = 1 - i * 0.045
        gsap.fromTo(
          card,
          { scale: s, yPercent: i * 4, transformOrigin: 'center top', filter: 'brightness(0.82)' },
          {
            scale: 1,
            yPercent: 0,
            filter: 'brightness(1)',
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'top 12%',
              scrub: 0.4,
            },
          },
        )
      })
      gsap.from('.recipes__card', {
        opacity: 0,
        y: 70,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 78%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced, touch])

  return (
    <section className="sec sec--dark recipes" ref={rootRef}>
      <div className="container">
        <SectionHead label="04 — Recipes" lede="Explore our recipes and kickstart your day with the perfect meal.">
          From our <span className="red">kitchen.</span>
        </SectionHead>

        <div className="recipes__stack">
          {RECIPES.map((r, i) => (
            <article className="recipes__card" key={r.title}>
              <div className="recipes__media" data-cursor="view" data-cursor-label="READ">
                {r.video ? (
                  <Clip src={r.video} poster={r.image} alt={r.title} />
                ) : (
                  <img src={r.image} alt={r.title} loading="lazy" />
                )}
                <span className="recipes__glass glass" />
              </div>
              <div className="recipes__info">
                <div>
                  <span className="recipes__num">0{i + 1}</span>
                  <h3 className="recipes__title">{r.title}</h3>
                  <p className="recipes__excerpt">{EXCERPTS[i]}</p>
                </div>
                <TLink to="/recipes" className="recipes__read">
                  Read Recipe
                  <ArrowRight size={15} />
                </TLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
