// Shared Playwright helpers for the e2e flows (War Table's pattern, adapted). `npm run test:e2e` builds the
// game (VITE_E2E=1), serves it under /departures/ like GitHub Pages, and runs every flow against the real
// board and real UI; lanes, speeds and the quick tier live in tests/e2e/lanes.ts.
// Run one flow by hand against your own dev server:
//   npx vite --host 127.0.0.1 --port <p> --strictPort &   DEP_URL=http://127.0.0.1:<p>/ npx tsx tests/e2e/<flow>.e2e.ts
// DEP_URL is the page to open (default the lead's dev server); DEP_QUERY adds URL flags (e.g. '?still=1');
// E2E_SPEED=instant|real overrides the flow's lane speed. Always muted (GPU_ARGS).
// Owned by F in Phase 0, by Q from Phase 1.

import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { mkdirSync } from 'node:fs';
import { basename } from 'node:path';
import { speedOf, type Speed } from './lanes';

export const BASE = process.env.DEP_URL ?? 'http://127.0.0.1:5390/';
export const Q = process.env.DEP_QUERY ?? '';
export const ART = 'artifacts/e2e';
mkdirSync(ART, { recursive: true });

/** = CLAUDE.md's launch flags; always muted. */
export const GPU_ARGS = ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--mute-audio'];

export const SETTINGS_KEY = 'departures.settings.v1';
export const SAVE_KEY = 'departures.save.v1';
export const SEATS_KEY = 'departures.seats.v1';

/** The speed this flow runs at: from the runner (E2E_SPEED), else looked up in lanes.ts by file name. */
export const SPEED: Speed = (() => {
  const env = process.env.E2E_SPEED;
  if (env === 'instant' || env === 'real') return env;
  if (env) throw new Error(`E2E_SPEED must be instant or real (got ${env})`);
  return speedOf(basename(process.argv[1] ?? '').replace(/\.e2e\.ts$/, ''));
})();

export interface Ctx {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  errors: string[];
}

/** The runner's shared browser for this worker (E2E_WS), else a fresh launch (by hand, and the timing lane). */
export async function launchBrowser(): Promise<Browser> {
  const ws = process.env.E2E_WS;
  return ws ? chromium.connect(ws) : chromium.launch({ args: GPU_ARGS });
}

// Instant speed, pinned in the page before the game boots: every load starts with speed 0 and AI 'instant'
// in the saved settings (other settings kept), and __dep.speed()/__dep.ai() calls are held at instant until
// realtime() sets the tab's opt-out flag.
const PIN = `(() => {
  const REAL = 'departures.e2e.realtime';
  try { if (sessionStorage.getItem(REAL)) return; } catch { return; }
  try {
    const k = '${SETTINGS_KEY}';
    const s = JSON.parse(localStorage.getItem(k) || 'null') || {};
    localStorage.setItem(k, JSON.stringify({ ...s, speed: 0, aiSpeed: 'instant' }));
  } catch {}
  let hooks;
  Object.defineProperty(window, '__dep', {
    configurable: true,
    enumerable: true,
    get: () => hooks,
    set: (h) => {
      if (h && !h.__real) {
        const real = { speed: h.speed, ai: h.ai };
        h.__real = real;
        h.speed = (v) => (sessionStorage.getItem(REAL) ? real.speed(v) : real.speed(0));
        h.ai = (v) => (sessionStorage.getItem(REAL) ? real.ai(v) : real.ai('instant'));
      }
      hooks = h;
    },
  });
})()`;

let saidSpeed = false;
/** Every flow's browser context: the tsx __name shim, and the lane's speed pin. */
export async function prepareContext(context: BrowserContext): Promise<void> {
  // tsx (esbuild keepNames) wraps named functions inside page.evaluate callbacks in __name().
  await context.addInitScript('window.__name = (f) => f');
  if (SPEED !== 'instant') return;
  await context.addInitScript(PIN);
  if (!saidSpeed) console.log('(instant speed: a logic-lane flow, tests/e2e/lanes.ts; E2E_SPEED=real runs it at 1x)');
  saidSpeed = true;
}

/** Real speed (1×, AI watch) for the rest of this page's life, reloads included. */
export async function realtime(page: Page): Promise<void> {
  if (SPEED !== 'instant') return;
  await page.evaluate(() => {
    sessionStorage.setItem('departures.e2e.realtime', '1');
    const real = (window.__dep as unknown as { __real?: { speed(v: number): void; ai(v: string): void } }).__real;
    real?.speed(1);
    real?.ai('watch');
  });
}

export const SIZES = {
  laptop: { width: 1280, height: 800 },
  tv: { width: 1920, height: 1080 },
} as const;

export async function open(query = Q, viewport: { width: number; height: number } = SIZES.laptop, deviceScaleFactor = 1): Promise<Ctx> {
  const browser = await launchBrowser();
  const context = await browser.newContext({ viewport, deviceScaleFactor });
  await prepareContext(context);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`);
  });
  await page.goto(BASE + query);
  await waitReady(page);
  return { browser, context, page, errors };
}

export async function waitReady(page: Page, timeout = 20000): Promise<void> {
  await page.waitForFunction(() => !!(window as unknown as { __dep?: { ready?: boolean } }).__dep?.ready, null, { timeout });
}

export async function clearStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

export async function reload(page: Page): Promise<void> {
  await page.reload();
  await waitReady(page);
}

export async function clickBtn(page: Page, testid: string): Promise<void> {
  await page.locator(`[data-testid="${testid}"]`).first().click();
}

export async function vm(page: Page) {
  return page.evaluate(() => window.__dep.vm());
}

export async function state(page: Page) {
  return page.evaluate(() => window.__dep.state());
}

export async function idle(page: Page, ms = 20000): Promise<void> {
  await page.evaluate((t) => window.__dep.waitIdle(t), ms);
}

/** A region's CSS-px box, by data-region (frame, top, right, board, dock, hand, title). */
export async function region(page: Page, name: string): Promise<{ x: number; y: number; width: number; height: number } | null> {
  return page.locator(`[data-region="${name}"]`).first().boundingBox();
}

export function check(cond: unknown, msg: string, results: string[]): void {
  const line = `${cond ? 'PASS' : 'FAIL'} ${msg}`;
  results.push(line);
  console.log(line);
}

export function finish(results: string[], errors: string[]): never {
  const fails = results.filter((r) => r.startsWith('FAIL'));
  if (errors.length) console.log('Console errors:\n  ' + errors.join('\n  '));
  console.log(`\n${results.length - fails.length}/${results.length} passed, ${errors.length} console errors`);
  process.exit(fails.length || errors.length ? 1 : 0);
}
