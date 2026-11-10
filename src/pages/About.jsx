import { useEffect, useRef } from 'react'
import { ScrollTrigger, gsap } from '../lib/gsap-setup.js'
import { useSettings } from '../context/SettingsContext.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Clip from '../components/Clip.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { ABOUT_PARAGRAPHS, PROCESS } from '../data/site.js'
import { V } from '../data/videos.js'

export default function About() {
  const { reduced } = useSettings()
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('[data-phr]'),
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 78%' },
        },
      )
      gsap.utils.toArray('.ncount').forEach((el) => {
        const obj = { v: 0 }
        gsap.to(obj, {
          v: Number(el.dataset.count || 0),
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString('en-PK')
          },
        })
      })
      gsap.utils.toArray('.proc-media .ph').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={rootRef}>
      <PageHero
        crumb="About Us"
        label="Since Generations"
        title="A journey of tradition"
        highlight="& innovation."
        sub="Built on passion, trusted by generations — traditional dairy farming, presented through modern care."
        image="/images/about-1.jpeg"
        video={V.lab}
      />

      <section className="sec sec--milk">
        <div className="container">
          <SectionHead label="Our Story" lede="We have blended time-honored farming values with cutting-edge quality control.">
            The farm, the family,
            <br />
            the <span className="red">future.</span>
          </SectionHead>
          <div className="manifesto__row">
            <p className="mono" data-phr>
              ( Est. on a promise — every drop, untamed &amp; wholesome. )
            </p>
            <div className="manifesto__copy">
              {ABOUT_PARAGRAPHS.map((p, i) => (
                <p key={i} data-phr>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec--cream">
        <div className="container">
          <SectionHead label="How We Work" lede="Our practices rest to raise standard on the pillars of excellence.">
            Our <span className="red">process.</span>
          </SectionHead>
          {PROCESS.map((p, i) => (
            <div className="proc-row" key={p.title}>
              <div className="proc-row__num">
                <b>0{i + 1}</b>
                {p.icon}
              </div>
              <div className="proc-row__body on-light" data-phr>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
              <div className="proc-row__media">
                <div className="ph ph--wide proc-media">
                  {p.video ? (
                    <Clip src={p.video} poster={p.image} alt={p.title} />
                  ) : (
                    <img src={p.image} alt={p.title} loading="lazy" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="stats" aria-label="Bholu farms in numbers">
        {[
          { v: 100, s: '%', l: 'Organic & Pure' },
          { v: 0, s: '', l: 'Added Hormones' },
          { v: 24, s: 'H', l: 'Farm Care, Daily' },
          { v: 1000, s: '+', l: 'Happy Families' },
        ].map((c, i) => (
          <div className="stats__cell" key={c.l}>
            <b>
              <span className="ncount" data-count={c.v}>
                0
              </span>
              <i>{c.s}</i>
            </b>
            <span>{c.l}</span>
          </div>
        ))}
      </section>

      <FinalCta />
    </div>
  )
}
