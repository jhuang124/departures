// usa.ts equals docs/RULES.md Appendices A–C, row for row, plus the aggregates in PLAN.md §6.
// The appendices are parsed from RULES.md at test time, so the doc is the pin and the data follows it.
// A second block diffs usa.ts against the vendored Iron Atlas data (the port's source): any row that
// differs must be listed in IRON_ATLAS_CORRECTIONS with its reason, and in RULES.md §Differences.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  CITIES, CITY_BY_ID, DECK_COMPOSITION, DECK_SIZE, DOUBLE_GROUP, LANES, LANE_BY_ID, LANES_AT,
  ROUTE_POINTS, TICKETS, TICKET_BY_ID, TRAINS_PER_SEAT, LONGEST_BONUS,
} from '../../src/engine/data/usa';
import { CARD_COLORS, LANE_COLORS } from '../../src/engine/types';
import type { Lane, LaneColor } from '../../src/engine/types';
import { IA_CITIES, IA_ROUTES, IA_TICKETS, IA_SCORE_BY_LENGTH } from '../fixtures/iron-atlas';

const RULES = readFileSync(fileURLToPath(new URL('../../docs/RULES.md', import.meta.url)), 'utf8');

/** The markdown table rows under a `## heading`, as trimmed cells, header and rule rows dropped. */
function tableUnder(heading: string): string[][] {
  const start = RULES.indexOf(`\n## ${heading}`);
  if (start < 0) throw new Error(`RULES.md has no "## ${heading}" section`);
  const next = RULES.indexOf('\n## ', start + 4);
  const body = RULES.slice(start, next < 0 ? undefined : next);
  const rows = body.split('\n').filter(l => l.trim().startsWith('|'))
    .map(l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
  return rows.slice(2); // header + |---|
}
const unTick = (s: string) => s.replace(/^`|`$/g, '');
const noneMark = (s: string) => (s === '—' || s === '-' || s === '' ? undefined : unTick(s));

// ---------------------------------------------------------------------------
// Appendix C · Cities
// ---------------------------------------------------------------------------

const appendixC = tableUnder('Appendix C · Cities (36)').map(([id, name]) => ({ id: unTick(id), name }));
const idByName = new Map(appendixC.map(c => [c.name, c.id]));

describe('Appendix C · cities', () => {
  it('RULES.md lists 36 cities', () => {
    expect(appendixC).toHaveLength(36);
  });

  it('usa.ts has the same 36 cities, same ids, same names, same order', () => {
    expect(CITIES.map(c => ({ id: c.id, name: c.name }))).toEqual(appendixC);
  });

  it('city ids are unique and CITY_BY_ID finds every one', () => {
    expect(new Set(CITIES.map(c => c.id)).size).toBe(36);
    for (const c of CITIES) expect(CITY_BY_ID.get(c.id)).toBe(c);
  });

  it('every city has a real lat/lon inside the board box (southern Canada to Miami, Pacific to Atlantic)', () => {
    for (const c of CITIES) {
      expect(c.lat, c.id).toBeGreaterThan(25);
      expect(c.lat, c.id).toBeLessThan(52);
      expect(c.lon, c.id).toBeGreaterThan(-125);
      expect(c.lon, c.id).toBeLessThan(-70);
    }
  });

  it('lat/lon keep the map\'s neighbourly order (spot checks against geography)', () => {
    const at = (id: string) => CITY_BY_ID.get(id as never)!;
    // west to east
    expect(at('seattle').lon).toBeLessThan(at('helena').lon);
    expect(at('helena').lon).toBeLessThan(at('duluth').lon);
    expect(at('duluth').lon).toBeLessThan(at('sault-ste-marie').lon);
    expect(at('pittsburgh').lon).toBeLessThan(at('new-york').lon);
    expect(at('new-york').lon).toBeLessThan(at('boston').lon);
    // north to south
    expect(at('calgary').lat).toBeGreaterThan(at('helena').lat);
    expect(at('denver').lat).toBeGreaterThan(at('santa-fe').lat);
    expect(at('santa-fe').lat).toBeGreaterThan(at('el-paso').lat);
    expect(at('atlanta').lat).toBeGreaterThan(at('miami').lat);
    // Miami is the southernmost city, Calgary the northernmost
    expect(Math.min(...CITIES.map(c => c.lat))).toBe(at('miami').lat);
    expect(Math.max(...CITIES.map(c => c.lat))).toBe(at('calgary').lat);
  });
});

// ---------------------------------------------------------------------------
// Appendix A · Lanes
// ---------------------------------------------------------------------------

interface LaneRow { n: number; id: string; a: string; b: string; length: number; color: string; double?: string }
const appendixA: LaneRow[] = tableUnder('Appendix A · Lanes (100)').map(([n, id, a, b, len, color, dbl]) => {
  const aId = idByName.get(a);
  const bId = idByName.get(b);
  if (!aId || !bId) throw new Error(`Appendix A row ${n}: unknown city "${aId ? b : a}"`);
  return { n: Number(n), id: unTick(id), a: aId, b: bId, length: Number(len), color, double: noneMark(dbl) };
});

describe('Appendix A · lanes', () => {
  it('RULES.md lists 100 lanes numbered 1–100', () => {
    expect(appendixA.map(r => r.n)).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
  });

  it('usa.ts has 100 lanes', () => {
    expect(LANES).toHaveLength(100);
  });

  for (const r of appendixA) {
    it(`row ${r.n}: ${r.id} = ${r.a}–${r.b}, ${r.length}, ${r.color}${r.double ? `, double ${r.double}` : ''}`, () => {
      const lane = LANES[r.n - 1];
      expect({ id: lane.id, a: lane.a, b: lane.b, length: lane.length, color: lane.color, double: DOUBLE_GROUP[lane.id] })
        .toEqual({ id: r.id, a: r.a, b: r.b, length: r.length, color: r.color, double: r.double });
    });
  }

  it('lane ids are unique and LANE_BY_ID finds every one', () => {
    expect(new Set(LANES.map(l => l.id)).size).toBe(100);
    for (const l of LANES) expect(LANE_BY_ID.get(l.id)).toBe(l);
  });

  it('every lane joins two different known cities', () => {
    for (const l of LANES) {
      expect(CITY_BY_ID.has(l.a), l.id).toBe(true);
      expect(CITY_BY_ID.has(l.b), l.id).toBe(true);
      expect(l.a, l.id).not.toBe(l.b);
    }
  });

  it('every colour is a LaneColor', () => {
    for (const l of LANES) expect(LANE_COLORS).toContain(l.color);
  });

  it('doubles: each group has exactly two lanes, same endpoints, same length, and they name each other as siblings', () => {
    const groups = new Map<string, Lane[]>();
    for (const l of LANES) {
      const g = DOUBLE_GROUP[l.id];
      if (g) groups.set(g, [...(groups.get(g) ?? []), l]);
      else expect(l.sibling, l.id).toBeUndefined();
    }
    for (const [g, pair] of groups) {
      expect(pair, g).toHaveLength(2);
      const [x, y] = pair;
      expect(x.sibling, g).toBe(y.id);
      expect(y.sibling, g).toBe(x.id);
      expect([x.a, x.b], g).toEqual([y.a, y.b]);
      expect(x.length, g).toBe(y.length);
      expect(g).toBe(`${x.a}-${x.b}`);
    }
  });

  it('only doubles share a city pair: 78 pairs in all', () => {
    const pairs = new Map<string, Lane[]>();
    for (const l of LANES) {
      const k = [l.a, l.b].sort().join('|');
      pairs.set(k, [...(pairs.get(k) ?? []), l]);
    }
    expect(pairs.size).toBe(78);
    for (const [k, ls] of pairs) {
      if (ls.length > 1) expect(ls.every(l => l.sibling), k).toBe(true);
    }
  });

  it('LANES_AT lists every lane at both of its cities', () => {
    let total = 0;
    for (const c of CITIES) total += LANES_AT.get(c.id)!.length;
    expect(total).toBe(200);
    for (const l of LANES) {
      expect(LANES_AT.get(l.a)).toContain(l);
      expect(LANES_AT.get(l.b)).toContain(l);
    }
  });

  it('the board is one connected network', () => {
    const seen = new Set([CITIES[0].id]);
    const queue = [CITIES[0].id];
    while (queue.length) {
      const c = queue.shift()!;
      for (const l of LANES_AT.get(c)!) {
        const o = l.a === c ? l.b : l.a;
        if (!seen.has(o)) { seen.add(o); queue.push(o); }
      }
    }
    expect(seen.size).toBe(36);
  });

  it('the moment\'s lane: Helena–Duluth is orange, length 6, single', () => {
    const l = LANE_BY_ID.get('helena-duluth' as never)!;
    expect([l.a, l.b, l.length, l.color, l.sibling]).toEqual(['helena', 'duluth', 6, 'orange', undefined]);
  });
});

// ---------------------------------------------------------------------------
// Appendix B · Tickets
// ---------------------------------------------------------------------------

const appendixB = tableUnder('Appendix B · Destination tickets (30)').map(([n, id, from, to, pts]) => {
  const a = idByName.get(from);
  const b = idByName.get(to);
  if (!a || !b) throw new Error(`Appendix B row ${n}: unknown city "${a ? to : from}"`);
  return { n: Number(n), id: unTick(id), a, b, points: Number(pts) };
});

describe('Appendix B · tickets', () => {
  it('RULES.md lists 30 tickets numbered 1–30', () => {
    expect(appendixB.map(r => r.n)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });

  it('usa.ts has 30 tickets', () => {
    expect(TICKETS).toHaveLength(30);
  });

  for (const r of appendixB) {
    it(`row ${r.n}: ${r.id} = ${r.a}–${r.b}, ${r.points}`, () => {
      const t = TICKETS[r.n - 1];
      expect({ id: t.id, a: t.a, b: t.b, points: t.points }).toEqual({ id: r.id, a: r.a, b: r.b, points: r.points });
    });
  }

  it('ticket ids are unique, TICKET_BY_ID finds every one, and no two tickets join the same pair', () => {
    expect(new Set(TICKETS.map(t => t.id)).size).toBe(30);
    expect(new Set(TICKETS.map(t => [t.a, t.b].sort().join('|'))).size).toBe(30);
    for (const t of TICKETS) expect(TICKET_BY_ID.get(t.id)).toBe(t);
  });

  it('no ticket joins two cities that one lane already joins', () => {
    for (const t of TICKETS) {
      expect(LANES.some(l => (l.a === t.a && l.b === t.b) || (l.a === t.b && l.b === t.a)), t.id).toBe(false);
    }
  });

  it('the moment\'s tickets: Duluth–El Paso is 10, Duluth–Houston is 8, and there is no Helena–Duluth ticket', () => {
    expect(TICKET_BY_ID.get('duluth-el-paso' as never)?.points).toBe(10);
    expect(TICKET_BY_ID.get('duluth-houston' as never)?.points).toBe(8);
    expect(TICKETS.some(t => [t.a, t.b].sort().join('|') === 'duluth|helena')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Aggregates (PLAN.md §6; RULES.md §Components)
// ---------------------------------------------------------------------------

describe('aggregates', () => {
  const colours: LaneColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white'];
  const lanesOf = (c: LaneColor) => LANES.filter(l => l.color === c);
  const spaces = (ls: readonly Lane[]) => ls.reduce((n, l) => n + l.length, 0);

  it('36 cities, 100 lanes, 78 pairs, 22 doubles, 309 spaces', () => {
    expect(CITIES.length).toBe(36);
    expect(LANES.length).toBe(100);
    expect(new Set(LANES.map(l => [l.a, l.b].sort().join('|'))).size).toBe(78);
    expect(new Set(Object.values(DOUBLE_GROUP)).size).toBe(22);
    expect(Object.keys(DOUBLE_GROUP).length).toBe(44);
    expect(spaces(LANES)).toBe(309);
  });

  it('44 gray lanes over 93 spaces', () => {
    expect(lanesOf('gray').length).toBe(44);
    expect(spaces(lanesOf('gray'))).toBe(93);
  });

  for (const c of colours) {
    it(`${c}: 7 lanes, 27 spaces`, () => {
      expect(lanesOf(c).length).toBe(7);
      expect(spaces(lanesOf(c))).toBe(27);
    });
  }

  it('lanes by length 1–6 = 9 / 36 / 20 / 16 / 10 / 9', () => {
    const byLen = [1, 2, 3, 4, 5, 6].map(n => LANES.filter(l => l.length === n).length);
    expect(byLen).toEqual([9, 36, 20, 16, 10, 9]);
  });

  it('30 tickets totalling 349 points, each worth 4–22', () => {
    expect(TICKETS.reduce((n, t) => n + t.points, 0)).toBe(349);
    expect(Math.min(...TICKETS.map(t => t.points))).toBe(4);
    expect(Math.max(...TICKETS.map(t => t.points))).toBe(22);
  });

  it('a 110-card deck: 12 of each of the 8 colours plus 14 locomotives', () => {
    expect(Object.keys(DECK_COMPOSITION).sort()).toEqual([...CARD_COLORS].sort());
    for (const c of colours) expect(DECK_COMPOSITION[c as keyof typeof DECK_COMPOSITION]).toBe(12);
    expect(DECK_COMPOSITION.loco).toBe(14);
    expect(DECK_SIZE).toBe(110);
  });

  it('route points by length match the RULES.md table: 1, 2, 4, 7, 10, 15', () => {
    const table = RULES.match(/\| Length \| ([^\n]+)\n\s*\|[^\n]+\n\s*\| Points \| ([^\n]+)/);
    expect(table, 'RULES.md route scoring table').not.toBeNull();
    const lengths = table![1].split('|').map(s => s.trim()).filter(Boolean).map(Number);
    const points = table![2].split('|').map(s => s.trim()).filter(Boolean).map(Number);
    expect(lengths).toEqual([1, 2, 3, 4, 5, 6]);
    expect(lengths.map(l => ROUTE_POINTS[l])).toEqual(points);
    expect(points).toEqual([1, 2, 4, 7, 10, 15]);
  });

  it('45 trains per seat and a 10-point longest path bonus', () => {
    expect(TRAINS_PER_SEAT).toBe(45);
    expect(LONGEST_BONUS).toBe(10);
  });

  it('RULES.md §Components states the same numbers', () => {
    expect(RULES).toMatch(/\| Cities \| 36 \|/);
    expect(RULES).toMatch(/\| Routes \| 78 city pairs, 100 lanes \(22 pairs are doubles\) \|/);
    expect(RULES).toMatch(/\| Route spaces \| 309 \| 93 gray; 27 per colour \|/);
    expect(RULES).toMatch(/1: 9 · 2: 36 · 3: 20 · 4: 16 · 5: 10 · 6: 9/);
    expect(RULES).toMatch(/\| Lanes by colour \| gray 44; each of the 8 colours 7 \|/);
    expect(RULES).toMatch(/\| Train cards \| 110 = 12 × 8 colours \+ 14 locomotives \|/);
    expect(RULES).toMatch(/\| Destination tickets \| 30, totalling 349 points \(4–22\) \|/);
    expect(RULES).toMatch(/\| Trains per player \| 45 \|/);
  });
});

// ---------------------------------------------------------------------------
// The port: usa.ts against its source, the vendored Iron Atlas data.ts
// ---------------------------------------------------------------------------

/**
 * Rows where usa.ts deliberately differs from Iron Atlas, each with its reason (and a matching line in
 * RULES.md §Differences). Empty: the 2015 physical board and Iron Atlas agree on every row.
 */
const IRON_ATLAS_CORRECTIONS: Record<string, string> = {};

describe('the port from Iron Atlas', () => {
  it('cities: same ids, names and order (Iron Atlas has map x/y; we have lat/lon)', () => {
    expect(CITIES.map(c => [c.id, c.name])).toEqual(IA_CITIES.map(c => [c.id, c.name]));
  });

  it('lanes: every row equals Iron Atlas except the listed corrections', () => {
    const differs: string[] = [];
    expect(IA_ROUTES).toHaveLength(LANES.length);
    IA_ROUTES.forEach((r, i) => {
      const l = LANES[i];
      const ours = [l.id, l.a, l.b, l.length, l.color, DOUBLE_GROUP[l.id]];
      const theirs = [r.id, r.from, r.to, r.length, r.color, r.parallelGroup];
      if (JSON.stringify(ours) !== JSON.stringify(theirs)) differs.push(r.id);
    });
    expect(differs.sort()).toEqual(Object.keys(IRON_ATLAS_CORRECTIONS).filter(k => LANE_BY_ID.has(k as never)).sort());
  });

  it('tickets: every row equals Iron Atlas except the listed corrections', () => {
    const differs: string[] = [];
    expect(IA_TICKETS).toHaveLength(TICKETS.length);
    IA_TICKETS.forEach((t, i) => {
      const o = TICKETS[i];
      if (JSON.stringify([o.id, o.a, o.b, o.points]) !== JSON.stringify([t.id, t.from, t.to, t.points])) differs.push(t.id);
    });
    expect(differs.sort()).toEqual(Object.keys(IRON_ATLAS_CORRECTIONS).filter(k => TICKET_BY_ID.has(k as never)).sort());
  });

  it('route points equal Iron Atlas SCORE_BY_LENGTH', () => {
    expect([...ROUTE_POINTS]).toEqual([...IA_SCORE_BY_LENGTH]);
  });
});

// ---------------------------------------------------------------------------
// R's stub board (scripts/stub-board.ts → src/data/board.stub.json) stays in step with usa.ts
// ---------------------------------------------------------------------------

describe('board.stub.json agrees with usa.ts (if not: npx tsx scripts/stub-board.ts)', () => {
  const stub = JSON.parse(readFileSync(fileURLToPath(new URL('../../src/data/board.stub.json', import.meta.url)), 'utf8'));

  it('is marked as the stub and has 36 cities and 100 lanes in usa.ts order', () => {
    expect(stub.stub).toBe(true);
    expect(stub.cities.map((c: { id: string; name: string }) => [c.id, c.name])).toEqual(CITIES.map(c => [c.id, c.name]));
    expect(stub.lanes.map((l: { id: string }) => l.id)).toEqual(LANES.map(l => l.id));
  });

  it('every lane carries usa.ts\'s endpoints, length, colour and sibling, and exactly `length` 26 × 10 slots', () => {
    expect(stub.slot).toEqual({ w: 26, h: 10 });
    LANES.forEach((l, i) => {
      const s = stub.lanes[i];
      expect([s.a, s.b, s.length, s.color, s.sibling], l.id).toEqual([l.a, l.b, l.length, l.color, l.sibling]);
      expect(s.slots, l.id).toHaveLength(l.length);
    });
  });
});
