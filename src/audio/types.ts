// ★ Contract file (PLAN.md §3.6 "Sound ownership", §8.3 S). Additive optional fields only after Phase 0.
// Who plays what: the board plays whistle, chug and clank (bound to its frames); the UI plays card and
// poster sounds; the controller plays only the scoring cues and the strings' resolve.

export type Cue =
  // board (render/)
  | 'whistle' // far, 3-pipe chord, ~900 ms: the loudest thing in the game; claims only (Soul question 9)
  | 'chug' // one pulse; rate follows wheel travel
  | 'clank' // the last car settles
  | 'slide' // the `skip` departure: one soft slide under the clank
  // ui (ui/)
  | 'cardRoll'
  | 'couple' // a card couples into its slot
  | 'riffle' // deck reshuffled
  | 'shunt' // a card draw or ticket draw: the verb that is not a departure
  | 'posterSlide'
  | 'uiTick' // a pick acknowledged (very quiet)
  // controller (game/)
  | 'reveal' // a ticket turned at scoring
  | 'trail' // the lit locomotive at scoring
  | 'stringsResolve';

export type CueSource = 'board' | 'ui' | 'controller';

export interface CueOpts {
  /** stereo pan −1 (west) … 1 (east); the board derives it from projected x */
  pan?: number;
  /** linear gain multiplier on the cue's own level, default 1 */
  gain?: number;
  /** delay from now, ms */
  delayMs?: number;
  /** chug rate or pitch multiplier */
  rate?: number;
  /** far reverb send (the whistle is always far) */
  far?: boolean;
  /** the engine event this cue plays, so the privacy flow can prove no private event made a sound */
  eventId?: number;
  source?: CueSource;
}

export type Bed = 'off' | 'golden' | 'night';

export interface Volumes { master: number; music: number; effects: number }

export interface AudioLogEntry {
  cue: Cue;
  /** performance.now() when scheduled to sound */
  t: number;
  source: CueSource;
  pan?: number;
  eventId?: number;
}

export interface AudioBus {
  /** resume the AudioContext after the first user gesture */
  unlock(): Promise<void>;
  readonly unlocked: boolean;
  play(cue: Cue, opts?: CueOpts): void;
  /** the wind-and-birds bed (strings in Phase 2); crossfades */
  setBed(bed: Bed, ms?: number): void;
  setVolumes(v: Partial<Volumes>): void;
  /** duck everything but the whistle for `ms` */
  duck(ms: number): void;
  /** every cue played since boot, for the e2e audio log (window.__dep.audioLog()) */
  log(): readonly AudioLogEntry[];
}
