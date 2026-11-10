import puppeteer from 'puppeteer-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:4173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--disable-gpu', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(`${BASE}/#/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
await sleep(1800)

const journeyCheck = async (label) => {
  const jTop = await page.evaluate(() => {
    const r = document.querySelector('.journey').getBoundingClientRect()
    return r.top + window.scrollY
  })
  await page.evaluate((y) => window.scrollTo(0, y + 10), jTop)
  await sleep(900)
  const s = await page.evaluate(() => ({
    y: Math.round(window.scrollY),
    pct: document.querySelector('.journey__pct')?.textContent || 'MISSING',
    spacers: [...document.querySelectorAll('.pin-spacer')].map((el) => el.parentElement.className.split(' ')[0]),
  }))
  console.log(`CHK ${label}: jTop=${Math.round(jTop)} ${JSON.stringify(s)}`)
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(600)
}

const scrollUntil = async (fnSrc) => {
  let y = await page.evaluate(() => window.scrollY)
  for (let i = 0; i < 160; i += 1) {
    if (await page.evaluate(fnSrc)) return y
    y += 360
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await sleep(45)
  }
  return -1
}

const seek = async (videoSel) => {
  await page.evaluate((sel) => {
    const v = document.querySelector(sel)
    if (!v) return
    const jump = isFinite(v.duration) && v.duration > 2 ? v.duration * 0.5 : 3
    v.currentTime = (v.currentTime + jump) % (v.duration || 10)
  }, videoSel)
  await sleep(700)
}

await journeyCheck('load')

/* hero seek */
await seek('.hero__bg .clip')
await journeyCheck('after-hero-seek')

/* manifesto */
await scrollUntil("document.querySelector('.manifesto__clip')?.getBoundingClientRect().top < 640 && document.querySelector('.manifesto__clip')?.getBoundingClientRect().top > 60")
await sleep(1100)
await seek('video[src*="Milk_and_yogurt"]')
await journeyCheck('after-manifesto')

/* farm */
await scrollUntil("(() => { const r = document.querySelector('.farm'); const b = r && r.getBoundingClientRect(); return b && b.top < 100 && b.bottom > 700 })()")
await sleep(900)
await seek('video[src*="Cows_graze_on_hillside"]')
await journeyCheck('after-farm')

/* story pass with seek at 05 */
await scrollUntil("document.querySelector('.story')?.getBoundingClientRect().top <= 1")
await sleep(800)
for (let i = 0; i < 44; i += 1) {
  const stepTxt = await page.evaluate(() => document.querySelector('.story__num b')?.textContent || '')
  if (i === 16 && stepTxt === '05 / 06') {
    await sleep(500)
    await seek('video[src*="Worker_monitoring"]')
  }
  await page.evaluate((d) => window.scrollBy(0, d), 360)
  await sleep(190)
}
await journeyCheck('after-story')

await browser.close()
