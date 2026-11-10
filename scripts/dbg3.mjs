import puppeteer from 'puppeteer-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:4173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--disable-gpu', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(`${BASE}/#/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
await sleep(1800)

const state = async (label) => {
  const s = await page.evaluate(() => ({
    y: Math.round(window.scrollY),
    pct: document.querySelector('.journey__pct')?.textContent || 'MISSING',
    docH: document.documentElement.scrollHeight,
  }))
  console.log(label, JSON.stringify(s))
  return s
}

const jumpToJourney = async () => {
  const jTop = await page.evaluate(() => {
    const r = document.querySelector('.journey').getBoundingClientRect()
    return r.top + window.scrollY
  })
  await page.evaluate((y) => window.scrollTo(0, y + 10), jTop)
  await sleep(800)
  return jTop
}

const walk = async (label) => {
  const start = await page.evaluate(() => window.scrollY)
  const seen = []
  for (let i = 0; i < 60; i += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), start + i * 110)
    await sleep(62)
    const s = await page.evaluate(() => ({
      req: Math.round(window.scrollY),
      pct: document.querySelector('.journey__pct')?.textContent || 'MISSING',
    }))
    if (i % 6 === 0 || i < 3) seen.push(`${s.req}/${s.pct}`)
    const m = s.pct.match(/(\d+)%/)
    if (m && +m[1] >= 28 && +m[1] <= 38) { console.log(label, 'HIT at', s.req, s.pct); return true }
  }
  console.log(label, 'MISS samples:', seen.join(' '))
  return false
}

/* A: fresh load → jump → walk */
await state('fresh')
let jTop = await jumpToJourney()
console.log('jTop', jTop)
await state('after jump')
await walk('A-fresh')

/* B: story scroll-through first, then jump → walk */
await page.evaluate(() => window.scrollTo(0, 0))
await sleep(600)
const storyY = await page.evaluate(() => {
  const r = document.querySelector('.story').getBoundingClientRect()
  return r.top + window.scrollY
})
console.log('storyY', storyY)
for (let i = 0; i < 40; i += 1) {
  await page.evaluate((y) => window.scrollTo(0, y), storyY + i * 360)
  await sleep(170)
}
await state('after story pass')
jTop = await jumpToJourney()
console.log('jTop2', jTop)
await state('B after jump')
await walk('B-poststory')

await browser.close()
