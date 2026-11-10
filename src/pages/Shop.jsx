import { useState } from 'react'
import { useCart, formatPKR } from '../context/CartContext.jsx'
import { PRODUCTS, PRODUCT_PARAGRAPHS } from '../data/site.js'
import { V } from '../data/videos.js'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Marquee from '../components/Marquee.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import { ArrowRight, Basket, Bottle, Minus, Plus, Shield, Truck } from '../components/Icons.jsx'

const SORTS = [
  'Default sorting',
  'Sort by popularity',
  'Sort by latest',
  'Price: low to high',
  'Price: high to low',
]

const PERKS = [
  { icon: <Bottle size={20} />, title: 'Milked daily', text: 'Sourced fresh every morning from our own managed herd.' },
  { icon: <Shield size={20} />, title: 'Zero-touch packed', text: 'Closed automatic processing preserves natural quality.' },
  { icon: <Truck size={20} />, title: 'Fast delivery', text: 'Reaches your doorstep within hours of milking.' },
]

export default function Shop() {
  const { addItem, setIsOpen } = useCart()
  const [qty, setQty] = useState(1)
  const [sort, setSort] = useState(SORTS[0])
  const product = PRODUCTS[0]

  const add = () => {
    addItem(product, qty)
    setIsOpen(true)
  }

  return (
    <>
      <PageHero
        crumb="Shop"
        label="The Dairy Line"
        title="Fresh milk,"
        highlight="one product."
        sub="One product done perfectly — Bholu Pure Cow Milk, from our farm to your table."
        image="/images/product.jpeg"
        video={V.yogurt}
      />

      <section className="sec sec--cream on-light">
        <div className="container">
          <SectionHead label="Shop" lede={PRODUCT_PARAGRAPHS[0]}>
            Our <span className="red">products.</span>
          </SectionHead>

          <div className="shop__toolbar glass--light" style={{ borderRadius: 18, display: 'flex', justifyContent: 'space-between', padding: '14px 20px', marginBottom: 26, flexWrap: 'wrap', gap: 12 }}>
            <span className="mono" style={{ color: 'var(--muted-l)' }}>
              Showing the single result
            </span>
            <div className="field field--sel" style={{ minWidth: 240 }}>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <label style={{ left: 18, top: 13 }}>{' '}</label>
            </div>
          </div>

          <article className="shop-card glass--light" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, padding: 'clamp(22px, 4vw, 48px)', borderRadius: 32 }}>
            <div>
              <div className="showroom__stage">
                <div className="showroom__slab" data-cursor="view" data-cursor-label="MILK">
                  <img src={product.image} alt={product.name} />
                </div>
                <span className="showroom__badge">
                  <i />
                  {product.badge}
                </span>
              </div>
            </div>
            <div>
              <span className="card-simple__num">{product.category}</span>
              <h3 className="showroom__title" style={{ margin: '10px 0 14px' }}>
                {product.name}
              </h3>
              {PRODUCT_PARAGRAPHS.slice(1).map((p, i) => (
                <p className="showroom__text" key={i}>
                  {p}
                </p>
              ))}
              <div className="showroom__price" style={{ margin: '18px 0' }}>
                {formatPKR(product.price)}
                <span>per litre — daily delivery</span>
              </div>
              <div className="showroom__row" style={{ marginBottom: 18 }}>
                <div className="cart-item__controls" style={{ borderColor: 'var(--line-l)', padding: '6px 8px' }}>
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                    <Minus size={13} />
                  </button>
                  <span style={{ color: 'var(--ink)', minWidth: 26, textAlign: 'center' }}>{qty}</span>
                  <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                    <Plus size={13} />
                  </button>
                </div>
                <button type="button" className="btn" onClick={add} data-cursor="view" data-cursor-label="ADD">
                  <Basket size={15} />
                  Add to Cart
                </button>
              </div>
              <ul className="showroom__list" style={{ borderTop: '1px solid var(--line-l)', paddingTop: 18 }}>
                {PERKS.map((p, i) => (
                  <li key={p.title}>
                    <b>0{i + 1}</b>
                    <span>
                      <i>—</i> {p.title} — {p.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <TLink to="/contact" className="manifesto__link">
              Need help ordering? Contact us
              <ArrowRight size={16} />
            </TLink>
          </div>
        </div>
      </section>

      <Marquee items={['Farm fresh daily', 'No added hormones', 'Free delivery — Karachi', '1 Litre pouch']} />
    </>
  )
}
