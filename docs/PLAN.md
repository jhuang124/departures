# Departures: the plan

**SOUL.md outranks this file on intent and feel.** When this plan and SOUL disagree, change the plan or ask John;
never the soul. The rules (Ticket to Ride USA, 2015 English rulebook) bind and live in `docs/RULES.md`, which this
plan's tests are pinned to (§6). Of `docs/DIRECTIONS.md`, only the settled block at the top binds.

**Where this came from.** Three candidates were written (`docs/plans/candidate-*.md`) and three judges ranked them.
This is the winner, "engine first", with the judges' agreed grafts absorbed and every conflict they raised
resolved toward the soul. §10 logs each resolution in one line, so nobody re-litigates them.

**The angle.** Build from correctness outward. The pure engine comes first, with an ID for every rule and a test
for every ID. Then the AI and the controller, then the event vocabulary the board plays. A departure is an engine
event with an origin, a lane and a payment. The board plays it and never works it out for itself. Every event has
a timing budget before anyone draws a pixel. The look is settled in a sandbox at a gate, before integration, so
iterating on the cel-shaded 2.5D never touches rules or UI.

**Paste this block into every brief** (SOUL "Before you plan" #7):

> **Intent.** A complete, fully featured Ticket to Ride for John and his friends, on one laptop or TV, passed hand
> to hand, with the polish, intuitiveness and taste of War Table. It should feel like America on the eve of the
> railroad, already romanticising the country it was ending: more vivid than it was, the way the travel posters
> painted it. You build the railroad that finishes the picture, and every train that leaves makes it a little more
> gone.
>
> **The moment.** Turn 30, on the couch. The continent lies still in late golden light: cream plains, lavender
> ranges, deep teal lakes, dark pine in the Northwest, a backlit cloud bank over the Pacific. Priya taps the route
> from Helena to Duluth and pays six orange cards. A whistle, far off. Her brass train pulls out of Helena, slow on
> the first beat, then the chug picks up, steam trailing, and the last car settles at Duluth with a soft clank. The
> title bar reads `HELENA · DULUTH`. Sam, watching, says nothing; that was the route his ticket needed. He finds out
> for sure three turns later, when he opens his hand and the Duluth poster wears a small CANCELLED stamp. The board
> has not moved since. It never does, until the last round, when the light goes down once and the lit trains are
> all that is left. **And after:** someone looks at the finished map for a while before anyone reaches for the menu.
>
> **Pillars.** 1 The calm is the country, not a pause between turns. 2 Departing is the only verb, not appearing.
> 3 Vivid as memory, readable as print. 4 Wonder and loss in the same move, not a polite win. 5 The land is a
> character, never a prop.

---

## 0. Commands

The Foundation agent (F, Phase 0) makes every line below true. The lead then copies this block into CLAUDE.md.

```
npm run dev              vite --host 127.0.0.1 --port 5390 --strictPort          (lead only)
npx vite --host 127.0.0.1 --port <p> --strictPort                                (agents, own port, background)
npm test                 vitest run                                              (unit: engine, ai, game, data, render math)
npm run typecheck        tsc --noEmit
npm run build            tsc --noEmit && vite build
npm run test:e2e         tsx scripts/e2e.ts [--port <p>] [flow ...]              (logic lane parallel, then timing lane serial)
npm run test:e2e:quick   tsx scripts/e2e.ts --quick [--port <p>]                 (smoke + one human turn + setup + resume)
npm run sim              tsx scripts/sim.ts --games 500 --seats 4                (AI vs AI; writes artifacts/sim/*.json)
npm run board            tsx scripts/build-board.ts && tsx scripts/verify-board.ts
npm run relief           tsx scripts/bake-relief.ts
npm run verify:audio     tsx scripts/verify-audio.ts
npm run preview:pages    vite preview --host 127.0.0.1 --port 5390 --strictPort         (serves dist under /departures/)
```

**Deploy.** The game ships to GitHub Pages at `https://jhuang124.github.io/departures/` (public repo
`jhuang124/departures`, John's ask 2026-09-30). `vite.config.ts` sets `base: '/departures/'`;
`.github/workflows/pages.yml` builds on every push to `main` and deploys `dist/` with `actions/deploy-pages`;
`public/.nojekyll` is present. Saves live in localStorage under that origin. Only the lead pushes.

Sandboxes, served by any dev server: `/land.html` (L), `/trains.html` (P), `/audio-lab.html` (S),
`/ui-gallery.html` (U). The e2e runner builds with `VITE_E2E=1`, serves on `--port` (default 5399), and exposes
`window.__dep` (§7.6). Only one e2e suite runs on the machine at a time; the lead or Q holds the timing lane.

---

## 1. SOUL checklist, run against this plan

**Evidence.** Everything below is **promised** (plan lines). Nothing is **built**. What is **seen**: the four
moodboard frames and the five references (looked at), War Table's code and docs, Iron Atlas's code, and its map
data, which I ran a script over: 36 cities, 100 lanes, 78 pairs, 22 doubles, 309 spaces, 44 gray lanes, 7 lanes and
27 spaces per colour, lengths 1–6 = 9/36/20/16/10/9, 30 tickets totalling 349 points. I checked every lane and
ticket against the 2015 map from memory, and they agree. Helena–Duluth is **orange 6**. The PDF check is a Phase 0
task (§8.2).

### 1.1 The moment, beat by beat

The fixture `tests/fixtures/moment.json` makes the moment literally reachable under the pinned rules. It's a 4-seat
game at turn 30, with brass Priya, Sam, John and an AI, and about 40 % of lanes claimed. Every Duluth lane except
Helena–Duluth is already owned by someone other than Sam. Sam holds Duluth–El Paso (10), and his line already runs
Helena–Denver–Santa Fe–El Paso. Priya's claim seals Duluth, so Sam's ticket becomes truthfully impossible.

| Beat | What this plan does | Verdict |
|---|---|---|
| The continent lies still in golden light, with its palette | The land is rendered once into a **baked plate** (§4.3) under one fixed sun (azimuth 255°, elevation 16°). The palette comes from `relief.json` regions and banded ramps. The NW fir forest, the lakes and the Pacific cloud bank are in the plate. Stillness is exact: with drift off, two frames are pixel-identical. | serves |
| Priya taps the route and pays | The tap **picks**: a gold keyline, and the title bar reads `HELENA · DULUTH`. `DEPART` (Enter) **commits**. When there is only one sensible payment it is chosen for her, and the line under the place says what it is. | serves |
| "six orange cards" | On the pinned map Helena–Duluth is orange 6; SOUL's moment was corrected to match on 2026-09-30 (it said five yellow, from the imagegen frame). She pays six orange, or orange plus locomotives. | serves |
| A whistle, far off | `departed` starts the whistle at t = 0, panned to Helena with far reverb. The gold keyline appears in the same frame. The train doesn't move until t = 350 ms. It is heard before it is seen, and the `departure` gate checks this. | serves |
| Brass train pulls out, slow first beat, chug picks up, steam, soft clank | §4.9: the locomotive noses out from under the Helena disc. It eases in over the first 30 % (the slow first beat), and the chug is tied to wheel travel, so its rhythm quickens with speed. Steam never draws over print. The locomotive runs on under the Duluth disc, the cars settle into their slots, and one clank sounds, panned to Duluth. Length 6 takes ≤ 2.8 s. | serves |
| Title bar reads `HELENA · DULUTH` | The place line keeps the last departure's name until someone picks something new. Record: `Priya's train left Helena for Duluth.` | serves |
| Sam says nothing; the route his ticket needed | `ticketBlocked` is a **private** event. `BoardEvent` excludes private kinds at the type level. No sound and no public pixel changes. The `cancelled` flow diffs every public region before and after. | serves |
| Three turns later, the Duluth poster wears CANCELLED | The poster is `DULUTH` over `DULUTH · EL PASO · 10`, as in frame 3. The stamp is already printed when Sam opens his hand after the cover: no animation, no sound. It's derived from `ticketOutlook().status === 'blocked'`, which never reverts. The sim reports how often a stamp lands in real games (§7.2), so the sting's frequency is measured, not hoped for. | serves (the definition is Soul question 2) |
| The board has not moved since | The camera is fixed forever. There is no ambient motion except light drift (§4.8), and steam thins to nothing within 3 s of the settle. | serves |
| Last round: the light goes down once; lit trains are all that is left | `finalRoundBegan` → `setLight('night', 6000)`, once and non-blocking. The land drops to about 28 % value and the coasts get a faint edge. Only claimed cars light, in one lamp colour, and only in their window strips. Only cities a claimed route touches get a lamp. Two still searchlights stand over New York. A gate caps lit pixels at 4 % of the board (§7.5). Unclaimed slots keep full-strength outlines so the last round stays playable. | serves |
| And after | `THE LAST TRAIN HAS LEFT`, then 4 s with nothing new on screen. Then the word `SCORES` fades in and waits for someone to press it. The tally fills the siding column, never covering the map. `BOARD` folds it away. `REMATCH · TITLE` stay hidden until the pointer moves or 20 s pass. | serves |

**Bad day 1, losing.** John is the only human, with three blocked tickets, on an AI's turn. His posters wear their
stamps without comment. The AI plays at tempo (median ≤ 2.5 s). No hint, no nag, no timer. At scoring, his tickets
reveal in plain numbers: `John's ticket to Miami was not completed. −12.` The blocked ones show CANCELLED; the merely
unfinished ones show UNFINISHED, so CANCELLED keeps its one meaning. **Serves.**

**Bad day 2, idle.** Priya walks away mid-turn with a second human in the room. After 60 s without input, her hand
tier quietly covers itself (`PRIYA'S HAND IS PUT AWAY` · `I'M PRIYA`; Soul question 8). Otherwise only the light
drifts. **Serves.**

**Bad day 3, skipped.** A seat with no legal action passes: `Sam had no card to draw and no route he could pay for.
He passed.` If every seat passes in one cycle, the game ends and is scored (R-E7). **Serves.**

### 1.2 Pillars

1. **The calm is the country: serves.** The land is a baked plate. Idle motion is light only, capped at ≤ 6/255 per
   pixel per second: five sunbeam opacities, the cloud rim ±4 %, and one lake glint. There are no cloud shadows
   and no weather. A day-cycle guard test asserts that the light uniforms at turn 1 equal those at turn 40. Two
   earlier contradictions are removed. Frame 1's parked, puffing locomotive: no locomotive rests on the board
   (Soul question 4). Searchlights that sweep: the beams are still.
2. **Departing is the only verb: serves.** Board pieces enter only by leaving a station; the `pops` gate counts cars
   that appear anywhere else and must read 0. A tap during motion compresses the animation to 160 ms and never
   snaps it. The AI `skip` speed slides trains in 300 ms and never snaps them. Market slots are fixed in the engine,
   so a replacement rolls into exactly the slot that emptied. Cards travel from their source with `travel()`. At
   the end, the longest trail is shown by a lit locomotive running it.
3. **Vivid as memory, readable as print: serves.** Print (slots, discs, names, counts) is an unlit pass after the
   plate. Steam is masked out over print, and there's no full-frame post-process. Two gates guard it. The
   print-diff gate: print pixels are identical within 2/255 over a flat plate and over the real one. The squint
   gate: at the size a 55" TV shows from 3 m, every unclaimed slot's hue and every claimed car's finish classifies
   correctly, 100 %, at golden hour and at night, and again under deuteranopia and protanopia. Slot length reads by
   count, because every slot on the board is the same size.
4. **Wonder and loss in the same move: serves.** At 2–3 seats, a claim closes the sibling lane in public. CANCELLED
   is private, silent, and found later. Nothing about a ticket ever reaches the public board: `BoardView` has no
   ticket input at all, and holding a poster rings nothing on the map.
5. **The land is a character: serves.** No people, landmarks, skylines or ornaments on the board. Cities are discs.
   Forest, ranges, lakes, the cloud bank and the light carry the character. Tree density tapers near routes rather
   than being cut, and trees are culled only where they would cover print along the fixed view ray, so forests
   never look mowed.

### 1.3 Inherited commitments (the five with the most effect)

1. **Iron Atlas `data.ts` (36 cities, 100 lanes, 30 tickets): traces** SOUL Open: "The rules (Ticket to Ride USA,
   2015 rulebook) … bind". It's ported but not trusted. RULES.md Appendices A–B are the pin, and the PDF cross-read
   in Phase 0 is done by someone other than the porter.
2. **War Table's engine / controller / render / UI split, event playback, e2e lanes and tempo gates: traces** the
   War Table touchstone ("the board as the UI … the tempo gates and the hand-off cover").
3. **War Table's hand-off cover (off by default, full screen): conflicts** with the task's "the hand is private"
   and with pillar 1 (a full-screen cover hides the country). Here the cover is on whenever 2+ humans play, and it
   covers **only the dock's hand tier**.
4. **DIRECTIONS §2, "Completing one hangs it on your wall": conflicts** with the rules (tickets are secret until
   the end). A completed ticket gets a conductor's punch, seen only in your own hand (Soul question 3).
5. **Frames 1 and 4 (saturated slots, carriages lit in card colours) and frame 3's band `HELENA · DULUTH · 8`:
   conflicts.** SOUL's Misreads already rules out the first two. Slots are hue outlines with a light tint; night
   lights windows only, in one lamp colour. There is no Helena–Duluth ticket in the 30, so the poster's band reads
   the real ticket.

### 1.4 Guesses and my own taste (they bind nobody; each is a Soul question)

The station emergence, the siding market, cards taken in one tap, the conductor's punch, the synthesized sound, one
imagegen poster per ticket, the 6 s fall, the whistle on claims only, the idle hand cover, and the ink-line
candidate for the land.

### 1.5 The Misread this plan comes closest to

**Imagegen frames 1 and 4.** The slot tint and the night lamps are where a builder drifts back toward saturated
slots and a lit-up board. Guards:
- The tint starts at 18 % and may rise only per hue, only if the squint gate demands it, capped at 45 %, never
  opaque.
- Night lights window strips only, in one lamp colour.
- City lamps light only where a claimed route touches.
- The lit-fraction gate: ≤ 4 % of board pixels lit at night with 70 % of lanes claimed.

The runner-up is the **day cycle as clock**. The sun never moves, the one light change fires only on
`finalRoundBegan`, and the turn-1-equals-turn-40 test catches any creep.

### Soul questions (for John, in one sitting with the look gate; each has a default the build uses until he answers)

1. **The moment's route.** Settled by the lead 2026-09-30: SOUL's moment now reads "pays six orange", and Sam's
   poster is `DULUTH · EL PASO · 10` (frame 3's `HELENA · DULUTH · 8` was invented; SOUL's touchstone says so).
2. **What CANCELLED means.** Default **truthful**: the stamp appears when the ticket can no longer be finished with
   your trains left, over your routes plus lanes still open to you. It never lies. The sim reports how often it
   lands. Target: some seat gets one in ≥ 40 % of 4-seat games. The alternative is **cut**: a claim took a route on
   every one of your cheapest paths. That's frequent, but a "cancelled" ticket could still be completed. The engine
   computes both, so switching is one line (`posterStatus` in C's VM builder, `src/game/controller.ts`).
3. **Completed tickets.** Default: a small conductor's punch through the poster's band, silent, seen only in your own
   hand. Alternatives: an `ARRIVED` stamp, or nothing until scoring.
4. **Frame 1's puffing locomotive.** Default: no locomotive rests on the board. It pulls the cars in and runs on under
   the destination disc, and its steam thins within 3 s, because pillar 1 says only light drifts.
5. **Sound source.** Default: everything synthesized in WebAudio. The alternative is recorded CC0 samples you
   approve. The whistle is the loudest thing in the game, and a synthesized whistle can sound like a toy; you
   listen once in Phase 1.
6. **Posters.** Default: 30 unique imagegen posters, one per ticket, each painting one of its two cities' land and
   light, with no people, no text and no buildings. A typographic placeholder ships until each passes the taste
   gate. The alternative is one per city: cheaper, but two tickets to the same city would look identical.
7. **The market as a siding, and one-tap cards.** Default: yes. Cards roll down the rail like cars and couple with a
   clank. The market lives in the frame, not on the board, so a card is a button: one tap takes it, and a draw is
   two taps. The alternative, pick then `TAKE`, doubles the commonest turn.
8. **The cover on a TV.** Default: with 2+ humans the hand tier covers between turns, even on a TV. It also covers
   itself after 60 s without input. `Settings → Hand-off: Auto · Off`.
9. **The whistle's reach.** Default: a far whistle before every **claim** only. Card draws and tickets get coupling
   and shunt sounds, so the whistle stays the loudest and rarest thing. SOUL says "before every departure"; a card
   draw is a shunt, not a departure.
10. **Ink on the land.** Your note that the frames "don't quite capture the cel-shaded 2.5D feel" is the project's
    biggest risk. The look gate shows three builds side by side:
    - **A:** bands, brush, rim and cast shadow
    - **B:** A plus thin ink lines on tree silhouettes and major ridge crests at 45 %
    - **C:** B at 25 %

    SOUL's touchstones say to leave War Table's ink, so B and C are candidates, not defaults. The lead and a Fable
    second opinion pick, and you veto in the sitting. Trains get a thin dark outline by default, because cream enamel
    on cream plains must read.
11. **Slot fill.** Default: an 18 % hue tint inside a full-strength hue outline, raised per hue only if the couch gate
    fails, capped at 45 %. Going higher, or opaque, would repeat the frames' Misread, so it comes back to you.
12. **The light fall.** Default: 6 s, at the moment the final round is triggered, so the last round is played at
    night. The alternative is 12 s, or at game end only.

---

## 2. Stack and architecture

**Stack.** TypeScript 5, Vite, Three.js (WebGL2), DOM + CSS for UI and labels, synthesized WebAudio, Vitest for
unit tests, Playwright driven from node scripts for e2e. No React. This is War Table's stack, so the fleet reuses
proven patterns: the stub board, the lanes, the samplers, the audio lab. Fonts: `@fontsource-variable/jost`
(geometric caps; F verifies `tnum` at 18 px with a screenshot) and `@fontsource-variable/inter` as the tabular
fallback.

**Dependencies.** F installs these once, and nobody else ever runs `npm install`: `three`, `@types/three`, `vite`,
`typescript`, `vitest`, `tsx`, `@types/node`, `playwright`, `d3-geo`, `@types/d3-geo`, `topojson-client`,
`@types/topojson-client`, `world-atlas`, `pngjs`, `@types/pngjs`, `@fontsource-variable/jost`,
`@fontsource-variable/inter`. Later needs go under "Requests", and the lead installs them between phases.

### 2.1 Directory layout (owner in brackets; ★ = contract file)

```
departures/
  index.html                      [F]  game entry
  land.html                       [L]  land + light sandbox (F creates the shell)
  trains.html                     [P]  print + trains sandbox on a flat or real plate (F shell)
  audio-lab.html                  [S]  cue audition (F shell)
  ui-gallery.html                 [U]  every UI state from VM fixtures (F shell)
  package.json  package-lock.json  tsconfig.json  vite.config.ts  vitest.config.ts   [F]
  docs/  PLAN.md  RULES.md (pinned; lead edits after Phase 0)  plans/ (history)
  scripts/
    e2e.ts                        [F → Q]  lane runner (reads tests/e2e/lanes.ts)
    stub-board.ts                 [R]  Iron Atlas coordinates → src/data/board.stub.json (straight lanes, uniform slots)
    build-board.ts verify-board.ts [G] projection, nudges, slot solver, warp fallback → src/data/board.json
    bake-relief.ts                [G]  relief.json → public/relief/{height,normal,paint,coast}.png + trees.bin
    sim.ts                        [A]  AI vs AI batches → artifacts/sim/*.json
    verify-audio.ts               [S]  offline render + loudness and ordering report
    posters.ts                    [T]  poster manifest, packing, contact sheet
  src/
    engine/                       [E]  PURE: no DOM, no Date, no Math.random
      types.ts                    ★[F] GameState, Action, EngineEvent, Reason, GameConfig (incl. house rules), views
      data/usa.ts                 ★[R] cities (+ lat/lon), lanes, tickets, deck composition
      rng.ts setup.ts reducer.ts market.ts payment.ts lanes.ts tickets.ts longest.ts scoring.ts legal.ts
      views.ts save.ts index.ts
    ai/                           [A]  index.ts graph.ts plan.ts draw.ts keep.ts levels.ts
    game/                         [C]  DOM-free controller (runs in Node)
      viewModel.ts                ★[F] GameVM and every sub-VM the UI renders
      timing.ts                   ★[F] durations per BoardEvent at 1× (the renderer matches ±10 %)
      controller.ts playback.ts copy.ts storage.ts scoringReel.ts stubBoard.ts idle.ts
      hooks.ts                    [C]  window.__dep in VITE_E2E builds (F writes the shell)
    render/
      BoardView.ts                ★[F] what the controller talks to
      stageTypes.ts               ★[F] the seam between L's plate/light and P's composition
      index.ts stage.ts flatPlate.ts metrics.ts   [P]  createBoardView; the loop; the flat plate; stats
      camera.ts                   [G]  fixed high-oblique camera, fit to insets, project()
      plate/**  light/**          [L]  bake, land shader, ramps, water, forest, clouds, brush, drift, beams, fall, night, lamps
      print/** (except pick.ts)   [P]  slots, slotShader, cities, labels (DOM), printMask
      print/pick.ts               [G]  2D hit polygons
      trains/**                   [P]  cars, finishes, departure, steam, windows, trail
    ui/                           [U]  index dom travel styles frame seats dock hand siding posters ticketSheet cover screens/*
    audio/                        [S]  engine bus whistle chug clank cards bed strings; types.ts ★[F]
    shared/palette.ts             ★[F] structure; values tuned by P (print, finishes) and L (lamp); §4.6
    data/
      boardTypes.ts               ★[F] BoardGeometry
      board.stub.json             [R]
      board.json relief.json      [G]
    main.ts                       [F stub → lead]
  public/relief/**                [G]   public/posters/** [T]
  tests/
    engine/** [E, except data.test.ts and rules-coverage.test.ts: R]   ai/** [A]   game/** [C]
    data/** render/** [G, except imports.test.ts: F]   fixtures/iron-atlas/** [R, vendored, dev-only]
    fixtures/*.json [C writes, E validates]   e2e/** [F lib+lanes+smoke → Q]
  artifacts/<area>/               screenshots, sims, audio renders (png gitignored)
```

### 2.2 Contract files (★): additive optional fields only after Phase 0

`engine/types.ts`, `engine/data/usa.ts` (frozen after the PDF check), `render/BoardView.ts`, `render/stageTypes.ts`,
`game/viewModel.ts`, `game/timing.ts`, `audio/types.ts`, `data/boardTypes.ts`, `shared/palette.ts`. A change is
reported as "additive: `X.y?`", and the lead rejects anything else. One exception: `palette.ts` *values* may be
tuned by their named owners (P for print and finishes, L for the lamp colour), and every change is listed in the
report with the gate result that justified it.

### 2.3 Module boundaries (enforced by `tests/data/imports.test.ts`, which scans import paths)

```
engine → engine only            ai     → engine
game   → engine, ai, render/BoardView (type), audio/types (type), shared
render → engine/types (type), engine/data, game/timing, data, shared, audio/types (type)
ui     → game/viewModel (type), shared, audio/types (type)
audio  → shared                 main   → everything
```

### 2.4 Ownership handoffs (explicit, so no file ever has two writers)

| File | Phase 0 | Phase 1 | Phase 2+ |
|---|---|---|---|
| `src/main.ts` | F (stub) | lead | lead |
| `src/game/hooks.ts` | F (shell) | C | C's successor by brief (lead reviews, never edits) |
| `land.html`, `trains.html`, `audio-lab.html`, `ui-gallery.html` | F (shells) | L, P, S, U | L2, P2, S2, U2 |
| `scripts/e2e.ts`, `tests/e2e/{lib,lanes}.ts`, `smoke.e2e.ts` | F | Q (after C finishes) | Q |
| `docs/RULES.md` | R (PDF corrections only, each noted) | lead | lead |
| `src/render/light/lamps.ts` | — | L | L2 |
| `src/render/trains/trail.ts` | — | P (stub that no-ops) | P2 |
| `src/ui/screens/settings.ts`, `rules.ts`, `record.ts` | — | not created | U2 |

---

## 3. The event vocabulary

The engine returns events from every action. The controller splits them into **public** events (to the board and
everyone's HUD) and **private** events (only the holding seat's hand). `BoardEvent` is a type that excludes
private kinds, so the board can't receive one.

### 3.1 Engine state and actions (`types.ts`)

```
SeatId = 0|1|2|3|4;  CityId, LaneId, TicketId = branded strings (so R and F never wait on each other)
CardColor = 'red'|'orange'|'yellow'|'green'|'blue'|'purple'|'black'|'white'|'loco'
LaneColor = Exclude<CardColor,'loco'> | 'gray'
Finish    = 'brass'|'copper'|'chrome'|'gunmetal'|'enamel'
HouseRules { doublesAtLowCount: 'closed'|'open', secondDraw: 'required'|'optional',
             firstSeat: 'drawn'|'firstRow', ticketHints: boolean }        // RULES.md §H; defaults = rulebook
GameConfig { seats: {name, kind:'human'|'ai', level?:'gentle'|'steady'|'sharp', finish}[], seed: uint32, house: HouseRules }
Seat      { id, name, kind, level?, finish, hand: Record<CardColor, number>, tickets: TicketId[],
            trains: number, routePoints: number }
GameState { v: 1, rng: uint32, config, seats: Seat[], turnSeat, turn /* 0 = setup */, firstSeat,
            phase: { kind: 'setupTickets', seat, offer: TicketId[] }
                 | { kind: 'turn' }
                 | { kind: 'secondDraw', firstFrom: 'deck'|'market' }
                 | { kind: 'keepTickets', offer: TicketId[], minKeep: 1 }
                 | { kind: 'over', reason: 'finalRound'|'stalemate' },
            deck: CardColor[] /* top = last */, discard: CardColor[],
            market: (CardColor|null)[5]      /* FIXED slots: a taken card's slot refills in place */,
            ticketDeck: TicketId[]           /* top = index 0; returns go to the end in offer order */,
            claims: Record<LaneId, SeatId>, blocked: Record<SeatId, TicketId[]> /* monotonic */,
            finalRound: null | { triggeredBy: SeatId, turnsLeft: number },
            passStreak: number, nextEventId: number }
Action =
  | { type: 'keepTickets', seat, keep: TicketId[] }
  | { type: 'drawCard',    seat, from: 'deck' | 0|1|2|3|4 }
  | { type: 'endDraw',     seat }                      // only when house.secondDraw === 'optional'
  | { type: 'claim',       seat, lane, pay: { color: CardColor, colored: number, locos: number }, origin?: CityId }
  | { type: 'drawTickets', seat }
  | { type: 'pass',        seat }                      // only when legalSummary says nothing else is legal
applyAction(s, a) → { ok: true, state, events: EngineEvent[] } | { ok: false, reason: Reason, detail? }
```

**Reasons** (copy.ts maps each to one plain sentence): `notYourTurn`, `wrongPhase`, `laneClaimed`,
`laneClosedDouble`, `ownSibling`, `notEnoughTrains`, `wrongColor`, `wrongCount`, `cannotAfford`, `locoAsSecondDraw`,
`slotEmpty`, `deckEmpty`, `noTickets`, `keepAtLeast`, `keepNotOffered`, `mustFinishDraw`, `passNotAllowed`,
`gameOver`.

**Fixed market slots** are a rules-layer decision made for pillar 2. Iron Atlas splices, so every take reorders the
market and four cards would jump. **`origin`** is presentational; the engine validates only that it's an endpoint.
The record and replay need it. `defaultOrigin(state, seat, lane, tapAt?)` picks the endpoint that already touches
the seat's network. If both or neither do, it picks the endpoint nearer the tap, and failing that, the western one.

### 3.2 Envelope

`EngineEvent = { id: number, turn: number, vis: 'public' | { seat: SeatId }, e: E }`

### 3.3 The vocabulary

| `e.type` | Vis | Payload | Board plays | HUD applies on resolve |
|---|---|---|---|---|
| `gameStarted` | public | `seats, firstSeat` | plate first light (title → game) | seat strip; `Sam goes first.` |
| `cardsDealt` | public | `seat, count: 4` | — | 4 face-down cards travel deck → seat's strip slot |
| `cardsDealtTo` | private | `seat, cards` | — | that seat's chips, when holding |
| `marketDealt` | public | `slot, card` | — | card rolls deck → slot, coupling clank |
| `marketCleared` | public | `discarded[5], dealt[5]` | — | 5 roll off to discard, 5 roll in |
| `deckReshuffled` | public | `size` | — | discard slides up into the deck, riffle |
| `ticketsOffered` | public | `seat, count` | — | 1–3 poster backs leave the ticket deck |
| `ticketsOfferedTo` | private | `seat, ids` | — | posters turn face up in the sheet |
| `ticketsKept` | public | `seat, kept, returned` | — | kept go to the seat, returned slide under the deck |
| `ticketsKeptBy` | private | `seat, ids` | — | poster fan |
| `turnBegan` | public | `seat, turn, final` | — | current-seat underline |
| `cardTaken` | public | `seat, from: 'deck' \| slot, card?` (face-up only) | — | the card rolls down the siding to the hand (holding) or to the seat's strip slot (anyone else) |
| `cardDrawnBlind` | private | `seat, card` | — | the chip gets +1 |
| `drawEnded` | public | `seat, reason: 'two' \| 'faceUpLoco' \| 'noSecondCard' \| 'chose'` | — | record line |
| **`departed`** | public | `seat, lane, origin, dest, length, laneColor, pay, points, trainsLeft` | **the departure** (§4.9) | pay chips leave (t 0–300); trains-left ticks per car out; points count up at settle |
| `laneClosed` | public | `lane, because` (2–3 seats) | sibling outline dims to 25 % and hatches over 600 ms | — |
| `ticketCompleted` | private | `seat, ticket` | — | punch, seen next time the hand opens |
| `ticketBlocked` | private | `seat, ticket` | — | CANCELLED, seen next time the hand opens |
| `finalRoundBegan` | public | `seat, trainsLeft, turnsLeft` | `setLight('night', 6000)`, non-blocking | `LAST ROUND` + one dot per remaining turn |
| `passed` | public | `seat` | — | record line |
| `gameEnded` | public | `reason` | — | title bar `THE LAST TRAIN HAS LEFT` |

**Scoring events** are built by the controller (`scoringReel.ts`) from `finalStandings` and `ticketPath`. They play
only after `SCORES` is pressed. Tickets are public at that point by rule.

| Kind | Payload | Board | HUD (siding column) |
|---|---|---|---|
| `ticketRevealed` | `seat, ticket, result: 'complete'\|'cancelled'\|'unfinished', points, lanes[]` | complete: a lamp runs along `lanes`, 600 ms | poster; `+8`, or CANCELLED / UNFINISHED `−8` |
| `trailLit` | `seats[], length, lanes[]` (ordered) | a lit locomotive runs the trail at 8 slots/s, ≤ 3 s (a departure, not a highlight) | `+10` |
| `standings` | `rows[], tieBreak?` | — | the tally rows |

### 3.4 Timings at 1× (`game/timing.ts`)

Speeds:
- **2×** halves every duration, with an 80 ms floor and the whistle lead kept at ≥ 250 ms.
- **`skip`** is AI turns only: ≤ 600 ms per turn, departures slide in 300 ms with one clank, and the whistle lead is
  kept at ≥ 120 ms.
- **Instant (0)** exists only in the e2e logic lane, and there it may snap.

| Event | Duration | Class | Beats |
|---|---|---|---|
| `departed`, length L | `350 + (700 + 250·L) + 200`: L1 1.50 s, L6 **2.75 s**, cap 2.80 s | blocking | t 0: whistle, gold keyline, pay chips leave. t 350: the locomotive noses out of the origin disc; ease-in over the first 30 % (the slow first beat), cruise, ease-out over the last 20 %; the locomotive runs under the destination disc. +200: settle (±1.5 u overshoot, one clank). The steam tail, 3.0 s, is **non-blocking**. |
| `cardTaken`, market | 420 ms; replacement +140 → 560 ms | overlap (the next take can start at 450) | slow start, glide, settle |
| `cardTaken`, deck | 380 ms | overlap | turns face up on arrival (160 ms), in the holder's hand only |
| `marketCleared` | ≤ 1100 ms | blocking | 5 × 320 ms off (50 ms stagger), then 5 × 360 ms in (70 ms stagger) |
| `deckReshuffled` | 500 ms | blocking | |
| `ticketsOffered` | 420 ms + 80 ms stagger | blocking | |
| `ticketsKept` | 360 ms | overlap | |
| `laneClosed` | 600 ms | overlap | |
| `finalRoundBegan` | 6000 ms | ambient (input live) | |
| `ticketRevealed` | 700 ms | blocking, tap-skippable | ≤ 4 s per seat |
| `trailLit` | ≤ 3000 ms | blocking, tap-skippable | |
| AI think | 250 ms before the first action, 150 ms before a second draw | — | 0 at instant |
| hand-off cover | mounts in the same frame the last blocking event resolves; dismiss 240 ms | — | |
| victory hold | 4000 ms after `gameEnded` before `SCORES` fades in (400 ms) | — | |

**`finish()` compresses; it never snaps.** A tap or Space during motion runs every blocking animation to its end
state in **160 ms** (cars rush into their slots, cards finish their roll), and only then handles the tap.

### 3.5 BoardView (`render/BoardView.ts`)

```
interface BoardView {
  mount(el: HTMLElement, board: BoardGeometry): Promise<void>   // bakes the golden plate; resolves when lit
  sync(view: PublicView): void                                  // snap to state (load, resume, after instant)
  play(e: BoardEvent, opts?: { speed?: 0|1|2|'skip' }): Promise<void>
  finish(): void                                                // compress running motion to ≤ 160 ms
  setPick(p: { lane?: LaneId|null, dim?: LaneId[] }): void      // NO ticket input, ever (pillar 4, privacy)
  onLaneTap(cb: (lane: LaneId, at: {x,y}) => void): void        // pick only; never commits
  onLaneHover(cb: (lane: LaneId|null) => void): void
  setLight(to: 'golden'|'night', ms: number): Promise<void>
  setInsets(r: { top, right, bottom, left }): void              // re-fit and re-bake (debounced 200 ms)
  setAudio(a: AudioBus|null): void                              // the board plays whistle/chug/clank on its frames
  setReducedMotion(on: boolean): void
  onDepartureProgress(cb: (carsOut: number) => void): void      // HUD ticks trains-left per car
  project(p: CityId | LaneId): { x, y }                         // CSS px, for labels, UI anchors, tests
  stats(): BoardStats   // fps, frameMsP95, drawnFps, activeTweens, plateBakeMs, appearedOffStation,
                        // lastDeparture{whistleAt, firstMoveAt, settleAt}, lightHash, transformsHash
}
```

### 3.6 The render seam (`render/stageTypes.ts`)

```
type Layer = 'plate' | 'drift' | 'print' | 'trains' | 'steam' | 'lamps'
interface Stage { renderer, scene(layer): THREE.Scene, addLayer(layer, obj), requestFrame(reason: string),
                  onResize(cb), project(world: Vec3): {x,y}, printMask: THREE.Texture, still: boolean }
interface LightUniforms { t: number /* 0 golden → 1 night */, sunDir, sunColor, ambient, beamAlpha[5], rimGain, glint }
interface PlateModule {                                          // L implements in render/plate/index.ts
  mount(stage: Stage, geo: BoardGeometry): Promise<{ bakeMs: number }>
  setLight(to: 'golden'|'night', ms: number): Promise<void>     // owns the fall and the night bake
  setLitCities(ids: CityId[]): void                              // lamps only where a claimed route touches
  setStill(on: boolean): void; uniforms(): LightUniforms; stats(): PlateStats
}
```

P's `render/index.ts` composes Stage + PlateModule + print + trains into a `BoardView`. Until L lands, P runs on its
own `flatPlate.ts`, which is also the `?plate=flat` plate for the print-diff gate.

**Sound ownership.** The board plays whistle, chug and clank, because they're bound to its frames. The UI plays card
and poster sounds. The controller plays only the scoring cues and the strings' resolve.

---

## 4. Rendering

### 4.1 What makes it cel-shaded 2.5D, not a painting (the look gate's checklist)

John's note is that the frames "don't quite capture the cel-shaded 2.5D feel", and the build must. The frames are
palette references. The 2.5D comes from real geometry under one hard light, drawn as a few flat values. These are
the levers, each a tunable in `land.html`, and the look gate judges against them:

1. **Relief you can see sideways.** A real heightfield seen from a high oblique. West faces are lit and east faces in
   shadow, with a **hard terminator**. The exaggeration knob runs 2–4 % of board width (default 2.6 %).
2. **Long cast shadows at golden hour.** The sun is at 16°, so ranges throw shadows east across the plains. This is
   the single strongest 2.5D cue, and it's baked, so it's free.
3. **Hard bands, soft light inside them.** Four value bands per material, with brush-wobbled edges. Inside a band,
   value varies by ±6 % at most (the lithograph's airbrushed light). Band first, then biome mix, so bands never
   blur into each other.
4. **Things that stand up.** Instanced trees with their own three bands, a lit side and a contact shadow. Forest
   edges resolve into individual silhouettes, the frame 2 forest as a character. Trains are 3D models with cel
   bands and a thin dark outline.
5. **Rim and depth.** A warm rim band on crests facing the sun. Far (north) is paler and cooler.
6. **Ink-line candidate** (Soul question 10): Sobel on depth and normal, limited to tree silhouettes and major ridge
   crests, 1 css px of #2A2140 at 45 % (B) or 25 % (C). Built as a toggle, off by default.

**Look-gate shots** (`artifacts/land/`):
- `golden-1920.png` and `golden-1280.png`, for A, B and C
- `rockies-2x.png`
- `helena-duluth-2x.png`, the frame 2 crop
- `nw-pines-2x.png`
- `squint-25.png`: at 25 % the land should read as a few flat planes per region, not noise

Hold each one next to frames 1 and 2 and the Ragan and Bonestell references.

### 4.2 Camera, projection, relief

- **Fixed high-oblique perspective**, looking north: pitch 56° down, FOV 22°. The ratio of near to far scale is
  ≤ 1.15 (tested). The camera never moves, zooms or orbits, and no code path exists to do so.
- **Board space** is 1000 × 620 units. Albers conic (standard parallels 29.5°/45.5°, centre −96°), fitted to the
  continental US plus the southern Canada strip to Calgary, Winnipeg and Montréal.
- **Relief.** A 1024 × 640 16-bit heightfield from `relief.json`:
  - hand-authored ridge splines: Cascades, Sierra, Coast Ranges, Rockies front and spine, Wasatch, Bighorns,
    Ozarks, Appalachians, Laurentian rim
  - basins and plateaus, plus seeded ridged noise
  - the coast falloff forces height to 0 near shore
  - mesh: 384 × 240 segments
- **Normals.** A broad normal (σ = 6 texels) drives the bands; a detail normal (σ = 1.5) drives the brush. The land
  reads as big painted planes, not noisy terrain.
- **Coast** from `world-atlas` land-50m, projected. The Great Lakes are five hand-traced polygons, checked against a
  reference overlay screenshot. There's no elevation download.

### 4.3 The plate: the land is baked, the board is still

Land, water, forest, clouds and cast shadows render **once per size** into a device-resolution target. Each frame is
then plate + drift + print + trains + steam. Why:
1. Stillness is exact.
2. A 4096 shadow map and about 7,000 instanced trees cost nothing per frame.
3. The TV laptop keeps its budget.

The bake takes ≤ 1.5 s at 1920 × 1080 DPR 2, hidden under the title's first light: the plate rises from dark over
1.2 s. Resize re-bakes after a 200 ms debounce. The fall renders live for 6 s, then bakes the night plate.

### 4.4 Board geometry (`build-board.ts` → `board.json`)

- **Cities** are projected from real lat/lon, then nudged by hand (`nudge: [dx, dy]`, |d| ≤ 25 u). Coastal cities
  stay within 6 u of the coast, and inland cities stay on land.
- **Uniform slots.** Every slot on the board is exactly **26 × 10 u** (a car is 24 × 9), so length reads by count
  from the couch. Per lane, the target arc is `n·26 + (n−1)·g + 2c`, with gap g ∈ [3, 8] u and city clearance
  c ∈ [11, 20] u. If the chord is too long, g and then c absorb the slack. If it's too short, the lane becomes a
  quadratic Bézier with its sag solved to ±2 %. The sag sign comes from `relief.json`, defaulting to away from the
  sibling or neighbour, and the sag is ≤ 0.22 × chord. Doubles are offset ±7 u from the pair's centreline.
- **Warp fallback.** If nudges alone can't make the Northeast pass at 1280 × 800, apply a bounded poster warp to land
  and cities *together* (the poster exaggerates, it never lies about neighbours): ≤ 8 RBF control points or a thin-
  plate spline, ≤ 18 % displacement, with a fold guard (Jacobian ≥ 0.35 on a 200 × 124 grid). It's reported as a
  list, never waved through.
- **`verify-board.ts`** exits non-zero on any of these:
  - slots of different lanes closer than 3 u
  - a slot over a non-endpoint disc
  - a label box over any slot or disc (labels try 8 positions and step down to 90 % size before failing)
  - a slot within 2 u of a coast
  - a sag over 0.22 × chord
  - an arc length off target by > 2 %
  - a fold
  - any count or length that doesn't match `usa.ts`

  It writes `artifacts/geometry/layout-{1280,1920}.png` (print only), and G looks at both.
- **Per lane output:** ordered slots `{x, y, z, yaw, pitch}` from A to B, a 2D hit polygon (the slot union inflated
  6 px, ≥ 28 px across, doubles split along the centreline), and a label anchor per city.
- **Tree occlusion is solved at bake time.** No tree within 9 u of a slot, rail or disc, and no tree whose top,
  projected along the fixed view ray, overlaps a slot, disc or 1280 × 800 label box. Density otherwise tapers to 0
  over 18 u toward slot centrelines, and trees within 30 u drop to 60 % height.

### 4.5 The land shader (land only; never print)

- **Four bands** on N·L (broad normal), with thresholds 0.75 / 0.45 / 0.15. Cast shadow drops a pixel to band 4. Band
  edges are wobbled ±0.06 by a **brush field**: a procedurally generated, tileable 512² gouache stroke texture,
  sampled at two rotations chosen from terrain aspect, so strokes follow the contours.
- **Warm against cool.**
  - band 1: albedo × warm gold (+8 % value, hue toward 45°)
  - band 2: albedo
  - band 3: albedo shifted toward lavender
  - band 4: albedo × #6E5E8E at 55 %
- **Rim:** crests where N·L > 0.6 and N·V < 0.35 get one warm gold band.
- **Depth:** toward the north, value rises and saturation falls by up to 12 %.
- **Regions** (albedo proposals; L tunes them at the look gate):

  | Region | Albedo |
  |---|---|
  | plains | cream #EAD9A6 |
  | prairie | #C9C26A |
  | desert | ochre-coral #D99A5E |
  | ranges | lavender #9C86B8 |
  | high peaks | pale lavender-cream |
  | NW fir understory | #2E5A45 |
  | eastern forest | #5E8F4E |
  | southern pine | #4F7F48 |

- **Water:** flat, in three depth bands from the coast SDF (deep teal #1F6F7A → shallow #3FA3A0), with a static
  cream foam line 1.5 px. Rivers are painted into the land, teal, ≤ 3 u wide, so they never read as routes. The
  water itself never animates; the glint is drift.
- **Forest:** about 7,000 instanced low-poly conifers (24 tris) and eastern broadleaf blobs (42 tris), in three toon
  bands one step darker than the floor, with a warm rim, casting into the plate.
- **Clouds:** a backlit bank over the Pacific, entirely outside the play area. Three to six layered SDF clusters,
  cel-quantized into three tones with a gold rim, baked.
- **Refused:** film grain, vignette, chromatic aberration, lens flare, bloom over print, and any full-frame post.
  (The ink-line candidate is a land-only pass that happens before print.)

### 4.6 Palette (`shared/palette.ts`: proposals; gates decide)

- **Route hues.** Each has a full-strength outline and a fill tint that **starts at 18 %** and may rise **per hue**
  only to pass the squint gate, **capped at 45 %**, never opaque (Soul question 11).

  | Hue | Colour | Note |
  |---|---|---|
  | red | #C8412E | |
  | orange | #D9772A | |
  | yellow | #E3D03C | lemon, kept away from the gold |
  | green | #3F8A4A | |
  | blue | #2F62A8 | |
  | purple | #8A4E9C | |
  | black | #23262B | 1 px cream inner keyline |
  | white | #F1ECDD | 1 px ink outer keyline |
  | gray | #9A968C | |

  Every slot also gets a 1 px ink keyline at 40 %.
- **Gold** (the one thing happening now): #F0B24A, flat, never shaded. **Ink:** #15130F, with a cream inner keyline
  #E9DFC6 at 1.5 px. **Lamp:** #FFD58A, the same for every finish.
- **Finishes** read by value and sheen, never by hue. Each is a toon metal ramp with a hard specular band and a thin
  dark outline (0.8 u inverted hull). The L\* ladder must classify from greyscale alone:

  | Finish | Shadow → base → highlight | Target lit L\* | Signature |
  |---|---|---|---|
  | cream enamel | #A89B7C → #EDE3C8 → #FFF8E6 | 90 | matte, 1 px ink trim along the roof |
  | chrome | #4A5560 → #B9C3CC → #FFFFFF | 78 | widest, hardest specular band over a dark horizon band |
  | brass | #5E4518 → #B8913A → #F3D98A | 66 | warm band, dark green windows; always shows its dark band |
  | copper | #5A2A18 → #B0603A → #F0A983 | 48 | red-warm band |
  | gunmetal | #1E2227 → #4A5058 → rim #9AA3AD | 28 | cream window strip |

- **Assertions** (`tests/render/palette.test.ts`, ΔE2000 unless noted):
  - route hues pairwise ≥ 20; gray vs black and gray vs white ≥ 15
  - gold vs every hue ≥ 12; gold vs brass base ≥ 12
  - finishes pairwise ≥ 15 at golden hour and ≥ 10 at night
  - finish ΔL\* pairwise ≥ 10
  - every tint within [0.18, 0.45]
  - finishes ≥ 8 under deuteranopia and protanopia simulation

### 4.7 Print (slots, discs, names)

- **Slots:** one instanced draw. An analytic rounded-rect SDF with `fwidth` antialiasing, drawn after the plate with
  depth test off, lifted 0.3 u. Outline 2.5 px at 1280 and 3.5 px at 1920.
- **Slot states:**
  - **open:** outline + tint
  - **hover:** keyline 2 px with a 1 px cream inner line, in the same frame
  - **picked:** 2 px gold outer keyline, 5 px soft gold halo, slots raised 1.5 u over 90 ms
  - **closed** (2–3 seats): 25 %, 45° hatch
  - **claimed:** the car covers the slot, and a 1.5 px hue edge stays visible so the map still reads as Ticket to
    Ride
- **Night:** outlines stay at full strength and the tint drops to half. The keyline rises to 60 % for contrast
  against dark land.
- **City discs:** radius 7 u, cream fill, 2 px ink ring. A disc is also the **station mask**: cars under it are
  hidden, which is how trains emerge and arrive.
- **Names:** DOM labels placed by `project()` once per resize. Jost 600 caps, tracking 0.12 em, 14 px at 1280 and
  20 px at 1920. Cream, with a 3 px ink halo at 55 % (75 % at night).
- **Print mask** (`print/printMask.ts`): slots dilated 2 px, discs and label boxes, into an R8 target at half
  resolution. It re-renders only on resize or lane state change. Steam alpha is multiplied by `(1 − printMask)`, so
  steam never touches print.
- **Picking** is 2D point-in-polygon against the projected hit polygons. Hover takes one frame. No raycasting, so
  picking is unit-testable in Node.

### 4.8 Light: drift, the fall, the night (pillar 1's whole budget)

- **Drift** (the only idle motion; `?still=1` turns it off for gates):
  - five sunbeam quads over the northern Rockies and Cascades (frame 2), additive gold, opacity 0.10–0.16,
    periods 23–37 s
  - the cloud rim's brightness, ±4 % over 41 s
  - one lake glint sliding 20 u over 30 s

  Per pixel ≤ 6/255 per second. The idle loop draws at ≤ 30 fps. **Never, before the last round:** sun
  direction, sun colour, ramp row, beam count. There are no cloud shadows and no weather.
- **The fall** (`setLight('night', 6000)`, easeInOutSine), fired only by `finalRoundBegan`, once, and nothing brings
  the day back but a new game. Over the fall:
  - the ramps lerp golden → night in OKLab
  - the sun sinks, and a cool teal moon key rises ENE at 30°
  - the land drops to value × 0.28 toward #0F2A33
  - the beams fade out in the first 2 s
  - the cloud bank loses its gold rim for a faint moon edge
  - coasts gain a 1 px pale edge (frame 4)
  - from t = 0.55, claimed cars light their **window strips only** in `lamp`
  - lamps come up only in **cities that at least one claimed route touches**, radius 9 u at alpha 0.5; the rest
    stay dark discs (the railroad lit them)
  - from t = 0.7, **two still searchlights** fade in over the Atlantic from New York, with no source drawn; they
    never sweep
- **Lit fraction:** ≤ 4 % of board pixels above lamp luminance, with 70 % of lanes claimed across five finishes (a
  gate, §7.5).

### 4.9 Trains and the departure

- **Car:** a procedural mesh of about 180 tris: rounded roof, a 4-window strip, bogies and buffers, 24 × 9 × 7 u.
  Cel-shaded with its finish ramp, a hard warm rim on the sun side, and a thin dark outline. It gets a contact
  shadow sprite in the plate's band-4 colour instead of a real shadow.
- **Locomotive:** boiler, stack, cab and cowcatcher in the seat's finish, with a gunmetal smokebox. It exists only
  while a train is moving. At rest, car *k* sits in slot *k*.
- **Departure path:** a polyline through the lane's slots, extended under both station discs. The chug interval is
  tied to wheel travel (`clamp(0.9·car / v, 110, 260) ms`), so it quickens with speed and thins at the brake.
- **Steam:** puffs at the chug rate, rising 6–10 u and growing ×2.2, in two cel tones (cream, lavender) with a gold
  rim on the sun side. They thin over 2.4 s through a rising alpha threshold on the brush texture (so they thin
  rather than fade), ≤ 40 alive, masked out over print.
- **`appearedOffStation`:** `metrics.ts` counts every car whose visibility turns on outside a station mask. The gate
  is 0.
- **Reduced motion:** the whistle lead is kept, then a 450 ms glide with no rocking and 3 puffs.

### 4.10 Performance ladder

At 1920 × 1080 DPR 2: p95 frame ≤ 16.7 ms during a departure, idle drawn frame ≤ 4 ms GPU. When p95 > 20 ms over
3 s, the ladder steps down automatically: trees 7,000 → 3,500, then DPR 1.5, then beams off. The plate keeps its
baked shadows at every level.

---

## 5. UI grammar and screens

### 5.1 Grammar

- **Board taps pick; buttons or a finished gesture commit.** A pick is always visible in gold and named in the dock.
  The siding and the dock are the frame, not the board. Their cards and words are buttons (Soul question 7).
- **One gold, one referent:** the thing happening now. That's the picked lane and its name, the departing lane, the
  card in flight, or the commit word. Everything else is cream or ivory. The current seat gets a cream underline,
  never gold.
- **Words.** Plain English. Records in past tense, like a ledger; prompts and instructions in plain present. Real
  names and numbers. No `!`, no "Error" or "Invalid". U+2212 for minus, ` · ` as the separator. Every string lives
  in `copy.ts`, and a lint test enforces this (§7.1).
- **Nothing reflows.** Hand chips have fixed positions (a zero count stays at 30 %), market slots are fixed, seat
  columns are fixed.
- **Motion.** Game pieces (cards, posters, cars) only travel from their source, via `travel()` with the departure
  curve. Text may crossfade (160 ms). Nothing scales in from zero, and nothing fades in on the board.
- **No scrims.** Sheets never darken the country.

### 5.2 The frame (CSS px)

| Region | 1280 × 800 | 1920 × 1080 | Holds |
|---|---|---|---|
| Top border | 44 | 60 | seat strip |
| Right border (the siding) | 164 | 236 | ticket deck, deck, 5 market slots, discard strip |
| Bottom border (the dock) | 120 = hand tier 48 + title tier 72 | 172 = 68 + 104 | hand; place line, record, words |
| Left border | 16 | 24 | — |
| Board | 1100 × 636 | 1660 × 848 | the land, ≈ 1.10 / 1.66 px per unit |

**Couch sizes** (the `sizes` sampler reads them from the DOM and from `project()`):

| Thing | 1280 | 1920 |
|---|---|---|
| Slot (every slot) | ≥ 28 × 11 | ≥ 43 × 16 |
| Car | ≥ 26 × 10 | ≥ 40 × 15 |
| Slot outline | 2.5 | 3.5 |
| City name | 14 (cap ≥ 10) | 20 (cap ≥ 14) |
| Counts (tabular) | 18 | 26 |
| Seat score | 20 | 27 |
| Title line (Jost 600, tracking 0.16 em) | 36 | 50 |
| Words / buttons (tracking 0.22 em) | 15 | 22 |
| Market card | 112 × 70 | 152 × 95 |
| Hand chip | 34 × 46 | 50 × 68 |
| Poster in fan | 44 × 66 | 64 × 96 |
| Poster in sheet | 168 × 252 | 240 × 360 |
| Min target | 32 × 32 mouse, 44 × 44 touch | same |

Text contrast is ≥ 4.5 : 1 against the sampled local background.

### 5.3 Seat strip (top, public)

Each seat has a fixed column:
- a finish swatch (a rendered car chip, 22 × 14)
- the name in caps
- route points (20 px)
- trains left, with a car glyph
- cards held
- tickets held

All numbers are tabular. The current seat has a cream 2 px underline. In the final round, `LAST ROUND` and one dot
per remaining turn sit at the right. `≡` (menu) sits at the far right. When an AI seat exists, the AI speed words
`WATCH · FAST · SKIP` sit beside it.

### 5.4 The siding (right, public)

A vertical rail, top to bottom:
1. **The ticket deck:** poster backs, with a count.
2. **The deck:** a face-down stack whose thickness shows its size, with a count.
3. **Five fixed market slots,** 6 px apart. Each card has a hue field and a carriage silhouette glyph from the
   rulebook's car types:

   | Card | Glyph |
   |---|---|
   | purple | freight car |
   | white | reefer |
   | blue | passenger car |
   | yellow | box car |
   | orange | tanker |
   | black | hopper |
   | red | coal car |
   | green | caboose |
   | locomotive | all eight hues in bands, with the loco glyph |

   (Mapping corrected 2026-09-30 from the Astra cross-read, `_claude/reviews/2026-09-30-astra-rules-crossread.md`;
   the physical cards are purple = freight, white = reefer, blue = passenger, yellow = box, orange = tanker.)

   The glyph lets colour-blind players read cards without the hue.
4. **The discard:** a 28 px strip with the top card's hue and a count.

Taken cards roll down and out toward the hand, or up to the taking seat's strip column. Replacements roll in from
the deck with a coupling clank.

### 5.5 The dock (bottom): hand tier and title tier

**Hand tier** (holding seat only):
- 9 chips in the fixed order red, orange, yellow, green, blue, purple, black, white, loco, each with its count
- the poster fan at the right; tapping it opens the ticket sheet read-only, which is how you "open your hand"

With 2+ humans, the hand tier folds down (160 ms) at the commit that ends your turn, so no hand is on screen while
the room watches your departure.

**Title tier:**
- left: the **place line** (gold caps when it names the thing now, otherwise cream: `HELENA · DULUTH`)
- under it: the latest record at low ivory (`Priya's train left Helena for Duluth.`)
- right: the words and the commit

| State | Right side shows |
|---|---|
| Idle, your turn | `CLAIM · TICKETS` as low-ivory words. `CLAIM` cycles affordable lanes (R). `TICKETS` draws tickets. Cards are taken by tapping the siding. |
| Lane picked | `DEPART` (primary, Enter) and `CANCEL` (Esc). The line names the payment: `Six orange, or orange and locomotives. You have 5 orange, 1 locomotive.` A chooser appears only when the options differ in kind (gray lanes with several colours, or a locomotive mix that matters). |
| After one card | The line: `One more card. Not a face-up locomotive.` Face-up locomotives dim to 45 %. With H2 optional: `END TURN`. |
| Ticket sheet | `KEEP 2 · RETURN 1`, shown at 45 % with `Keep at least 1.` until the minimum is met |
| Unaffordable pick | The line `Helena to Duluth needs 6 orange. You have 3.` No button, no shake, no buzzer. |
| Not your turn (AI playing) | The AI's name, then its departure's place in gold at the whistle |

**Keys:**

| Key | Does |
|---|---|
| Enter | commits the gold word |
| Esc | cancels the pick, closes a sheet, or opens the menu |
| D | takes the deck's top card |
| 1–5 | take a market slot |
| T | draws tickets |
| H | opens your hand sheet |
| R | cycles affordable lanes |
| Space | finishes motion only; never commits; ignored for 300 ms after a finish |

### 5.6 Budgets (each is a gate in §7.3)

| What | Budget |
|---|---|
| Title → first human's opening sheet | ≤ 3 clicks (`NEW GAME`, `START`, `I'M PRIYA`) with remembered seats; ≤ 5 s of machine time |
| Opening keep | 3 clicks (two posters, `KEEP 2`) |
| Draw turn | 2 clicks (1 for a face-up locomotive) |
| Claim turn | 2 clicks (lane, `DEPART`); 3 when the chooser shows |
| Tickets turn | 3 clicks (`TICKETS`, a poster, `KEEP 1`) |
| Hand-off | 1 click |
| Forced wait on your own turn | 0 ms |
| Click or key → first visible response | ≤ 50 ms; hover ≤ 1 frame |
| Tap during motion → settled | ≤ 200 ms, never a snap |
| Departure, length L | 350 + 700 + 250·L + 200 ms; cap 2800 |
| Whistle lead before first motion | ≥ 300 ms at 1× |
| AI turn at 1× | median ≤ 2.5 s, p95 ≤ 3.6 s; a round of 4 AI turns ≤ 12 s |
| Light fall | 6000 ms, non-blocking, input acknowledged ≤ 50 ms during it |
| Scoring reel | ≤ 4 s per seat, ≤ 18 s for four, after `SCORES` is pressed |
| Idle | 0 tweens; `?still=1` frames identical; drift ≤ 6/255/s |
| Frame | p95 ≤ 16.7 ms in a departure at 1920 × 1080 DPR 2; worst ≤ 50 ms on the first departure after a cold load |

### 5.7 AI turns (spectators see what happens, never what it means)

- The AI thinks for 250 ms, with nothing moving.
- **Draw:** each taken card rolls up the siding to that seat's strip column.
- **Claim:** at the whistle, in the same frame, the lane takes its gold keyline and the title names it. Then the
  departure. Heard no later than seen, and the train is heard 350 ms before it's seen.
- **Tickets:** poster backs rise off the deck and settle toward the seat's column, or return under the deck.
- A click or Space skips the current beat only; it never acts.
- AI claims never flash or say whose ticket they hurt.

### 5.8 Hand-off (the dock's covered state, not a full-screen modal)

The cover fires when the incoming seat is human, 2+ humans sit, and `Hand-off` is `Auto`. The hand tier is unmounted
in the **same frame** the previous turn's last blocking event resolves. The next hand is never rendered until the
button is pressed.

- **Title tier:** `PASS TO SAM`.
- **Line:** up to three **public** departures since Sam's last turn, in past tense (`Priya's train left Helena for
  Duluth. · Cobalt's train left Denver for Omaha.`), or `A quiet round.` Never tickets, cards or anything about
  Sam's hand.
- **Button:** `I'M SAM` (Enter). Dismissing fades the words in 240 ms, and the hand rises.
- Everything public stays visible and calm.
- **Idle cover:** after 60 s without input on a human's turn with 2+ humans, the hand tier covers itself
  (`PRIYA'S HAND IS PUT AWAY` · `I'M PRIYA`).
- **Setup:** each human's opening choice happens behind the same cover. AI setup resolves instantly (`Cobalt kept 3
  tickets.`).
- **Resume:** always lands on the cover if the current seat is human.

### 5.9 Tickets as posters, found later

- **A poster** is 2:3. The art paints one of the ticket's two cities (the hero, from `posters.json`; Duluth–El Paso's
  hero is Duluth, as in frame 3). The lower 24 % is an ink band with the hero city in gold caps and `DULUTH · EL PASO
  · 10` beneath it in cream caps. The type is set in code and is never painted.
- **Phase 1 placeholder:** a typographic poster: a two-band sky gradient, one horizon silhouette sampled from the
  relief at the hero's latitude, and the same band. It's printed, and the grammar exists before the art.
- **The sheet** rises from the dock over the lower board, without a scrim. Posters sit side by side.
  - Offer mode: tap to toggle keep (a kept poster lifts 8 px with a cream underline), then `KEEP N`.
  - View mode: all your tickets. Holding a poster rings nothing on the board.
- **Stamps** (SVG print, crisp):
  - **CANCELLED:** 46 % of the poster's width, rotated −8°, vermilion #A23A2A at 85 %, double rule, uneven ink from
    a roughness mask. It sits over the art, never the type. It's present when the sheet opens: **no animation, no
    sound**.
  - **Completed:** a 10 px conductor's punch through the band. Also silent, also already there.
  - At scoring only, tickets that are open but incomplete get **UNFINISHED** in the same style. CANCELLED keeps its
    one meaning: this was taken from you.
- **Ticket hints** (`about 9 trains`) exist only as house rule H4, **off by default**, so frame 3 is kept whole.

### 5.10 Screens

- **Title.** The golden plate with no trains. `DEPARTURES` in gold caps in the title tier; `NEW GAME · CONTINUE` at
  the right. Continue appears only if a save exists and reads `Turn 30 · Priya, Sam, John`. There's no attract
  motion.
- **New game.** A timetable sheet in the siding column. 2–5 seat rows; each row has:
  - a finish swatch (tap to cycle the unused finishes)
  - a name field (≥ 16 px)
  - `HUMAN · AI`, and for AI, `GENTLE · STEADY · SHARP` (`SHARP` appears once A2 lands in Phase 2)
  - add and remove seat

  Then `START`. Seats are remembered. From Phase 2, a `HOUSE RULES` fold offers H1–H4 (RULES.md §H), shown in the
  Rules page. They're fixed for the game and saved in its config. The first seat is drawn from the seed (`Sam goes
  first.`) unless H3 says first row.
- **Menu** (Esc or `≡`): Resume, Rules, Record, Settings, Save and quit, New game.
- **Settings** (Phase 2):
  - Speed 1× / 2×
  - AI speed
  - Sound: master, music, effects
  - Reduced motion
  - Text size 1 / 1.15 / 1.3
  - Hand-off Auto / Off
  - Colour marks on slots (off by default)
- **Rules** (Phase 2): one plain page generated from RULES.md headings, with the route scoring table and the keys.
- **Record** (Phase 2): the public ledger.

### 5.11 Victory (the map is the victory screen)

1. **`gameEnded`.** The title tier reads `THE LAST TRAIN HAS LEFT` in gold. The last train's steam thins. For
   **4 s** nothing new appears.
2. **`SCORES`** fades in at the title tier's right, at low ivory, and waits. Nothing runs by itself.
3. **Pressed:** the siding's cards roll away down the rail and the column becomes the tally. Seat by seat, in seat
   order:
   1. route points
   2. each ticket revealed: completed ones light their path on the board with a `+8`; CANCELLED or UNFINISHED
      ones show `−8`
   3. `trailLit`: a lit locomotive runs the longest trail(s), `+10`
   4. the total

   A tap skips a step, and Enter skips all. The map is never covered, so spectators see every path light.
4. **Standings.** Each row shows finish, name, total, and `routes 64 · tickets 38 · longest 10`. Any tie-break used
   gets a line (`Priya and Sam tied at 112. Priya completed more tickets.`). Record: `Priya's railroad won, 112 to
   98.` The title keeps `THE LAST TRAIN HAS LEFT`; it never becomes a name or a score. No fanfare: the strings
   resolve.
5. **`BOARD`** folds the tally away to leave the finished night map alone. `REMATCH · TITLE` stay hidden until the
   pointer moves or 20 s pass, then fade in at 40 %. `REMATCH` is one click: same seats, new seed.

### 5.12 View model (`game/viewModel.ts`, the UI's only input)

```
GameVM { screen, seats: SeatVM[], siding: SidingVM, dock: DockVM, hand?: HandVM, sheet?: TicketSheetVM,
         cover?: { to: string, recap: string[], idle: boolean }, victory?: VictoryVM, gold: GoldRef,
         aiSpeed?: 'watch'|'fast'|'skip', settings: Settings }
DockVM { place: { text, gold: boolean }, record: string, line?: string,
         buttons: ButtonVM[] /* id, label, primary, disabled?, reason? */, words: WordVM[], folded: boolean }
HandVM { chips: { color, count }[9], posters: PosterVM[] }
PosterVM { ticket, from, to, hero, points, art: string|null, status: 'open'|'complete'|'blocked'|'unfinished' }
```

UI intents going back: `pickLane`, `takeCard(from)`, `pickTickets`, `toggleKeep`, `commit`, `cancel`, `endDraw`,
`holdSeat`, `openHand`, `input(at)` (for idle), `pressScores`, `pressBoard`, `menu(...)`, `setting(...)`.

---

## 6. Rules coverage and the pin

- **`docs/RULES.md` is the pin.** Every rule has an ID:
  - R-S setup, R-A actions, R-D drawing, R-C claiming, R-T tickets, R-E end and scoring
  - R-X implementation resolutions, flagged as such
  - H house rules

  Each carries a paraphrase, a page, an interpretation flag where the text is ambiguous, and the tests that cover
  it. Appendix A is the lane table, B the tickets, C the cities.
- **`tests/engine/rules-coverage.test.ts`** (R) parses RULES.md. It fails if any R- or H-ID doesn't appear, in the
  form `[R-D3]`, in at least one test title under `tests/engine/`. It stays red until E lands and says so.
- **`tests/engine/data.test.ts`** (R) asserts that `usa.ts` equals Appendices A–C row for row, plus the aggregates:
  - 36 cities, 100 lanes, 78 pairs, 22 doubles, 309 spaces
  - 44 gray lanes, 7 lanes and 27 spaces per colour, 93 gray spaces
  - lengths 9/36/20/16/10/9
  - 30 tickets totalling 349
  - a 110-card deck: 12 per colour plus 14 locomotives
- **Independent check.** Iron Atlas agrees with the physical map on every row (checked from memory for this plan).
  No PDF is downloaded without John's OK (he was away at Phase 0). Instead Codex `gpt-6-astra` cross-reads RULES.md
  from its own knowledge of the 2015 rulebook, a cross-family check, before Phase 1 closes; Iron Atlas's own
  rules pin is the second reference. R (or the lead) applies any correction and notes each one in RULES.md
  §Differences. Residual risk: an error shared by both models and Iron Atlas; John's playtest is the last check.
- **Differential test** (`tests/engine/diff.test.ts`, dev-only). For 300 random claim sets, our `longestTrail` and
  ticket completion must equal a vendored copy of Iron Atlas's `longestRoute` and `isTicketComplete` in
  `tests/fixtures/iron-atlas/`, which is never shipped and never imported across repos.
- **RNG.** mulberry32, with the state in `state.rng`; every shuffle and deal goes through it. The AI uses its own
  stream, `hashInts(seed, turn, seat, actionIndex)`, and never advances `state.rng`, so a replay needs only the
  actions.
- **Views.** `publicView` has seats with counts only (cards and tickets), plus market, discard, deck size, ticket
  deck size, claims, finalRound and phase kind. `seatView(seat)` adds that seat's hand, tickets, offer and ticket
  outlooks. The AI sees only a `seatView`, and the UI's hand is built only from `seatView(holding)`.
- **Ticket outlook** (`tickets.ts`): `ticketOutlook(state, seat, ticket) → { status, trainsNeeded, cut }`.
  - Dijkstra over the 36 cities, with weight 0 for own lanes, *length* for lanes open to the seat, and ∞ for claimed
    or closed ones.
  - `blocked` means distance ∞ or > trains left. It's monotonic (claims only accumulate, trains only fall) and
    stored in `state.blocked`.
  - `cut` means the last claim raised `trainsNeeded`.
  - `ticketPath(state, seat, ticket) → LaneId[]` gives the shortest own-lane path, for the scoring lights.
  - It runs for all seats after each `departed`, in ≤ 0.5 ms.
- **Save format.**
  ```
  localStorage 'departures.save.v1' = { format: 'departures.save', v: 1, config: GameConfig, seed,
    actions: Action[], state: GameState, record: string[] /* last 300, public */,
    meta: { savedAt, turn, seats: string[] } }        // meta written by storage.ts, not the engine
  'departures.settings.v1' = Settings                 // 'departures.seats.v1' = last seat rows
  ```
  - A save is written on every committed action, **before** playback. A reload mid-animation resumes at the post-
    action state: the board syncs, the night is restored if the final round began, and the cover shows if needed.
  - Load runs `validateState` (structure, the conservation invariants below, the double rule, phase consistency;
    ported from Iron Atlas's thorough validator). Then `replay(config, seed, actions)` is compared with the snapshot.
    On a mismatch the snapshot wins, and `__dep.warnings` records it (e2e fails on warnings).
  - `migrate` is a table keyed by `v`.
  - A corrupt save shows `The saved game could not be read. A new game is ready.` The bad save is kept under
    `.bad`, and a good save is never silently overwritten.
- **Invariants,** asserted after every action in fuzz:
  - cards in deck + discard + market + hands = 110, per colour exact
  - tickets in deck + hands + offer = 30
  - trains + claimed lengths = 45 per seat
  - routePoints = the sum of points for owned lanes
  - the market has < 3 locomotives unless R-X2 applies
  - blocked never shrinks
  - replay reproduces the state

---

## 7. Tests and gates

### 7.1 Unit (`npm test`)

- **engine** (E):
  - ≥ 1 test per R- and H-ID
  - `fuzz.test.ts`: 2,000 seeded games at 2–5 seats, 70 % random legal actions and 30 % an in-test greedy policy;
    invariants after every action; a save round-trip every 10 actions; replay equals the final state; a 200-turn cap
  - `longest.test.ts`: brute force on 500 random graphs of up to 14 edges; a 20-lane worst case in ≤ 50 ms
  - `views.test.ts`: `publicView` carries no card colour or ticket ID from any hand
  - the 12 tamper fixtures ported from Iron Atlas's tests are rejected
  - `moment.json` is valid, and Priya's claim blocks Sam's Duluth–El Paso
- **ai** (A):
  - 200 games per level at 3 and 4 seats with zero illegal actions and zero stalls
  - hidden-information invariance: permuting the deck order and other seats' hands and tickets leaves
    `chooseAction` unchanged
  - never a face-up locomotive as the second draw
  - keep minimums respected
  - `chooseAction` p95 ≤ 40 ms (Steady) and ≤ 120 ms (Sharp)
- **game** (C), with the controller and stubBoard in Node:
  - the picks → commits flow
  - playback order; the HUD applies on resolve (no spoilers)
  - `finish()` compression
  - hand-off only with 2+ humans; the recap never names tickets or cards
  - the idle cover
  - private events never reach `board.play`
  - resume at every phase kind
  - the scoring reel equals `finalStandings`
  - **the day-cycle guard:** light uniforms requested at turn 1 equal those at turn 40 of a seeded game, and exactly
    one `setLight` call per game
  - **copy lint:** every record is a sentence ending in `.` whose verb is on the allow list (`left, drew, took, kept,
    returned, had, began, was, won, finished, ran, passed, tied, completed`); no `!`; no Error or Invalid; titles are
    caps noun phrases; no string literal in `src/ui` outside what `copy.ts` supplies (grep)
- **data / render** (G, F, P):
  - board.json passes verify-board
  - projection round-trip
  - pick polygons hit every lane at its own slot centres and never at another lane's
  - camera scale ratio ≤ 1.15
  - every slot 26 × 10
  - palette assertions (§4.6)
  - import boundaries

### 7.2 Sim gates (`npm run sim`, reported in phase reports)

- 500 games per matchup at 3–4 seats: Sharp beats Steady ≥ 60 %, Steady beats Gentle ≥ 70 % (Phase 2). Steady
  completes ≥ 75 % of its tickets.
- The median 4-seat game runs 45–75 total turns, and no game exceeds 200.
- **Stamp rate:** the share of 4-seat games in which some seat has ≥ 1 truthfully blocked ticket, and the same
  under `cut`. The target is ≥ 40 % truthful. Below that, the number goes to John with Soul question 2.

### 7.3 E2E lanes (`tests/e2e/lanes.ts`, War Table's model)

**Logic lane** (parallel, instant speed unless marked realtime):

| Flow | Asserts | Phase |
|---|---|---|
| `smoke` (quick) | boot → title → new game → first opening sheet → first turn: screens, seats, dock | 0 (F), 1 (Q extends) |
| `setup` (quick) | 2–5 seats, unique finishes, AI levels saved, remembered seats, Continue metadata | 1 |
| `turn` (quick) | a full human turn of each action through real clicks | 1 |
| `resume` (quick) | reload mid-turn, mid-second-draw, mid-ticket-sheet, and in the final round; state equals the snapshot; night restored | 1 |
| `handoff` (realtime) | zero frames of the next seat's hand, sampled per mutation and per rAF across a real turn end; `I'M SAM` reveals it; the recap line is public-only | 1 |
| `privacy` | while not holding, DOM text and `data-*` contain no ticket ID or chip count of any hand; audio cue log has no private-event cue | 1 |
| `cancelled` | `moment.json`: public DOM regions byte-identical before and after Priya's claim except the departure's own changes; no audio cue beyond the departure's; Sam's sheet shows the stamp after the cover | 1 |
| `rules` | fixture scenarios by real clicks: face-up loco ends the draw; loco refused as the second draw, with its line; market clear; doubles closed at 3 and open at 4; keep minimums; reshuffle; `noSecondCard`; gray chooser | 2 |
| `scoring` | fixture end state: nothing new for 4 s; `SCORES` waits; the tally equals `finalStandings` including tie-break lines; UNFINISHED vs CANCELLED | 2 |
| `house` | each house rule changes exactly the behaviour RULES.md §H says | 2 |
| `fullgame` | 4 AI at `skip` to victory: no console errors, no warnings | 2 |
| `keys` | every key in §5.5 | 2 |

**Timing lane** (serial, real speed, a cold browser each time):

| Flow | Asserts | Phase |
|---|---|---|
| `departure` | commit → settle ≤ 1.55 s at L1 and ≤ 2.80 s at L6; `firstMoveAt − whistleAt` ≥ 300 ms; chug intervals shrink monotonically over the first 40 %; the gold keyline no earlier than the whistle | 1 |
| `pops` | across a turn of each action type and an AI `skip` turn: `appearedOffStation` = 0; every card or poster entry travels ≥ 24 px; no board or siding element goes from 0 to ≥ 60 % visible in one frame | 1 |
| `feel` | tap → gold ≤ 50 ms; tap during a departure → settled ≤ 200 ms; idle has 0 tweens; `?still=1` frames 2 s apart identical; drift ≤ 6/255 over 1 s; worst frame ≤ 50 ms on the first cold departure | 1 |
| `budgets` | every click and wait budget in §5.6 | 1 |
| `legibility` | §7.5 at golden hour | 1 (night in 2) |
| `nightfall` | the trigger → the fall completes ≤ 6.2 s; a tap during it is acknowledged ≤ 50 ms; light constant for every turn before the trigger; exactly once | 1 |
| `round` | AI turn median ≤ 2.5 s, p95 ≤ 3.6 s; a round of 4 AI ≤ 12 s | 2 |
| `perf` | 1920 × 1080 DPR 2: departure p95 ≤ 16.7 ms; bake ≤ 1.5 s; idle ≤ 4 ms | 2 |
| `onegold` | a real turn sampled every 50 ms: exactly one gold referent (car pixels masked by instance ID, so brass is never mistaken for gold) | 2 |

### 7.4 Samplers (`tests/e2e/samplers.ts`, Q)

- **one-gold:** counts gold referents per frame (HUD elements inked gold plus the board's pick halo). The limit is 1;
  a place line and its lane count as one.
- **print-diff:** renders `?plate=flat`, then the real plate, and compares print pixels through a print-only mask
  render. Max diff 2/255, at rest and mid-steam.
- **squint** (below).
- **sizes / contrast:** §5.2 from the DOM and `project()`.
- **lit fraction:** at night.
- **pops:** visibility jumps per element per frame.

### 7.5 The legibility gate (`legibility` flow, Q; the couch as a test)

- **Fixtures:** `mid-game` (40 % claimed across all five finishes), `late` (70 % claimed), `picked`, `night`
  (Phase 2 for night).
- **Viewports:** 1280 × 800 at DPR 1 and 2, and 1920 × 1080 at DPR 1.
- **Squint classification.** Downscale each board shot to what a 55" 1080p screen resolves from 3 m (factor 0.45),
  what a 14" laptop resolves from 1.5 m (0.6), and 25 %. Sample every **unclaimed slot**'s interior and outline and
  classify it to the nearest of the nine route colours in OKLab. Sample every **claimed car** and classify its
  finish from greyscale. Both must be **100 %** correct with a margin of ΔE ≥ 6, at golden and at night.
  - Deuteranopia and protanopia simulations (Machado matrices): finishes must still be 100 %. Slot hues may
    misclassify only where the colour-mark setting would draw a glyph, and a run with marks on must be 100 %.
  - If the 18 % tint fails, raise that hue's tint (never above 45 %) and re-run.
- **Keyline:** the luminance ratio of each slot's keyline to the land 3 px outside it is ≥ 3 : 1.
- **Lit fraction** (night, `late`): ≤ 4 % of board pixels at or above lamp luminance.
- **Output:** `artifacts/legibility/{1280x800,1920x1080}-{golden,night}{,-squint45,-squint25}.png`. Q and the lead
  look at every one.

### 7.6 Test hooks (`src/game/hooks.ts`, `VITE_E2E` only)

`window.__dep`: `state()`, `vm()`, `load(fixture)`, `seed(n)`, `speed(0|1|2)`, `ai('watch'|'fast'|'skip'|'instant')`,
`metrics()`, `board.stats()`, `laneRects(id)`, `goldSubjects()`, `audioLog()`, `warnings`.

### 7.7 Screenshots that are looked at (a phase is done only on **seen**)

- `artifacts/moment/helena-duluth-{0,350,900,1600,2750}ms.png`, at 1920 × 1080 from `moment.json`
- `artifacts/screens/`: `title`, `newgame`, `ticket-sheet-offer`, `ticket-sheet-view-stamp`, `handoff`,
  `handoff-recap`, `lane-picked`, `after-one-card`, `ai-claim-whistle`, `victory+0`, `victory+4s`, `tally`,
  `board-after`
- the legibility set (§7.5)
- each is opened with the Read tool before anything visual is claimed
- the lead plus a Codex gpt-6-astra taste review (cross-family; the lead, Fable 5.1, makes the final call) review the sweep at phase ends

---

## 8. Build phases

### 8.1 Rules for every phase

- **Briefs.** Every brief pastes the Intent, the moment and the pillars, names its owned files, forbids everything
  else (other needs go under "Requests"), and gives acceptance with screenshots to look at.
- **Hard rules.**
  - No agent runs `npm install` except F.
  - No agent commits; the lead commits.
  - One e2e suite runs at a time.
  - Playwright uses CLAUDE.md's launch flags, always muted.
  - Each agent runs its dev server in the background on its own port and kills it on finish.
- **Concurrency.** **At most 6 agents at once.** A slot's successor starts only after its predecessor has reported
  done.

**One port table for the whole project:**

| Port | Owner (all phases) |
|---|---|
| 5390 | lead |
| 5391 | F Foundation (Phase 0) → fix agent X1 (Phase 3) |
| 5392 | S Sound, S2 |
| 5393 | G Geometry |
| 5394 | L Land and light, L2 |
| 5395 | C Controller (one smoke only) → fix agent X2 (Phase 3) |
| 5396 | T Posters |
| 5397 | P Print and trains, P2 |
| 5398 | U UI, U2 |
| 5399 | Q Gates |
| none | R Rules pin, E Engine, A AI, A2 |

### 8.2 Phase 0 · Foundation and rules pin (2 agents in parallel, ~1 h)

**F · Foundation** (5391)
- **Owns:**
  - package.json, the lockfile, tsconfig.json, vite.config.ts (`VITE_E2E` hooks; no HMR under `DEP_E2E`),
    vitest.config.ts
  - index.html, the four sandbox shells
  - `src/main.ts` (stub), `src/shared/fonts.css`
  - every ★ contract except `usa.ts`, exactly as in §3 and §4.6; `types.ts` lands first, within 20 min, so R can
    import the branded IDs
  - `src/game/hooks.ts` (shell)
  - `scripts/e2e.ts`, `tests/e2e/{lanes,lib,smoke.e2e}.ts`, `tests/data/imports.test.ts`
  - `.github/workflows/pages.yml`, `public/.nojekyll`, `base: '/departures/'` in vite.config.ts (§0 Deploy)
- **Delivers:** the npm scripts in §0, all of them working, and a build that serves from the `/departures/` subpath.
- **Accept:**
  - `npm run typecheck`, `npm test` and `npm run build` green
  - `npm run test:e2e:quick -- --port 5391` green (smoke: boots and shows the frame)
  - the dev server on 5391 shows the dark frame at 1280 × 800 with `DEPARTURES` in the title tier, and the
    screenshot has been looked at
  - Jost `tnum` verified at 18 px with a screenshot
  - `npm run build && npm run preview:pages` serves `http://127.0.0.1:5390/departures/` with every asset resolving
    (no 404 in the network log), screenshot looked at

**R · Rules pin** (no server)
- **Owns:** `src/engine/data/usa.ts` (the port, plus lat/lon per city), `scripts/stub-board.ts` →
  `src/data/board.stub.json`, `tests/engine/data.test.ts`, `tests/engine/rules-coverage.test.ts`,
  `tests/fixtures/iron-atlas/**` (vendored, dev-only), and `docs/RULES.md` (corrections only, each noted).
- **Accept:**
  - data.test green against Appendices A–C
  - the coverage test runs, fails only for missing engine tests, and says so
  - the stub board loads in F's shell
- **The lead,** in parallel: routes the Codex `gpt-6-astra` cross-read of RULES.md (§6; no PDF download without
  John's OK). Any corrections go to R, or to the lead if R has finished.

### 8.3 Phase 1 · The playable vertical slice

**The slice.** John plays a whole evening at 1280 × 800, and on the TV at 1920 × 1080:
- title → new game (humans and AI seats; Gentle and Steady) → private opening tickets behind the cover
- turns of all three actions with every rule enforced
- departures with whistle, chug, steam and clank; AI turns watched at tempo
- the hand-off cover with its recap
- tickets as typographic posters in a private hand sheet, with a working CANCELLED stamp and punch
- the final round's light fall onto a basic night
- `SCORES` → the tally → standings
- reload-resume mid-game

It's all on the cel-shaded golden board (NW fir and eastern forests, ranges, lakes, coast, the cloud bank,
sunbeams), with crisp print. The smoke, quick and legibility gates are green.

**Not in the slice:** imagegen posters, Sharp, strings and birds, searchlights, trail lights at scoring, house-rule
UI, settings/rules/record pages, perf ladder tuning, the full forest set.

**Slots** (≤ 6 at once):

| Slot | Starts at Phase 1 open | Then |
|---|---|---|
| 1 | E Engine | A AI (when E reports done) |
| 2 | G Geometry | S Sound (when G reports done) |
| 3 | L Land and light | — |
| 4 | P Print and trains | — |
| 5 | U UI | — |
| 6 | C Controller | Q Gates (when C reports done) |

**E · Engine** (no server, ~3 h)
- **Owns:** `src/engine/**` except types.ts (additive only) and data; `tests/engine/**` except R's two files;
  `tests/fixtures/moment.json` (validation only; C writes fixtures).
- **Delivers:** reducer, market (fixed slots, R-X2), payment, lanes, tickets (outlook, `ticketPath`, `blocked`),
  longest, scoring, legal (`legalSummary`, `randomLegal`), views, save (validate, replay, migrate), and house-rule
  support in config.
- **Checkpoint** at ~90 min, named in a mid-run report: reducer + events + legal + views green. C switches from
  fixtures to the real engine here.
- **Accept:** rules-coverage green; fuzz 2,000 green; the longest brute-force check green; the diff test green;
  tamper fixtures rejected; `moment.json` blocks Sam.

**G · Geometry** (5393, ~2 h)
- **Owns:** `scripts/{build-board,verify-board,bake-relief}.ts`, `src/data/{board,relief}.json`,
  `public/relief/**`, `src/render/camera.ts`, `src/render/print/pick.ts`, `tests/data/board.test.ts`,
  `tests/render/{projection,pick,camera}.test.ts`.
- **Delivers:**
  - a v0 heightmap and normals within 30 min (the report names the path), so L isn't blocked
  - §4.2 and §4.4 in full, including the slot solver, tree occlusion and `trees.bin`
  - the warp fallback only if nudges fail
- **Accept:** verify-board exits 0; `layout-{1280,1920}.png` and an overlay of cities, slots, coast and lakes on a
  flat plate (`artifacts/geometry/`) looked at; pick tests green.

**L · Land and light** (5394, through the look gate)
- **Owns:** `src/render/plate/**`, `src/render/light/**` (including `lamps.ts`), `land.html`, `public/tex/**`.
- **Delivers:**
  - the §4.3 bake and the §4.5 shader: bands, brush, rim, depth, water, the NW fir forest and the eastern forest,
    the cloud bank
  - the ink-line toggle (A/B/C); the exaggeration knob
  - drift with beams
  - `PlateModule` per `stageTypes.ts`: the fall, the night ramp, `setLitCities`
- **Lookdev check-in at +2 h:** L sends the lead `golden-1920.png` and `helena-duluth-2x.png`. The lead and Fable
  judge whether the cel-shaded 2.5D read is on track before L continues.
- **Accept:** the §4.1 look-gate shots, a flat-vs-golden pair for print-diff, and `night-1920.png`, all looked at;
  bake ≤ 1.5 s reported.

**P · Print and trains** (5397)
- **Owns:** `src/render/{index,stage,flatPlate,metrics}.ts`, `src/render/print/**` except pick.ts,
  `src/render/trains/**`, `trains.html`, and the print and finish **values** in `palette.ts`.
- **Delivers:**
  - `createBoardView` in full (§3.5); §4.7 and §4.9
  - the departure matching timing.ts ±10 %; steam masked from print; `appearedOffStation`
  - `finish()` compression, the `skip` slide, night windows
  - it works on the stub board and flat plate from minute one, then on G's board and L's plate
- **Accept:**
  - `trains.html` plays Helena–Duluth at 1× on `moment.json`
  - the five `artifacts/moment/` frames looked at
  - `stats().lastDeparture` shows the whistle ≥ 300 ms ahead of first motion
  - L6 ≤ 2.80 s
  - the finish contact sheet (`artifacts/trains/finishes.png`, golden and night, plus greyscale) looked at

**U · UI** (5398)
- **Owns:** `src/ui/**` (except screens settings, rules and record) and `ui-gallery.html`.
- **Delivers:**
  - frame, seat strip, siding, dock (every state in §5.5), hand, poster fan
  - the ticket sheet (offer and view)
  - typographic posters with CANCELLED, punch and UNFINISHED
  - the cover with recap and the idle state
  - title, new game, the victory hold / `SCORES` / tally / `BOARD`, the menu
  - `travel.ts`
  - everything rendered from VM fixtures in the gallery
- **Accept:** gallery shots of every §7.7 `screens/` state at both sizes looked at; the §5.2 sizes met.

**C · Controller** (5395 for one smoke run only)
- **Owns:** `src/game/**` except the viewModel and timing contracts; `tests/game/**`; `tests/fixtures/*.json`.
- **Delivers:**
  - the controller: screens, holding seat, picks and commits, the AI turn driver (`randomLegal` until A lands, then
    `chooseAction`), speeds 1×/2×/`watch`/`fast`/`skip`
  - playback (the reel, overlap classes, `finish()`)
  - the VM builder; `copy.ts` with every sentence
  - storage (save, resume, `.bad`, remembered seats)
  - scoringReel (full events, including `lanes`), stubBoard
  - `idle.ts` (the 60 s cover); hooks.ts
- **Accept:** §7.1 game tests green, including the day-cycle guard and copy lint; a Node full-game test drives
  2 humans + AI through the controller to victory with stubBoard.

**A · AI** (no server; starts when E reports done)
- **Owns:** `src/ai/**`, `scripts/sim.ts`, `tests/ai/**`.
- **Delivers:** Steady (ticket plans over weighted shortest paths, card deficits, draw choice, ticket keep), and
  Gentle as a Steady with noise and no blocking.
- **Accept:** §7.1 AI tests green; the sim at 3 and 4 seats reported, including the **stamp rate** (§7.2). The
  Steady-vs-Gentle gate can wait for Phase 2.

**S · Sound** (5392; starts when G reports done)
- **Owns:** `src/audio/**` except types.ts, `audio-lab.html`, `scripts/verify-audio.ts`.
- **Delivers:**
  - the whistle: a 3-pipe chord, ~900 ms, far reverb, panned by origin x
  - the chug: filtered noise pulses driven by `rate(t)`
  - the clank; card roll and couple; riffle; poster slide
  - a sparse wind + birds bed; a mixer with ducking under the whistle
- **Accept:**
  - verify-audio shows the whistle peak ≥ 3 dB above every other cue and the bed ≤ −24 LUFS under play
  - `artifacts/audio/moment.wav` (the 3 s departure) rendered for the lead to listen to
  - John listens once (Soul question 5)

**Q · Gates** (5399; starts when C reports done)
- **Owns:** `tests/e2e/**` (taking over F's files), `scripts/e2e.ts`.
- **Delivers:** the samplers (§7.4) and the Phase 1 flows marked in §7.3; the screenshot sweep script.
- **Accept:** every Phase 1 flow green against the integrated build; the legibility set looked at.

**Lead · Integration** (5390)
- **Owns:** `src/main.ts`.
- Wires C + P + U + S once C's checkpoint and P's `createBoardView` exist.
- Reviews contracts and hooks, never editing others' files.

**The look gate.** John's one sitting, at the end of L:
1. The lead and a Codex gpt-6-astra taste review (cross-family; the lead, Fable 5.1, makes the final call) hold L's shots against frames 1 and 2, the Ragan and Bonestell
   references, and the Life is Strange touchstone, using §4.1's checklist: banded, brushy, standing up, long
   shadows, a still poster.
2. The lead picks A, B or C (Soul question 10) and brings John the shots plus every Soul question at once, so the
   picker fires once.
3. P and U integrate onto the real plate only after the gate passes. If it fails, L iterates with an `/off`-style
   correction, while P and U keep going on the flat plate.

**Phase 1 accept:**
- `npm test`, `npm run typecheck` and `npm run build` green
- `npm run test:e2e:quick` green, plus `handoff privacy cancelled departure pops feel budgets legibility nightfall`
  green
- the §7.7 shots looked at
- the sim's stamp rate reported to John
- the lead pushes `main`; `https://jhuang124.github.io/departures/` loads and passes the smoke flow (seen)
- the lead re-runs §1 against what was seen and pastes it into the phase report
- **John's gate, after the push:** he plays the slice with at least one other human (seen) and answers the Soul
  questions in one sitting

### 8.4 Phase 2 · The whole game at quality (≤ 6 at once)

| Slot | Agent | Then |
|---|---|---|
| 1 | A2 · AI (no server) | S2 · Sound (5392) when A2 reports done |
| 2 | L2 · Land and light (5394) | — |
| 3 | P2 · Print and trains (5397) | — |
| 4 | U2 · UI (5398) | — |
| 5 | T · Posters (5396) | — |
| 6 | Q · Gates (5399, continuing) | — |

- **A2** owns `src/ai/**`, `scripts/sim.ts` and `tests/ai/**`. Sharp: ticket value weighed against trains left, a
  late long-route preference, denial of contested doubles, ticket draws when ahead, and no peeking. Gentle is tuned.
  *Accept:* the §7.2 gates.
- **L2** owns the Phase 1 L files. The southern pine and broadleaf forests, brush-field tuning, the night plate at
  quality, the two still searchlights, the perf ladder. *Accept:* the night legibility shots and the lit-fraction
  gate; `perf` green.
- **P2** owns the Phase 1 P files. Final finishes, the closed-lane hatch, `trail.ts` (the lit locomotive for
  `trailLit` and the path lamp for `ticketRevealed`), and reduced motion in the departure. *Accept:* squint 100 % at
  golden and night; the finish sheet looked at.
- **U2** owns `src/ui/**`. The house-rules fold, settings, rules, record, text size, reduced motion and colour marks;
  poster art integration; tally polish. *Accept:* `victory+0`, `victory+4s`, `tally` and `board-after` looked at;
  `scoring`, `keys` and `house` green.
- **T** owns `public/posters/**`, `_claude/posters-src/**`, `scripts/posters.ts` and `src/data/posters.json`.
  - 30 imagegen posters from one style brief, with frame 3 as the reference: land and light only, no people, no
    buildings, no text, the lower 24 % a flat dark band. Heroes are chosen to spread across the 36 cities.
  - 2:3 at 1024 × 1536, shipped as webp at 480 × 720, ≤ 120 KB each.
  - 2–3 candidates per poster; every one is looked at; any with text or figures is rejected.
  - *Accept:* `artifacts/posters/sheet.png` (6 × 5) plus the CANCELLED, punch and UNFINISHED states looked at. The
    lead's taste gate picks or regenerates, and the typographic fallback stays for any that fail.
- **S2** owns `src/audio/**`. Sparse strings, the night variant of the bed, the descent on `finalRoundBegan`, the
  resolve at the standings. *Accept:* verify-audio green; John listens once in a game.
- **Q** delivers the Phase 2 flows in §7.3.
- **Phase 2 accept:**
  - `npm test`, `npm run typecheck`, `npm run build` and `npm run test:e2e` all green
  - the lead plays 2 humans + Sharp to the finished map and looks at it
  - the full sweep looked at, shot by shot

### 8.5 Phase 3 · Gates, polish, the couch (lead + Q + up to 3 fix agents)

- **Q** runs everything, cold, twice.
- **Fix agents** (ports 5391, 5395, and any freed port) get briefs written by the lead from Q's failures, each owning
  exactly the failing files.
- **The lead:**
  1. Re-runs §1 against the build and pastes it into the final report, with the evidence labelled **seen**.
  2. Routes a Codex gpt-6-astra taste pass on the sweep and makes the final call.
  3. Holds John's evening playtest with friends, the last gate.

---

## 9. Risks and guards

| Risk | Guard |
|---|---|
| The cel-shaded 2.5D still doesn't land (John's standing note) | §4.1's concrete levers; the +2 h lookdev check-in; the look gate before integration, decided on shots against frames 1–2 and the references; A/B/C ink candidates; the plate architecture means iterating on the look never touches rules or UI |
| Painterly bleeds into print | print is an unlit pass after the plate; steam masked by `printMask`; print-diff ≤ 2/255; no full-frame post |
| Route hues unreadable from the couch | squint classification at 0.45, 0.6 and 25 %, 100 % correct at golden and at night and under colour-blind simulation; per-hue tint raise capped at 45 %; colour marks as a setting |
| Yellow vs gold vs brass | palette ΔE floors; lemon yellow; gold only as flat print; car pixels masked by instance ID in one-gold |
| Finishes don't separate (brass/copper, chrome/enamel), especially at night | the L\* ladder with ΔL\* ≥ 10; signatures (chrome's band, enamel's trim); dark outlines; finish classification from greyscale at night |
| The Northeast doesn't fit | uniform-slot solver with Bézier lanes; nudges; the bounded warp fallback with a fold guard; failures reported as a list |
| Parallel agents drift or collide | contracts first, additive only; the `stageTypes.ts` seam; the ownership handoff table; ≤ 6 slots with successors only after done; E's checkpoint; stubBoard and the flat plate let C and P work without their upstreams; the import-boundary test |
| Hidden information leaks (AI, DOM or sound) | `seatView` redaction; the AI invariance test; `BoardEvent` excludes private kinds; `BoardView` has no ticket input; the `privacy`, `handoff` and `cancelled` flows, including the audio log; the hand folds at commit; the idle cover |
| CANCELLED too rare to sting | the sim's stamp rate goes to John; `cut` is computed alongside, so switching is one line |
| Market or stalemate loops | R-X2 bounded clears; R-E7 pass cycle; fuzz with a 200-turn cap |
| Longest path slow | exact DFS with bounds; a 20-lane worst case ≤ 50 ms test |
| Tempo creep with 5 seats and AIs | every duration in timing.ts and gated; `finish()`; 2×; AI `fast`/`skip`; 250 ms think |
| The synthesized whistle sounds like a toy | the audio lab; offline render; John listens once; Soul question 5 offers samples |
| imagegen posters inconsistent | one style brief; the contact sheet; the lead's taste gate; the typographic fallback |
| TV laptop GPU | the baked plate; idle ≤ 4 ms; the automatic ladder |
| A day cycle creeps in | one `setLight` call per game (tested); the turn-1-equals-turn-40 guard; `nightfall` asserts constant light before the trigger |

---

## 10. Resolutions log (judge grafts and conflicts → what this plan does)

| Raised | Resolution |
|---|---|
| Scoring reel auto-ran over the finished map | 4 s hold, then `SCORES` waits to be pressed; tally in the siding column; `BOARD` returns to the map; `REMATCH · TITLE` hidden until pointer or 20 s (§5.11) |
| Hue gate sampled the outline at full resolution | squint classification at 0.45 / 0.6 / 25 %, 100 %, golden + night + colour-blind (§7.5) |
| Car length varied 24–30 | every slot 26 × 10; gap, clearance and Bézier absorb slack (§4.4) |
| Northeast crowding | bounded RBF/TPS warp fallback, ≤ 18 %, fold guard (§4.4) |
| Cel-shaded 2.5D not captured | §4.1 levers, +2 h check-in, A/B/C ink candidates at the look gate, train outlines by default (Soul question 10) |
| Tree occlusion; band ordering; normals | bake-time occlusion along the view ray; band first, then biome; broad and detail normals (§4.2, §4.4, §4.5) |
| Every city lit at night; every car lit | lamps only in cities a claimed route touches; windows only; lit fraction ≤ 4 % (§4.8) |
| Unclaimed slots dropped to 35 % at night | outlines stay full; tint halves; keyline up (§4.7) |
| Searchlights swept ±14° | two still beams, no source drawn (§4.8) |
| Stamp rate unknown | sim reports it; target ≥ 40 % of 4-seat games (§7.2) |
| Unfinished = CANCELLED at scoring | UNFINISHED at scoring; CANCELLED only for truthfully blocked (§5.9) |
| Cover lacked context | recap of up to three public departures, or `A quiet round.` (§5.8) |
| Copy drift | copy lint with past-tense allow list (§7.1) |
| One test oracle for trails | differential test against a vendored Iron Atlas copy, dev-only (§6) |
| Day-cycle creep | turn 1 = turn 40 light test; one `setLight` per game (§7.1) |
| Budgets scattered | one budgets table, each a gate (§5.6) |
| Draw was pick then TAKE (4 clicks) | siding cards are buttons: one tap takes (Soul question 7) |
| AI slowest of the three | think 250 ms; median ≤ 2.5 s; round of 4 ≤ 12 s (§3.4) |
| AI claim telegraph shown before the whistle | gold keyline and name land in the whistle's frame, never earlier (§5.7) |
| Tap-through snapped trains | `finish()` compresses in 160 ms; `skip` slides in 300 ms; pops gate (§3.4) |
| Stamp animated with an audible thunk | silent and already there (§5.9); `cancelled` checks the audio log |
| Steam drawn over print | steam × (1 − printMask) (§4.7) |
| Market over the Atlantic | the siding is the right border, off the painting (§5.2) |
| Result title `PRIYA · 142` | the title keeps `THE LAST TRAIN HAS LEFT` (§5.11) |
| Ticket hints on by default | house rule H4, off by default (§5.9) |
| Poster endpoints ringed on the board | `BoardView` has no ticket input at all (§3.5) |
| Cloud shadows and a breathing rim | no cloud shadows; rim ±4 %; drift ≤ 6/255/s (§4.8) |
| 70 % scrim over the board | no scrims (§5.1) |
| Space commits or skips | Space finishes motion only (§5.5) |
| Hand left face up when a player walks away | idle cover after 60 s with 2+ humans (§5.8) |
| Hand visible during your own departure | the hand tier folds at the turn-ending commit with 2+ humans (§5.5) |
| Prompt hints in imperative | prompts are plain facts in the line; records past tense (§5.1) |
| One sandbox file, two writers | `land.html` (L) and `trains.html` (P) (§2.1) |
| No seam between plate and composition | `stageTypes.ts` with `PlateModule` (§3.6) |
| Phase 0 overloaded | F and R in parallel (§8.2) |
| 7 agents concurrent | slot table, ≤ 6, successors after done (§8.3) |
| Lead's hooks review overlapped C | C owns hooks.ts; the lead reviews, never edits (§2.4) |
| Cards 124 × 78 didn't fit the siding | 112 × 70 at 1280 and 152 × 95 at 1920, with a discard strip (§5.2) |
| RULES.md unverified against the PDF | Codex astra cross-read from its own rulebook knowledge before Phase 1 closes; no download without John's OK (§6) |
| Stub layout so work starts early | R's `board.stub.json`; P's flat plate (§8.2) |
| Lookdev only at the end of Wave A | +2 h check-in plus the end-of-L look gate (§8.3) |
| One port table | §8.1 |
