import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap-setup.js'
import { useSettings } from '../context/SettingsContext.jsx'
import Clip from '../components/Clip.jsx'
import { V } from '../data/videos.js'

const STAGES = [
  { at: 0, k: 'ORIGIN', line: 'farm landscape', img: '/images/fresh-milk.webp', alt: 'Aerial view of Bholu cattle farm' },
  { at: 20, k: 'HERD', line: 'cow/farm visual moves forward', img: '/images/process-stress-free.jpeg', alt: 'HF cows resting in the Bholu barn' },
  { at: 40, k: 'FLOW', line: 'white milk starts flowing', img: '/images/hero-1.webp', alt: 'Bholu milk wave' },
  { at: 60, k: 'FILL', line: 'milk fills screen', img: '', alt: '' },
  { at: 80, k: 'BOTTLE', line: 'milk transforms into bottle', img: '/images/hero-2.jpeg', alt: 'Bholu milk bottle in the field' },
  { at: 100, k: 'PRODUCT', line: 'Bholu product appears', img: '/images/product.jpeg', alt: 'Bholu Milk 1 litre pack' },
]

/* milk bottle silhouette — milk fill + brand-red outline, morphs into the pack */
const BOTTLE =
  'M76 30 h48 v30 c0 12 30 28 30 62 v152 c0 20 -16 36 -36 36 h-66 c-20 0 -36 -16 -36 -36 v-152 c0 -34 30 -50 30 -62 z'
const BAND = 'M34 168 h132 v52 h-132 z'

function StaticJourney() {
  return (
    <section className="sec sec--dark journey-section" id="journey">
      <div className="container">
        <h2 className="display" style={{ marginBottom: 48 }}>
          Scroll the <span className="red">story</span> of every drop.
        </h2>
        <div className="stack-simple">
          {STAGES.map((s, i) => (
            <article className="card-simple" key={s.k}>
              <div className="card-simple__media" style={s.img ? undefined : { background: '#efe9e1', display: 'grid', placeItems: 'center' }}>
                {s.img ? (
                  <img src={s.img} alt={s.alt} loading="lazy" />
                ) : (
                  <b style={{ color: '#d00000', fontSize: '2rem', fontWeight: 880 }}>100% MILK</b>
                )}
              </div>
              <div>
                <span className="card-simple__num">
                  SCROLL {s.at}% ↓ 0{i + 1} / 0{STAGES.length} — {s.k}
                </span>
                <h3>{s.line}</h3>
                <p>
                  {i === 0 && 'Wide over the land where every Bholu morning begins — barns, grazing fields and open sky.'}
                  {i === 1 && 'The camera pushes forward into the herd, calm and close, before the pour begins.'}
                  {i === 2 && 'A white river of fresh milk rises and starts to flow across the frame.'}
                  {i === 3 && 'Milk takes the whole screen — pure, seamless, Bholu white.'}
                  {i === 4 && 'The flood reshapes itself into a bottle, still cold, still fresh.'}
                  {i === 5 && 'The Bholu Milk pack lands — pureness, delivered.'}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Journey() {
  const { reduced, touch } = useSettings()
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const farmRef = useRef(null)
  const cowRef = useRef(null)
  const splashRef = useRef(null)
  const floodRef = useRef(null)
  const bottleRef = useRef(null)
  const packRef = useRef(null)
  const glowRef = useRef(null)
  const ring1Ref = useRef(null)
  const ring2Ref = useRef(null)
  const pctRef = useRef(null)
  const lineRef = useRef(null)
  const lastIdx = useRef(0)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (reduced || touch) return undefined

    const ctx = gsap.context(() => {
      gsap.set([cowRef.current, bottleRef.current, packRef.current, glowRef.current], { opacity: 0 })
      gsap.set(floodRef.current, { yPercent: 101 })
      gsap.set(splashRef.current, { opacity: 0, scale: 1.16 })
      gsap.set(bottleRef.current, { scale: 0.5, filter: 'blur(16px)' })
      gsap.set(packRef.current, { scale: 0.62, filter: 'blur(18px)' })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=500%',
          pin: pinRef.current,
          scrub: 0.6,
          onUpdate: (self) => {
            const pct = Math.round((self.progress || 0) * 100)
            if (pctRef.current) pctRef.current.textContent = `SCROLL ${pct}%`
            if (lineRef.current) lineRef.current.style.transform = `scaleX(${self.progress || 0})`
            const hud = rootRef.current && rootRef.current.querySelector('.journey__hud')
            if (hud) {
              hud.classList.toggle('journey__hud--ink-c', pct >= 47)
              hud.classList.toggle('journey__hud--ink-r', pct >= 51)
              hud.classList.toggle('journey__hud--ink-t', pct >= 53)
            }
            const idx = Math.min(STAGES.length - 1, Math.floor(pct / 20))
            if (idx !== lastIdx.current) {
              lastIdx.current = idx
              setStage(idx)
            }
          },
        },
      })

      /* 0–20 · farm landscape — slow dolly over the land */
      tl.fromTo(farmRef.current, { scale: 1.3, yPercent: 3 }, { scale: 1.05, yPercent: -2, duration: 24 }, 0)
      tl.to(farmRef.current, { opacity: 0, duration: 9 }, 23)

      /* 20–40 · cow/farm visual rushes forward */
      tl.fromTo(cowRef.current, { opacity: 0, scale: 1.6, filter: 'blur(12px)' }, { opacity: 1, duration: 6 }, 17)
      tl.to(cowRef.current, { scale: 1.04, filter: 'blur(0px)', duration: 23 }, 17)

      /* 40–60 · white milk starts flowing → fills the screen */
      tl.to(cowRef.current, { opacity: 0, duration: 7 }, 47)
      tl.to(splashRef.current, { opacity: 1, scale: 1, duration: 7, immediateRender: false }, 41)
      tl.to(splashRef.current, { opacity: 0, scale: 1.04, duration: 5 }, 56)
      tl.to(floodRef.current, { yPercent: 0, duration: 21, ease: 'power1.inOut' }, 40)
      tl.to(floodRef.current, { yPercent: -1.5, duration: 10 }, 62)

      /* 60–80 · the milk reshapes into a bottle */
      tl.to(bottleRef.current, { opacity: 1, scale: 0.94, filter: 'blur(0px)', duration: 13, ease: 'power2.out' }, 66)
      tl.fromTo(glowRef.current, { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 12 }, 66)
      tl.to(bottleRef.current, { y: -14, duration: 10 }, 79)

      /* 80–100 · bottle morphs into the Bholu pack + splash rings */
      tl.to(bottleRef.current, { opacity: 0, scale: 0.9, duration: 7 }, 83)
      tl.to(packRef.current, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 12, ease: 'power2.out' }, 83)
      tl.fromTo(ring1Ref.current, { scale: 0.35, opacity: 0.55 }, { scale: 1.9, opacity: 0, duration: 14, immediateRender: false }, 85)
      tl.fromTo(ring2Ref.current, { scale: 0.35, opacity: 0.4 }, { scale: 2.3, opacity: 0, duration: 14, immediateRender: false }, 90)
      tl.to(glowRef.current, { scale: 1.4, opacity: 0.75, duration: 14 }, 86)
      tl.to(packRef.current, { y: -10, duration: 8 }, 93)
    }, rootRef)

    return () => ctx.revert()
  }, [reduced, touch])

  if (reduced || touch) return <StaticJourney />

  const s = STAGES[stage]

  return (
    <section className="journey" ref={rootRef} id="journey">
      <div className="journey__pin" ref={pinRef}>
        <div className="journey__stage">
          <div className="jl jl--farm" ref={farmRef}>
            <img src="/images/fresh-milk.webp" alt="Aerial view of Bholu cattle farm" />
          </div>
          <div className="jl jl--cow" ref={cowRef}>
            <Clip src={V.barn} poster="/images/process-stress-free.jpeg" alt="HF cows resting in the Bholu barn" />
          </div>

          <Clip src={V.splash} fill className="journey__splash" alt="" />

          <div className="journey__flood" ref={floodRef} aria-hidden="true">
            <svg className="journey__wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0 132 C 240 34 470 196 726 118 C 980 42 1210 174 1440 86 L1440 320 L0 320 Z" fill="#efe9e1" />
            </svg>
            <div className="journey__milkfill" />
            <div className="journey__bubbles" />
          </div>

          <div className="journey__glow" ref={glowRef} aria-hidden="true" />

          <svg className="journey__bottle" ref={bottleRef} viewBox="0 0 200 320" aria-hidden="true">
            <path d={BOTTLE} fill="#fdfcfa" stroke="#d00000" strokeWidth="7" strokeLinejoin="round" />
            <path d={BAND} fill="#d00000" />
            <text x="100" y="202" textAnchor="middle" fill="#fff" fontSize="30" fontWeight="880" letterSpacing="2">
              BHOLU
            </text>
            <rect x="82" y="18" width="36" height="16" rx="6" fill="#d00000" />
          </svg>

          <div className="journey__ring journey__ring--1" ref={ring1Ref} aria-hidden="true" />
          <div className="journey__ring journey__ring--2" ref={ring2Ref} aria-hidden="true" />

          <div className="journey__pack" ref={packRef}>
            <img src="/images/product.jpeg" alt="Bholu Milk 1 litre pack" />
          </div>

          <div className="journey__veil" aria-hidden="true" />
        </div>

        <div className="journey__hud">
          <span className="journey__pct mono" ref={pctRef}>
            SCROLL 0%
          </span>
          <div className="journey__line">
            <i ref={lineRef} />
          </div>

          <ol className="journey__rail">
            {STAGES.map((st, i) => (
              <li key={st.k} className={stage === i ? 'is-on' : ''}>
                <b>SCROLL {st.at}%</b>
                <i>↓</i>
                <span>{st.line}</span>
              </li>
            ))}
          </ol>

          <div className="journey__cap" key={stage}>
            <span className="mono">0{stage + 1} / 0{STAGES.length} — {s.k}</span>
            <strong>{s.line}</strong>
          </div>

          <span className="journey__hint mono">( scroll — the pour begins )</span>
        </div>
      </div>
    </section>
  )
}
