// ★ Contract file (PLAN.md §3.6). The seam between L's plate and light and P's composition.
// P's render/index.ts composes Stage + PlateModule + print + trains into a BoardView. Until L lands, P runs
// on its own flatPlate.ts (also the `?plate=flat` plate for the print-diff gate).
// Additive optional fields only after Phase 0.

import type * as THREE from 'three';
import type { BoardGeometry } from '../data/boardTypes';
import type { CityId } from '../engine/types';

/** Draw order, back to front. Print is an unlit pass after the plate; steam is masked out over print. */
export type Layer = 'plate' | 'drift' | 'print' | 'trains' | 'steam' | 'lamps';
export const LAYERS: readonly Layer[] = ['plate', 'drift', 'print', 'trains', 'steam', 'lamps'] as const;

export type Vec3 = [x: number, y: number, z: number];

export interface Stage {
  renderer: THREE.WebGLRenderer;
  scene(layer: Layer): THREE.Scene;
  addLayer(layer: Layer, obj: THREE.Object3D): void;
  /** the loop draws only when asked; `reason` feeds stats and the idle gate */
  requestFrame(reason: string): void;
  onResize(cb: (w: number, h: number, dpr: number) => void): void;
  /** board units → CSS px */
  project(world: Vec3): { x: number; y: number };
  /** R8, half resolution: slots dilated 2 px, discs and label boxes (P renders it) */
  printMask: THREE.Texture;
  /** `?still=1`: drift off, for gates */
  still: boolean;
  /** the fixed camera (G's camera.ts) */
  camera?: THREE.Camera;
}

export interface LightUniforms {
  /** 0 golden → 1 night */
  t: number;
  sunDir: Vec3;
  sunColor: Vec3;
  ambient: Vec3;
  /** five sunbeam opacities */
  beamAlpha: [number, number, number, number, number];
  rimGain: number;
  glint: number;
}

export interface PlateStats {
  bakeMs: number;
  trees: number;
  /** size of the baked target, device px */
  target: { w: number; h: number };
  ink?: 'A' | 'B' | 'C';
  still: boolean;
}

/** L implements this in render/plate/index.ts. */
export interface PlateModule {
  mount(stage: Stage, geo: BoardGeometry): Promise<{ bakeMs: number }>;
  /** owns the fall and the night bake */
  setLight(to: 'golden' | 'night', ms: number): Promise<void>;
  /** lamps only where a claimed route touches */
  setLitCities(ids: CityId[]): void;
  setStill(on: boolean): void;
  uniforms(): LightUniforms;
  stats(): PlateStats;
  dispose?(): void;
}
