import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, gsap } from '../lib/gsap-setup.js'
import { initTilt } from '../lib/tilt.js'
import { useSettings } from '../context/SettingsContext.jsx'
import { useCart, formatPKR } from '../context/CartContext.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Clip from '../components/Clip.jsx'
import { ArrowRight, Basket } from '../components/Icons.jsx'
import { V } from '../data/videos.js'

const PANELS = [
  {
    type: 'product',
    num: '01',
    tag: 'POUCH',
    badge: 'Bholu Pure Cow Milk — 1 Litre',
    image: '/images/product.jpeg',
    title: 'Bholu Pure Cow Milk',
    text: '100% organic milk from our own HF herd — no added hormones, no preservatives. Thick, creamy, and naturally rich in protein and calcium.',
    price: 260,
  },
  {
    type: 'facts',
    num: '02',
    tag: 'PROCESS',
    badge: 'The zero-touch standard',
    image: '/images/process-processing.jpeg',
    video: V.lab,
    title: 'Doubly sealed. Zero-touch.',
    text: 'Milk is drawn by closed automatic systems, chilled in bulk tanks, pasteurised, and packed on a hygienic, touchless line.',
    facts: [
      ['MILKING', 'Automatic closed systems'],
      ['PASTEURISED', 'Sealed in freshness'],
      ['PACKAGING', 'Hygienic seal, daily'],
    ],
  },
  {
    type: 'delivery',
    num: '03',
    tag: 'DELIVERY',
    badge: 'Fresh on your doorstep',
    image: '/images/hero-2.jpeg',
    title: 'Farm to doorstep, within hours.',
    text: 'Pure Bholu milk is on its way while the city still sleeps. Order today — fresh dairy, delivered every single morning.',
    facts: [
      ['ORDER', 'Tonight, before 9 PM'],
      ['MILKED', 'Fresh, every morning'],
      ['DELIVERED', 'Before sunrise'],
    ],
  },
]

export default function Showroom() {
  const { reduced, touch } = useSettings()
  const { addItem, setIsOpen } = useCart()
  const rootRef = useRef(null)
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const lineRef = useRef(null)
  const countRef = useRef(null)
  const [idx, setIdx] = useState(0)
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
    if (!desktop || reduced || touch) return undefined
    return initTilt(rootRef.current, '.showroom__slab', 7)
  }, [desktop, reduced, touch])

  useEffect(() => {
    if (!desktop || reduced || touch) return undefined
    const root = rootRef.current
    const ctx = gsap.context(() => {
      const dist = () => (trackRef.current ? trackRef.current.scrollWidth - window.innerWidth + 40 : 0)
      gsap.set(trackRef.current, { x: 0 })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const i = Math.round((self.progress || 0) * (PANELS.length - 1))
            if (i !== idx) setIdx(i)
          },
        },
      })
      tl.to(trackRef.current, { x: () => -dist(), ease: 'none', duration: 1 })
      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)
      tl.fromTo(countRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.1 }, 0)
      tl.to(countRef.current, { opacity: 0, y: -8, duration: 0.1 }, 0.9)
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktop, reduced, touch])

  const add = (p) => {
    addItem({ id: 'bholu-1l', name: p.badge.split('—')[0].trim() + ' (1 Litre)', price: p.price, image: p.image })
    setIsOpen(true)
  }

  return (
    <section className="sec sec--cream showroom" id="products" ref={rootRef}>
      <div className="container">
        <SectionHead label="03 — Products" lede="From milking to delivery — strict quality control at every step, so fresh dairy reaches your doorstep every day.">
          The dairy{' '}
          <span className="red">line.</span>
        </SectionHead>
      </div>

      <div className="showroom-track-wrap" ref={wrapRef}>
        <div className="showroom__track" ref={trackRef}>
          {PANELS.map((p) => (
            <article className="showroom__panel" key={p.num}>
              <span className="showroom__num">
                <b>{p.num}</b> / 03 — {p.tag}
              </span>
              <div className="showroom__stage">
                <div className="showroom__slab" data-cursor={p.type === 'product' ? 'view' : 'link'} data-cursor-label={p.type === 'product' ? 'MILK' : p.type === 'facts' ? 'PROCESS' : 'DELIVERY'}>
                  {p.video ? (
                    <Clip src={p.video} poster={p.image} alt={p.title} />
                  ) : (
                    <img src={p.image} alt={p.title} loading="lazy" />
                  )}
                </div>
                <span className="showroom__badge">
                  <i />
                  {p.badge}
                </span>
              </div>
              <div className="showroom__body">
                <h3 className="showroom__title">{p.title}</h3>
                <p className="showroom__text">{p.text}</p>
                {p.type === 'product' && (
                  <>
                    <div className="showroom__price">
                      {formatPKR(p.price)}
                      <span>per litre — daily delivery</span>
                    </div>
                    <div className="showroom__row">
                      <button type="button" className="btn" onClick={() => add(p)} data-cursor="view" data-cursor-label="ADD">
                        <Basket size={15} />
                        Add to Cart
                      </button>
                      <TLink to="/shop" className="hero__textlink" style={{ color: 'var(--muted-l)' }}>
                        More details
                      </TLink>
                    </div>
                  </>
                )}
                {p.type !== 'product' && (
                  <ul className="showroom__list">
                    {p.facts.map(([k, v]) => (
                      <li key={k}>
                        <b>{k}</b>
                        <span>
                          <i>—</i> {v}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="showroom__hud">
          <span className="showroom__count" ref={countRef}>
            0{idx + 1} / 03
          </span>
          <div className="showroom__line">
            <i ref={lineRef} />
          </div>
          <span className="showroom__count mono">Scroll — horizontal</span>
        </div>
      </div>
    </section>
  )
}
