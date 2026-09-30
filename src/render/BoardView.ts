// ★ Contract file (PLAN.md §3.5). What the controller talks to. P implements it (render/index.ts,
// createBoardView); C's stubBoard implements it in Node. Additive optional fields only after Phase 0.
//
// Privacy by type: play() takes BoardEvent, which excludes every private kind, and setPick() has NO
// ticket input, ever (pillar 4). Board taps only pick; nothing here commits.

import type { AudioBus } from '../audio/types';
import type { BoardGeometry } from '../data/boardTypes';
import type { BoardEvent, CityId, LaneId, PublicView } from '../engine/types';
import type { PlaySpeed } from '../game/timing';

export interface ScreenPoint { x: number; y: number }

export interface Insets { top: number; right: number; bottom: number; left: number }

export interface LastDeparture {
  lane: LaneId;
  /** performance.now() stamps */
  whistleAt: number;
  firstMoveAt: number;
  settleAt: number;
  /** ms between chug pulses, in order (the departure gate checks they shrink over the first 40 %) */
  chugIntervals?: number[];
}

export interface BoardStats {
  fps: number;
  frameMsP95: number;
  /** frames actually drawn per second (the idle loop draws at ≤ 30) */
  drawnFps: number;
  activeTweens: number;
  plateBakeMs: number;
  /** cars whose visibility turned on outside a station mask; the pops gate is 0 */
  appearedOffStation: number;
  lastDeparture: LastDeparture | null;
  /** hash of the light uniforms (the day-cycle guard: turn 1 equals turn 40) */
  lightHash: string;
  /** hash of every piece's transform (stillness) */
  transformsHash: string;
  /** 'golden' | 'night' | a fall in progress */
  light?: { to: 'golden' | 'night'; t: number };
  /** the ink-line candidate in use (Soul question 10) */
  ink?: 'A' | 'B' | 'C';
}

export interface PlayOpts { speed?: PlaySpeed }

export interface BoardView {
  /** bakes the golden plate; resolves when lit */
  mount(el: HTMLElement, board: BoardGeometry): Promise<void>;
  /** snap to state (load, resume, after instant) */
  sync(view: PublicView): void;
  play(e: BoardEvent, opts?: PlayOpts): Promise<void>;
  /** compress running motion to ≤ 160 ms; never snaps */
  finish(): void;
  /** NO ticket input, ever (pillar 4, privacy) */
  setPick(p: { lane?: LaneId | null; dim?: LaneId[] }): void;
  /** pick only; never commits */
  onLaneTap(cb: (lane: LaneId, at: ScreenPoint) => void): void;
  onLaneHover(cb: (lane: LaneId | null) => void): void;
  setLight(to: 'golden' | 'night', ms: number): Promise<void>;
  /** re-fit and re-bake (debounced 200 ms) */
  setInsets(r: Insets): void;
  /** the board plays whistle, chug and clank on its own frames */
  setAudio(a: AudioBus | null): void;
  setReducedMotion(on: boolean): void;
  /** HUD ticks trains-left per car */
  onDepartureProgress(cb: (carsOut: number) => void): void;
  /** CSS px, for labels, UI anchors, tests */
  project(p: CityId | LaneId): ScreenPoint;
  stats(): BoardStats;
  /** screen-space rects of a lane's slots (CSS px), for __dep.laneRects and the legibility gate */
  laneRects?(lane: LaneId): { x: number; y: number; w: number; h: number; angle: number }[];
  dispose?(): void;
}
