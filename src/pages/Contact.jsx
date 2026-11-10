import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { AREAS, CONTACT, CONTACT_PARAGRAPHS } from '../data/site.js'
import { V } from '../data/videos.js'
import { ArrowRight, Check, Mail, Phone, Pin, Whatsapp } from '../components/Icons.jsx'

const INFO = [
  { icon: <Pin size={19} />, label: 'Our Farm', value: CONTACT.address, href: null },
  { icon: <Phone size={19} />, label: 'Call Us', value: CONTACT.phone, href: CONTACT.phoneHref },
  { icon: <Mail size={19} />, label: 'Email Us', value: CONTACT.email, href: CONTACT.emailHref },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', area: '', address: '', message: '' })
  const [sent, setSent] = useState(false)
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <>
      <PageHero
        crumb="Contact Us"
        label="We’re here for you"
        title="Say salaam"
        highlight="to the farm."
        sub="Bringing nature’s purest and best to your family — orders, queries and daily delivery, all in one place."
        image="/images/about-2.jpeg"
        video={V.heart}
      />

      <section className="sec sec--cream on-light">
        <div className="container contact__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>
          <div>
            <SectionHead label="Get In Touch">
              Let’s talk <span className="red">milk.</span>
            </SectionHead>
            {CONTACT_PARAGRAPHS.map((p, i) => (
              <p className="showroom__text" key={i} style={{ marginBottom: 14 }}>
                {p}
              </p>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 26 }}>
              {INFO.map((it) => (
                <div className="glass--light" key={it.label} style={{ display: 'flex', gap: 16, padding: 18, borderRadius: 20 }}>
                  <span
                    style={{
                      width: 48,
                      height: 48,
                      flex: 'none',
                      borderRadius: 14,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'var(--red)',
                      color: '#fff',
                    }}
                  >
                    {it.icon}
                  </span>
                  <div>
                    <span className="card-simple__num" style={{ display: 'block' }}>
                      {it.label}
                    </span>
                    {it.href ? (
                      <a href={it.href} style={{ fontSize: '.92rem', color: 'var(--ink)' }}>
                        {it.value}
                      </a>
                    ) : (
                      <p style={{ fontSize: '.9rem', lineHeight: 1.6, color: 'var(--muted-l)' }}>{it.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <a className="btn" href={CONTACT.whatsapp} target="_blank" rel="noreferrer" style={{ marginTop: 22 }} data-cursor="view" data-cursor-label="CHAT">
              <Whatsapp size={18} />
              Chat on WhatsApp
            </a>
          </div>

          <div className="glass--light" style={{ padding: 'clamp(24px, 3.4vw, 40px)', borderRadius: 32 }}>
            {sent ? (
              <div className="form-success" style={{ textAlign: 'center', padding: '40px 10px' }}>
                <span
                  className="form-success__check"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'var(--red)',
                    color: '#fff',
                    margin: '0 auto 20px',
                  }}
                >
                  <Check size={28} />
                </span>
                <h3 style={{ color: 'var(--ink)', fontSize: '1.4rem', marginBottom: 10 }}>
                  Shukriya, {form.name || 'friend'}!
                </h3>
                <p style={{ color: 'var(--muted-l)', lineHeight: 1.7 }}>
                  Your message has been received. The Bholu Farm team will reach out to you shortly.
                </p>
                <button
                  type="button"
                  className="manifesto__link"
                  onClick={() => {
                    setSent(false)
                    setForm({ name: '', phone: '', area: '', address: '', message: '' })
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <span className="card-simple__num">Order / Enquiry</span>
                <h3 style={{ color: 'var(--ink)', fontSize: '1.6rem', marginBottom: 6 }}>Send us a message</h3>
                <div className="field">
                  <input id="c-name" type="text" required placeholder=" " value={form.name} onChange={update('name')} />
                  <label htmlFor="c-name">Name</label>
                </div>
                <div className="field">
                  <input id="c-phone" type="tel" required placeholder=" " value={form.phone} onChange={update('phone')} />
                  <label htmlFor="c-phone">Mobile Number</label>
                </div>
                <div className="field field--sel">
                  <select id="c-area" required value={form.area} onChange={update('area')}>
                    <option value="">Choose Your Area</option>
                    {AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="c-area">Select Area</label>
                </div>
                <div className="field">
                  <input id="c-address" type="text" required placeholder=" " value={form.address} onChange={update('address')} />
                  <label htmlFor="c-address">Address</label>
                </div>
                <div className="field">
                  <textarea id="c-message" rows={4} placeholder=" " value={form.message} onChange={update('message')} />
                  <label htmlFor="c-message">Message</label>
                </div>
                <button type="submit" className="btn btn--full" data-cursor="view" data-cursor-label="SEND">
                  Send <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  )
}
