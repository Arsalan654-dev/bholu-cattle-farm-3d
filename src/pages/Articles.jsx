import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Clip from '../components/Clip.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { V } from '../data/videos.js'

const ITEMS = [
  { tag: 'RECOVERY', title: 'Milk and muscle recovery — a natural post-workout drink', img: '/images/article-1.jpg', video: V.flex1 },
  { tag: 'SLEEP', title: 'Milk and better sleep — can dairy really help you rest?', img: '/images/article-2.jpg' },
  { tag: 'SKINCARE', title: 'Milk-based skincare — DIY recipes for glowing skin', img: '/images/article-3.webp', video: V.cleanser },
  { tag: 'GUT HEALTH', title: 'Gut health — three simple tips from the farm', img: '/images/article-4.webp' },
]

export default function Articles() {
  return (
    <>
      <PageHero
        crumb="Articles"
        label="News & Media"
        title="Notes from"
        highlight="the farm."
        sub="Bringing nature’s best to your family — tips, tricks and stories from Bholu Farm."
        image="/images/article-1.jpg"
        video={V.flex2}
      />

      <section className="sec sec--milk on-light">
        <div className="container">
          <SectionHead
            label="Journal"
            lede="Embrace your day with confidence, follow your own path, and shine bright with Bholu’s tips and tricks to make motherhood stress-free."
          >
            Wellness, <span className="red">milk &amp; you.</span>
          </SectionHead>
          <div className="stack-simple">
            {ITEMS.map((it, i) => (
              <article className="card-simple" key={it.tag}>
                <div className="card-simple__media" data-cursor="view" data-cursor-label="READ">
                  {it.video ? (
                    <Clip src={it.video} poster={it.img} alt={it.title} />
                  ) : (
                    <img src={it.img} alt={it.title} loading="lazy" />
                  )}
                </div>
                <div>
                  <span className="card-simple__num">0{i + 1} / 04 — {it.tag}</span>
                  <h3>{it.title}</h3>
                  <p>
                    What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the
                  </p>
                  <TLink to="/articles" className="manifesto__link">
                    Read More <ArrowRight size={15} />
                  </TLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  )
}
