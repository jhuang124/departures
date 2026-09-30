# departures — Ticket to Ride, pass-and-play

Read SOUL.md first, and run its "Before you plan" checklist before you plan, delegate, or call a build done. On intent and feel it outranks every spec and the code: when they disagree, change the build or raise it with John, never the soul.

Then `docs/PLAN.md` (architecture, file ownership, phases, acceptance) and `docs/RULES.md` (Ticket to Ride USA,
2015 rulebook, pinned). `docs/DIRECTIONS.md` is the aesthetic reasoning that led here; the settled block at its
top is current, the ranking below it is history.

## Commands
See `docs/PLAN.md` §Commands until the scaffold lands; then this section is filled in by the lead.

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
