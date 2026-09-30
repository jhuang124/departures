// Module boundaries (PLAN.md §2.3), enforced by scanning every import path under src/:
//
//   engine → engine only            ai     → engine
//   game   → engine, ai, render/BoardView (type), audio/types (type), shared
//   render → engine/types (type), engine/data, game/timing, data, shared, audio/types (type)
//   ui     → game/viewModel (type), shared, audio/types (type)
//   audio  → shared                 main   → everything
//
// Plus what the table implies for the contract leaves: shared and data may import engine/types (type) only;
// game may import data/boardTypes (type), the geometry BoardView.mount() takes. Nothing in src/ may import
// tests/ or scripts/ (the vendored Iron Atlas oracle is dev-only), and the engine stays pure (no DOM, no
// Date.now, no Math.random). Bare package imports: render may use three; nothing else in src/ but main.
// Owned by F.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../..');
const SRC = join(ROOT, 'src');

export interface Imp {
  spec: string;
  typeOnly: boolean;
}

/** Every import / export-from / dynamic import in a source file, with whether it is type-only. */
export function importsOf(code: string): Imp[] {
  const src = stripComments(code);
  const out: Imp[] = [];
  const stmt = /(?:^|[;\n])\s*(import|export)\s+(type\s+)?([\s\S]*?)\s*from\s*['"]([^'"]+)['"]/g;
  for (let m = stmt.exec(src); m; m = stmt.exec(src)) {
    const clause = m[3];
    if (m[1] === 'export' && !/^[{*]/.test(clause.replace(/^type\s+/, ''))) continue;
    const named = /^\{([\s\S]*)\}$/.exec(clause.trim());
    const allTypeNamed = !!named && named[1].split(',').map((x) => x.trim()).filter(Boolean).every((x) => x.startsWith('type '));
    out.push({ spec: m[4], typeOnly: !!m[2] || allTypeNamed });
  }
  const side = /(?:^|[;\n])\s*import\s*['"]([^'"]+)['"]/g;
  for (let m = side.exec(src); m; m = side.exec(src)) out.push({ spec: m[1], typeOnly: false });
  const dyn = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (let m = dyn.exec(src); m; m = dyn.exec(src)) out.push({ spec: m[1], typeOnly: false });
  const glob = /\bimport\.meta\.glob\s*(?:<[^>]*>)?\s*\(\s*['"]([^'"]+)['"]/g;
  for (let m = glob.exec(src); m; m = glob.exec(src)) out.push({ spec: m[1], typeOnly: false });
  return out;
}

function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
}

/** 'engine' | 'engine/types' | 'engine/data' | 'game/timing' | 'render/BoardView' | ... | 'main' | 'outside' */
export function moduleOf(absPath: string): string {
  const rel = relative(SRC, absPath).split(sep).join('/');
  if (rel.startsWith('..')) return 'outside';
  const noExt = rel.replace(/\.(ts|json|css)$/, '');
  if (noExt === 'main' || noExt === 'vite-env.d') return 'main';
  return noExt;
}

type Rule = (target: string, typeOnly: boolean) => boolean;
const under = (t: string, dir: string) => t === dir || t.startsWith(dir + '/');

/** The layer a src file belongs to: its top directory, or main. */
export function layerOf(mod: string): string {
  return mod === 'main' ? 'main' : mod.split('/')[0];
}

export const RULES: Record<string, Rule> = {
  engine: (t) => under(t, 'engine'),
  ai: (t) => under(t, 'ai') || under(t, 'engine'),
  game: (t, type) =>
    under(t, 'game') || under(t, 'engine') || under(t, 'ai') || under(t, 'shared') ||
    (type && (t === 'render/BoardView' || t === 'audio/types' || t === 'data/boardTypes')),
  render: (t, type) =>
    under(t, 'render') || under(t, 'engine/data') || t === 'game/timing' || under(t, 'data') || under(t, 'shared') ||
    (type && (t === 'engine/types' || t === 'audio/types')),
  ui: (t, type) => under(t, 'ui') || under(t, 'shared') || (type && (t === 'game/viewModel' || t === 'audio/types')),
  audio: (t) => under(t, 'audio') || under(t, 'shared'),
  shared: (t, type) => under(t, 'shared') || (type && t === 'engine/types'),
  data: (t, type) => under(t, 'data') || (type && t === 'engine/types'),
  main: () => true,
};

/** Bare package imports allowed per layer (main may import anything). */
export const PACKAGES: Record<string, (pkg: string) => boolean> = {
  render: (p) => p === 'three' || p.startsWith('three/'),
  main: () => true,
};

export function violations(file: string, code: string): string[] {
  const from = moduleOf(file);
  const layer = layerOf(from);
  const rule = RULES[layer];
  const bad: string[] = [];
  if (!rule) return [`${from}: not in a known layer (${Object.keys(RULES).join(', ')})`];
  for (const imp of importsOf(code)) {
    if (imp.spec.startsWith('.') || imp.spec.startsWith('/')) {
      const abs = imp.spec.startsWith('/') ? join(ROOT, imp.spec) : resolve(dirname(file), imp.spec);
      const to = moduleOf(abs);
      if (to === 'outside') bad.push(`${from} → ${imp.spec}: src/ never imports outside src/`);
      else if (!rule(to, imp.typeOnly)) bad.push(`${from} → ${to}${imp.typeOnly ? ' (type)' : ''}: not allowed for ${layer}`);
    } else if (imp.spec.startsWith('node:')) {
      if (layer !== 'main') bad.push(`${from} → ${imp.spec}: src/ runs in the browser`);
    } else if (!(PACKAGES[layer]?.(imp.spec) ?? false)) {
      bad.push(`${from} → package ${imp.spec}: not allowed for ${layer}`);
    }
  }
  if (layer === 'engine' || layer === 'ai') {
    const s = stripComments(code);
    for (const [re, what] of [
      [/\bMath\.random\s*\(/, 'Math.random()'],
      [/\bDate\.now\s*\(/, 'Date.now()'],
      [/\bnew\s+Date\s*\(/, 'new Date()'],
      [/\bperformance\.now\s*\(/, 'performance.now()'],
      [/\b(document|window|localStorage|requestAnimationFrame)\b/, 'the DOM'],
    ] as const) {
      if (re.test(s)) bad.push(`${from}: ${layer} is pure, but uses ${what}`);
    }
  }
  return bad;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.ts$/.test(f)) out.push(p);
  }
  return out;
}

describe('module boundaries (PLAN §2.3)', () => {
  const files = walk(SRC);

  it('scans the real tree', () => {
    expect(files.length).toBeGreaterThan(5);
    expect(files.some((f) => f.endsWith(join('engine', 'types.ts')))).toBe(true);
  });

  it('every import under src/ respects its layer', () => {
    const bad = files.flatMap((f) => violations(f, readFileSync(f, 'utf8')));
    expect(bad).toEqual([]);
  });

  // The checker must catch what it claims to: synthetic files in each layer.
  const at = (p: string) => join(SRC, p);
  const cases: [string, string, boolean][] = [
    ['engine/reducer.ts', "import { x } from './types';", true],
    ['engine/reducer.ts', "import { cityName } from './data/usa';", true],
    ['engine/reducer.ts', "import type { GameVM } from '../game/viewModel';", false],
    ['engine/reducer.ts', "import * as THREE from 'three';", false],
    ['engine/rng.ts', 'export const r = () => Math.random();', false],
    ['engine/rng.ts', '// never Math.random() here\nexport const r = 1;', true],
    ['engine/save.ts', 'export const t = Date.now();', false],
    ['engine/views.ts', "export const w = document.body;", false],
    ['ai/plan.ts', "import { applyAction } from '../engine/reducer';", true],
    ['ai/plan.ts', "import { x } from '../game/controller';", false],
    ['game/controller.ts', "import type { BoardView } from '../render/BoardView';", true],
    ['game/controller.ts', "import { createBoardView } from '../render/index';", false],
    ['game/controller.ts', "import { type BoardView } from '../render/BoardView';", true],
    ['game/controller.ts', "import { createBoardView, type BoardView } from '../render/BoardView';", false],
    ['game/controller.ts', "import { chooseAction } from '../ai/index';", true],
    ['game/controller.ts', "import type { AudioBus } from '../audio/types';", true],
    ['game/controller.ts', "import { makeBus } from '../audio/engine';", false],
    ['game/controller.ts', "import { x } from '../../tests/fixtures/iron-atlas';", false],
    ['render/index.ts', "import * as THREE from 'three';", true],
    ['render/index.ts', "import { LANES } from '../engine/data/usa';", true],
    ['render/index.ts', "import type { LaneId } from '../engine/types';", true],
    ['render/index.ts', "import { laneId } from '../engine/types';", false],
    ['render/index.ts', "import { applyAction } from '../engine/reducer';", false],
    ['render/index.ts', "import { departureMs } from '../game/timing';", true],
    ['render/index.ts', "import { buildVM } from '../game/viewModel';", false],
    ['render/index.ts', "import board from '../data/board.json';", true],
    ['ui/dock.ts', "import type { DockVM } from '../game/viewModel';", true],
    ['ui/dock.ts', "import { DEFAULT_SETTINGS } from '../game/viewModel';", false],
    ['ui/dock.ts', "import { GOLD } from '../shared/palette';", true],
    ['ui/dock.ts', "import type { CardColor } from '../engine/types';", false],
    ['ui/dock.ts', "export { x } from '../game/controller';", false],
    ['audio/whistle.ts', "import { GOLD } from '../shared/palette';", true],
    ['audio/whistle.ts', "import type { LaneId } from '../engine/types';", false],
    ['shared/palette.ts', "import type { Finish } from '../engine/types';", true],
    ['main.ts', "import { createBoardView } from './render/index';", true],
    ['main.ts', "const m = await import('./game/hooks');", true],
    ['ui/index.ts', "const m = await import('../game/hooks');", false],
    ['game/storage.ts', "import { readFileSync } from 'node:fs';", false],
  ];
  for (const [file, code, ok] of cases) {
    it(`${ok ? 'allows' : 'rejects'} ${file}: ${code.split('\n').pop()}`, () => {
      expect(violations(at(file), code).length === 0).toBe(ok);
    });
  }
});
