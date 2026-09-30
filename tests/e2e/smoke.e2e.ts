// Smoke (quick tier). Phase 0 (F): the app boots, window.__dep is ready, and the frame is on at 1280 × 800
// and 1920 × 1080 with the PLAN §5.2 border sizes, DEPARTURES in the title tier in Jost caps, gold; Jost's
// tabular figures work at 18 px. Q extends it in Phase 1: title → new game → first opening sheet → first turn.
import { mkdirSync } from 'node:fs';
import { ART, SIZES, check, clearStorage, finish, open, region, reload } from './lib';

const SHOTS = 'artifacts/foundation';
mkdirSync(SHOTS, { recursive: true });
const results: string[] = [];

const FRAME = {
  laptop: { top: 44, right: 164, bottom: 120, left: 16, hand: 48, title: 72, titleSize: 36, board: [1100, 636] },
  tv: { top: 60, right: 236, bottom: 172, left: 24, hand: 68, title: 104, titleSize: 50, board: [1660, 848] },
} as const;

const near = (a: number | undefined, b: number, tol = 1) => a !== undefined && Math.abs(a - b) <= tol;

for (const size of ['laptop', 'tv'] as const) {
  const vp = SIZES[size];
  const want = FRAME[size];
  const tag = `${vp.width}x${vp.height}`;
  const { browser, page, errors } = await open(undefined, vp);
  await clearStorage(page);
  await reload(page);

  const hooks = await page.evaluate(() => ({ ready: window.__dep.ready, build: window.__dep.build, warnings: window.__dep.warnings.length }));
  check(hooks.ready, `${tag}: window.__dep is ready (build ${hooks.build})`, results);
  check(hooks.warnings === 0, `${tag}: no __dep warnings (${hooks.warnings})`, results);

  const board = await region(page, 'board');
  const top = await region(page, 'top');
  const right = await region(page, 'right');
  const dock = await region(page, 'dock');
  const hand = await region(page, 'hand');
  const title = await region(page, 'title');
  check(near(top?.height, want.top), `${tag}: top border ${top?.height} = ${want.top}`, results);
  check(near(right?.width, want.right), `${tag}: right border (the siding) ${right?.width} = ${want.right}`, results);
  check(near(dock?.height, want.bottom), `${tag}: bottom border (the dock) ${dock?.height} = ${want.bottom}`, results);
  check(near(hand?.height, want.hand) && near(title?.height, want.title), `${tag}: hand tier ${hand?.height} + title tier ${title?.height} = ${want.hand} + ${want.title}`, results);
  check(near(board?.x, want.left), `${tag}: left border ${board?.x} = ${want.left}`, results);
  check(near(board?.width, want.board[0]) && near(board?.height, want.board[1]), `${tag}: board ${board?.width} × ${board?.height} = ${want.board.join(' × ')}`, results);

  const place = await page.locator('[data-testid="place"]').evaluate((e) => {
    const cs = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    return {
      text: (e as HTMLElement).innerText,
      family: cs.fontFamily,
      weight: cs.fontWeight,
      size: parseFloat(cs.fontSize),
      tracking: parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize),
      color: cs.color,
      transform: cs.textTransform,
      loaded: document.fonts.check(`600 ${cs.fontSize} "Jost Variable"`),
      inTitleTier: !!e.closest('[data-region="title"]'),
      y: r.y + r.height / 2,
    };
  });
  check(place.text === 'DEPARTURES' && place.inTitleTier, `${tag}: title tier reads ${place.text}`, results);
  check(/Jost/.test(place.family) && place.loaded, `${tag}: set in Jost, loaded (${place.family.split(',')[0]}, weight ${place.weight})`, results);
  check(place.size === want.titleSize && Math.abs(place.tracking - 0.16) < 0.01, `${tag}: title line ${place.size} px, tracking ${place.tracking.toFixed(2)} em`, results);
  check(place.color === 'rgb(240, 178, 74)', `${tag}: DEPARTURES in the one gold (${place.color})`, results);
  check(!!title && place.y > title.y && place.y < title.y + title.height, `${tag}: centred in the title tier`, results);

  // The border is dark: sample the frame colour in the four borders from a screenshot.
  const png = await page.screenshot({ path: `${SHOTS}/frame-${tag}.png` });
  await page.screenshot({ path: `${ART}/smoke-title-${tag}.png` });
  const border = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext('2d')!;
    g.drawImage(img, 0, 0);
    const at = (x: number, y: number) => Array.from(g.getImageData(x, y, 1, 1).data.slice(0, 3));
    const w = img.width;
    const h = img.height;
    return { top: at(w / 2, 4), right: at(w - 6, h / 2), bottomRight: at(w - 6, h - 6), left: at(3, h / 2) };
  }, png.toString('base64'));
  const dark = Object.values(border).every((p) => Math.max(...p) < 40);
  check(dark, `${tag}: dark border (${Object.entries(border).map(([k, v]) => `${k} ${v.join(',')}`).join(' · ')})`, results);

  const stub = await page.evaluate(() => ({ cities: document.querySelectorAll('[data-city]').length, slots: document.querySelectorAll('[data-lane]').length }));
  if (stub.cities) check(stub.cities === 36 && stub.slots === 309, `${tag}: R's stub board printed: ${stub.cities} cities, ${stub.slots} slots`, results);
  else console.log(`note ${tag}: src/data/board.stub.json not present yet; the board region is a flat plate`);

  if (size === 'laptop') {
    // Jost tabular figures at 18 px: with tnum every digit has the same advance; without, 1 is narrower.
    const tnum = await page.evaluate(async () => {
      const box = document.createElement('div');
      box.id = 'tnum-specimen';
      box.style.cssText = 'position:fixed;left:40px;top:80px;padding:14px 18px;background:#15130F;color:#E9DFC6;z-index:99;font:600 18px/1.5 "Jost Variable";border:1px solid #E9DFC6';
      const row = (label: string, text: string, tn: boolean) => {
        const d = document.createElement('div');
        const l = document.createElement('span');
        l.textContent = label;
        l.style.cssText = 'display:inline-block;width:170px;opacity:.6;font-feature-settings:normal';
        const s = document.createElement('span');
        s.textContent = text;
        s.style.fontFeatureSettings = tn ? '"tnum" 1, "lnum" 1' : '"pnum" 1';
        s.dataset.tn = tn ? '1' : '0';
        d.append(l, s);
        box.append(d);
        return s;
      };
      const a = row('tnum 18px', '1111111111', true);
      const b = row('tnum 18px', '0000000000', true);
      const c = row('tnum 18px', '4518203967', true);
      const d = row('proportional', '1111111111', false);
      const e = row('proportional', '0000000000', false);
      document.body.append(box);
      await document.fonts.ready;
      const w = (s: HTMLElement) => s.getBoundingClientRect().width;
      return { t1: w(a), t0: w(b), tmix: w(c), p1: w(d), p0: w(e), size: parseFloat(getComputedStyle(a).fontSize) };
    });
    await page.locator('#tnum-specimen').screenshot({ path: `${SHOTS}/tnum-18px.png` });
    check(tnum.size === 18, `tnum specimen at ${tnum.size} px`, results);
    check(Math.abs(tnum.t1 - tnum.t0) < 0.5 && Math.abs(tnum.tmix - tnum.t0) < 0.5, `Jost tnum: 1s ${tnum.t1.toFixed(1)} = 0s ${tnum.t0.toFixed(1)} = mixed ${tnum.tmix.toFixed(1)} px`, results);
    check(tnum.p0 - tnum.p1 > 2, `Jost proportional differs (1s ${tnum.p1.toFixed(1)} vs 0s ${tnum.p0.toFixed(1)} px), so tnum is really applied`, results);
    await page.evaluate(() => document.getElementById('tnum-specimen')?.remove());
  }

  const vmNow = await page.evaluate(() => window.__dep.vm());
  if (!vmNow) console.log(`note ${tag}: __dep.vm() is null (Phase 0 stub); Q extends smoke to new game → first turn in Phase 1`);

  check(errors.length === 0, `${tag}: no console errors or failed requests`, results);
  errors.length = 0;
  await browser.close();
}

finish(results, []);
