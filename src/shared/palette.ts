// ★ Contract file (PLAN.md §4.6). Structure is fixed; VALUES are proposals the gates decide.
// Value tuning: P owns print and finishes, L owns the lamp colour; every change is reported with the gate
// result that justified it. Assertions live in tests/render/palette.test.ts (ΔE2000 unless noted).

import type { CardColor, Finish, LaneColor } from '../engine/types';

export type Hex = `#${string}`;

export interface RouteHue {
  /** full-strength outline */
  outline: Hex;
  /** fill tint alpha over the plate: starts at 0.18, may rise per hue only to pass the squint gate, cap 0.45 */
  tint: number;
  /** black and white carry an extra 1 px keyline so they read on dark and light land */
  keyline?: { color: Hex; px: number; side: 'inner' | 'outer' };
}

export const TINT_MIN = 0.18;
export const TINT_MAX = 0.45;

export const ROUTE_HUES: Record<LaneColor, RouteHue> = {
  red: { outline: '#C8412E', tint: 0.18 },
  orange: { outline: '#D9772A', tint: 0.18 },
  /** lemon, kept away from the gold */
  yellow: { outline: '#E3D03C', tint: 0.18 },
  green: { outline: '#3F8A4A', tint: 0.18 },
  blue: { outline: '#2F62A8', tint: 0.18 },
  purple: { outline: '#8A4E9C', tint: 0.18 },
  black: { outline: '#23262B', tint: 0.18, keyline: { color: '#E9DFC6', px: 1, side: 'inner' } },
  white: { outline: '#F1ECDD', tint: 0.18, keyline: { color: '#15130F', px: 1, side: 'outer' } },
  gray: { outline: '#9A968C', tint: 0.18 },
};

/** Card faces use the route hue; the locomotive is all eight hues in bands (PLAN §5.4). */
export const CARD_HUES: Record<Exclude<CardColor, 'loco'>, Hex> = {
  red: ROUTE_HUES.red.outline,
  orange: ROUTE_HUES.orange.outline,
  yellow: ROUTE_HUES.yellow.outline,
  green: ROUTE_HUES.green.outline,
  blue: ROUTE_HUES.blue.outline,
  purple: ROUTE_HUES.purple.outline,
  black: ROUTE_HUES.black.outline,
  white: ROUTE_HUES.white.outline,
};
export const LOCO_BANDS: readonly Exclude<CardColor, 'loco'>[] = [
  'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white',
];

/** Every slot also gets a 1 px ink keyline at this alpha (0.6 at night, PLAN §4.7). */
export const SLOT_KEYLINE = { color: '#15130F' as Hex, px: 1, alpha: 0.4, alphaNight: 0.6 };

/** The one thing happening now. Flat, never shaded. */
export const GOLD: Hex = '#F0B24A';
/** Ink, with a cream inner keyline at 1.5 px. */
export const INK: Hex = '#15130F';
export const CREAM: Hex = '#E9DFC6';
export const INK_KEYLINE = { color: CREAM, px: 1.5 };
/** Night lamp: window strips and city lamps, the same for every finish (L tunes). */
export const LAMP: Hex = '#FFD58A';
/** The CANCELLED / UNFINISHED stamp ink (PLAN §5.9), at 85 %. */
export const STAMP: Hex = '#A23A2A';
export const STAMP_ALPHA = 0.85;
/** Low ivory for records and idle words (UI). */
export const IVORY: Hex = '#F4EEDD';

/** The dark border of the frame (the lithograph's border; SOUL touchstone Ragan / Bonestell). */
export const FRAME: Hex = '#15130F';

export interface FinishRamp {
  shadow: Hex;
  base: Hex;
  highlight: Hex;
  /** target lit L* (CIELAB); the ladder must classify from greyscale alone */
  litL: number;
  signature: string;
}

/** Finishes read by value and sheen, never by hue (PLAN §4.6). Outline 0.8 u inverted hull. */
export const FINISH_RAMPS: Record<Finish, FinishRamp> = {
  enamel: { shadow: '#A89B7C', base: '#EDE3C8', highlight: '#FFF8E6', litL: 90, signature: 'matte, 1 px ink trim along the roof' },
  chrome: { shadow: '#4A5560', base: '#B9C3CC', highlight: '#FFFFFF', litL: 78, signature: 'widest, hardest specular band over a dark horizon band' },
  brass: { shadow: '#5E4518', base: '#B8913A', highlight: '#F3D98A', litL: 66, signature: 'warm band, dark green windows; always shows its dark band' },
  copper: { shadow: '#5A2A18', base: '#B0603A', highlight: '#F0A983', litL: 48, signature: 'red-warm band' },
  /** highlight is the rim */
  gunmetal: { shadow: '#1E2227', base: '#4A5058', highlight: '#9AA3AD', litL: 28, signature: 'cream window strip' },
};
export const FINISH_OUTLINE_U = 0.8;

/** Land albedo proposals (PLAN §4.5); L tunes at the look gate. */
export const LAND = {
  plains: '#EAD9A6' as Hex,
  prairie: '#C9C26A' as Hex,
  desert: '#D99A5E' as Hex,
  ranges: '#9C86B8' as Hex,
  highPeaks: '#E6DCE6' as Hex,
  nwFir: '#2E5A45' as Hex,
  easternForest: '#5E8F4E' as Hex,
  southernPine: '#4F7F48' as Hex,
  band4Shadow: '#6E5E8E' as Hex,
  nightFloor: '#0F2A33' as Hex,
  waterDeep: '#1F6F7A' as Hex,
  waterShallow: '#3FA3A0' as Hex,
  inkLine: '#2A2140' as Hex,
};

/** ΔE floors asserted by tests/render/palette.test.ts (PLAN §4.6). */
export const PALETTE_FLOORS = {
  routeHuesPairwise: 20,
  grayVsBlackWhite: 15,
  goldVsHue: 12,
  goldVsBrassBase: 12,
  finishesGolden: 15,
  finishesNight: 10,
  finishDeltaL: 10,
  finishesColourBlind: 8,
};
