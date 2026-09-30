// ★ Contract file (PLAN.md §3.1–§3.3). Additive optional fields only after Phase 0.
// Pure types: no runtime imports, no DOM.

// ---------------------------------------------------------------------------
// Identifiers
// ---------------------------------------------------------------------------

declare const brand: unique symbol;
/** A string carrying a compile-time brand, so ids of different kinds never mix. */
export type Brand<T, B extends string> = T & { readonly [brand]: B };

export type SeatId = 0 | 1 | 2 | 3 | 4;
export type CityId = Brand<string, 'CityId'>;
export type LaneId = Brand<string, 'LaneId'>;
export type TicketId = Brand<string, 'TicketId'>;

/** Brand constructors: identity at runtime, a cast at compile time. */
export const cityId = (s: string): CityId => s as CityId;
export const laneId = (s: string): LaneId => s as LaneId;
export const ticketId = (s: string): TicketId => s as TicketId;

// ---------------------------------------------------------------------------
// Colours and finishes
// ---------------------------------------------------------------------------

export type CardColor =
  | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'black' | 'white' | 'loco';
export type LaneColor = Exclude<CardColor, 'loco'> | 'gray';
export type Finish = 'brass' | 'copper' | 'chrome' | 'gunmetal' | 'enamel';

/** Fixed order used by hands, chips and conservation checks. */
export const CARD_COLORS: readonly CardColor[] = [
  'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white', 'loco',
] as const;
export const LANE_COLORS: readonly LaneColor[] = [
  'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white', 'gray',
] as const;
export const FINISHES: readonly Finish[] = ['brass', 'copper', 'chrome', 'gunmetal', 'enamel'] as const;

// ---------------------------------------------------------------------------
// Static data shapes (filled by src/engine/data/usa.ts, owned by R)
// ---------------------------------------------------------------------------

export interface City { id: CityId; name: string; lat: number; lon: number }
export interface Lane {
  id: LaneId;
  a: CityId;
  b: CityId;
  length: 1 | 2 | 3 | 4 | 5 | 6;
  color: LaneColor;
  /** The other lane of a double, if any. */
  sibling?: LaneId;
}
export interface Ticket { id: TicketId; a: CityId; b: CityId; points: number }

// ---------------------------------------------------------------------------
// Configuration (RULES.md §H for house rules; defaults = rulebook)
// ---------------------------------------------------------------------------

export interface HouseRules {
  /** H1: doubles at 2–3 seats. 'closed' = rulebook (R-C8). */
  doublesAtLowCount: 'closed' | 'open';
  /** H2: second card. 'required' = rulebook (R-D10). */
  secondDraw: 'required' | 'optional';
  /** H3: first seat. 'drawn' = rulebook (R-S5). */
  firstSeat: 'drawn' | 'firstRow';
  /** H4: ticket hints. false = rulebook. */
  ticketHints: boolean;
}

export const DEFAULT_HOUSE_RULES: HouseRules = {
  doublesAtLowCount: 'closed',
  secondDraw: 'required',
  firstSeat: 'drawn',
  ticketHints: false,
};

export type SeatKind = 'human' | 'ai';
export type AiLevel = 'gentle' | 'steady' | 'sharp';

export interface SeatConfig { name: string; kind: SeatKind; level?: AiLevel; finish: Finish }

export interface GameConfig {
  seats: SeatConfig[];
  /** uint32 */
  seed: number;
  house: HouseRules;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export type Hand = Record<CardColor, number>;

export interface Seat {
  id: SeatId;
  name: string;
  kind: SeatKind;
  level?: AiLevel;
  finish: Finish;
  hand: Hand;
  tickets: TicketId[];
  trains: number;
  routePoints: number;
}

export type MarketSlot = 0 | 1 | 2 | 3 | 4;

export type Phase =
  | { kind: 'setupTickets'; seat: SeatId; offer: TicketId[] }
  | { kind: 'turn' }
  | { kind: 'secondDraw'; firstFrom: 'deck' | 'market' }
  | { kind: 'keepTickets'; offer: TicketId[]; minKeep: 1 }
  | { kind: 'over'; reason: 'finalRound' | 'stalemate' };

export type PhaseKind = Phase['kind'];

export interface GameState {
  v: 1;
  /** mulberry32 state, uint32. Every shuffle and deal goes through it. */
  rng: number;
  config: GameConfig;
  seats: Seat[];
  turnSeat: SeatId;
  /** 0 = setup */
  turn: number;
  firstSeat: SeatId;
  phase: Phase;
  /** top = last */
  deck: CardColor[];
  discard: CardColor[];
  /** FIXED slots: a taken card's slot refills in place. Length 5. */
  market: (CardColor | null)[];
  /** top = index 0; returns go to the end in offer order */
  ticketDeck: TicketId[];
  claims: Partial<Record<LaneId, SeatId>>;
  /** monotonic */
  blocked: Partial<Record<SeatId, TicketId[]>>;
  finalRound: null | { triggeredBy: SeatId; turnsLeft: number };
  passStreak: number;
  nextEventId: number;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export interface Payment { color: CardColor; colored: number; locos: number }

export type Action =
  | { type: 'keepTickets'; seat: SeatId; keep: TicketId[] }
  | { type: 'drawCard'; seat: SeatId; from: 'deck' | MarketSlot }
  /** only when house.secondDraw === 'optional' */
  | { type: 'endDraw'; seat: SeatId }
  | { type: 'claim'; seat: SeatId; lane: LaneId; pay: Payment; origin?: CityId }
  | { type: 'drawTickets'; seat: SeatId }
  /** only when legalSummary says nothing else is legal */
  | { type: 'pass'; seat: SeatId };

export type ActionType = Action['type'];

export type Reason =
  | 'notYourTurn'
  | 'wrongPhase'
  | 'laneClaimed'
  | 'laneClosedDouble'
  | 'ownSibling'
  | 'notEnoughTrains'
  | 'wrongColor'
  | 'wrongCount'
  | 'cannotAfford'
  | 'locoAsSecondDraw'
  | 'slotEmpty'
  | 'deckEmpty'
  | 'noTickets'
  | 'keepAtLeast'
  | 'keepNotOffered'
  | 'mustFinishDraw'
  | 'passNotAllowed'
  | 'gameOver';

export type ApplyResult =
  | { ok: true; state: GameState; events: EngineEvent[] }
  | { ok: false; reason: Reason; detail?: string };

// ---------------------------------------------------------------------------
// Events (PLAN.md §3.2–§3.3)
// ---------------------------------------------------------------------------

export type Visibility = 'public' | { seat: SeatId };

export type DrawEndReason = 'two' | 'faceUpLoco' | 'noSecondCard' | 'chose';

export type PublicEvent =
  | { type: 'gameStarted'; seats: { id: SeatId; name: string; kind: SeatKind; finish: Finish }[]; firstSeat: SeatId }
  | { type: 'cardsDealt'; seat: SeatId; count: 4 }
  | { type: 'marketDealt'; slot: MarketSlot; card: CardColor }
  | { type: 'marketCleared'; discarded: CardColor[]; dealt: CardColor[] }
  | { type: 'deckReshuffled'; size: number }
  | { type: 'ticketsOffered'; seat: SeatId; count: number }
  | { type: 'ticketsKept'; seat: SeatId; kept: number; returned: number }
  | { type: 'turnBegan'; seat: SeatId; turn: number; final: boolean }
  /** card present only when taken face up */
  | { type: 'cardTaken'; seat: SeatId; from: 'deck' | MarketSlot; card?: CardColor }
  | { type: 'drawEnded'; seat: SeatId; reason: DrawEndReason }
  | {
      type: 'departed';
      seat: SeatId;
      lane: LaneId;
      origin: CityId;
      dest: CityId;
      length: number;
      laneColor: LaneColor;
      pay: Payment;
      points: number;
      trainsLeft: number;
    }
  | { type: 'laneClosed'; lane: LaneId; because: LaneId }
  | { type: 'finalRoundBegan'; seat: SeatId; trainsLeft: number; turnsLeft: number }
  | { type: 'passed'; seat: SeatId }
  | { type: 'gameEnded'; reason: 'finalRound' | 'stalemate' };

export type PrivateEvent =
  | { type: 'cardsDealtTo'; seat: SeatId; cards: CardColor[] }
  | { type: 'ticketsOfferedTo'; seat: SeatId; ids: TicketId[] }
  | { type: 'ticketsKeptBy'; seat: SeatId; ids: TicketId[] }
  | { type: 'cardDrawnBlind'; seat: SeatId; card: CardColor }
  | { type: 'ticketCompleted'; seat: SeatId; ticket: TicketId }
  | { type: 'ticketBlocked'; seat: SeatId; ticket: TicketId };

export type E = PublicEvent | PrivateEvent;
export type EventType = E['type'];
export type PublicEventType = PublicEvent['type'];
export type PrivateEventType = PrivateEvent['type'];

export const PRIVATE_EVENT_TYPES: readonly PrivateEventType[] = [
  'cardsDealtTo', 'ticketsOfferedTo', 'ticketsKeptBy', 'cardDrawnBlind', 'ticketCompleted', 'ticketBlocked',
] as const;

export interface EngineEvent<T extends E = E> {
  id: number;
  turn: number;
  vis: Visibility;
  e: T;
}

// ---------------------------------------------------------------------------
// Scoring (controller-built, PLAN.md §3.3; tickets public by rule at this point)
// ---------------------------------------------------------------------------

export type TicketResult = 'complete' | 'cancelled' | 'unfinished';

export interface StandingRow {
  seat: SeatId;
  total: number;
  routes: number;
  tickets: number;
  longest: number;
  completedTickets: number;
  rank: number;
}

export type ScoringEvent =
  | { type: 'ticketRevealed'; seat: SeatId; ticket: TicketId; result: TicketResult; points: number; lanes: LaneId[] }
  | { type: 'trailLit'; seats: SeatId[]; length: number; lanes: LaneId[] }
  | { type: 'standings'; rows: StandingRow[]; tieBreak?: string };

/** What the board may be asked to play: public engine events and scoring events. Never private kinds. */
export type BoardEventPayload = PublicEvent | ScoringEvent;
export interface BoardEvent<T extends BoardEventPayload = BoardEventPayload> {
  id: number;
  turn: number;
  vis: 'public';
  e: T;
}

// ---------------------------------------------------------------------------
// Views (PLAN.md §6 Views)
// ---------------------------------------------------------------------------

export interface PublicSeatView {
  id: SeatId;
  name: string;
  kind: SeatKind;
  level?: AiLevel;
  finish: Finish;
  cards: number;
  tickets: number;
  trains: number;
  routePoints: number;
}

export interface PublicView {
  seats: PublicSeatView[];
  turnSeat: SeatId;
  turn: number;
  firstSeat: SeatId;
  phaseKind: PhaseKind;
  market: (CardColor | null)[];
  discardTop: CardColor | null;
  discardSize: number;
  deckSize: number;
  ticketDeckSize: number;
  claims: Partial<Record<LaneId, SeatId>>;
  finalRound: null | { triggeredBy: SeatId; turnsLeft: number };
}

export type TicketStatus = 'open' | 'complete' | 'blocked';

export interface TicketOutlook {
  status: TicketStatus;
  /** fewest trains still needed over own routes plus open lanes; Infinity when blocked by the network */
  trainsNeeded: number;
  /** the last claim raised trainsNeeded */
  cut: boolean;
}

export interface SeatView extends PublicView {
  seat: SeatId;
  hand: Hand;
  myTickets: TicketId[];
  /** the pending offer for this seat, if any */
  offer?: TicketId[];
  outlooks: Partial<Record<TicketId, TicketOutlook>>;
}
