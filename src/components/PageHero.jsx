import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap-setup.js'
import { useSettings } from '../context/SettingsContext.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import Clip from './Clip.jsx'

export default function PageHero({ crumb, label, title, highlight, sub, image, video }) {
  const { reduced } = useSettings()
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('[data-ph]'),
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: 'power3.out', delay: 0.12 },
      )
      gsap.from(root.querySelectorAll('[data-phw]'), {
        yPercent: 118,
        rotate: 4,
        duration: 1.4,
        stagger: 0.08,
        ease: 'power4.out',
        delay: 0.24,
      })
      gsap.fromTo(
        root.querySelector('.page-hero__bg'),
        { scale: 1.14, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: 'power3.out', delay: 0.05 },
      )
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="page-hero" ref={rootRef}>
      {(image || video) && (
        <div className="page-hero__bg">
          {image && <img src={image} alt="" aria-hidden="true" />}
          {video && <Clip src={video} fill alt="" />}
        </div>
      )}
      <div className="container page-hero__inner">
        <div className="page-hero__crumb" data-ph>
          <TLink to="/">Home</TLink>
          <i>/</i>
          <span>{crumb}</span>
        </div>
        <span className="g-label" data-ph>
          {label}
        </span>
        <h1 className="page-hero__title">
          <span className="wline">
            <span data-phw>{title}</span>
          </span>
          {highlight && (
            <span className="wline">
              <span data-phw className="red">
                {highlight}
              </span>
            </span>
          )}
        </h1>
        {sub && (
          <p className="page-hero__sub" data-ph>
            {sub}
          </p>
        )}
      </div>
    </section>
  )
}
