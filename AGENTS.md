# departures — Ticket to Ride, pass-and-play

Read SOUL.md first, and run its "Before you plan" checklist before you plan, delegate, or call a build done. On intent and feel it outranks every spec and the code: when they disagree, change the build or raise it with John, never the soul.

Then `docs/PLAN.md` (architecture, file ownership, phases, acceptance) and `docs/RULES.md` (Ticket to Ride USA,
2015 rulebook, pinned). `docs/DIRECTIONS.md` is the aesthetic reasoning that led here; the settled block at its
top is current, the ranking below it is history.

## Commands
Node 24: `export PATH=/Users/jhuang/.nvm/versions/node/v24.14.0/bin:$PATH`. Only the scaffold owner runs `npm install`.

```
npm run dev              vite --host 127.0.0.1 --port 5390 --strictPort   (lead only) → http://127.0.0.1:5390/
npx vite --host 127.0.0.1 --port <p> --strictPort                         (agents: own port, background; kill on finish)
npm test                 vitest run                                       (tests/**/*.test.ts; e2e is not vitest)
npm run typecheck        tsc --noEmit
npm run build            tsc --noEmit && vite build                       (dist/, base /departures/)
npm run test:e2e -- [--port <p>] [flow ...]      logic lane parallel, then timing lane serial (default port 5399)
npm run test:e2e:quick -- [--port <p>]           smoke + turn + setup + resume (unwritten ones skipped with a note)
npm run preview:pages    vite preview on 5390 → http://127.0.0.1:5390/departures/ (run `npm run build` first)
npm run sim              tsx scripts/sim.ts --games 500 --seats 4         (A; artifacts/sim/*.json)
npm run board            tsx scripts/build-board.ts && tsx scripts/verify-board.ts   (G)
npm run relief           tsx scripts/bake-relief.ts                       (G)
npm run verify:audio     tsx scripts/verify-audio.ts                      (S)
```

- **Dev serves at `/`, build and preview at `/departures/`.** Sandboxes are dev-server pages only:
  `/land.html` (L), `/trains.html` (P), `/audio-lab.html` (S), `/ui-gallery.html` (U).
- **One e2e flow by hand** against your own dev server:
  `DEP_URL=http://127.0.0.1:<p>/ npx tsx tests/e2e/<flow>.e2e.ts` (a logic-lane flow pins instant speed; `E2E_SPEED=real`
  overrides). `scripts/e2e.ts --dev` uses the dev server (`DEP_E2E=1`: no HMR) instead of the build.
- **Test hooks:** `window.__dep` (`src/game/hooks.ts`) exists in dev and in the e2e build (`VITE_E2E=1`), never in
  the shipped build.
- **Deploy:** push to `main` → `.github/workflows/pages.yml` runs `npm test` and `npm run build`, then deploys `dist/`
  to https://jhuang124.github.io/departures/. Only the lead pushes.

## Rules for agents working here
- Stay inside the files your brief says you own. Need a change elsewhere? Put it under "Requests" in your final
  report instead of editing.
- Contract files: additive optional fields only, and say so in your report.
- Do NOT `npm install` unless your brief says you own the scaffold (parallel installs corrupt node_modules).
- Do NOT `git commit`; the lead commits. Personal repo: no PRs.
- Engine code is pure: no DOM, no Date.now()/Math.random() for game logic (use the state's rng).
- Browser checks: Playwright from a node script with
  `chromium.launch({ args: ['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--mute-audio'] })`
  (always mute). Never agent-browser or the Browser pane from a subagent.
- Run your own dev server on the port in your brief (`npx vite --port <p> --strictPort`, in the background) and
  kill it when you finish.
- Screenshots → `artifacts/<area>/`. Look at them with the Read tool before claiming a visual works.
- Reference repos, read-only: `~/Desktop/JH-Projects/risk3d` (War Table: patterns for engine/controller/render/
  UI split, e2e lanes, tempo gates, hand-off cover, dock) and
  `~/Documents/Codex/2026-09-30/task-3/iron-atlas` (a rules-pinned TTR engine with tests and docs/RULES.md;
  reference for rules and edge cases only, its UI is the anti-pattern).
