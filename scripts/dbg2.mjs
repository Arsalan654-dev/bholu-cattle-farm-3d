import puppeteer from 'puppeteer-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:4173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--disable-gpu', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
})

async function runAbout(withSeek) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  const errs = []
  page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()) })
  page.on('response', (r) => {
    if (r.url().includes('/videos/') && (r.status() >= 400 || r.status() === 200 || r.status() === 206)) {
      errs.push(`RESP ${r.status()} ${r.url().split('/').pop().slice(0, 18)} range=${r.headers()['content-range'] || '-'}`)
    }
  })
  page.on('requestfailed', (r) => { if (r.url().includes('/videos/')) errs.push(`FAIL ${(r.failure()?.errorText || '')} ${r.url().split('/').pop().slice(0, 18)}`) })
  await page.goto(`${BASE}/#/about`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await sleep(1300)
  if (withSeek) {
    await page.evaluate(() => {
      const v = document.querySelector('.page-hero__bg .clip')
      v.currentTime = (v.currentTime + 2.2) % (v.duration || 10)
    })
    await sleep(1200)
  }
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= h; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(120) }
  await sleep(1500)
  const st = await page.evaluate(() =>
    [...document.querySelectorAll('video.clip')].map((v) => ({
      s: v.getAttribute('src')?.split('/').pop().slice(0, 14), rs: v.readyState, err: v.error && v.error.code, t: +v.currentTime.toFixed(1),
    })),
  )
  console.log(`\n--- about seek=${withSeek} ---`)
  console.log('videos:', JSON.stringify(st))
  errs.filter((e) => e.startsWith('FAIL') || e.startsWith('CONSOLE')).forEach((e) => console.log(e))
  await page.close()
}

async function traceJourney() {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(`${BASE}/#/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await sleep(1500)
  const jTop = await page.evaluate(() => {
    let y = 0
    let n = document.querySelector('.journey')
    while (n) { y += n.offsetTop; n = n.offsetParent }
    return y
  })
  console.log('\n--- journey trace ---')
  console.log('jTop', jTop, 'docH', await page.evaluate(() => document.documentElement.scrollHeight))
  await page.evaluate((y) => window.scrollTo(0, y + 10), jTop)
  await sleep(1000)
  const samples = []
  let y = jTop + 10
  for (let i = 0; i < 170; i += 1) {
    y += 110
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await sleep(65)
    const t = await page.evaluate(() => document.querySelector('.journey__pct')?.textContent || 'MISSING')
    samples.push(`${y}:${t}`)
    const m = t.match(/(\d+)%/)
    if (m && +m[1] >= 28 && +m[1] <= 38) { console.log('HIT at', samples.slice(-6).join(' ')); break }
  }
  console.log('last samples:', samples.slice(-14).join(' '))
  console.log('pin-spacer h:', await page.evaluate(() => { const p = document.querySelector('.journey')?.closest('.pin-spacer'); return p ? p.style.height + '/' + p.getBoundingClientRect().height : 'none' }))
  await page.close()
}

await runAbout(false)
await runAbout(true)
await traceJourney()
await browser.close()
