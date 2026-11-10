import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { TransitionProvider, transitions } from './context/TransitionContext.jsx'
import { LenisProvider, useLenis } from './context/LenisContext.jsx'
import { ScrollTrigger } from './lib/gsap-setup.js'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Cursor from './components/Cursor.jsx'
import GlassGlow from './components/GlassGlow.jsx'
import Home from './pages/Home.jsx'

const About = lazy(() => import('./pages/About.jsx'))
const Shop = lazy(() => import('./pages/Shop.jsx'))
const Recipes = lazy(() => import('./pages/Recipes.jsx'))
const Articles = lazy(() => import('./pages/Articles.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))

function ScrollManager() {
  const { pathname } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    lenis.scrollTo(0, { immediate: true })
    const refresh = () => ScrollTrigger.refresh()
    transitions.stageDone = refresh
    const r1 = requestAnimationFrame(refresh)
    const r2 = requestAnimationFrame(refresh)
    document.fonts?.ready?.then(refresh)
    return () => {
      cancelAnimationFrame(r1)
      cancelAnimationFrame(r2)
      transitions.stageDone = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}

export default function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <TransitionProvider>
          <LenisProvider>
            <ScrollManager />
            <Cursor />
            <GlassGlow />
            <Nav />
            <main>
              <Suspense fallback={<div className="route-loading" aria-hidden="true" />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </Suspense>
            </main>
            <CartDrawer />
            <Footer />
          </LenisProvider>
        </TransitionProvider>
      </CartProvider>
    </SettingsProvider>
  )
}
