// ★ Contract file (PLAN.md §3.4). Durations per board event at 1×; the renderer matches them ±10 %.
// Additive optional fields only after Phase 0. Pure: no DOM, no clocks.

import type { BoardEventPayload } from '../engine/types';

/** 0 = instant (e2e logic lane only; may snap). 'skip' is AI turns only. */
export type PlaySpeed = 0 | 1 | 2 | 'skip';

export type TimingClass = 'blocking' | 'overlap' | 'ambient' | 'none';

// --- The departure (PLAN §3.4, §4.9) ---------------------------------------------------------------------

export const DEPARTURE = {
  /** t 0: whistle, gold keyline, pay chips leave. The train does not move until this. */
  whistleLeadMs: 350,
  /** pay chips leave over t 0–300 */
  payChipsMs: 300,
  travelBaseMs: 700,
  travelPerCarMs: 250,
  settleMs: 200,
  capMs: 2800,
  /** fraction of travel spent easing in (the slow first beat) and easing out */
  easeInFrac: 0.3,
  easeOutFrac: 0.2,
  /** settle overshoot, board units */
  overshootU: 1.5,
  /** non-blocking steam tail after the settle */
  steamTailMs: 3000,
  /** chug interval = clamp(0.9 · car / v, min, max) */
  chugMinMs: 110,
  chugMaxMs: 260,
  chugCarFactor: 0.9,
  /** at 2×: the whistle lead never drops below this */
  whistleLead2xMinMs: 250,
  /** at skip */
  skipSlideMs: 300,
  whistleLeadSkipMinMs: 120,
} as const;

export interface DeparturePlan {
  whistleAt: number;
  firstMoveAt: number;
  arriveAt: number;
  settleAt: number;
  totalMs: number;
}

/** When each beat of a departure of `length` cars lands, from t = 0 (the commit's whistle). */
export function departurePlan(length: number, speed: PlaySpeed = 1): DeparturePlan {
  if (speed === 0) return { whistleAt: 0, firstMoveAt: 0, arriveAt: 0, settleAt: 0, totalMs: 0 };
  if (speed === 'skip') {
    const lead = DEPARTURE.whistleLeadSkipMinMs;
    const end = lead + DEPARTURE.skipSlideMs;
    return { whistleAt: 0, firstMoveAt: lead, arriveAt: end, settleAt: end, totalMs: end };
  }
  const k = speed === 2 ? 0.5 : 1;
  const lead = speed === 2 ? Math.max(DEPARTURE.whistleLead2xMinMs, DEPARTURE.whistleLeadMs * k) : DEPARTURE.whistleLeadMs;
  const travel = floor((DEPARTURE.travelBaseMs + DEPARTURE.travelPerCarMs * length) * k);
  const settle = floor(DEPARTURE.settleMs * k);
  // at 2× the cap halves too, plus whatever the whistle-lead floor added
  const cap = DEPARTURE.capMs * k + (lead - DEPARTURE.whistleLeadMs * k);
  const total = Math.min(cap, lead + travel + settle);
  const arrive = total - settle;
  return { whistleAt: 0, firstMoveAt: lead, arriveAt: arrive, settleAt: total, totalMs: total };
}

/** 1×: L1 1500 ms, L6 2750 ms, cap 2800 ms. */
export function departureMs(length: number, speed: PlaySpeed = 1): number {
  return departurePlan(length, speed).totalMs;
}

// --- Everything else at 1× ----------------------------------------------------------------------------

export const CARDS = {
  /** a market take; the next take may start at overlapAtMs */
  marketTakeMs: 420,
  marketReplaceDelayMs: 140,
  marketTotalMs: 560,
  marketOverlapAtMs: 450,
  deckTakeMs: 380,
  /** turns face up on arrival, in the holder's hand only */
  deckFlipMs: 160,
  /** marketCleared: 5 × 320 ms off (50 ms stagger), then 5 × 360 ms in (70 ms stagger), ≤ 1100 ms total */
  clearOffMs: 320,
  clearOffStaggerMs: 50,
  clearInStartMs: 460,
  clearInMs: 360,
  clearInStaggerMs: 70,
  clearTotalMs: 1100,
  reshuffleMs: 500,
} as const;

export const TICKETS = {
  offeredMs: 420,
  offeredStaggerMs: 80,
  keptMs: 360,
  /** a kept poster lifts this far in the sheet */
  keepLiftPx: 8,
} as const;

export const LANES = {
  closedMs: 600,
  /** picked: slots raise 1.5 u over this */
  pickRaiseMs: 90,
} as const;

export const LIGHT = {
  fallMs: 6000,
  /** beams fade out over the first 2 s of the fall */
  beamsOutMs: 2000,
  /** claimed cars light their window strips from this fraction of the fall */
  windowsFrom: 0.55,
  /** the two still searchlights fade in from this fraction */
  searchlightsFrom: 0.7,
  /** the plate rises from dark under the title's first light */
  firstLightMs: 1200,
  resizeDebounceMs: 200,
} as const;

export const SCORING = {
  ticketRevealMs: 700,
  perSeatMaxMs: 4000,
  trailMaxMs: 3000,
  trailSlotsPerSec: 8,
  victoryHoldMs: 4000,
  scoresFadeMs: 400,
  /** REMATCH · TITLE appear after pointer movement or this long, at 40 % */
  afterRevealMs: 20000,
  afterAlpha: 0.4,
} as const;

export const AI = {
  thinkMs: 250,
  secondDrawThinkMs: 150,
  skipTurnMaxMs: 600,
} as const;

export const UI = {
  /** a tap or Space during motion: every blocking animation runs to its end in this long, never snaps */
  finishMs: 160,
  /** Space is ignored this long after a finish */
  spaceIgnoreMs: 300,
  coverDismissMs: 240,
  handFoldMs: 160,
  textCrossfadeMs: 160,
  /** the hand covers itself after this long without input (2+ humans) */
  idleCoverMs: 60000,
  /** click or key → first visible response */
  responseBudgetMs: 50,
} as const;

/** 2× halves every duration, never below this. */
export const MIN_MS = 80;

const floor = (ms: number) => Math.max(MIN_MS, Math.round(ms));

/** Scale a 1× duration to a speed. 0 → 0; 2 → half with an 80 ms floor; 'skip' → half, capped by the caller. */
export function scaleMs(ms: number, speed: PlaySpeed): number {
  if (speed === 0 || ms === 0) return 0;
  if (speed === 1) return ms;
  return floor(ms * 0.5);
}

export interface EventTiming {
  ms: number;
  cls: TimingClass;
  /** a tap skips it (scoring reel) */
  skippable?: boolean;
  /** for overlap events: when the next overlapping event may start */
  overlapAtMs?: number;
}

/** The one table: how long the board and HUD take to play each event at `speed`. */
export function timingOf(e: BoardEventPayload, speed: PlaySpeed = 1): EventTiming {
  const s = (ms: number) => scaleMs(ms, speed);
  switch (e.type) {
    case 'departed':
      return { ms: departureMs(e.length, speed), cls: 'blocking' };
    case 'cardTaken':
      return e.from === 'deck'
        ? { ms: s(CARDS.deckTakeMs), cls: 'overlap', overlapAtMs: s(CARDS.deckTakeMs) }
        : { ms: s(CARDS.marketTotalMs), cls: 'overlap', overlapAtMs: s(CARDS.marketOverlapAtMs) };
    case 'marketDealt':
      return { ms: s(CARDS.clearInMs), cls: 'overlap', overlapAtMs: s(CARDS.clearInStaggerMs) };
    case 'marketCleared':
      return { ms: s(CARDS.clearTotalMs), cls: 'blocking' };
    case 'deckReshuffled':
      return { ms: s(CARDS.reshuffleMs), cls: 'blocking' };
    case 'ticketsOffered':
      return { ms: s(TICKETS.offeredMs + TICKETS.offeredStaggerMs * Math.max(0, e.count - 1)), cls: 'blocking' };
    case 'ticketsKept':
      return { ms: s(TICKETS.keptMs), cls: 'overlap', overlapAtMs: 0 };
    case 'laneClosed':
      return { ms: s(LANES.closedMs), cls: 'overlap', overlapAtMs: 0 };
    case 'finalRoundBegan':
      // ambient: input stays live; the fall is never sped up (it happens once)
      return { ms: speed === 0 ? 0 : LIGHT.fallMs, cls: 'ambient' };
    case 'ticketRevealed':
      return { ms: s(SCORING.ticketRevealMs), cls: 'blocking', skippable: true };
    case 'trailLit': {
      const slots = e.length;
      return { ms: s(Math.min(SCORING.trailMaxMs, (slots / SCORING.trailSlotsPerSec) * 1000)), cls: 'blocking', skippable: true };
    }
    case 'gameStarted':
      return { ms: s(LIGHT.firstLightMs), cls: 'ambient' };
    case 'cardsDealt':
    case 'turnBegan':
    case 'drawEnded':
    case 'passed':
    case 'gameEnded':
    case 'standings':
      return { ms: 0, cls: 'none' };
  }
}
