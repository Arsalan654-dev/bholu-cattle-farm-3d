import { useEffect, useRef } from 'react'
import { CONTACT, FOOTER_LINKS } from '../data/site.js'
import { TLink } from '../context/TransitionContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { gsap } from '../lib/gsap-setup.js'
import { Facebook, Instagram, Mail, Phone, Pin, Whatsapp, Youtube } from './Icons.jsx'

const SOCIALS = [
  { href: CONTACT.facebook, label: 'Facebook', Icon: Facebook },
  { href: CONTACT.instagram, label: 'Instagram', Icon: Instagram },
  { href: CONTACT.youtube, label: 'Youtube', Icon: Youtube },
  { href: CONTACT.whatsapp, label: 'WhatsApp', Icon: Whatsapp },
]

export default function Footer() {
  const { reduced } = useSettings()
  const rootRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current.querySelectorAll('[data-rise]'), {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <footer className="footer" ref={rootRef}>
      <div className="container footer__grid">
        <div data-rise>
          <img className="footer__logo" src="/images/logo.webp" alt="Bholu Cattle & Dairy Farm" />
          <p className="footer__tag">{CONTACT.tagline}</p>
          <div className="footer__socials">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={label} className="footer__social" href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div data-rise>
          <h3 className="footer__title">Use Links</h3>
          <ul className="footer__links">
            {FOOTER_LINKS.map((l) => (
              <li key={l.label}>
                <TLink to={l.to} className="footer__link">
                  <i />
                  {l.label}
                </TLink>
              </li>
            ))}
          </ul>
        </div>

        <div data-rise>
          <h3 className="footer__title">Contact Information</h3>
          <ul className="footer__contact">
            <li>
              <Pin size={17} />
              {CONTACT.address}
            </li>
            <li>
              <Phone size={15} />
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </li>
            <li>
              <Mail size={15} />
              <a href={CONTACT.emailHref}>{CONTACT.email}</a>
            </li>
          </ul>
        </div>

        <div data-rise>
          <div className="footer__cta glass">
            <h4>Fresh milk, at your door before sunrise.</h4>
            <p>Order pure Bholu milk for daily home delivery across Karachi.</p>
            <TLink to="/shop" className="btn btn--sm" data-cursor="view" data-cursor-label="ORDER">
              Order Milk
            </TLink>
          </div>
        </div>
      </div>

      <div className="footer__bar">
        <span>© {new Date().getFullYear()} Bholu Cattle &amp; Dairy Farm. All rights reserved.</span>
        <span>Farm Fresh — Pure — Healthy</span>
      </div>

      <span className="footer__giant" aria-hidden="true">
        BHOLU
      </span>
    </footer>
  )
}
