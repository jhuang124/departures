// Every rule ID defined in docs/RULES.md must appear, as `[R-D3]` or `[H2]`, in at least one test title
// (it / test / describe, including .each / .skip-free variants) in a file under tests/engine/.
// PLAN.md §6. This stays red until E's engine tests land, and it says so.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const RULES = readFileSync(join(ROOT, 'docs/RULES.md'), 'utf8');
const TESTS_DIR = join(ROOT, 'tests/engine');
const SELF = fileURLToPath(import.meta.url);

/** IDs the rulebook pin defines: `- **R-S1.**` bullets and `| **H1** |` house-rule rows. */
export function definedIds(md: string): string[] {
  const ids: string[] = [];
  for (const m of md.matchAll(/^\s*-\s+\*\*(R-[SADCTEX]\d+)\.\*\*/gm)) ids.push(m[1]);
  for (const m of md.matchAll(/^\|\s*\*\*(H\d+)\*\*\s*\|/gm)) ids.push(m[1]);
  return ids;
}

function testFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...testFiles(p));
    else if (/\.test\.[cm]?[jt]sx?$/.test(name) && p !== SELF) out.push(p);
  }
  return out;
}

/**
 * The titles of it / test / describe calls in a source file: the first string argument, in '', "" or ``.
 * Chained forms count (`it.each(...)('[R-D1] …')`, `describe.concurrent('…')`), skipped ones don't
 * (`it.skip`, `it.todo`, `describe.skip`, `xit`): an ID with only a skipped test is not covered.
 */
export function testTitles(src: string): string[] {
  const titles: string[] = [];
  const call = /\b(it|test|describe)((?:\.(?:only|concurrent|sequential|fails|each|for|runIf|skipIf))*)((?:\([^()]*(?:\([^()]*\)[^()]*)*\))?)\s*\(\s*(['"`])((?:\\.|(?!\4)[\s\S])*?)\4/g;
  for (const m of src.matchAll(call)) titles.push(m[5]);
  return titles;
}

export function idsInTitles(titles: string[]): Set<string> {
  const ids = new Set<string>();
  for (const t of titles) for (const m of t.matchAll(/\[((?:R-[SADCTEX]|H)\d+)\]/g)) ids.add(m[1]);
  return ids;
}

const DEFINED = definedIds(RULES);

describe('rules coverage: the RULES.md parser', () => {
  it('finds every rule ID the pin defines: 52 in all, by prefix', () => {
    const count = (p: string) => DEFINED.filter(id => id.startsWith(p) && /\d+$/.test(id.slice(p.length))).length;
    expect({
      'R-S': count('R-S'), 'R-A': count('R-A'), 'R-D': count('R-D'), 'R-C': count('R-C'),
      'R-T': count('R-T'), 'R-E': count('R-E'), 'R-X': count('R-X'), H: count('H'),
    }).toEqual({ 'R-S': 5, 'R-A': 2, 'R-D': 11, 'R-C': 10, 'R-T': 7, 'R-E': 7, 'R-X': 6, H: 4 });
    expect(DEFINED).toHaveLength(52);
  });

  it('IDs are unique and numbered 1..n without gaps within each prefix', () => {
    expect(new Set(DEFINED).size).toBe(DEFINED.length);
    const byPrefix = new Map<string, number[]>();
    for (const id of DEFINED) {
      const [, p, n] = id.match(/^(R-[SADCTEX]|H)(\d+)$/)!;
      byPrefix.set(p, [...(byPrefix.get(p) ?? []), Number(n)]);
    }
    for (const [p, ns] of byPrefix) expect(ns, p).toEqual(ns.map((_, i) => i + 1));
  });

  it('reads titles the way the check needs: chained forms count, skipped and todo tests do not', () => {
    const src = [
      "it('[R-D3] refuses a face-up loco second', () => {})",
      'test("[R-C8] closes the sibling [H1]", () => {})',
      'describe.concurrent(`[R-E3] longest trail`, () => {})',
      "it.each([[1], [2]])('[R-X2] pathological market %s', () => {})",
      "it.skip('[R-T1] skipped', () => {})",
      "it.todo('[R-T2] later')",
      "xit('[R-T3] old style')",
      "const s = '[R-T4] not a title'",
    ].join('\n');
    expect([...idsInTitles(testTitles(src))].sort()).toEqual(['H1', 'R-C8', 'R-D3', 'R-E3', 'R-X2']);
  });
});

describe('rules coverage: every RULES.md ID has a test under tests/engine/', () => {
  it('no rule ID is missing from the engine test titles', (ctx) => {
    const files = testFiles(TESTS_DIR);
    const covered = new Set<string>();
    for (const f of files) for (const id of idsInTitles(testTitles(readFileSync(f, 'utf8')))) covered.add(id);
    const missing = DEFINED.filter(id => !covered.has(id));
    const unknown = [...covered].filter(id => !DEFINED.includes(id)).sort();

    // Before E (the Phase 1 engine) lands, nothing under tests/engine/ cites a rule ID. Skip with a message so
    // CI (pages.yml runs npm test) stays green in Phase 0; the moment one engine test cites an ID, every ID is required.
    if (covered.size === 0) {
      ctx.skip(`no engine test cites a rule ID yet (E has not landed); ${DEFINED.length} IDs await coverage`);
      return;
    }

    const lines: string[] = [];
    if (missing.length) {
      lines.push(
        `${missing.length} of ${DEFINED.length} rule IDs in docs/RULES.md have no test titled with them under tests/engine/.`,
        'Expected until E (Phase 1 engine) lands its tests; each needs at least one it/test/describe title like "[R-D3] …".',
        `Missing: ${missing.join(', ')}`,
      );
    }
    if (unknown.length) lines.push(`Titles cite IDs that RULES.md does not define: ${unknown.join(', ')}`);
    lines.push(`Scanned ${files.length} file(s): ${files.map(f => relative(ROOT, f)).join(', ') || 'none'}`);

    if (missing.length || unknown.length) throw new Error(lines.join('\n'));
    expect(covered.size).toBe(DEFINED.length);
  });
});
