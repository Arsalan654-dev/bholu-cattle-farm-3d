import Hero from '../sections/Hero.jsx'
import Manifesto from '../sections/Manifesto.jsx'
import FarmBand from '../sections/FarmBand.jsx'
import Story from '../sections/Story.jsx'
import Journey from '../sections/Journey.jsx'
import Showroom from '../sections/Showroom.jsx'
import Marquee from '../components/Marquee.jsx'
import RecipeStack from '../sections/RecipeStack.jsx'
import ArticleDepth from '../sections/ArticleDepth.jsx'
import FinalCta from '../sections/FinalCta.jsx'

const MARQUEE_ITEMS = ['Bholu Farm', 'Pure from origin', 'Farm to home', 'Fresh every day']

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <FarmBand />
      <Story />
      <Journey />
      <Showroom />
      <Marquee items={MARQUEE_ITEMS} light />
      <RecipeStack />
      <ArticleDepth />
      <FinalCta />
    </>
  )
}
