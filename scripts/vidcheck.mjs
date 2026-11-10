import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:4173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let failures = 0
const say = (k, v, ok = true) => {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${k}: ${v}`)
}

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--disable-gpu', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
})
fs.mkdirSync('shots', { recursive: true })

function track(page, label) {
  const errs = []
  page.on('pageerror', (e) => errs.push(`${label} PAGEERROR: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    if (m.text().includes('ERR_CACHE_OPERATION_NOT_SUPPORTED')) return
    errs.push(`${label} CONSOLE: ${m.text()}`)
  })
  page.on('response', (r) => {
    if (r.url().includes('/videos/') && r.status() >= 400) errs.push(`${label} VIDEO HTTP ${r.status()}: ${decodeURIComponent(r.url().split('/').pop())}`)
  })
  page.on('requestfailed', (r) => {
    if (!r.url().includes('/videos/')) return
    const why = r.failure()?.errorText || ''
    if (why.includes('ERR_ABORTED')) return
    if (why.includes('ERR_CACHE_OPERATION_NOT_SUPPORTED')) return
    errs.push(`${label} VIDEO REQFAIL: ${decodeURIComponent(r.url().split('/').pop())} ${why}`)
  })
  return errs
}

const clipState = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('video.clip')].map((v) => ({
      src: v.getAttribute('src') ? v.getAttribute('src').split('/').pop().slice(0, 26) : null,
      rs: v.readyState,
      paused: v.paused,
      t: +v.currentTime.toFixed(2),
      err: v.error ? v.error.code : null,
    })),
  )

const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)

async function scrollPass(page, step = 640, pause = 130) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= h; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await sleep(pause)
  }
}

async function scrollUntil(page, fnSrc, { step = 240, max = 40000 } = {}) {
  let y = (await page.evaluate(() => window.scrollY)) || 0
  const maxY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  for (let i = 0; i * step < max; i += 1) {
    if (await page.evaluate(fnSrc)) return y
    y = Math.min(y + step, maxY)
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await sleep(65)
    if (y >= maxY) return (await page.evaluate(fnSrc)) ? y : -2
  }
  return -1
}

async function diffPngs(browser, a, b) {
  const p = await browser.newPage()
  const res = await p.evaluate(async (a64, b64) => {
    const load = (s) =>
      new Promise((res2, rej) => {
        const i = new Image()
        i.onload = () => res2(i)
        i.onerror = rej
        i.src = 'data:image/png;base64,' + s
      })
    const [ia, ib] = await Promise.all([load(a64), load(b64)])
    const w = Math.min(ia.width, ib.width)
    const h = Math.min(ia.height, ib.height)
    const cv = document.createElement('canvas')
    cv.width = w
    cv.height = h
    const ctx = cv.getContext('2d')
    ctx.drawImage(ia, 0, 0)
    const da = ctx.getImageData(0, 0, w, h).data
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(ib, 0, 0)
    const db = ctx.getImageData(0, 0, w, h).data
    let changed = 0
    const n = w * h
    for (let i = 0; i < n; i += 1) {
      const k = i * 4
      const d = Math.abs(da[k] - db[k]) + Math.abs(da[k + 1] - db[k + 1]) + Math.abs(da[k + 2] - db[k + 2])
      if (d > 26) changed += 1
    }
    return +((100 * changed) / n).toFixed(2)
  }, a.toString('base64'), b.toString('base64'))
  await p.close()
  return res
}

async function boxClip(page, sel) {
  const h = await page.$(sel)
  if (!h) return null
  const box = await h.boundingBox()
  if (!box || box.width < 20 || box.height < 20) return null
  const x = Math.max(0, box.x)
  const y = Math.max(0, box.y)
  const width = Math.min(box.width, 1440 - x)
  const height = Math.min(box.height, 900 - y)
  if (width < 20 || height < 20) return null
  return { x, y, width, height }
}

/* natural-motion diff (settled scrub / ambient animation) */
async function shotDiff(page, sel, wait = 950) {
  const clip = await boxClip(page, sel)
  if (!clip) return { pct: -1, note: 'no box' }
  const a = await page.screenshot({ clip })
  await sleep(wait)
  const b = await page.screenshot({ clip })
  return { pct: await diffPngs(browser, a, b) }
}

/* frame liveness diff: seek the video +2.2s — proves its frames render */
async function seekDiff(page, videoSel) {
  const clip = await boxClip(page, videoSel)
  if (!clip) return { pct: -1, note: 'video box offscreen' }
  const waitRs = async (min, tries = 45) => {
    for (let i = 0; i < tries; i += 1) {
      const ok = await page.evaluate((sel, m) => {
        const v = document.querySelector(sel)
        return !!v && v.readyState >= m && !v.seeking && !v.error
      }, videoSel, min)
      if (ok) return true
      await sleep(200)
    }
    return false
  }
  const pre = await waitRs(3)
  const a = await page.screenshot({ clip })
  const ok = await page.evaluate((sel) => {
    const v = document.querySelector(sel)
    if (!v) return false
    const jump = isFinite(v.duration) && v.duration > 2 ? v.duration * 0.5 : 3
    v.currentTime = (v.currentTime + jump) % (v.duration || 10)
    return true
  }, videoSel)
  if (!ok) return { pct: -1, note: 'no video el' }
  const post = await waitRs(2)
  await sleep(450)
  const b = await page.screenshot({ clip })
  const pct = await diffPngs(browser, a, b)
  const err = await page.evaluate((sel) => { const v = document.querySelector(sel); return v && v.error ? v.error.code : 0 }, videoSel)
  const note = `${pre ? 'pre-ok' : 'pre-late'} ${post ? 'post-ok' : 'post-late'}${err ? ` err${err}` : ''}`
  if (pct < 0.5) console.log(`INFO seekDiff ${videoSel} → ${pct}% ${note}`)
  return { pct, note }
}

/* ---------------------------------- HOME --------------------------------- */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  const errs = track(page, 'home')
  await page.goto(`${BASE}/#/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await sleep(1800)

  const count = await page.evaluate(() => document.querySelectorAll('video.clip').length)
  say('home clip count', count, count >= 16)

  await page.screenshot({ path: 'shots/v1-hero.png' })
  const heroDiff = await seekDiff(page, '.hero__bg .clip')
  say('hero splash renders frames %', heroDiff.pct, heroDiff.pct > 0.3)

  await scrollUntil(page, "document.querySelector('.manifesto__clip')?.getBoundingClientRect().top < 640 && document.querySelector('.manifesto__clip')?.getBoundingClientRect().top > 60")
  await sleep(1100)
  await page.screenshot({ path: 'shots/v2-manifesto.png' })
  const mfDiff = await seekDiff(page, 'video[src*="Milk_and_yogurt"]')
  say('manifesto clip renders frames %', mfDiff.pct, mfDiff.pct > 0.3)

  await scrollUntil(page, "(() => { const r = document.querySelector('.farm'); const b = r && r.getBoundingClientRect(); return b && b.top < 100 && b.bottom > 700 })()")
  await sleep(900)
  const farmDiff = await seekDiff(page, 'video[src*="Cows_graze_on_hillside"]')
  say('farmband video renders frames %', farmDiff.pct, farmDiff.pct > 0.15)
  await page.screenshot({ path: 'shots/v2b-farm.png' })

  /* story: scroll through pinned range, track step + layer videos */
  const storyY = await scrollUntil(page, "document.querySelector('.story')?.getBoundingClientRect().top <= 1")
  void storyY
  await sleep(800)
  const seenSteps = new Set()
  let storyPlayed = 0
  let storySeek = null
  for (let i = 0; i < 44; i += 1) {
    const stepTxt = await page.evaluate(() => document.querySelector('.story__num b')?.textContent || '')
    if (stepTxt) seenSteps.add(stepTxt)
    const st = await clipState(page)
    storyPlayed = Math.max(storyPlayed, st.filter((v) => v.src && v.t > 0.1).length)
    if (!storySeek && stepTxt === '05 / 06') {
      await sleep(500)
      storySeek = await seekDiff(page, 'video[src*="Worker_monitoring"]')
    }
    await page.evaluate((d) => window.scrollBy(0, d), 360)
    await sleep(190)
  }
  say('story steps seen', [...seenSteps].join(','), seenSteps.size >= 5)
  say('story distinct videos played (cumul.)', storyPlayed, storyPlayed >= 8)
  await page.screenshot({ path: 'shots/v3-story.png' })
  say('story layer video renders frames %', storySeek ? storySeek.pct : 'never probed', storySeek && storySeek.pct > 0.3)

  /* journey stages */
  const jTop = await page.evaluate(() => {
    const el = document.querySelector('.journey')
    const r = el.getBoundingClientRect()
    return r.top + window.scrollY
  })
  await page.evaluate((y) => window.scrollTo(0, y + 10), jTop)
  await sleep(900)
  const readPct = async () => {
    const t = await page.evaluate(() => document.querySelector('.journey__pct')?.textContent || '')
    const m = t.match(/(\d+)%/)
    return m ? +m[1] : -1
  }
  const journeyProbe = async (targetPct, hi, shot, seekSel) => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (attempt > 0) {
        /* retry — jump back and let the scrub settle at the start */
        await page.evaluate((yy) => window.scrollTo(0, yy), jTop + 10)
        for (let i = 0; i < 30; i += 1) {
          const p = await readPct()
          if (p >= 0 && p <= 4) break
          await sleep(150)
        }
      }
      const y0 = await page.evaluate(() => window.scrollY)
      const maxY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
      let hitY = -1
      const samples = []
      for (let i = 0; i * 110 <= 18000; i += 1) {
        const y = Math.min(y0 + i * 110, maxY)
        await page.evaluate((yy) => window.scrollTo(0, yy), y)
        await sleep(62)
        const t = await page.evaluate(() => document.querySelector('.journey__pct')?.textContent || 'MISSING')
        if (i < 8 || i % 20 === 0) samples.push(`${Math.round(await page.evaluate(() => scrollY))}:${t}`)
        const m = t.match(/(\d+)%/)
        if (m && +m[1] >= targetPct && +m[1] <= hi) { hitY = y; break }
        if (y >= maxY) break
      }
      if (hitY >= 0) {
        await sleep(1000)
        if (shot) await page.screenshot({ path: `shots/${shot}.png` })
        if (seekSel) {
          const d = await seekDiff(page, seekSel)
          say(`journey ${targetPct}% video renders %`, d.pct, d.pct > 0.3)
        } else {
          const d = await shotDiff(page, '.journey__stage')
          say(`journey ${targetPct}% stage motion %`, d.pct, d.pct > 0.3)
        }
        return
      }
      const diag = await page.evaluate(() => {
        const spacers = [...document.querySelectorAll('.pin-spacer')].map((el) => {
          const r = el.getBoundingClientRect()
          return `${el.parentElement.className.split(' ')[0]}@${Math.round(r.top + scrollY)}+${Math.round(r.height)}`
        })
        const jt = document.querySelector('.journey')
        const st = document.querySelector('.story')
        return {
          y: Math.round(scrollY),
          pct: document.querySelector('.journey__pct')?.textContent,
          journeyTop: jt ? Math.round(jt.getBoundingClientRect().top + scrollY) : 'no-journey',
          storyTop: st ? Math.round(st.getBoundingClientRect().top + scrollY) : 'no-story',
          storyH: st ? Math.round(st.getBoundingClientRect().height) : 0,
          spacers,
        }
      })
      console.log(`INFO journey walk fail tgt=${targetPct} attempt=${attempt} samples:`, samples.join(' '), '\nDIAG', JSON.stringify(diag))
    }
    say(`journey reach ${targetPct}%`, 'never reached (2 tries)', false)
  }
  await journeyProbe(28, 38, 'v4-journey-cow', 'video[src*="Dairy_cows"]')
  await journeyProbe(48, 55, 'v5-journey-splash', '.journey__splash')
  await journeyProbe(93, 100, 'v6-journey-pack')

  /* showroom: horizontal pin — reach panel 02 */
  await scrollUntil(page, "(() => { const c = document.querySelector('.showroom__count'); return c && c.textContent.includes('02') })()", { max: 60000 })
  await sleep(1000)
  const showDiff = await seekDiff(page, 'video[src*="Scientist"]')
  say('showroom facts clip renders frames %', showDiff.pct, showDiff.pct > 0.3)
  await page.screenshot({ path: 'shots/v7-showroom.png' })

  await scrollUntil(page, "(() => { const r = document.querySelector('.recipes__media'); const b = r && r.getBoundingClientRect(); return b && b.top < 640 && b.bottom > 200 })()")
  await sleep(900)
  const recDiff = await seekDiff(page, 'video[src*="stirring"]')
  say('recipe clip renders frames %', recDiff.pct, recDiff.pct > 0.3)
  await page.screenshot({ path: 'shots/v8-recipes.png' })

  await scrollUntil(page, "(() => { const r = document.querySelector('.journal__media'); return r && r.getBoundingClientRect().top < 760 })()")
  await sleep(900)
  await page.screenshot({ path: 'shots/v9-journal.png' })

  await scrollUntil(page, "(() => { const r = document.querySelector('.final__bg'); return r && r.getBoundingClientRect().top < 300 })()", { max: 60000 })
  await sleep(1400)
  await page.screenshot({ path: 'shots/v10-final.png' })
  const finDiff = await seekDiff(page, 'video[src*="Animating"]')
  say('final logo film renders frames %', finDiff.pct, finDiff.pct > 0.3)

  const st = await clipState(page)
  const withSrc = st.filter((v) => v.src)
  const bad = withSrc.filter((v) => v.err)
  const played = withSrc.filter((v) => v.t > 0.1)
  say('clips with src / errors', `${withSrc.length} src, ${bad.length} errors ${JSON.stringify(bad)}`, bad.length === 0)
  say('clips ever played', `${played.length}/${withSrc.length}`, played.length >= withSrc.length - 1)
  const ov = await overflow(page)
  say('home overflow px', ov, ov <= 1)
  say('home console errors', errs.length ? errs.slice(0, 6).join(' || ') : 'none', errs.length === 0)
  await page.close()
}

/* ------------------------------- INNER PAGES ----------------------------- */
for (const [route, label] of [
  ['about', 'about'],
  ['shop', 'shop'],
  ['recipes', 'recipes'],
  ['articles', 'articles'],
  ['contact', 'contact'],
]) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  const errs = track(page, label)
  await page.goto(`${BASE}/#/${route}`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await sleep(1300)
  const heroHas = await page.evaluate(() => !!document.querySelector('.page-hero__bg .clip'))
  say(`${label} hero clip`, heroHas, heroHas)
  const heroSeek = await seekDiff(page, '.page-hero__bg .clip')
  say(`${label} hero video renders %`, heroSeek.pct, heroSeek.pct > 0.3)
  await scrollPass(page, 700, 120)
  await sleep(700)
  const st = await clipState(page)
  const withSrc = st.filter((v) => v.src)
  const bad = withSrc.filter((v) => v.err)
  const played = withSrc.filter((v) => v.t > 0.1)
  say(`${label} clips played/total`, `${played.length}/${withSrc.length} err=${bad.length}`, withSrc.length > 0 && bad.length === 0 && played.length >= 1)
  const ov = await overflow(page)
  say(`${label} overflow px`, ov, ov <= 1)
  if (errs.length) say(`${label} console errors`, errs.slice(0, 4).join(' || '), false)
  await page.close()
}

/* ------------------------------ REDUCED MOTION --------------------------- */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  const errs = track(page, 'reduced')
  await page.goto(`${BASE}/#/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await sleep(1400)
  await scrollPass(page, 800, 90)
  await sleep(800)
  const st = await clipState(page)
  const playing = st.filter((v) => !v.paused)
  say('reduced: playing clips', `${playing.length} of ${st.length}`, playing.length === 0)
  const staticJourney = await page.evaluate(() => !!document.querySelector('.journey-section'))
  say('reduced: static journey', staticJourney, staticJourney)
  say('reduced console errors', errs.length ? errs.slice(0, 4).join(' || ') : 'none', errs.length === 0)
  await page.close()
}

/* --------------------------------- MOBILE -------------------------------- */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  const errs = track(page, 'mobile')
  await page.goto(`${BASE}/#/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await sleep(1400)
  const staticJourney = await page.evaluate(() => !!document.querySelector('.journey-section'))
  say('mobile: static journey', staticJourney, staticJourney)
  await scrollPass(page, 500, 120)
  await sleep(900)
  const st = await clipState(page)
  const played = st.filter((v) => v.t > 0.1)
  const bad = st.filter((v) => v.src && v.err)
  say('mobile clips played', `${played.length}/${st.filter((v) => v.src).length} err=${bad.length}`, played.length >= 3 && bad.length === 0)
  const ov = await overflow(page)
  say('mobile overflow px', ov, ov <= 1)
  await page.screenshot({ path: 'shots/v11-mobile.png' })
  say('mobile console errors', errs.length ? errs.slice(0, 4).join(' || ') : 'none', errs.length === 0)
  await page.close()
}

await browser.close()
console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECKS FAILED`)
process.exit(failures === 0 ? 0 : 1)
