// ★ Contract file (PLAN.md §5.12). The UI's only input: the controller (C) builds a GameVM, the UI (U)
// renders it and sends Intents back. Every string the UI shows is in here, supplied by copy.ts; src/ui holds
// no string literals of its own (copy lint, PLAN §7.1). Additive optional fields only after Phase 0.

import type { AiLevel, CardColor, Finish, LaneId, MarketSlot, SeatId, SeatKind, TicketId } from '../engine/types';

// src/ui may import only this file (type), shared and audio/types (PLAN §2.3), so the ids and colours it
// needs are re-exported here.
export type { AiLevel, CardColor, Finish, LaneId, MarketSlot, SeatId, SeatKind, TicketId };

export type Screen = 'title' | 'newGame' | 'game';

export interface Settings {
  /** animation speed; 0 is the e2e logic lane only */
  speed: 0 | 1 | 2;
  aiSpeed: 'watch' | 'fast' | 'skip' | 'instant';
  master: number;
  music: number;
  effects: number;
  reducedMotion: boolean;
  textSize: 1 | 1.15 | 1.3;
  handOff: 'auto' | 'off';
  /** colour marks on slots, off by default */
  colourMarks: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  speed: 1,
  aiSpeed: 'watch',
  master: 0.8,
  music: 0.6,
  effects: 0.8,
  reducedMotion: false,
  textSize: 1,
  handOff: 'auto',
  colourMarks: false,
};

/** The one gold referent: the thing happening now (PLAN §5.1). */
export type GoldRef =
  | { kind: 'none' }
  | { kind: 'lane'; lane: LaneId } // a picked lane (and its name on the place line: one referent)
  | { kind: 'departure'; lane: LaneId }
  | { kind: 'card'; from: 'deck' | MarketSlot }
  | { kind: 'word'; id: string } // the commit word
  | { kind: 'title' }; // DEPARTURES / THE LAST TRAIN HAS LEFT on the title tier

export interface ButtonVM {
  id: string;
  label: string;
  primary: boolean;
  disabled?: boolean;
  /** the plain sentence shown when disabled */
  reason?: string;
  /** keyboard key that commits it, e.g. 'Enter' */
  key?: string;
  /** Intent sent on press */
  intent?: Intent;
}

/** Low-ivory words on the title tier (CLAIM · TICKETS). */
export interface WordVM {
  id: string;
  label: string;
  enabled: boolean;
  reason?: string;
  key?: string;
  intent?: Intent;
}

export interface SeatVM {
  id: SeatId;
  name: string;
  kind: SeatKind;
  level?: AiLevel;
  finish: Finish;
  points: number;
  trains: number;
  cards: number;
  tickets: number;
  current: boolean;
  /** this seat's hand is the one on screen */
  holding: boolean;
}

export interface MarketCardVM {
  slot: MarketSlot;
  card: CardColor | null;
  enabled: boolean;
  /** face-up locomotives after one card: 45 % */
  dim: boolean;
  reason?: string;
}

export interface SidingVM {
  ticketDeck: { count: number; enabled: boolean; reason?: string };
  deck: { count: number; enabled: boolean; reason?: string };
  market: MarketCardVM[];
  discard: { top: CardColor | null; count: number };
}

export interface DockVM {
  place: { text: string; gold: boolean };
  record: string;
  line?: string;
  buttons: ButtonVM[];
  words: WordVM[];
  /** the hand tier is folded down */
  folded: boolean;
}

export type PosterStatus = 'open' | 'complete' | 'blocked' | 'unfinished';

export interface PosterVM {
  ticket: TicketId;
  /** display names, caps applied by the UI's type, not the string */
  from: string;
  to: string;
  /** the city the art paints (posters.json) */
  hero: string;
  points: number;
  /** poster art URL, or null for the typographic placeholder */
  art: string | null;
  status: PosterStatus;
  /** H4 only: `about 9 trains` */
  hint?: string;
  /** the stamp's word, from copy.ts (CANCELLED / UNFINISHED) */
  stamp?: string;
}

export interface HandVM {
  /** fixed order: red, orange, yellow, green, blue, purple, black, white, loco */
  chips: { color: CardColor; count: number }[];
  posters: PosterVM[];
}

export interface TicketSheetVM {
  mode: 'offer' | 'view';
  posters: (PosterVM & { kept?: boolean })[];
  minKeep: number;
  /** offer: KEEP N (45 % until the minimum is met); view: CLOSE */
  commit: ButtonVM;
  line?: string;
}

export interface CoverVM {
  /** the incoming seat's name */
  to: string;
  /** up to three public departures since that seat's last turn, or `A quiet round.` */
  recap: string[];
  /** true for the 60 s idle cover */
  idle: boolean;
  /** PASS TO SAM / PRIYA'S HAND IS PUT AWAY */
  title: string;
  /** I'M SAM */
  button: ButtonVM;
}

export interface TallyRowVM {
  seat: SeatId;
  name: string;
  finish: Finish;
  routes: number;
  tickets: { ticket: TicketId; label: string; points: number; result: 'complete' | 'cancelled' | 'unfinished' }[];
  longest: number;
  total: number;
  /** `routes 64 · tickets 38 · longest 10` */
  summary: string;
  revealed: boolean;
}

export interface VictoryVM {
  stage: 'hold' | 'scores' | 'reel' | 'standings' | 'board';
  /** THE LAST TRAIN HAS LEFT (never a name or a score) */
  title: string;
  scores?: ButtonVM;
  tally: TallyRowVM[];
  tieBreak?: string;
  /** BOARD, then REMATCH · TITLE (hidden until pointer or 20 s) */
  buttons: ButtonVM[];
  afterVisible: boolean;
}

export interface TitleVM {
  title: string;
  words: ButtonVM[];
  /** `Turn 30 · Priya, Sam, John` when a save exists */
  continueMeta?: string;
}

export interface SeatRowVM {
  finish: Finish;
  name: string;
  kind: SeatKind;
  level?: AiLevel;
  levels: AiLevel[];
  removable: boolean;
}

export interface NewGameVM {
  rows: SeatRowVM[];
  canAdd: boolean;
  start: ButtonVM;
  /** Phase 2: the HOUSE RULES fold */
  house?: { id: 'H1' | 'H2' | 'H3' | 'H4'; label: string; value: string; options: string[] }[];
  labels: Record<string, string>;
}

export interface MenuVM {
  items: ButtonVM[];
}

export interface GameVM {
  screen: Screen;
  seats: SeatVM[];
  siding: SidingVM;
  dock: DockVM;
  hand?: HandVM;
  sheet?: TicketSheetVM;
  cover?: CoverVM;
  victory?: VictoryVM;
  gold: GoldRef;
  aiSpeed?: 'watch' | 'fast' | 'skip';
  settings: Settings;
  // additive (Phase 0, F): screens and chrome that §5.10 needs
  title?: TitleVM;
  newGame?: NewGameVM;
  menu?: MenuVM;
  /** LAST ROUND and one dot per remaining turn */
  lastRound?: { label: string; turnsLeft: number };
  /** labels for the seat strip's AI speed words (WATCH · FAST · SKIP) and the menu glyph */
  labels?: Record<string, string>;
}

/** UI intents going back to the controller (PLAN §5.12). */
export type Intent =
  | { type: 'pickLane'; lane: LaneId; at?: { x: number; y: number } }
  | { type: 'takeCard'; from: 'deck' | MarketSlot }
  | { type: 'pickTickets' }
  | { type: 'toggleKeep'; ticket: TicketId }
  | { type: 'commit'; id?: string }
  | { type: 'cancel' }
  | { type: 'endDraw' }
  | { type: 'holdSeat' }
  | { type: 'openHand' }
  | { type: 'input'; at?: { x: number; y: number } }
  | { type: 'finishMotion' }
  | { type: 'pressScores' }
  | { type: 'pressBoard' }
  | { type: 'cycleLane' }
  | { type: 'menu'; item: 'open' | 'close' | 'resume' | 'rules' | 'record' | 'settings' | 'saveQuit' | 'newGame' }
  | { type: 'title'; item: 'newGame' | 'continue' | 'rematch' | 'toTitle' }
  | {
      type: 'seatRow';
      row: number;
      change: { name?: string; kind?: SeatKind; level?: AiLevel; cycleFinish?: true; remove?: true } | { add: true };
    }
  | { type: 'start' }
  | { type: 'aiSpeed'; value: 'watch' | 'fast' | 'skip' }
  | { type: 'setting'; key: keyof Settings; value: Settings[keyof Settings] };

export type IntentType = Intent['type'];
