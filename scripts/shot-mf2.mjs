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
const t = await page.evaluate(() => {
  const r = document.querySelector('.manifesto').getBoundingClientRect()
  return r.top + window.scrollY
})
await page.evaluate((y) => window.scrollTo(0, y), t - 60)
await sleep(1600)
await page.screenshot({ path: 'shots/mf-final-title.png' })

const row = await page.evaluate(() => {
  const r = document.querySelector('.manifesto__row').getBoundingClientRect()
  return { x: r.x, y: r.y, w: r.width, h: r.height }
})
await page.mouse.move(row.x + row.w * 0.55, row.y + row.h * 0.4, { steps: 8 })
await sleep(900)
await page.evaluate((y) => window.scrollTo(0, y), t + 640)
await sleep(1300)
const card = await page.$('.manifesto__clip')
const cb = await card.boundingBox()
await page.mouse.move(cb.x + cb.width * 0.5, cb.y + cb.height * 0.55, { steps: 6 })
await sleep(1200)
await page.screenshot({ path: 'shots/mf-final-hover.png' })
const st = await page.evaluate(() => {
  const bg = document.querySelector('.manifesto__bg video')
  const cv = document.querySelector('.manifesto__clip video')
  return {
    bgPlaying: !bg.paused && bg.currentTime > 0.1,
    rate: cv.playbackRate,
    bgT: document.querySelector('.manifesto__bg .clip').style.transform,
  }
})
console.log(JSON.stringify(st))
await browser.close()
