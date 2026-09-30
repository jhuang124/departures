// ★ Contract file (PLAN.md §4.2, §4.4). The board geometry every renderer, picker and test reads.
// Written by R (board.stub.json: straight lanes, uniform slots) and G (board.json: the real solve).
// Additive optional fields only after Phase 0.
//
// Board space is 1000 × 620 units (Albers conic, parallels 29.5°/45.5°, centre −96°), x east, y south
// (y = 0 is the northern edge, as on the printed map), z up (relief height in the same units).

import type { CityId, LaneColor, LaneId } from '../engine/types';

export const BOARD_W = 1000;
export const BOARD_H = 620;
/** Every slot on the board is exactly this size (PLAN §4.4): length reads by count. */
export const SLOT_W = 26;
export const SLOT_H = 10;
/** A car: 24 × 9 × 7 u (PLAN §4.9). */
export const CAR_W = 24;
export const CAR_H = 9;
export const CAR_D = 7;
/** City disc radius; the disc is also the station mask (PLAN §4.7). */
export const DISC_R = 7;

export type Vec2 = [x: number, y: number];

/** One slot centre, ordered from the lane's `a` end to its `b` end. */
export interface Slot {
  x: number;
  y: number;
  /** relief height under the slot centre (0 on the stub) */
  z: number;
  /** radians, rotation about z; 0 = pointing east (+x), measured toward +y */
  yaw: number;
  /** radians, climb along the lane from a to b */
  pitch: number;
}

export type LabelAnchor = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export interface BoardCity {
  id: CityId;
  name: string;
  x: number;
  y: number;
  z: number;
  /** where the DOM label sits, in board units, and which side of the disc it hangs from */
  label: { x: number; y: number; anchor: LabelAnchor; /** 0.9–1 when stepped down to fit */ scale?: number };
  /** hand nudge applied after projection, |d| ≤ 25 u (G) */
  nudge?: Vec2;
}

/** The lane's centreline: a straight chord or a quadratic Bézier (PLAN §4.4). */
export type LanePath =
  | { kind: 'line'; p0: Vec2; p1: Vec2 }
  | { kind: 'quad'; p0: Vec2; c: Vec2; p1: Vec2 };

export interface BoardLane {
  id: LaneId;
  a: CityId;
  b: CityId;
  length: 1 | 2 | 3 | 4 | 5 | 6;
  color: LaneColor;
  sibling?: LaneId;
  /** ±7 u for the two lanes of a double, 0 otherwise */
  offset: number;
  path: LanePath;
  /** exactly `length` slots, ordered a → b */
  slots: Slot[];
  /** 2D hit polygon in board units (slot union inflated; doubles split along the centreline) */
  hit: Vec2[];
}

export interface BoardGeometry {
  v: 1;
  /** true for R's board.stub.json (straight lanes, no relief) */
  stub?: boolean;
  width: typeof BOARD_W;
  height: typeof BOARD_H;
  slot: { w: typeof SLOT_W; h: typeof SLOT_H };
  discR: number;
  projection: { kind: 'albers'; parallels: [number, number]; centerLon: number; scale: number; translate: Vec2 };
  cities: BoardCity[];
  lanes: BoardLane[];
  /** coastline and lake rings in board units (G); absent on the stub */
  coast?: Vec2[][];
  lakes?: Vec2[][];
  /** the bounded poster warp, if one was needed (PLAN §4.4), reported as a list of control points */
  warp?: { from: Vec2; to: Vec2 }[];
}
