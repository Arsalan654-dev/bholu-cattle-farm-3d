import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, gsap } from '../lib/gsap-setup.js'
import { useSettings } from '../context/SettingsContext.jsx'
import { useLenis } from '../context/LenisContext.jsx'
import Clip from '../components/Clip.jsx'
import { V } from '../data/videos.js'

const STEPS = [
  {
    k: 'FEED',
    title: 'It begins in the soil',
    text: 'Premium chemical-free fodder, grown on our own land — the first ingredient of every glass you pour.',
    img: '/images/process-organic.jpeg',
    video: V.dew,
  },
  {
    k: 'FARM',
    title: 'The herd that comes first',
    text: 'Our HF cows live in a calm, climate-controlled home — no stress, no shortcuts, no compromises.',
    img: '/images/fresh-milk.webp',
    video: V.dairy,
  },
  {
    k: 'NUTRITION',
    title: 'Nature does the rest',
    text: 'Pasture-fresh feed becomes rich, creamy milk — naturally high in protein, calcium and care.',
    img: '/images/about-2.jpeg',
    video: V.grazing,
  },
  {
    k: 'MILKING',
    title: 'Untouched by hand',
    text: 'Automatic, closed milking systems draw every drop straight into chilled tanks.',
    img: '/images/process-stress-free.jpeg',
    video: V.pour,
  },
  {
    k: 'PROCESSING',
    title: 'Sealed in freshness',
    text: 'Pasteurised, tested and packed on a touchless line — hygiene you can measure, taste you cannot forget.',
    img: '/images/process-processing.jpeg',
    video: V.conveyor,
  },
  {
    k: 'DELIVERY',
    title: 'On your table before sunrise',
    text: 'Chilled Bholu milk reaches your doorstep within hours of milking. Fresh, every single day.',
    img: '/images/hero-2.jpeg',
    video: null,
  },
]

const RIBBON = 'M 296 0 C 258 118 176 210 148 520 L 212 520 C 238 220 298 122 342 0 Z'
const CORE = 'M 319 0 C 278 122 202 214 180 520'

function GrainCanvas({ mode }) {
  const { quality, reduced } = useSettings()
  const ref = useRef(null)
  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    if (reduced) return undefined
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    const N = Math.min(quality.particles || 0, 420)
    if (N === 0) return undefined
    let W = 0
    let H = 0
    let dpr = 1
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(10, Math.floor(r.width * dpr))
      H = Math.max(10, Math.floor(r.height * dpr))
      canvas.width = W
      canvas.height = H
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const centers = [
      { x: 0.32, y: 0.4 },
      { x: 0.66, y: 0.54 },
      { x: 0.5, y: 0.78 },
    ]
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: (Math.random() * 1.3 + 0.55) * dpr,
      o: Math.random() * 0.34 + 0.12,
    }))
    let raf = 0
    let last = performance.now()
    const step = (now) => {
      raf = requestAnimationFrame(step)
      const dt = Math.min(42, now - last)
      last = now
      ctx.clearRect(0, 0, W, H)
      const m = modeRef.current
      if (m === 'off') return
      ctx.fillStyle = '#fbf8f4'
      for (const p of ps) {
        if (m === 'nutrition') {
          const c = centers[(Math.random() * centers.length) | 0]
          p.vx += (c.x * W - p.x) * 0.000024 * dt + (Math.random() - 0.5) * 0.1
          p.vy += (c.y * H - p.y) * 0.000024 * dt + (Math.random() - 0.5) * 0.1
          p.vx *= 0.9
          p.vy *= 0.9
        }
        p.x += p.vx * dt * 0.16
        p.y += p.vy * dt * 0.16
        if (p.x < 0) p.x += W
        if (p.x > W) p.x -= W
        if (p.y < 0) p.y += H
        if (p.y > H) p.y -= H
        ctx.globalAlpha = p.o
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [quality, reduced])

  if (reduced) return null
  const goo = mode === 'nutrition'
  return (
    <canvas
      ref={ref}
      className="story__grain"
      style={{ filter: goo ? 'blur(3px) contrast(16)' : 'opacity(0.75)' }}
      aria-hidden="true"
    />
  )
}

export default function Story() {
  const { reduced, touch } = useSettings()
  const lenis = useLenis()
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const videoRefs = useRef([])
  const barRef = useRef(null)
  const copyEl = useRef(null)
  const titleEl = useRef(null)
  const numRef = useRef(null)
  const tagRef = useRef(null)
  const stepRef = useRef(0)
  const [active, setActive] = useState(0)
  const [desktop, setDesktop] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(min-width: 901px)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const on = () => setDesktop(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const fxKey = ['feed', 'farm', 'nutrition', 'milking', 'processing', 'delivery'][active]
  const fxClass = fxKey === 'milking' ? 'fx-milk' : fxKey === 'processing' ? 'fx-processing' : ''

  useEffect(() => {
    if (reduced || touch || !desktop) return undefined
    const root = rootRef.current
    const vids = videoRefs.current.filter(Boolean)
    let inView = true

    const playActive = (i) => {
      vids.forEach((v, j) => {
        if (!v) return
        if (inView && j === i) {
          const p = v.play()
          if (p && typeof p.catch === 'function') p.catch(() => {})
        } else {
          v.pause()
        }
      })
    }

    const setCopy = (step) => {
      if (titleEl.current) titleEl.current.textContent = step.title
      if (copyEl.current) copyEl.current.textContent = step.text
    }

    const updateUI = (i) => {
      setCopy(STEPS[i])
      setActive(i)
      playActive(i)
      if (numRef.current) numRef.current.textContent = `0${i + 1} / 0${STEPS.length}`
      if (tagRef.current) tagRef.current.textContent = STEPS[i].k
      const wrap = root.querySelector('.story__trans')
      if (wrap) {
        gsap.fromTo(wrap, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
      }
    }

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray('.story__layer--step', root)
      gsap.set(layers, { opacity: 0, scale: 1.24, filter: 'blur(14px)' })
      gsap.set(layers[0], { opacity: 1, scale: 1, filter: 'blur(0px)', zIndex: 1 })

      const SEG = 1
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${(STEPS.length - 1) * 100}%`,
          pin: pinRef.current,
          scrub: 0.5,
          onUpdate: (self) => {
            const i = Math.min(STEPS.length - 1, Math.round((self.progress || 0) * (STEPS.length - 1)))
            if (i !== stepRef.current) {
              stepRef.current = i
              updateUI(i)
            }
          },
        },
      })

      tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: STEPS.length - 1 }, 0)

      for (let i = 1; i < STEPS.length; i += 1) {
        gsap.set(layers[i], { zIndex: i + 1 })
        const at = (i - 1) * SEG
        tl.to(layers[i], { opacity: 1, scale: 1, filter: 'blur(0px)', duration: SEG }, at)
        tl.to(layers[i - 1], { opacity: 0.3, scale: 0.92, filter: 'blur(14px)', duration: SEG }, at)
      }
    }, root)

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting
        playActive(stepRef.current)
      },
      { rootMargin: '120px 0px' },
    )
    io.observe(root)
    playActive(stepRef.current)

    return () => {
      io.disconnect()
      vids.forEach((v) => v.pause())
      ctx.revert()
    }
  }, [reduced, touch, desktop])

  const goStep = (i) => {
    const root = rootRef.current
    if (!root) return
    lenis.scrollTo(root.offsetTop + i * window.innerHeight + 1, { duration: 1.1 })
    ScrollTrigger.refresh()
  }

  if (reduced || touch || (!desktop && typeof window !== 'undefined')) {
    return (
      <section className="sec sec--dark story-section" id="story">
        <div className="container">
          <h2 className="display" style={{ marginBottom: 48 }}>
            From <span className="red">farm</span> to table.
          </h2>
          <div className="stack-simple">
            {STEPS.map((s, i) => (
              <article className="card-simple" key={s.k}>
                <div className="card-simple__media">
                  {s.video ? (
                    <Clip src={s.video} poster={s.img} alt={s.title} />
                  ) : (
                    <img src={s.img} alt={s.title} loading="lazy" />
                  )}
                </div>
                <div>
                  <span className="card-simple__num">0{i + 1} / 0{STEPS.length} — {s.k}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`story ${fxClass}`} ref={rootRef}>
      <div className="story__pin" ref={pinRef}>
        <div className="story__layers">
          {STEPS.map((s, i) => (
            <div className="story__layer story__layer--veil story__layer--step" key={s.k} style={{ zIndex: i + 1 }}>
              <video
                className="clip"
                ref={(el) => {
                  videoRefs.current[i] = el
                }}
                src={s.video || undefined}
                poster={s.img}
                aria-hidden="true"
                muted
                loop
                playsInline
                preload="metadata"
                tabIndex={-1}
                disablePictureInPicture
                onError={(e) => {
                  const v = e.currentTarget
                  if (v.dataset.retried || !v.getAttribute('src')) return
                  v.dataset.retried = '1'
                  v.load()
                }}
              />
            </div>
          ))}
          <GrainCanvas mode={fxKey === 'feed' || fxKey === 'farm' ? 'drift' : fxKey === 'nutrition' ? 'nutrition' : 'off'} />

          <div className="story__stream" aria-hidden="true">
            <svg viewBox="0 0 400 520" preserveAspectRatio="none">
              <defs>
                <linearGradient id="msgrad" x1="0" y1="0" x2="0.4" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                  <stop offset="60%" stopColor="#fff8f4" stopOpacity="0.94" />
                  <stop offset="100%" stopColor="#ffe0d8" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path d={RIBBON} fill="url(#msgrad)" />
              <path className="stream-core" d={CORE} fill="none" stroke="rgba(255,255,255,.95)" strokeWidth="4" strokeLinecap="round" strokeDasharray="15 42" />
              <path className="stream-core stream-core--slow" d={CORE} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 58" />
            </svg>
          </div>

          <div className="story__scan" aria-hidden="true" />

          <div className="story__glass" aria-hidden="true">
            <div className="story__chip glass">
              <span>SEAL 100%</span>
              <span>TEMP 4°C</span>
              <span>TOUCHLESS LINE</span>
            </div>
          </div>
        </div>

        <div className="story__ui">
          <div className="story__head">
            <span className="mono story__sub">02 — Farm to Table</span>
            <span className="story__direction">Scroll — ( the milk remembers its origin )</span>
          </div>

          <div className="story__stepwrap">
            <div className="story__step">
              <div className="story__num">
                <b ref={numRef}>01 / 06</b>
                <em />
                <i ref={tagRef}>FEED</i>
              </div>
              <div className="story__bar">
                <i ref={barRef} />
              </div>
              <div className="story__trans">
                <div className="story__title" ref={titleEl}>
                  {STEPS[0].title}
                </div>
                <div className="story__text" ref={copyEl}>
                  {STEPS[0].text}
                </div>
              </div>
            </div>
            <div className="story__ctrl">
              {STEPS.map((s, i) => (
                <button type="button" key={s.k} className={`story__cell ${active === i ? 'is-on' : ''}`} onClick={() => goStep(i)}>
                  <b>0{i + 1}</b>
                  {s.k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
