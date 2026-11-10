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
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE:', m.text()) })
await page.goto(`${BASE}/#/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
await sleep(1500)

async function scrollUntil(fnSrc, { step = 240, max = 60000 } = {}) {
  let y = (await page.evaluate(() => window.scrollY)) || 0
  const maxY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  for (let i = 0; i * step < max; i += 1) {
    if (await page.evaluate(fnSrc)) return y
    y = Math.min(y + step, maxY)
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await sleep(65)
    if (y >= maxY) return -2
  }
  return -1
}

const probe = (vSel) =>
  page.evaluate((sel) => {
    const v = document.querySelector(sel)
    if (!v) return { missing: true }
    const r = v.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const top = document.elementFromPoint(Math.min(cx, innerWidth - 2), Math.min(cy, innerHeight - 2))
    const before = v.currentTime
    const d = isFinite(v.duration) && v.duration > 6 ? v.duration : 14
    v.currentTime = (v.currentTime + 4) % d
    return {
      src: v.getAttribute('src').split('/').pop().slice(0, 20),
      paused: v.paused, rs: v.readyState, err: v.error && v.error.code,
      t: +before.toFixed(2), dur: +(+v.duration).toFixed(1),
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      topEl: top ? `${top.tagName}.${top.className && top.className.toString().slice(0, 40)}` : 'null',
      same: top === v || (top && v.contains(top)),
    }
  }, vSel)

/* showroom */
const y1 = await scrollUntil("(() => { const c = document.querySelector('.showroom__count'); return c && c.textContent.includes('02') })()")
console.log('showroom scrollY', y1)
await sleep(1200)
console.log('showroom pre-seek', JSON.stringify(await probe('video[src*="Scientist"]'), null, 0))
await sleep(900)
console.log('showroom post-seek t', await page.evaluate(() => document.querySelector('video[src*="Scientist"]').currentTime.toFixed(2)))
const shot1 = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } })
await sleep(400)
const shot2 = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } })
console.log('full-viewport shots identical:', shot1.equals(shot2))

/* recipes */
const y2 = await scrollUntil("(() => { const r = document.querySelector('.recipes__media'); const b = r && r.getBoundingClientRect(); return b && b.top < 640 && b.bottom > 200 })()")
console.log('recipes scrollY', y2)
await sleep(1200)
await sleep(4000); console.log('recipes rs after +4s', await page.evaluate(() => document.querySelector('video[src*="stirring"]').readyState)); console.log('recipes pre-seek', JSON.stringify(await probe('video[src*="stirring"]'), null, 0)); await sleep(3000); console.log('recipes rs after seek+3s', await page.evaluate(() => { const v = document.querySelector('video[src*="stirring"]'); return v.readyState + ' t=' + v.currentTime.toFixed(2) }))
await sleep(900)
console.log('recipes post-seek t', await page.evaluate(() => document.querySelector('video[src*="stirring"]').currentTime.toFixed(2)))

await browser.close()
