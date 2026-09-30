// VENDORED, DEV-ONLY entry point for the Iron Atlas oracle (PLAN.md §6, "Differential test").
//
// What is here, all from Iron Atlas (MIT, ./LICENSE) at commit 77b5158a:
//   data.ts    verbatim src/game/data.ts   (cities with Iron Atlas's own map x/y, 100 routes, 30 tickets)
//   types.ts   verbatim src/game/types.ts  (GameState, which engine.ts's signatures need)
//   engine.ts  verbatim isTicketComplete + longestRoute from src/game/engine.ts
//   index.ts   this adapter (ours): runs those functions on Departures-shaped claims
//
// Rules: never import this from src/; never ship it; never
// import across repos. Lane ids and ticket ids are identical in both projects (tests/engine/data.test.ts
// proves it), so Departures claims pass through unchanged.

import { isTicketComplete, longestRoute } from './engine';
import type { GameState } from './types';

export { CITIES as IA_CITIES, ROUTES as IA_ROUTES, TICKETS as IA_TICKETS, SCORE_BY_LENGTH as IA_SCORE_BY_LENGTH } from './data';

/** Departures claims: lane id → seat. */
export type Claims = Readonly<Partial<Record<string, number>>>;

/** The smallest Iron Atlas GameState the two oracle functions read (claims and players[seat]). */
export function ironAtlasState(claims: Claims, seats: number): GameState {
  const clean: Record<string, number> = {};
  for (const [lane, seat] of Object.entries(claims)) if (seat !== undefined) clean[lane] = seat;
  return {
    version: 1, rng: 0,
    players: Array.from({ length: seats }, (_, id) => ({
      id, name: `P${id}`, kind: 'ai' as const, color: '#000', hand: [], tickets: [], trains: 45, score: 0,
    })),
    activePlayer: 0, phase: 'turn', pendingTickets: null,
    deck: [], discard: [], market: [], ticketDeck: [], claims: clean,
    finalTurnsRemaining: null, turn: 1, log: [],
  };
}

/** Iron Atlas's exact longest edge-simple trail for `seat`, in trains. */
export function oracleLongest(claims: Claims, seat: number, seats = 5): number {
  return longestRoute(ironAtlasState(claims, seats), seat);
}

/** Iron Atlas's ticket completion: `seat`'s own routes join the ticket's two cities. */
export function oracleTicketComplete(claims: Claims, seat: number, ticket: string, seats = 5): boolean {
  return isTicketComplete(ironAtlasState(claims, seats), seat, ticket);
}
