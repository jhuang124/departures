// R · Phase 0: usa.ts lat/lon → src/data/board.stub.json, so P, C and U can work before G's real solve.
//
//   npx tsx scripts/stub-board.ts            writes src/data/board.stub.json and prints a short report
//   npx tsx scripts/stub-board.ts --check    exits non-zero if the file on disk is stale
//
// The stub is deliberately plain (PLAN.md §4.4 is G's job):
//   - Albers conic (parallels 29.5°/45.5°, centre −96°), fitted uniformly to the 36 cities with margins
//   - straight lanes; doubles offset ±7 u from the pair's centreline
//   - every slot exactly 26 × 10 u, gap 3–8 u, city clearance 11–20 u where the chord allows; short lanes
//     (the Northeast, mostly) keep gap 3 and eat into the clearance; long ones (real geography is wider
//     than the printed map) stretch the gap past 8 u so their slots stay anchored to both cities. Both
//     kinds are listed in the report; G's solver (Bézier sag, nudges) replaces all of this
//   - no relief (z = 0, pitch = 0), no nudges, no warp; labels hang north of each disc
//
// The projection is written so it can be reproduced from the fields in BoardGeometry.projection alone:
//   n = (sin φ1 + sin φ2) / 2,  C = cos² φ1 + 2 n sin φ1,  ρ(φ) = √(C − 2 n sin φ) / n,  θ = n (λ − λ0)
//   X = ρ sin θ,  Y = −ρ cos θ      (origin at the cone's apex, so no reference latitude is needed)
//   x = translate[0] + scale · X,   y = translate[1] − scale · Y      (board y runs south)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CITIES, LANES, DOUBLE_GROUP } from '../src/engine/data/usa';
import {
  BOARD_H, BOARD_W, DISC_R, SLOT_H, SLOT_W,
  type BoardCity, type BoardGeometry, type BoardLane, type Slot, type Vec2,
} from '../src/data/boardTypes';
import type { CityId } from '../src/engine/types';

const OUT = fileURLToPath(new URL('../src/data/board.stub.json', import.meta.url));

const PARALLELS: [number, number] = [29.5, 45.5];
const CENTER_LON = -96;
/** Margins inside the 1000 × 620 board, in units: room for labels and discs at the edges. */
const MARGIN = { left: 60, right: 60, top: 50, bottom: 40 };
const GAP_MIN = 3;
const GAP_MAX = 8;
const CLEAR_MIN = 11;
const CLEAR_MAX = 20;
const DOUBLE_OFFSET = 7;
/** Hit polygons: slot union inflated by ~6 px at 1280 (≈ 1.10 px/u), and ≥ 28 px (≈ 25 u) across. */
const HIT_PAD = 5.5;
const HIT_MIN_HALF = 12.5;

const rad = (d: number) => (d * Math.PI) / 180;
const round = (v: number, dp = 3) => Math.round(v * 10 ** dp) / 10 ** dp;

function albersRaw(lat: number, lon: number): Vec2 {
  const [p1, p2] = PARALLELS.map(rad);
  const n = (Math.sin(p1) + Math.sin(p2)) / 2;
  const C = Math.cos(p1) ** 2 + 2 * n * Math.sin(p1);
  const rho = Math.sqrt(C - 2 * n * Math.sin(rad(lat))) / n;
  const theta = n * rad(lon - CENTER_LON);
  return [rho * Math.sin(theta), -rho * Math.cos(theta)];
}

// Fit: one uniform scale so the cities fill the board inside the margins, centred on the spare axis.
const raw = CITIES.map(c => albersRaw(c.lat, c.lon));
const minX = Math.min(...raw.map(p => p[0]));
const maxX = Math.max(...raw.map(p => p[0]));
const minY = Math.min(...raw.map(p => p[1]));
const maxY = Math.max(...raw.map(p => p[1]));
const innerW = BOARD_W - MARGIN.left - MARGIN.right;
const innerH = BOARD_H - MARGIN.top - MARGIN.bottom;
const scale = Math.min(innerW / (maxX - minX), innerH / (maxY - minY));
const padX = (innerW - scale * (maxX - minX)) / 2;
const padY = (innerH - scale * (maxY - minY)) / 2;
// x = tx + scale·X with minX → left edge; y = ty − scale·Y with maxY (north) → top edge
const translate: Vec2 = [MARGIN.left + padX - scale * minX, MARGIN.top + padY + scale * maxY];
const project = (lat: number, lon: number): Vec2 => {
  const [X, Y] = albersRaw(lat, lon);
  return [translate[0] + scale * X, translate[1] - scale * Y];
};

const pos = new Map<CityId, Vec2>(CITIES.map(c => [c.id, project(c.lat, c.lon)]));

const cities: BoardCity[] = CITIES.map(c => {
  const [x, y] = pos.get(c.id)!;
  return {
    id: c.id, name: c.name, x: round(x), y: round(y), z: 0,
    label: { x: round(x), y: round(y - DISC_R - 5), anchor: 'n' },
  };
});

const cramped: string[] = [];
const loose: string[] = [];

const lanes: BoardLane[] = LANES.map(l => {
  const [ax, ay] = pos.get(l.a)!;
  const [bx, by] = pos.get(l.b)!;
  const dx = bx - ax;
  const dy = by - ay;
  const chord = Math.hypot(dx, dy);
  const ux = dx / chord;
  const uy = dy / chord;
  // left-hand normal of a → b; lane "-1" of a double sits on −normal, "-2" on +normal
  const nx = -uy;
  const ny = ux;
  const group = DOUBLE_GROUP[l.id];
  const offset = group ? (l.id.endsWith('-1') ? -DOUBLE_OFFSET : DOUBLE_OFFSET) : 0;
  const ox = nx * offset;
  const oy = ny * offset;
  const p0: Vec2 = [ax + ox, ay + oy];
  const p1: Vec2 = [bx + ox, by + oy];

  // Spacing: clearance CLEAR_MIN with the gap in [GAP_MIN, GAP_MAX]; a long chord then widens the
  // clearance up to CLEAR_MAX, and past that (stub only) the gap stretches so slots stay anchored to
  // both cities. A short chord keeps GAP_MIN and eats the clearance.
  const n = l.length;
  let clearance: number;
  let gap = 0;
  if (n === 1) {
    clearance = (chord - SLOT_W) / 2;
  } else {
    gap = (chord - 2 * CLEAR_MIN - n * SLOT_W) / (n - 1);
    clearance = CLEAR_MIN;
    if (gap < GAP_MIN) {
      gap = GAP_MIN;
      clearance = (chord - n * SLOT_W - (n - 1) * gap) / 2;
    } else if (gap > GAP_MAX) {
      gap = GAP_MAX;
      clearance = (chord - n * SLOT_W - (n - 1) * gap) / 2;
      if (clearance > CLEAR_MAX) {
        clearance = CLEAR_MAX;
        gap = (chord - 2 * CLEAR_MAX - n * SLOT_W) / (n - 1);
        loose.push(`${l.id} (gap ${gap.toFixed(1)} u)`);
      }
    }
  }
  const run = n * SLOT_W + (n - 1) * gap;          // first slot's a-edge to last slot's b-edge
  if (clearance < CLEAR_MIN - 0.05) cramped.push(`${l.id} (clearance ${clearance.toFixed(1)} u)`);

  const yaw = Math.atan2(dy, dx);
  const slots: Slot[] = [];
  for (let k = 0; k < n; k++) {
    const t = clearance + SLOT_W / 2 + k * (SLOT_W + gap);  // distance from a along the chord
    slots.push({ x: round(p0[0] + ux * t), y: round(p0[1] + uy * t), z: 0, yaw: round(yaw, 5), pitch: 0 });
  }

  // Hit polygon: a rectangle over the slot run, inflated; a double's half stops at the pair's centreline.
  const s0 = clearance - HIT_PAD;
  const s1 = clearance + run + HIT_PAD;
  const half = Math.max(SLOT_H / 2 + HIT_PAD, HIT_MIN_HALF);
  const [lo, hi] = offset === 0 ? [-half, half] : offset < 0 ? [offset - half, 0] : [0, offset + half];
  // offsets lo/hi are measured along +normal from the pair's centreline (a → b through the city centres)
  const corner = (s: number, w: number): Vec2 => [round(ax + ux * s + nx * w), round(ay + uy * s + ny * w)];
  const hit: Vec2[] = [corner(s0, lo), corner(s1, lo), corner(s1, hi), corner(s0, hi)];

  const lane: BoardLane = {
    id: l.id, a: l.a, b: l.b, length: l.length, color: l.color, offset,
    path: { kind: 'line', p0: [round(p0[0]), round(p0[1])], p1: [round(p1[0]), round(p1[1])] },
    slots, hit,
  };
  if (l.sibling) lane.sibling = l.sibling;
  return lane;
});

const board: BoardGeometry = {
  v: 1,
  stub: true,
  width: BOARD_W,
  height: BOARD_H,
  slot: { w: SLOT_W, h: SLOT_H },
  discR: DISC_R,
  projection: {
    kind: 'albers', parallels: PARALLELS, centerLon: CENTER_LON,
    scale: round(scale, 6), translate: [round(translate[0], 6), round(translate[1], 6)],
  },
  cities,
  lanes,
};

// Self-checks: the stub must agree with usa.ts and sit on the board.
const problems: string[] = [];
if (cities.length !== 36) problems.push(`cities ${cities.length} ≠ 36`);
if (lanes.length !== 100) problems.push(`lanes ${lanes.length} ≠ 100`);
for (const l of lanes) {
  if (l.slots.length !== l.length) problems.push(`${l.id}: ${l.slots.length} slots for length ${l.length}`);
  for (const s of l.slots) {
    if (!(s.x > 0 && s.x < BOARD_W && s.y > 0 && s.y < BOARD_H)) problems.push(`${l.id}: slot off board at ${s.x},${s.y}`);
  }
  // uniform slots: consecutive centres at least one slot width apart
  for (let k = 1; k < l.slots.length; k++) {
    const d = Math.hypot(l.slots[k].x - l.slots[k - 1].x, l.slots[k].y - l.slots[k - 1].y);
    if (d < SLOT_W + GAP_MIN - 0.01) problems.push(`${l.id}: slots ${k - 1}/${k} only ${d.toFixed(2)} u apart`);
  }
}
for (const c of cities) {
  if (!(c.x >= MARGIN.left - 0.01 && c.x <= BOARD_W - MARGIN.right + 0.01 && c.y >= MARGIN.top - 0.01 && c.y <= BOARD_H - MARGIN.bottom + 0.01)) {
    problems.push(`${c.id}: outside the margins at ${c.x},${c.y}`);
  }
}
if (problems.length) {
  console.error(`stub-board: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

const json = `${JSON.stringify(board, null, 1)}\n`;
if (process.argv.includes('--check')) {
  let onDisk = '';
  try { onDisk = readFileSync(OUT, 'utf8'); } catch { /* missing */ }
  if (onDisk !== json) {
    console.error('stub-board: src/data/board.stub.json is stale; run npx tsx scripts/stub-board.ts');
    process.exit(1);
  }
  console.log('stub-board: src/data/board.stub.json is current');
} else {
  writeFileSync(OUT, json);
  const fill = (ext: number[]) => `${(ext[1] - ext[0]).toFixed(0)}`;
  console.log(`stub-board: wrote src/data/board.stub.json (${(json.length / 1024).toFixed(0)} KB)`);
  console.log(`  36 cities, 100 lanes, ${lanes.reduce((n, l) => n + l.slots.length, 0)} slots of ${SLOT_W} × ${SLOT_H} u`);
  console.log(`  scale ${scale.toFixed(2)} u per unit sphere; city box ${fill([Math.min(...cities.map(c => c.x)), Math.max(...cities.map(c => c.x))])} × ${fill([Math.min(...cities.map(c => c.y)), Math.max(...cities.map(c => c.y))])} u`);
  console.log(`  ${cramped.length} lane(s) shorter than the slot run needs (clearance < ${CLEAR_MIN} u; G's Bézier solver fixes these):`);
  for (const c of cramped) console.log(`    ${c}`);
  console.log(`  ${loose.length} lane(s) longer than the slot run (gap stretched past ${GAP_MAX} u to stay anchored; G's nudges fix these):`);
  console.log(`    ${loose.join(', ')}`);
}
