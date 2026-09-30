// Phase 0 stub (F). The lead owns this file from Phase 1 and wires controller + board + UI + audio here.
//
// What the stub does: draws the frame at the §5.2 sizes (dark border, seat strip, siding, dock with its hand
// and title tiers) with DEPARTURES in the title tier, lays a flat plate in the board region, and, when R's
// src/data/board.stub.json exists, prints its cities and slots on it so the stub board can be seen loading.
// In dev and VITE_E2E builds it installs window.__dep (src/game/hooks.ts).

import './shared/fonts.css';
import type { BoardGeometry } from './data/boardTypes';
import { CREAM, FRAME, GOLD, INK, LAND, ROUTE_HUES } from './shared/palette';

const STYLE = `
  :root { color-scheme: dark; }
  body { background: ${FRAME}; color: ${CREAM}; font-family: var(--font-text); }
  .frame { position: fixed; inset: 0; background: ${FRAME};
    --top: 44px; --right: 164px; --bottom: 120px; --left: 16px; --hand: 48px; --title: 72px; --title-size: 36px; }
  @media (min-width: 1900px) and (min-height: 1000px) {
    .frame { --top: 60px; --right: 236px; --bottom: 172px; --left: 24px; --hand: 68px; --title: 104px; --title-size: 50px; }
  }
  .seat-strip { position: absolute; left: 0; right: 0; top: 0; height: var(--top); }
  .siding { position: absolute; top: var(--top); right: 0; width: var(--right); bottom: var(--bottom); }
  .board { position: absolute; top: var(--top); left: var(--left); right: var(--right); bottom: var(--bottom);
    background: ${LAND.plains}; overflow: hidden; }
  .board svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .dock { position: absolute; left: 0; right: 0; bottom: 0; height: var(--bottom); }
  .hand-tier { position: absolute; left: 0; right: 0; top: 0; height: var(--hand); }
  .title-tier { position: absolute; left: 0; right: 0; bottom: 0; height: var(--title);
    display: flex; align-items: center; padding-left: calc(var(--left) + 8px); }
  .place { font-family: var(--font-caps); font-weight: 600; font-size: var(--title-size); line-height: 1;
    letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; white-space: nowrap; }
`;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, region?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  e.className = cls;
  if (region) e.dataset.region = region;
  return e;
}

/** R's stub board, if it has landed (import.meta.glob tolerates the file not existing yet). */
function stubBoard(): BoardGeometry | null {
  const found = import.meta.glob<BoardGeometry>('./data/board.stub.json', { eager: true, import: 'default' });
  return Object.values(found)[0] ?? null;
}

function printStub(svgHost: HTMLElement, board: BoardGeometry): void {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${board.width ?? 1000} ${board.height ?? 620}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.dataset.stub = 'board';
  const sw = board.slot?.w ?? 26;
  const sh = board.slot?.h ?? 10;
  for (const lane of board.lanes ?? []) {
    const hue = ROUTE_HUES[lane.color] ?? ROUTE_HUES.gray;
    for (const s of lane.slots ?? []) {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', String(-sw / 2));
      r.setAttribute('y', String(-sh / 2));
      r.setAttribute('width', String(sw));
      r.setAttribute('height', String(sh));
      r.setAttribute('rx', '2');
      r.setAttribute('transform', `translate(${s.x} ${s.y}) rotate(${(s.yaw * 180) / Math.PI})`);
      r.setAttribute('fill', hue.outline);
      r.setAttribute('fill-opacity', String(hue.tint));
      r.setAttribute('stroke', hue.outline);
      r.setAttribute('stroke-width', '2');
      r.dataset.lane = lane.id;
      svg.append(r);
    }
  }
  for (const c of board.cities ?? []) {
    const d = document.createElementNS(NS, 'circle');
    d.setAttribute('cx', String(c.x));
    d.setAttribute('cy', String(c.y));
    d.setAttribute('r', String(board.discR ?? 7));
    d.setAttribute('fill', CREAM);
    d.setAttribute('stroke', INK);
    d.setAttribute('stroke-width', '2');
    d.dataset.city = c.id;
    svg.append(d);
  }
  svgHost.append(svg);
}

async function boot(): Promise<void> {
  const style = document.createElement('style');
  style.textContent = STYLE;
  document.head.append(style);

  const app = document.getElementById('app')!;
  const frame = el('div', 'frame', 'frame');
  const board = el('main', 'board', 'board');
  const dock = el('footer', 'dock', 'dock');
  const hand = el('div', 'hand-tier', 'hand');
  const titleTier = el('div', 'title-tier', 'title');
  const place = el('div', 'place');
  place.dataset.testid = 'place';
  place.textContent = 'DEPARTURES';
  titleTier.append(place);
  dock.append(hand, titleTier);
  frame.append(el('header', 'seat-strip', 'top'), board, el('aside', 'siding', 'right'), dock);
  app.append(frame);

  const geo = stubBoard();
  if (geo) printStub(board, geo);

  await document.fonts.ready;

  if (import.meta.env.DEV || import.meta.env.VITE_E2E) {
    const { installHooks } = await import('./game/hooks');
    const hooks = installHooks({ build: geo ? 'phase0-stub+board' : 'phase0-stub' });
    hooks.ready = true;
  }
}

void boot();
