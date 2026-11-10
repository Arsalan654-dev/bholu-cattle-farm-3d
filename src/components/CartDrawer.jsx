import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatPKR, useCart } from '../context/CartContext.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import { useLenis } from '../context/LenisContext.jsx'
import { ArrowRight, Close, Minus, Plus, Trash } from './Icons.jsx'

export default function CartDrawer() {
  const { items, count, total, isOpen, setIsOpen, removeItem, setQty, toast } = useCart()
  const lenis = useLenis()

  useEffect(() => {
    document.body.classList.toggle('no-scroll', isOpen)
    if (isOpen) lenis.stop()
    else lenis.start()
    return () => {
      document.body.classList.remove('no-scroll')
      lenis.start()
    }
  }, [isOpen, lenis])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="cart-veil"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              className="cart-drawer"
              initial={{ x: '110%' }}
              animate={{ x: 0 }}
              exit={{ x: '110%' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Shopping cart"
            >
              <header className="cart-drawer__head">
                <div>
                  <h3>Your Cart</h3>
                  <p>
                    {count} item{count === 1 ? '' : 's'} selected
                  </p>
                </div>
                <button
                  type="button"
                  className="cart-drawer__close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close cart"
                >
                  <Close size={19} />
                </button>
              </header>

              <div className="cart-drawer__body" data-lenis-prevent>
                {items.length === 0 ? (
                  <motion.div className="cart-empty" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="cart-empty__icon">🥛</span>
                    <h4>Your cart is empty</h4>
                    <p>Add some farm fresh Bholu milk to get started.</p>
                    <TLink to="/shop" className="btn btn--sm" onClick={() => setIsOpen(false)}>
                      Shop Milk <ArrowRight size={14} />
                    </TLink>
                  </motion.div>
                ) : (
                  <ul className="cart-list">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.id}
                          className="cart-item"
                          layout
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 60 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="cart-item__img">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="cart-item__info">
                            <h4>{item.name}</h4>
                            <span className="cart-item__price">{formatPKR(item.price)}</span>
                            <div className="cart-item__controls">
                              <button type="button" onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                                <Minus size={12} />
                              </button>
                              <span>{item.qty}</span>
                              <button type="button" onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="cart-item__remove"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash size={17} />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <footer className="cart-drawer__foot">
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>{formatPKR(total)}</strong>
                  </div>
                  <motion.button type="button" className="btn btn--full" whileTap={{ scale: 0.97 }} data-cursor="view" data-cursor-label="CHECKOUT">
                    Proceed to Checkout <ArrowRight size={16} />
                  </motion.button>
                  <p className="cart-note">Free home delivery within Karachi</p>
                </footer>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginLeft: `-${Math.min(170, (toast.length * 6) / 2)}px` }}
          >
            <span className="toast__check">✓</span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
