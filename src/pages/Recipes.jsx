import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Clip from '../components/Clip.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { TLink } from '../context/TransitionContext.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { RECIPES } from '../data/site.js'
import { V } from '../data/videos.js'

const EXCERPTS = [
  'Kheer, served the way the farm remembers it — chilled cream, slow-cooked rice and a finish of pure Bholu milk.',
  'Preparing fresh farm milk, the traditional way — boiled once, cooled gently, kept rich and naturally sweet.',
  'The final presentation of rice kheer — a golden bowl made with Bholu farm fresh milk and a handful of dry fruit.',
  'Slow-cooked rice kheer in pure Bholu milk — the recipe passed down through generations.',
]

export default function Recipes() {
  return (
    <>
      <PageHero
        crumb="Recipes"
        label="News & Media"
        title="From our"
        highlight="kitchen."
        sub="Fresh farm milk recipes crafted with rich flavours, traditional taste, and wholesome ingredients for every family meal."
        image="/images/recipe-1.jpeg"
        video={V.stir}
      />

      <section className="sec sec--milk on-light">
        <div className="container">
          <SectionHead label="Recipes" lede="Explore our recipes and kickstart your day with the perfect meal.">
            Cook with <span className="red">Bholu milk.</span>
          </SectionHead>
          <div className="stack-simple">
            {RECIPES.map((r, i) => (
              <article className="card-simple" key={r.title}>
                <div className="card-simple__media" data-cursor="view" data-cursor-label="READ">
                  {r.video ? (
                    <Clip src={r.video} poster={r.image} alt={r.title} />
                  ) : (
                    <img src={r.image} alt={r.title} loading="lazy" />
                  )}
                </div>
                <div>
                  <span className="card-simple__num">0{i + 1} / 04</span>
                  <h3>{r.title}</h3>
                  <p>{EXCERPTS[i]}</p>
                  <TLink to="/recipes" className="manifesto__link">
                    Read Recipe <ArrowRight size={15} />
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
