// VENDORED, DEV-ONLY. Verbatim copy of isTicketComplete and longestRoute from Iron Atlas
// src/game/engine.ts (lines 293–359) at commit 77b5158a (MIT, see ./LICENSE). Only the imports are
// trimmed to what these two functions need. Never shipped, never imported from src/.
// The oracle for tests/engine/diff.test.ts (PLAN.md §6, "Differential test").

import { ROUTES, TICKETS } from './data';
import type { GameState } from './types';

const ticketById = new Map(TICKETS.map(ticket => [ticket.id, ticket]));

export function isTicketComplete(state: GameState, playerId: number, ticketId: string): boolean {
  const ticket = ticketById.get(ticketId);
  if (!ticket || !state.players[playerId]) return false;
  const adjacency = new Map<string, string[]>();
  for (const route of ROUTES) {
    if (state.claims[route.id] !== playerId) continue;
    adjacency.set(route.from, [...(adjacency.get(route.from) ?? []), route.to]);
    adjacency.set(route.to, [...(adjacency.get(route.to) ?? []), route.from]);
  }
  const visited = new Set([ticket.from]);
  const queue = [ticket.from];
  for (let index = 0; index < queue.length; index++) {
    if (queue[index] === ticket.to) return true;
    for (const city of adjacency.get(queue[index]) ?? []) {
      if (!visited.has(city)) { visited.add(city); queue.push(city); }
    }
  }
  return false;
}

/** Exact maximum edge-simple trail: cities can repeat, each owned route can be used once. */
export function longestRoute(state: GameState, playerId: number): number {
  const routes = ROUTES.filter(route => state.claims[route.id] === playerId);
  if (!routes.length) return 0;
  type Edge = { to: string; index: number; length: number; bit: bigint };
  const adjacency = new Map<string, Edge[]>();
  routes.forEach((route, index) => {
    const bit = 1n << BigInt(index);
    adjacency.set(route.from, [...(adjacency.get(route.from) ?? []), { to: route.to, index, length: route.length, bit }]);
    adjacency.set(route.to, [...(adjacency.get(route.to) ?? []), { to: route.from, index, length: route.length, bit }]);
  });
  let best = 0;
  const visited = new Set<string>();
  const search = (city: string, used: bigint, length: number): void => {
    best = Math.max(best, length);
    const key = `${city}:${used}`;
    if (visited.has(key)) return;
    visited.add(key);
    const reachable = new Set([city]);
    const queue = [city];
    let remaining = 0;
    let edgeMask = 0n;
    const degrees = new Map<string, number>();
    for (let i = 0; i < queue.length; i++) {
      const current = queue[i];
      for (const edge of adjacency.get(current) ?? []) {
        if (used & edge.bit) continue;
        degrees.set(current, (degrees.get(current) ?? 0) + 1);
        if (!(edgeMask & edge.bit)) { edgeMask |= edge.bit; remaining += edge.length; }
        if (!reachable.has(edge.to)) { reachable.add(edge.to); queue.push(edge.to); }
      }
    }
    if (length + remaining <= best) return;
    const odd = [...degrees].filter(([, degree]) => degree % 2).map(([vertex]) => vertex);
    if (odd.length === 0 || (odd.length === 2 && odd.includes(city))) {
      best = Math.max(best, length + remaining);
      return;
    }
    const available = (adjacency.get(city) ?? []).filter(edge => !(used & edge.bit));
    available.sort((a, b) => b.length - a.length);
    for (const edge of available) search(edge.to, used | edge.bit, length + edge.length);
  };
  // Leaves/odd vertices first find a strong bound quickly; all starts are explored.
  const starts = [...adjacency.keys()].sort((a, b) => (adjacency.get(a)!.length % 2 ? 0 : 1) - (adjacency.get(b)!.length % 2 ? 0 : 1));
  for (const city of starts) search(city, 0n, 0);
  return best;
}
