import puppeteer from 'puppeteer-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--disable-gpu', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:4173/#/', { waitUntil: 'domcontentloaded', timeout: 45000 })
await sleep(2000)
const top = await page.evaluate(() => {
  const r = document.querySelector('.manifesto').getBoundingClientRect()
  return r.top + window.scrollY
})
await page.evaluate((y) => window.scrollTo(0, y), top - 40)
await sleep(1600)
await page.screenshot({ path: 'shots/mf-1-title.png' })
await page.evaluate((y) => window.scrollTo(0, y), top + 720)
await sleep(1400)
await page.screenshot({ path: 'shots/mf-2-clip.png' })

/* mouse over section → bg clip should translate */
const secBox = await (await page.$('.manifesto')).boundingBox()
await page.mouse.move(secBox.x + secBox.width * 0.8, secBox.y + secBox.height * 0.4, { steps: 8 })
await sleep(900)
const bgT = await page.evaluate(() => document.querySelector('.manifesto__bg .clip')?.style.transform || 'none')

/* hover card → playbackRate + scale */
const card = await page.$('.manifesto__clip')
const cb = await card.boundingBox()
await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2, { steps: 6 })
await sleep(1100)
const hoverState = await page.evaluate(() => {
  const v = document.querySelector('.manifesto__clip video')
  return { rate: v?.playbackRate, scale: v?.style.transform }
})
await page.screenshot({ path: 'shots/mf-3-hover.png' })

const state = await page.evaluate(() => {
  const bg = document.querySelector('.manifesto__bg video')
  return { bgPlaying: bg ? !bg.paused && bg.currentTime > 0.1 : false, rs: bg?.readyState }
})
console.log('bg transform:', bgT)
console.log('card hover:', JSON.stringify(hoverState))
console.log('bg video:', JSON.stringify(state))
await browser.close()
