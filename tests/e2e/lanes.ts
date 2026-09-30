// The one place the e2e suite is sorted (read by scripts/e2e.ts and by lib.ts). War Table's model.
//   lane 'logic'  — no assertion on wall-clock tempo, fps or ms budgets. Runs in parallel (a worker pool, one
//                   shared Chromium per worker, a fresh context per open()) at INSTANT speed: animation speed
//                   0 and AI 'instant', pinned by lib.ts. `realtime: true` keeps a logic flow at 1×.
//   lane 'timing' — tempo, fps and ms budgets. Runs after the logic lane, one flow at a time on the quiet
//                   machine, at real speed, a fresh Chromium per open() (a cold GPU, like a first load).
//   quick         — the `npm run test:e2e:quick` tier: smoke + one human turn + setup + resume.
// A flow file that isn't listed here runs in the timing lane and the runner says so. Flows listed here whose
// file doesn't exist yet are skipped by --quick with a note (they belong to a later phase, PLAN §7.3).
// Owned by F in Phase 0, by Q from Phase 1.

export type Lane = 'logic' | 'timing';

export interface FlowSpec {
  lane: Lane;
  /** Logic lane only: real speed instead of instant (still in parallel). */
  realtime?: boolean;
  /** In the quick tier. */
  quick?: boolean;
  /** The phase that delivers it (PLAN §7.3). */
  phase: 0 | 1 | 2;
  /** Why it's in this lane: the assertions that decide it. */
  why: string;
}

export const FLOWS: Record<string, FlowSpec> = {
  // --- logic (parallel, instant unless realtime) ----------------------------------------------------------
  smoke: { lane: 'logic', quick: true, phase: 0, why: 'boot → title → new game → first opening sheet → first turn: screens, seats, dock (Phase 0: boots and shows the frame)' },
  setup: { lane: 'logic', quick: true, phase: 1, why: '2–5 seats, unique finishes, AI levels saved, remembered seats, Continue metadata' },
  turn: { lane: 'logic', quick: true, phase: 1, why: 'a full human turn of each action through real clicks' },
  resume: { lane: 'logic', quick: true, phase: 1, why: 'reload mid-turn, mid-second-draw, mid-ticket-sheet, final round; state equals the snapshot; night restored' },
  handoff: { lane: 'logic', realtime: true, phase: 1, why: 'zero frames of the next hand, sampled per mutation and per rAF across a real turn end' },
  privacy: { lane: 'logic', phase: 1, why: 'while not holding, DOM text and data-* carry no ticket id or chip count; no private-event audio cue' },
  cancelled: { lane: 'logic', phase: 1, why: "moment.json: public DOM byte-identical around Priya's claim except the departure; Sam's stamp after the cover" },
  rules: { lane: 'logic', phase: 2, why: 'fixture rule scenarios by real clicks' },
  scoring: { lane: 'logic', phase: 2, why: 'fixture end state: 4 s hold, SCORES waits, tally equals finalStandings' },
  house: { lane: 'logic', phase: 2, why: 'each house rule changes exactly what RULES.md §H says' },
  fullgame: { lane: 'logic', phase: 2, why: '4 AI at skip to victory: no console errors, no warnings' },
  keys: { lane: 'logic', phase: 2, why: 'every key in PLAN §5.5' },

  // --- timing (serial, real speed; in this order) -------------------------------------------------------
  departure: { lane: 'timing', phase: 1, why: 'commit → settle ≤ 1.55 s at L1 and ≤ 2.80 s at L6; whistle ≥ 300 ms before first motion' },
  pops: { lane: 'timing', phase: 1, why: 'appearedOffStation = 0; every entry travels ≥ 24 px; nothing 0 → 60 % in one frame' },
  feel: { lane: 'timing', phase: 1, why: 'tap → gold ≤ 50 ms; tap mid-departure → settled ≤ 200 ms; idle 0 tweens; still frames identical' },
  budgets: { lane: 'timing', phase: 1, why: 'every click and wait budget in PLAN §5.6' },
  legibility: { lane: 'timing', phase: 1, why: 'PLAN §7.5 squint classification at golden hour (night in Phase 2)' },
  nightfall: { lane: 'timing', phase: 1, why: 'the fall completes ≤ 6.2 s, input acknowledged ≤ 50 ms during it, exactly once' },
  round: { lane: 'timing', phase: 2, why: 'AI turn median ≤ 2.5 s, p95 ≤ 3.6 s; a round of 4 AI ≤ 12 s' },
  perf: { lane: 'timing', phase: 2, why: '1920 × 1080 DPR 2: departure p95 ≤ 16.7 ms; bake ≤ 1.5 s; idle ≤ 4 ms' },
  onegold: { lane: 'timing', phase: 2, why: 'a real turn sampled every 50 ms: exactly one gold referent' },
};

export type Speed = 'instant' | 'real';

/** The speed a flow runs at: the logic lane is instant unless the flow is marked realtime. */
export function speedOf(flow: string): Speed {
  const f = FLOWS[flow];
  return f && f.lane === 'logic' && !f.realtime ? 'instant' : 'real';
}

export function laneOf(flow: string): Lane {
  return FLOWS[flow]?.lane ?? 'timing';
}

export const QUICK = Object.keys(FLOWS).filter((f) => FLOWS[f].quick);
