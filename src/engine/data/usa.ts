// ★ Contract file (PLAN.md §2.2): the Ticket to Ride USA board, pinned to the 2015 rulebook.
// Owned by R. Frozen after the Phase 0 PDF cross-read; additive optional fields only after that.
//
// Every row equals docs/RULES.md Appendices A–C (tests/engine/data.test.ts checks row for row).
// Ported from Iron Atlas src/game/data.ts (MIT) and checked against the 2015 physical board:
// no row differs. City lat/lon are real coordinates (city centres, WGS84, 4 dp), added here for
// the projection; they are not rules.
//
// Pure data: no DOM, no randomness. Imports types only from ../types.

import type { CardColor, City, CityId, Lane, LaneColor, LaneId, Ticket, TicketId } from '../types';
import { CARD_COLORS } from '../types';

type Len = Lane['length'];

const city = (id: string, name: string, lat: number, lon: number): City =>
  ({ id: id as CityId, name, lat, lon });

const ticket = (id: string, a: string, b: string, points: number): Ticket =>
  ({ id: id as TicketId, a: a as CityId, b: b as CityId, points });

interface Row { id: LaneId; a: CityId; b: CityId; length: Len; color: LaneColor; double?: string }
const row = (id: string, a: string, b: string, length: Len, color: LaneColor, double?: string): Row =>
  ({ id: id as LaneId, a: a as CityId, b: b as CityId, length, color, ...(double ? { double } : {}) });

// ---------------------------------------------------------------------------
// Appendix C · Cities (36), with lat/lon for the Albers projection
// ---------------------------------------------------------------------------

export const CITIES: readonly City[] = [
  city('vancouver', 'Vancouver', 49.2827, -123.1207),
  city('calgary', 'Calgary', 51.0447, -114.0719),
  city('winnipeg', 'Winnipeg', 49.8951, -97.1384),
  city('montreal', 'Montréal', 45.5017, -73.5673),
  city('boston', 'Boston', 42.3601, -71.0589),
  city('seattle', 'Seattle', 47.6062, -122.3321),
  city('portland', 'Portland', 45.5152, -122.6784),
  city('helena', 'Helena', 46.5891, -112.0391),
  city('duluth', 'Duluth', 46.7867, -92.1005),
  city('sault-ste-marie', 'Sault Ste. Marie', 46.5219, -84.3461),
  city('toronto', 'Toronto', 43.6532, -79.3832),
  city('new-york', 'New York', 40.7128, -74.0060),
  city('san-francisco', 'San Francisco', 37.7749, -122.4194),
  city('salt-lake-city', 'Salt Lake City', 40.7608, -111.8910),
  city('denver', 'Denver', 39.7392, -104.9903),
  city('omaha', 'Omaha', 41.2565, -95.9345),
  city('kansas-city', 'Kansas City', 39.0997, -94.5786),
  city('st-louis', 'St. Louis', 38.6270, -90.1994),
  city('chicago', 'Chicago', 41.8781, -87.6298),
  city('pittsburgh', 'Pittsburgh', 40.4406, -79.9959),
  city('washington', 'Washington', 38.9072, -77.0369),
  city('raleigh', 'Raleigh', 35.7796, -78.6382),
  city('nashville', 'Nashville', 36.1627, -86.7816),
  city('atlanta', 'Atlanta', 33.7490, -84.3880),
  city('charleston', 'Charleston', 32.7765, -79.9311),
  city('miami', 'Miami', 25.7617, -80.1918),
  city('new-orleans', 'New Orleans', 29.9511, -90.0715),
  city('houston', 'Houston', 29.7604, -95.3698),
  city('dallas', 'Dallas', 32.7767, -96.7970),
  city('oklahoma-city', 'Oklahoma City', 35.4676, -97.5164),
  city('little-rock', 'Little Rock', 34.7465, -92.2896),
  city('santa-fe', 'Santa Fe', 35.6870, -105.9378),
  city('el-paso', 'El Paso', 31.7619, -106.4850),
  city('phoenix', 'Phoenix', 33.4484, -112.0740),
  city('las-vegas', 'Las Vegas', 36.1699, -115.1398),
  city('los-angeles', 'Los Angeles', 34.0522, -118.2437),
];

// ---------------------------------------------------------------------------
// Appendix A · Lanes (100). Each lane is claimed separately; a double names its pair.
// ---------------------------------------------------------------------------

const ROWS: readonly Row[] = [
  row('vancouver-calgary', 'vancouver', 'calgary', 3, 'gray'),
  row('vancouver-seattle-1', 'vancouver', 'seattle', 1, 'gray', 'vancouver-seattle'),
  row('vancouver-seattle-2', 'vancouver', 'seattle', 1, 'gray', 'vancouver-seattle'),
  row('calgary-seattle', 'calgary', 'seattle', 4, 'gray'),
  row('calgary-helena', 'calgary', 'helena', 4, 'gray'),
  row('calgary-winnipeg', 'calgary', 'winnipeg', 6, 'white'),
  row('seattle-portland-1', 'seattle', 'portland', 1, 'gray', 'seattle-portland'),
  row('seattle-portland-2', 'seattle', 'portland', 1, 'gray', 'seattle-portland'),
  row('seattle-helena', 'seattle', 'helena', 6, 'yellow'),
  row('portland-san-francisco-1', 'portland', 'san-francisco', 5, 'green', 'portland-san-francisco'),
  row('portland-san-francisco-2', 'portland', 'san-francisco', 5, 'purple', 'portland-san-francisco'),
  row('portland-salt-lake-city', 'portland', 'salt-lake-city', 6, 'blue'),
  row('san-francisco-salt-lake-city-1', 'san-francisco', 'salt-lake-city', 5, 'orange', 'san-francisco-salt-lake-city'),
  row('san-francisco-salt-lake-city-2', 'san-francisco', 'salt-lake-city', 5, 'white', 'san-francisco-salt-lake-city'),
  row('san-francisco-los-angeles-1', 'san-francisco', 'los-angeles', 3, 'yellow', 'san-francisco-los-angeles'),
  row('san-francisco-los-angeles-2', 'san-francisco', 'los-angeles', 3, 'purple', 'san-francisco-los-angeles'),
  row('los-angeles-las-vegas', 'los-angeles', 'las-vegas', 2, 'gray'),
  row('los-angeles-phoenix', 'los-angeles', 'phoenix', 3, 'gray'),
  row('los-angeles-el-paso', 'los-angeles', 'el-paso', 6, 'black'),
  row('las-vegas-salt-lake-city', 'las-vegas', 'salt-lake-city', 3, 'orange'),
  row('phoenix-santa-fe', 'phoenix', 'santa-fe', 3, 'gray'),
  row('phoenix-el-paso', 'phoenix', 'el-paso', 3, 'gray'),
  row('phoenix-denver', 'phoenix', 'denver', 5, 'white'),
  row('salt-lake-city-helena', 'salt-lake-city', 'helena', 3, 'purple'),
  row('salt-lake-city-denver-1', 'salt-lake-city', 'denver', 3, 'red', 'salt-lake-city-denver'),
  row('salt-lake-city-denver-2', 'salt-lake-city', 'denver', 3, 'yellow', 'salt-lake-city-denver'),
  row('helena-winnipeg', 'helena', 'winnipeg', 4, 'blue'),
  row('helena-duluth', 'helena', 'duluth', 6, 'orange'),
  row('helena-omaha', 'helena', 'omaha', 5, 'red'),
  row('helena-denver', 'helena', 'denver', 4, 'green'),
  row('denver-santa-fe', 'denver', 'santa-fe', 2, 'gray'),
  row('denver-oklahoma-city', 'denver', 'oklahoma-city', 4, 'red'),
  row('denver-kansas-city-1', 'denver', 'kansas-city', 4, 'black', 'denver-kansas-city'),
  row('denver-kansas-city-2', 'denver', 'kansas-city', 4, 'orange', 'denver-kansas-city'),
  row('denver-omaha', 'denver', 'omaha', 4, 'purple'),
  row('santa-fe-el-paso', 'santa-fe', 'el-paso', 2, 'gray'),
  row('santa-fe-oklahoma-city', 'santa-fe', 'oklahoma-city', 3, 'blue'),
  row('el-paso-oklahoma-city', 'el-paso', 'oklahoma-city', 5, 'yellow'),
  row('el-paso-dallas', 'el-paso', 'dallas', 4, 'red'),
  row('el-paso-houston', 'el-paso', 'houston', 6, 'green'),
  row('winnipeg-duluth', 'winnipeg', 'duluth', 4, 'black'),
  row('winnipeg-sault-ste-marie', 'winnipeg', 'sault-ste-marie', 6, 'gray'),
  row('duluth-sault-ste-marie', 'duluth', 'sault-ste-marie', 3, 'gray'),
  row('duluth-toronto', 'duluth', 'toronto', 6, 'purple'),
  row('duluth-chicago', 'duluth', 'chicago', 3, 'red'),
  row('duluth-omaha-1', 'duluth', 'omaha', 2, 'gray', 'duluth-omaha'),
  row('duluth-omaha-2', 'duluth', 'omaha', 2, 'gray', 'duluth-omaha'),
  row('omaha-chicago', 'omaha', 'chicago', 4, 'blue'),
  row('omaha-kansas-city-1', 'omaha', 'kansas-city', 1, 'gray', 'omaha-kansas-city'),
  row('omaha-kansas-city-2', 'omaha', 'kansas-city', 1, 'gray', 'omaha-kansas-city'),
  row('kansas-city-st-louis-1', 'kansas-city', 'st-louis', 2, 'blue', 'kansas-city-st-louis'),
  row('kansas-city-st-louis-2', 'kansas-city', 'st-louis', 2, 'purple', 'kansas-city-st-louis'),
  row('kansas-city-oklahoma-city-1', 'kansas-city', 'oklahoma-city', 2, 'gray', 'kansas-city-oklahoma-city'),
  row('kansas-city-oklahoma-city-2', 'kansas-city', 'oklahoma-city', 2, 'gray', 'kansas-city-oklahoma-city'),
  row('oklahoma-city-little-rock', 'oklahoma-city', 'little-rock', 2, 'gray'),
  row('oklahoma-city-dallas-1', 'oklahoma-city', 'dallas', 2, 'gray', 'oklahoma-city-dallas'),
  row('oklahoma-city-dallas-2', 'oklahoma-city', 'dallas', 2, 'gray', 'oklahoma-city-dallas'),
  row('dallas-houston-1', 'dallas', 'houston', 1, 'gray', 'dallas-houston'),
  row('dallas-houston-2', 'dallas', 'houston', 1, 'gray', 'dallas-houston'),
  row('dallas-little-rock', 'dallas', 'little-rock', 2, 'gray'),
  row('houston-new-orleans', 'houston', 'new-orleans', 2, 'gray'),
  row('little-rock-new-orleans', 'little-rock', 'new-orleans', 3, 'green'),
  row('little-rock-nashville', 'little-rock', 'nashville', 3, 'white'),
  row('little-rock-st-louis', 'little-rock', 'st-louis', 2, 'gray'),
  row('st-louis-chicago-1', 'st-louis', 'chicago', 2, 'green', 'st-louis-chicago'),
  row('st-louis-chicago-2', 'st-louis', 'chicago', 2, 'white', 'st-louis-chicago'),
  row('st-louis-pittsburgh', 'st-louis', 'pittsburgh', 5, 'green'),
  row('st-louis-nashville', 'st-louis', 'nashville', 2, 'gray'),
  row('chicago-pittsburgh-1', 'chicago', 'pittsburgh', 3, 'orange', 'chicago-pittsburgh'),
  row('chicago-pittsburgh-2', 'chicago', 'pittsburgh', 3, 'black', 'chicago-pittsburgh'),
  row('chicago-toronto', 'chicago', 'toronto', 4, 'white'),
  row('sault-ste-marie-toronto', 'sault-ste-marie', 'toronto', 2, 'gray'),
  row('sault-ste-marie-montreal', 'sault-ste-marie', 'montreal', 5, 'black'),
  row('toronto-montreal', 'toronto', 'montreal', 3, 'gray'),
  row('toronto-pittsburgh', 'toronto', 'pittsburgh', 2, 'gray'),
  row('montreal-boston-1', 'montreal', 'boston', 2, 'gray', 'montreal-boston'),
  row('montreal-boston-2', 'montreal', 'boston', 2, 'gray', 'montreal-boston'),
  row('montreal-new-york', 'montreal', 'new-york', 3, 'blue'),
  row('boston-new-york-1', 'boston', 'new-york', 2, 'yellow', 'boston-new-york'),
  row('boston-new-york-2', 'boston', 'new-york', 2, 'red', 'boston-new-york'),
  row('new-york-pittsburgh-1', 'new-york', 'pittsburgh', 2, 'white', 'new-york-pittsburgh'),
  row('new-york-pittsburgh-2', 'new-york', 'pittsburgh', 2, 'green', 'new-york-pittsburgh'),
  row('new-york-washington-1', 'new-york', 'washington', 2, 'orange', 'new-york-washington'),
  row('new-york-washington-2', 'new-york', 'washington', 2, 'black', 'new-york-washington'),
  row('pittsburgh-washington', 'pittsburgh', 'washington', 2, 'gray'),
  row('pittsburgh-raleigh', 'pittsburgh', 'raleigh', 2, 'gray'),
  row('pittsburgh-nashville', 'pittsburgh', 'nashville', 4, 'yellow'),
  row('washington-raleigh-1', 'washington', 'raleigh', 2, 'gray', 'washington-raleigh'),
  row('washington-raleigh-2', 'washington', 'raleigh', 2, 'gray', 'washington-raleigh'),
  row('raleigh-nashville', 'raleigh', 'nashville', 3, 'black'),
  row('raleigh-atlanta-1', 'raleigh', 'atlanta', 2, 'gray', 'raleigh-atlanta'),
  row('raleigh-atlanta-2', 'raleigh', 'atlanta', 2, 'gray', 'raleigh-atlanta'),
  row('raleigh-charleston', 'raleigh', 'charleston', 2, 'gray'),
  row('nashville-atlanta', 'nashville', 'atlanta', 1, 'gray'),
  row('atlanta-charleston', 'atlanta', 'charleston', 2, 'gray'),
  row('charleston-miami', 'charleston', 'miami', 4, 'purple'),
  row('atlanta-miami', 'atlanta', 'miami', 5, 'blue'),
  row('atlanta-new-orleans-1', 'atlanta', 'new-orleans', 4, 'yellow', 'atlanta-new-orleans'),
  row('atlanta-new-orleans-2', 'atlanta', 'new-orleans', 4, 'orange', 'atlanta-new-orleans'),
  row('new-orleans-miami', 'new-orleans', 'miami', 6, 'red'),
];

// ---------------------------------------------------------------------------
// Derived lanes: the contract shape (types.ts Lane), with each double's sibling resolved.
// ---------------------------------------------------------------------------

/** Lane id → its double group (RULES.md Appendix A, "Double group"); absent for single lanes. */
export const DOUBLE_GROUP: Readonly<Partial<Record<LaneId, string>>> = Object.freeze(
  Object.fromEntries(ROWS.filter(r => r.double).map(r => [r.id, r.double!])),
);

export const LANES: readonly Lane[] = ROWS.map(r => {
  const lane: Lane = { id: r.id, a: r.a, b: r.b, length: r.length, color: r.color };
  if (r.double) {
    const sib = ROWS.find(o => o.double === r.double && o.id !== r.id);
    if (!sib) throw new Error(`usa.ts: double ${r.double} has one lane`);
    lane.sibling = sib.id;
  }
  return Object.freeze(lane);
});

// ---------------------------------------------------------------------------
// Appendix B · Destination tickets (30). Points are printed values (R-T6).
// ---------------------------------------------------------------------------

export const TICKETS: readonly Ticket[] = [
  ticket('boston-miami', 'boston', 'miami', 12),
  ticket('calgary-phoenix', 'calgary', 'phoenix', 13),
  ticket('calgary-salt-lake-city', 'calgary', 'salt-lake-city', 7),
  ticket('chicago-new-orleans', 'chicago', 'new-orleans', 7),
  ticket('chicago-santa-fe', 'chicago', 'santa-fe', 9),
  ticket('dallas-new-york', 'dallas', 'new-york', 11),
  ticket('denver-el-paso', 'denver', 'el-paso', 4),
  ticket('denver-pittsburgh', 'denver', 'pittsburgh', 11),
  ticket('duluth-el-paso', 'duluth', 'el-paso', 10),
  ticket('duluth-houston', 'duluth', 'houston', 8),
  ticket('helena-los-angeles', 'helena', 'los-angeles', 8),
  ticket('kansas-city-houston', 'kansas-city', 'houston', 5),
  ticket('los-angeles-chicago', 'los-angeles', 'chicago', 16),
  ticket('los-angeles-miami', 'los-angeles', 'miami', 20),
  ticket('los-angeles-new-york', 'los-angeles', 'new-york', 21),
  ticket('montreal-atlanta', 'montreal', 'atlanta', 9),
  ticket('montreal-new-orleans', 'montreal', 'new-orleans', 13),
  ticket('new-york-atlanta', 'new-york', 'atlanta', 6),
  ticket('portland-nashville', 'portland', 'nashville', 17),
  ticket('portland-phoenix', 'portland', 'phoenix', 11),
  ticket('san-francisco-atlanta', 'san-francisco', 'atlanta', 17),
  ticket('sault-ste-marie-nashville', 'sault-ste-marie', 'nashville', 8),
  ticket('sault-ste-marie-oklahoma-city', 'sault-ste-marie', 'oklahoma-city', 9),
  ticket('seattle-los-angeles', 'seattle', 'los-angeles', 9),
  ticket('seattle-new-york', 'seattle', 'new-york', 22),
  ticket('toronto-miami', 'toronto', 'miami', 10),
  ticket('vancouver-montreal', 'vancouver', 'montreal', 20),
  ticket('vancouver-santa-fe', 'vancouver', 'santa-fe', 13),
  ticket('winnipeg-houston', 'winnipeg', 'houston', 12),
  ticket('winnipeg-little-rock', 'winnipeg', 'little-rock', 11),
];

// ---------------------------------------------------------------------------
// Components (RULES.md §Components, §Setup, R-C4)
// ---------------------------------------------------------------------------

/** The 110 train cards: 12 of each of the 8 colours and 14 locomotives. */
export const DECK_COMPOSITION: Readonly<Record<CardColor, number>> = Object.freeze({
  red: 12, orange: 12, yellow: 12, green: 12, blue: 12, purple: 12, black: 12, white: 12, loco: 14,
});
export const DECK_SIZE = CARD_COLORS.reduce((n, c) => n + DECK_COMPOSITION[c], 0);

/** R-C4: points by lane length (index = length; 0 unused). */
export const ROUTE_POINTS: readonly number[] = Object.freeze([0, 1, 2, 4, 7, 10, 15]);

export const TRAINS_PER_SEAT = 45;          // R-S3
export const OPENING_HAND = 4;              // R-S1
export const MARKET_SIZE = 5;               // R-S2
export const MARKET_LOCO_LIMIT = 3;         // R-D6: 3 or more face-up locomotives clear the market
export const OPENING_OFFER = 3;             // R-S4
export const OPENING_MIN_KEEP = 2;          // R-S4
export const TICKET_OFFER = 3;              // R-T1
export const TICKET_MIN_KEEP = 1;           // R-T1
export const FINAL_ROUND_TRAINS = 2;        // R-E1: 0, 1 or 2 trains left triggers the final round
export const LONGEST_BONUS = 10;            // R-S3, R-E4
export const MIN_SEATS = 2;
export const MAX_SEATS = 5;
/** R-C7/R-C8: at this many seats or fewer, a claimed double closes its sibling (H1 opens them). */
export const DOUBLES_CLOSED_AT_OR_BELOW = 3;

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export const CITY_BY_ID: ReadonlyMap<CityId, City> = new Map(CITIES.map(c => [c.id, c]));
export const LANE_BY_ID: ReadonlyMap<LaneId, Lane> = new Map(LANES.map(l => [l.id, l]));
export const TICKET_BY_ID: ReadonlyMap<TicketId, Ticket> = new Map(TICKETS.map(t => [t.id, t]));

/** City → the lanes touching it, in Appendix A order. */
export const LANES_AT: ReadonlyMap<CityId, readonly Lane[]> = new Map(
  CITIES.map(c => [c.id, LANES.filter(l => l.a === c.id || l.b === c.id)]),
);

export const cityName = (id: CityId): string => CITY_BY_ID.get(id)?.name ?? id;
