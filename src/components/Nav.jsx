import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NAV_LINKS } from '../data/site.js'
import { useCart } from '../context/CartContext.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import { useLenis } from '../context/LenisContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { gsap } from '../lib/gsap-setup.js'
import { ArrowRight, Basket, Chevron, Close, Menu } from './Icons.jsx'

export default function Nav() {
  const { count, setIsOpen: setCartOpen } = useCart()
  const { pathname } = useLocation()
  const { reduced } = useSettings()
  const lenis = useLenis()
  const [open, setOpen] = useState(false)
  const pillRef = useRef(null)
  const indRef = useRef(null)
  const rootRef = useRef(null)

  const activeLink = () => {
    let best = NAV_LINKS.find((l) => l.to === pathname)?.label
    if (!best) {
      const parent = NAV_LINKS.find((l) => l.children?.some((c) => c.to === pathname))
      best = parent?.label
    }
    return best || 'Home'
  }

  const place = (label) => {
    const el = pillRef.current?.querySelector(`[data-navlabel="${label}"]`)
    if (!el || !pillRef.current || !indRef.current) return
    const pr = pillRef.current.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    gsap.to(indRef.current, {
      left: r.left - pr.left + 6,
      width: r.width - 12,
      duration: 0.5,
      ease: 'power3.out',
    })
  }

  useEffect(() => {
    if (reduced) return undefined
    const st = gsap.fromTo(
      rootRef.current?.children ?? [],
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 0.55, ease: 'power3.out' },
    )
    return () => st.kill()
  }, [reduced])

  useEffect(() => {
    place(activeLink())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open)
    if (open) lenis.stop()
    else lenis.start()
    return () => {
      document.body.classList.remove('no-scroll')
      lenis.start()
    }
  }, [open, lenis])

  useEffect(() => setOpen(false), [pathname])

  const flat = NAV_LINKS.flatMap((i) => (i.children ? i.children : [i]))

  return (
    <>
      <header className="nav" ref={rootRef}>
        <div className="nav__row">
          <TLink to="/" className="nav__brand" data-cursor="link" aria-label="Bholu Farms home">
            <img className="nav__logo" src="/images/logo.webp" alt="Bholu Cattle & Dairy Farm" />
          </TLink>

          <nav className="nav__pill glass" ref={pillRef}>
            <span className="nav__indicator" ref={indRef} />
            {NAV_LINKS.map((item) =>
              item.children ? (
                <div className="nav__group" key={item.label} onMouseEnter={() => place(item.label)}>
                  <span
                    className={`nav__link ${activeLink() === item.label ? 'is-active' : ''}`}
                    data-navlabel={item.label}
                  >
                    {item.label}
                    <span className="nav__caret">
                      <Chevron size={11} />
                    </span>
                  </span>
                  <div className="nav__sub glass">
                    {item.children.map((c) => (
                      <TLink key={c.to} to={c.to} className="nav__sublink">
                        {c.label}
                        <ArrowRight size={13} />
                      </TLink>
                    ))}
                  </div>
                </div>
              ) : (
                <TLink
                  key={item.label}
                  to={item.to}
                  className={`nav__link ${activeLink() === item.label ? 'is-active' : ''}`}
                  onMouseEnter={() => place(item.label)}
                  data-navlabel={item.label}
                >
                  {item.label}
                </TLink>
              ),
            )}
          </nav>

          <div className="nav__right">
            <TLink to="/shop" className="nav__shop" data-cursor="view" data-cursor-label="SHOP">
              Shop Milk
              <ArrowRight size={14} />
            </TLink>
            <button
              type="button"
              className="nav__cart"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${count} items`}
              data-cursor="link"
            >
              <Basket size={19} />
              <motion.span
                key={count}
                className="nav__cart-badge"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              >
                {count}
              </motion.span>
            </button>
            <button
              type="button"
              className="nav__burger"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <Close size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <motion.div
          className="nav-menu"
          initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
          animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)' }}
          exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="nav-menu__links">
            {flat.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30, rotateX: -25 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.12 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <TLink to={item.to} className="nav-menu__link" onClick={() => setOpen(false)}>
                  <span>0{i + 1}</span>
                  {item.label}
                  <ArrowRight size={22} />
                </TLink>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="nav-menu__foot"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TLink to="/shop" className="btn" onClick={() => setOpen(false)}>
              Shop Milk <ArrowRight size={15} />
            </TLink>
            <TLink to="/contact" className="btn btn--ghost" onClick={() => setOpen(false)}>
              Contact Us
            </TLink>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
