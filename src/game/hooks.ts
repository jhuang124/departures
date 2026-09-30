// window.__dep: the e2e test hooks (PLAN.md §7.6). Present in dev and in VITE_E2E builds only; the shipped
// Pages build never contains this module (src/main.ts imports it behind import.meta.env checks).
//
// Shell written by F in Phase 0; C owns it from Phase 1 and fills in the real implementations. The shape
// below is the contract the e2e flows (tests/e2e/lib.ts) rely on; keep it additive.

import type { AudioLogEntry } from '../audio/types';
import type { GameState, LaneId } from '../engine/types';
import type { BoardStats } from '../render/BoardView';
import type { GameVM } from './viewModel';

export type HookSpeed = 0 | 1 | 2;
export type HookAiSpeed = 'watch' | 'fast' | 'skip' | 'instant';

export interface LaneRect { x: number; y: number; w: number; h: number; angle: number }

export interface DepHooks {
  /** true once the app has booted and the first screen is on */
  ready: boolean;
  /** which build answered: 'phase0-stub' until the controller lands */
  build: string;
  state(): GameState | null;
  vm(): GameVM | null;
  /** load a fixture (tests/fixtures/*.json: a save or a state) and land on it the way a resume does */
  load(fixture: unknown): Promise<void>;
  /** the seed of the next new game */
  seed(n: number): void;
  speed(s: HookSpeed): void;
  ai(s: HookAiSpeed): void;
  /** controller-side counters: playback, budgets, timings */
  metrics(): Record<string, unknown>;
  board: { stats(): BoardStats | null };
  laneRects(id: LaneId): LaneRect[];
  /** every gold referent on screen right now (the one-gold sampler) */
  goldSubjects(): string[];
  audioLog(): readonly AudioLogEntry[];
  /** save/replay mismatches and other soft failures; e2e fails if non-empty */
  warnings: string[];
  /** resolves when nothing is playing and input is live */
  waitIdle(timeoutMs?: number): Promise<void>;
}

declare global {
  interface Window {
    __dep: DepHooks;
  }
}

const notYet = (name: string) => () => {
  throw new Error(`__dep.${name}() is not implemented yet (Phase 0 shell; C fills it in)`);
};

/** Install window.__dep with `impl` over inert defaults. Returns the installed object. */
export function installHooks(impl: Partial<DepHooks> = {}): DepHooks {
  const hooks: DepHooks = {
    ready: false,
    build: 'phase0-stub',
    state: () => null,
    vm: () => null,
    load: async () => notYet('load')(),
    seed: () => undefined,
    speed: () => undefined,
    ai: () => undefined,
    metrics: () => ({}),
    board: { stats: () => null },
    laneRects: () => [],
    goldSubjects: () => [],
    audioLog: () => [],
    warnings: [],
    waitIdle: async () => undefined,
    ...impl,
  };
  window.__dep = hooks;
  return window.__dep;
}
