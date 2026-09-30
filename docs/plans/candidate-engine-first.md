# Departures: plan candidate "engine first"

**SOUL.md outranks this file on intent and feel.** The rules (Ticket to Ride USA, 2015 English rulebook) and
"board taps pick, buttons commit" bind, and they live in `docs/RULES.md`, which this plan defines (§6). The settled
block at the top of `docs/DIRECTIONS.md` binds; its ranking does not.

**The angle.** Build from correctness outward. The pure engine comes first: state, actions, rules edge cases, RNG,
save format. Then the AI and the controller, then the event vocabulary the renderer plays. The renderer and UI are
consumers of that vocabulary. A departure is an engine event with an origin, a route and a payment. The board plays
it and never works it out for itself. Every rule has an ID, every ID has a test, and every event has a timing budget
before anyone draws a pixel.

Pasted for every brief (SOUL "Before you plan" #7):

> **Intent.** A complete, fully featured Ticket to Ride for John and his friends, on one laptop or TV, passed hand
> to hand, with the polish, intuitiveness and taste of War Table. It should feel like America on the eve of the
> railroad, already romanticising the country it was ending: more vivid than it was, the way the travel posters
> painted it. You build the railroad that finishes the picture, and every train that leaves makes it a little more
> gone.
>
> **The moment.** Turn 30, on the couch. The continent lies still in late golden light: cream plains, lavender
> ranges, deep teal lakes, dark pine in the Northwest, a backlit cloud bank over the Pacific. Priya taps the route
> from Helena to Duluth and pays five yellow cards. A whistle, far off. Her brass train pulls out of Helena, slow on
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

## 1. SOUL checklist, run against this plan

Evidence labels: every line below is **promised** (a plan line). Nothing is **built**. The only things **seen**
are the four moodboard frames, War Table's code and docs, and Iron Atlas's data. I checked Iron Atlas's data by
running a script over it: 36 cities, 100 lanes, 309 spaces, 44 gray lanes, 7 lanes per colour, lengths 1–6 =
9/36/20/16/10/9, 30 tickets. Helena–Duluth is **orange 6** in that data, which matches the physical board.

### 1.1 The moment, beat by beat

| Beat | What this plan does | Verdict |
|---|---|---|
| The continent lies still in golden light, with its palette | The land is rendered once into a **baked plate** (§4.2) under one fixed sun (azimuth 255°, elevation 16°). The palette comes from `relief.json` regions and four-band toon ramps. The Pacific cloud bank and NW pines are in the plate. The stillness is exact: pixels are identical between frames unless light drift is on. | serves |
| Priya taps the route and pays | A tap **picks**: gold keyline, and the title bar reads `HELENA · DULUTH`. `Depart` (Enter) **commits**. When there's only one way to pay, the payment is picked automatically. | serves |
| "five yellow cards" | Helena–Duluth is orange, length 6, on the pinned map. The rules bind, so Priya pays six orange, or five orange and a locomotive. | **works against the moment's text** → Soul question 1 |
| A whistle, far off | The `departed` event starts with a whistle panned to Helena, with a far reverb, at t = 0. The train doesn't move until t = 350 ms. It is heard before it is seen, and a gate enforces this (§7). | serves |
| Brass train pulls out, slow first beat, chug picks up, steam, soft clank at Duluth | This is the departure choreography in §3.4. The locomotive noses out from under the Helena station disc. The speed curve eases in over the first 30 %. The chug is tied to the distance the wheels travel, so its rhythm speeds up with the train. Steam puffs thin out over 2.4 s. The locomotive runs on into the Duluth station and the cars settle into their slots with a clank panned to Duluth. Length 6 takes ≤ 2.8 s. | serves |
| Title bar reads `HELENA · DULUTH` | After a departure, the dock's place line keeps the last departure's name until someone picks something new. | serves |
| Sam says nothing; the route his ticket needed | `ticketBlocked` is a **private** engine event. The type system keeps it off the board (`BoardEvent` excludes private kinds), and nothing public changes. The `cancelled` e2e diffs the public DOM at the moment of the claim. | serves |
| Three turns later, the Duluth poster wears CANCELLED | The stamp is already printed when Sam opens his hand after the cover. It doesn't animate and makes no sound. It is derived from `ticketOutlook(...).status === 'blocked'`, which never reverts (§6.6). **But** by the strict definition, Helena–Duluth almost never blocks a Duluth ticket, because Winnipeg and Omaha are detours. | **at risk** → Soul question 2 |
| The board has not moved since | The camera is fixed and never moves. There's no ambient motion except light drift (§4.6). The steam thins to nothing within 3 s of the settle. | serves |
| Last round: the light goes down once; lit trains are all that is left | `finalRoundBegan` → `board.setLight('night', 6000)`, which doesn't block. The night plate: the land drops to about 28 % value, coasts are faint, unclaimed slots fade to 35 %, and claimed cars light their windows in one warm lamp colour (not card hues). Searchlights sweep over the Atlantic. | serves |
| And after | No modal and no confetti. Scoring plays on the map, and the tally sits in the right column. `NEW GAME · MENU` shows at low ivory only after 4 s without input (§5.8). | serves |

**One bad day.** John is losing badly: three tickets are blocked, and it's an AI's turn. His hand is visible (he
is the only human), and the three posters wear their stamps without comment. The AI turn plays at full tempo
(≤ 3.6 s). Nothing nags, no hint pops, and no timer runs. If he leaves the laptop for ten minutes, only the light
drifts. At the end, his tickets are revealed one by one with `−12` in plain numbers, and the record reads `John's
ticket to Miami was not completed. −12.` A skipped turn: `Sam had nothing to take and passed.` Verdict:
**serves**. The loss is plain and the sting is private.

### 1.2 Pillars

1. **The calm is the country: serves.** The land is a baked plate. Light drift is the only idle motion: god-ray
   opacity, the cloud-bank rim and a glint on the lakes, each ≤ 6/255 per pixel per second. The idle test is
   automatic (§7.4). One contradiction removed: frame 1's parked, puffing locomotive would fail the test ("only
   light drifts"), so the locomotive goes into the destination station and its steam thins out (Soul question 4).
2. **Departing is the only verb: serves.** Board pieces only ever enter by leaving a station. Cars come out from
   under the origin disc, and the `pops` gate counts cars that become visible anywhere else (must be 0). The
   market is a **siding**: cards roll down it and out, and replacements roll in from the deck with a coupling
   clank. Tickets leave the ticket deck. The commit word on a route is `Depart`. UI motion goes through one helper,
   `travel(el, from, to)`. Game pieces never fade or scale in; text is allowed to crossfade.
3. **Vivid as memory, readable as print: serves.** The print layer (slots, cities, names, counts) is drawn after
   the plate, unlit, with analytic antialiasing. It is never touched by brush, ramp or post. A gate proves this:
   with the plate swapped for flat grey, print pixels are identical within ±2/255. Couch sizes are in px (§5.2),
   and hue and finish classification gates run at golden hour and at night (§7.5).
4. **Wonder and loss in the same move: serves, with one open risk.** At 2–3 players, a claim closes the sibling
   lane (its outline dims to 25 % and gets hatched). CANCELLED is private and found later. Whether the sting
   happens often enough depends on Soul question 2.
5. **The land is a character: serves.** The board has no people, no landmarks, no ornaments and no city
   skylines. Cities are discs. Forest, ranges, lakes, the cloud bank and the light carry the character. Tree
   density tapers near routes over 18 units instead of being cut off, so forests don't look mowed.

### 1.3 Inherited commitments (the five with the most effect)

1. **Iron Atlas `data.ts` (36 cities, 100 lanes, 30 tickets): traces.** SOUL says "The rules (Ticket to Ride USA,
   2015 rulebook) … bind". It's ported, but not trusted: RULES.md Appendix A is re-verified against the rulebook
   map by someone other than the porter (§6.2).
2. **War Table's engine / controller / render / ui split, the event playback, e2e lanes and tempo gates:
   traces.** Touchstone: War Table, "the board as the UI … the tempo gates and the hand-off cover". Kept.
3. **War Table's hand-off cover defaults to OFF and is full-screen: conflicts.** SOUL says "the hand is private".
   Here the cover is on whenever 2 or more humans are playing, and it covers **only the dock's hand tier**. The
   board, market and scores are public, so they stay visible and calm. This changes War Table's design.
4. **DIRECTIONS §2: "Completing one hangs it on your wall": conflicts** with the rules (tickets stay secret until
   the end). Completed tickets stay in the hand with a conductor's punch. Nothing is public until scoring (Soul
   question 3).
5. **Frame 1's density and saturated slots: conflicts,** as SOUL's Misreads already records. Unclaimed slots are
   a hue outline (2.5 px at 1280) with an 18 % tint, so most of the board reads as empty outlines over quiet land.

### 1.4 Guesses and my own taste (they bind nobody)

The following are my taste, and the plan uses defaults for them. Each is listed in Soul questions: the station
emergence, the siding market, the conductor's punch, the synthesized sound, the typographic placeholder posters,
and the 6 s light fall.

### 1.5 The Misread this plan comes closest to

The imagegen frames 1 and 4 misread: every slot saturated, and every carriage lit in its card colour. The slot
tint and the night windows are exactly where a builder would drift back to it. The guards: the tint ceiling is
18 % (asserted in palette.ts), night windows use one lamp colour for every finish, and the hue gate measures the
**outline**, not the fill. It is also the plan nearest to "day cycle as clock". The guard there: the sun never
moves, and there is exactly one light change, fired only by `finalRoundBegan`.

### Soul questions (for John)

1. **The moment's route.** On the 2015 map Helena–Duluth is **orange, length 6**, not five yellow. May the moment
   read "pays six orange" (or "five orange and a locomotive")? Default: the rules win and the moment is amended.
2. **What CANCELLED means.** Default: **truthful**. The stamp appears only when the ticket can no longer be
   completed: no path over your own routes plus lanes still open to you fits in your trains left. It's rare early
   and common late, and it never lies. The alternative is **cut**: the stamp appears when a claim took a route on
   every cheapest path. That's frequent and matches the moment, but a "cancelled" ticket could still be completed,
   so the record would lie. The engine computes both, so switching is one line in `ui/posters.ts`.
3. **Completed tickets.** Default: a small conductor's punch through the poster's band, seen only in your own
   hand. The alternatives are an `ARRIVED` stamp, or nothing until scoring.
4. **The puffing locomotive in frame 1.** Default: no locomotive rests on the board. It pulls the cars in and runs
   on under the destination station, and its steam thins out within 3 s, because pillar 1's test says only light
   drifts. OK?
5. **Sound source.** Default: everything synthesized in WebAudio (whistle, chug, clank, wind, birds, strings), so
   nothing is downloaded. The alternative is recorded CC0 samples that you choose and approve. The whistle is the
   loudest thing in the game, and a synthesized whistle can sound like a toy.
6. **Posters.** Default: 30 unique imagegen posters, one per ticket, showing the destination's land and no
   people. A typographic placeholder ships until they pass the taste gate. The alternative is one poster per
   destination city, which is cheaper, but two tickets to the same city would look identical in your hand.
7. **The market as a siding** (cards roll down it like cars and couple with a clank). Is that the verb, or too
   literal? Default: yes, it's the verb.
8. **Cover on a TV.** With 2 or more humans the dock's hand tier is covered between turns, even on a TV where the
   couch can see anyway. Default: on (the hand is private). A Settings option, `Hand-off: Auto · Off`, exists.

---

## 2. Stack and architecture

**Stack.** TypeScript 5, Vite, Three.js (WebGL2), DOM + CSS for the UI and labels, WebAudio synthesized sound,
Vitest for unit tests, and Playwright driven from node scripts for e2e. No React. This is War Table's stack, so
the fleet reuses proven patterns: the stub board, the lanes, the samplers and the audio lab. Three.js handles the
cel shader, baked shadows and instanced trains. Fonts: `@fontsource-variable/jost` (geometric caps) and
`@fontsource-variable/inter` (tabular numerals, if Jost's `tnum` doesn't hold up at 18 px).

**Dependencies, installed once by the Scaffold agent (Phase 0) and never again:** `three`, `@types/three`, `vite`,
`typescript`, `vitest`, `tsx`, `playwright`, `d3-geo`, `@types/d3-geo`, `topojson-client`,
`@types/topojson-client`, `world-atlas` (coast; vetted in War Table), and the two font packages. If a later agent
needs anything else, it goes under "Requests" for the lead.

### 2.1 Directory layout

```
departures/
  index.html                  game entry
  render-sandbox.html         land + print + trains without the game (L, P)
  audio-lab.html              sound bank audition (S)
  ui-gallery.html             every UI state from fixtures (U)
  package.json  tsconfig.json  vite.config.ts  vitest.config.ts
  docs/  PLAN.md (the chosen plan)  RULES.md (pinned, §6)  EVENTS.md (generated table from types.ts, §3)
  scripts/
    build-board.ts            projection + nudges + slot layout → src/data/board.json
    verify-board.ts           hard layout checks (§4.3), exit ≠ 0 on failure
    bake-relief.ts            relief.json → public/relief/{height,paint,forest}.png
    sim.ts                    AI vs AI batches → artifacts/sim/*.json
    e2e.ts                    lane runner (reads tests/e2e/lanes.ts)
    verify-audio.ts           offline render + loudness/ordering checks
    posters.ts                poster manifest + contact sheet check
  src/
    engine/                   PURE. No DOM, no Date, no Math.random.
      types.ts                ★ CONTRACT: GameState, Action, EngineEvent, Reason, Config, views
      data/usa.ts             ★ CONTRACT (data): cities, lanes, tickets, deck composition
      rng.ts                  mulberry32 in state.rng; hashInts for side streams
      setup.ts                createGame
      reducer.ts              applyAction (the only mutator), turn/phase flow
      market.ts               refill, three-locomotive clear, reshuffle, bounded pathological case
      payment.ts              paymentOptions, validatePayment, defaultPayment
      lanes.ts                laneStatus (open/claimed/closed/ownSibling), double-route rules
      tickets.ts              isComplete, ticketOutlook (open/complete/blocked, trainsNeeded, cut)
      longest.ts              longestTrail (exact, returns ordered lanes)
      scoring.ts              finalStandings, tie-breaks
      legal.ts                legalSummary(state) for UI + AI
      views.ts                publicView(state), seatView(state, seat): redaction
      save.ts                 SaveFile v1, validateState, replay, migrate
      index.ts
    ai/
      index.ts                chooseAction(view: SeatView, level, seed): Action
      graph.ts                weighted shortest paths over lanes (Dijkstra, 36 nodes)
      plan.ts                 ticket plan: greedy Steiner over kept tickets
      draw.ts                 card-draw policy
      keep.ts                 ticket keep policy (setup + mid-game)
      levels.ts               Gentle / Steady / Sharp knobs
    game/                     DOM-free controller (runs in Node)
      controller.ts           screens, holding seat, picks, commits, AI turns, hand-off
      playback.ts             the reel: queue, blocking/overlap classes, finish(), speed
      viewModel.ts            ★ CONTRACT: GameVM and every sub-VM the UI renders
      timing.ts               ★ CONTRACT: durations per BoardEvent at 1× (renderer must match ±10 %)
      copy.ts                 every sentence the game says (records, lines, reasons)
      storage.ts              KV + save/settings keys
      scoringReel.ts          standings → the victory sequence of BoardEvents + VM steps
      stubBoard.ts            BoardView fake with timing.ts durations (Node tests)
      hooks.ts                window.__dep in VITE_E2E builds
    render/
      BoardView.ts            ★ CONTRACT: the interface the controller talks to
      index.ts                createBoardView: composes plate + print + trains + light
      camera.ts               fixed high-oblique camera, fit to insets, project()
      plate/  bake.ts land.ts landShader.ts ramps.ts water.ts forest.ts clouds.ts brush.ts night.ts
      light/  drift.ts beams.ts searchlights.ts fall.ts
      print/  slots.ts slotShader.ts cities.ts labels.ts (DOM) pick.ts (2D hit polygons)
      trains/ cars.ts finishes.ts departure.ts steam.ts windows.ts trail.ts (longest-path light)
      metrics.ts              stats(), per-frame samplers for gates
    ui/
      index.ts  dom.ts  travel.ts (the one motion helper)  styles.css
      frame.ts                the dark border, insets reporting
      seats.ts                top strip
      dock.ts                 bottom: hand tier + title tier (line, record, verbs, commit)
      hand.ts                 colour chips with counts, poster fan
      siding.ts               right column: deck, 5 market slots, ticket deck, discard
      posters.ts              ticket poster component (art, band, stamp, punch)
      ticketSheet.ts          draw/keep sheet
      cover.ts                hand-off state of the dock
      screens/ title.ts newGame.ts victory.ts menu.ts settings.ts rules.ts record.ts
    audio/
      engine.ts bus.ts        master/music/sfx buses, ducking
      whistle.ts chug.ts clank.ts cards.ts   synthesized voices
      bed.ts strings.ts       wind + birds + sparse strings
    shared/
      palette.ts              ★ CONTRACT: route hues, finishes, gold, ink, lamp, ΔE checks
      fonts.css
    data/
      board.json              generated by build-board (G owns)
      relief.json             ranges, basins, lakes, regions (G owns)
    main.ts                   composition root (lead)
  public/relief/  public/posters/
  tests/
    engine/  ai/  game/  data/  render/ (pure math: projection, pick polygons)
    e2e/  lanes.ts lib.ts samplers.ts fixtures.ts  *.e2e.ts
  artifacts/<area>/           screenshots (gitignored png)
```

### 2.2 Contract files (★). Additive optional fields only after Phase 0

- `src/engine/types.ts`: everything in §3.1–3.3.
- `src/engine/data/usa.ts`: data, frozen after the Appendix A check.
- `src/render/BoardView.ts`: §3.5.
- `src/game/viewModel.ts`: §5.9.
- `src/game/timing.ts`: §3.4 as functions.
- `src/shared/palette.ts`: §4.5.

A contract change goes into the agent's report as "additive: `X.y?`". The lead rejects anything that isn't
additive.

### 2.3 Module boundaries (imports allowed, enforced by `tests/data/imports.test.ts` scanning import paths)

```
engine  → nothing (except engine/*)
ai      → engine
game    → engine, ai, render/BoardView.ts (type only), audio (type only), shared
render  → engine/types (type only), engine/data, game/timing, shared, data
ui      → game/viewModel (type only), shared
audio   → shared
main    → everything
```

---

## 3. The event vocabulary

The engine returns events from every action. The controller splits them into **public** events, which go to the
board and to everyone's HUD, and **private** events, which only reach the holding seat's hand. The renderer never
receives a private event: `BoardEvent` is a type that excludes them.

### 3.1 Engine state and actions (types.ts)

```
CardColor = 'red'|'orange'|'yellow'|'green'|'blue'|'purple'|'black'|'white'|'loco'
LaneColor = Exclude<CardColor,'loco'> | 'gray'
Finish    = 'brass'|'copper'|'chrome'|'gunmetal'|'enamel'
Seat      { id: 0..4, name, kind: 'human'|'ai', level?: 'gentle'|'steady'|'sharp', finish,
            hand: Record<CardColor, number>,   // counts: cards are fungible
            tickets: TicketId[], trains: number, routePoints: number }
GameState { v: 1, rng: uint32, seats: Seat[], turnSeat, turn /* 0 = setup */, firstSeat,
            phase: { kind: 'setupTickets', seat, offer: TicketId[] }
                 | { kind: 'turn' }
                 | { kind: 'secondDraw', firstFrom: 'deck'|'market' }
                 | { kind: 'keepTickets', offer: TicketId[], minKeep: 1 }
                 | { kind: 'over', reason: 'finalRound'|'stalemate' },
            deck: CardColor[] /* top = last */, discard: CardColor[],
            market: (CardColor|null)[5] /* FIXED slots: a taken card's slot refills in place */,
            ticketDeck: TicketId[] /* top = index 0; returns go to the end */,
            claims: Record<LaneId, SeatId>,
            finalRound: null | { triggeredBy: SeatId, turnsLeft: number },
            passStreak: number, nextEventId: number }
Action =
  | { type: 'keepTickets', seat, keep: TicketId[] }
  | { type: 'drawCard',    seat, from: 'deck' | 0|1|2|3|4 }
  | { type: 'claim',       seat, lane: LaneId, pay: { color: CardColor, colored: number, locos: number },
                           origin?: CityId }          // presentational; validated as an endpoint
  | { type: 'drawTickets', seat }
  | { type: 'pass',        seat }                     // only when legalSummary says nothing else is legal
applyAction(s, a) → { ok: true, state, events: EngineEvent[] } | { ok: false, reason: Reason, detail? }
```

`Reason` codes (copy.ts maps each one to a plain sentence): `notYourTurn`, `wrongPhase`, `laneClaimed`,
`laneClosedDouble`, `ownSibling`, `notEnoughTrains`, `wrongColor`, `wrongCount`, `cannotAfford`,
`locoAsSecondDraw`, `slotEmpty`, `deckEmpty`, `noTickets`, `keepAtLeast`, `keepNotOffered`, `mustFinishDraw`,
`passNotAllowed`, `gameOver`.

**Why fixed market slots matter to the renderer.** Iron Atlas splices and pushes, so every take reorders the
market, which would make four cards jump. Fixed slots let a replacement roll into exactly the slot that emptied.
This was a rules-layer decision made for pillar 2.

**Why `origin` is part of the action.** The engine doesn't care, but the record does (`left Helena for Duluth`),
and so does the replay. The default, `defaultOrigin(state, seat, lane)`, picks the endpoint that already touches
the seat's network. If both or neither do, it picks the endpoint nearer to where the tap landed (the controller
passes that), and failing that, the western endpoint.

### 3.2 Event envelope

```
EngineEvent = { id: number, turn: number, vis: 'public' | { seat: SeatId }, e: E }
```

### 3.3 The vocabulary

| `e.type` | Vis | Payload | Board plays | HUD applies on resolve |
|---|---|---|---|---|
| `gameStarted` | public | `seats, firstSeat` | plate first light (title → game) | seat strip |
| `cardsDealt` | public | `seat, count: 4` | — | 4 cards travel deck → seat (face-down) |
| `cardsDealtTo` | private | `seat, cards` | — | the seat's chips (when holding) |
| `marketDealt` | public | `slot, card` | — | card rolls deck → slot, clank |
| `marketCleared` | public | `discarded[5], dealt[5]` | — | 5 roll off to discard, 5 roll in |
| `deckReshuffled` | public | `size` | — | discard slides up to deck, riffle |
| `ticketsOffered` | public | `seat, count` | — | 1–3 face-down posters leave the ticket deck |
| `ticketsOfferedTo` | private | `seat, ids` | — | posters turn face up in the sheet |
| `ticketsKept` | public | `seat, kept, returned` | — | kept go to seat/hand, returned under the deck |
| `ticketsKeptBy` | private | `seat, ids` | — | poster fan |
| `turnBegan` | public | `seat, turn, final: boolean` | — | current-seat underline, place line kept |
| `cardTaken` | public | `seat, from: 'deck' \| slot, card?` (face-up only) | — | card rolls down the siding to the hand / seat |
| `cardDrawnBlind` | private | `seat, card` | — | the chip gets +1 |
| `drawEnded` | public | `seat, reason: 'two' \| 'faceUpLoco' \| 'noSecondCard'` | — | record line |
| **`departed`** | public | `seat, lane, origin, dest, length, laneColor, pay{color,colored,locos}, points, trainsLeft` | **the departure** | pay chips leave (t 0–300), trains-left ticks down per car, points count up at settle |
| `laneClosed` | public | `lane, because: LaneId` (2–3 p sibling) | sibling outline dims 25 % + hatch over 600 ms | — |
| `ticketCompleted` | private | `seat, ticket` | — | punch (next time the hand is shown) |
| `ticketBlocked` | private | `seat, ticket` | — | CANCELLED stamp (next time shown) |
| `finalRoundBegan` | public | `seat, trainsLeft, turnsLeft` | `setLight('night', 6000)`, non-blocking | `LAST ROUND` + dots |
| `passed` | public | `seat` | — | record line |
| `gameEnded` | public | `reason` | — | title bar `THE LAST TRAIN HAS LEFT` |

**Scoring events are built by the controller**, from `finalStandings`, in `scoringReel.ts`. They aren't engine
events.

| Kind | Payload | Board | HUD |
|---|---|---|---|
| `ticketRevealed` | `seat, ticket, complete, points` | complete: a light runs along the seat's connecting lanes, 600 ms | poster in the column, `+8` or CANCELLED `−8` |
| `trailLit` | `seats[], length, lanes[]` (ordered) | a light runs the longest trail, 1500 ms | `+10` |
| `standings` | `rows[], tieBreak?` | — | the tally |

### 3.4 Timings at 1× (`game/timing.ts`; 2× halves them with an 80 ms floor; instant = 0)

| Event | Duration | Class | Beats |
|---|---|---|---|
| `departed` length L | `350 + (700 + 250·L) + 200`: L1 = 1.50 s, L6 = **2.75 s**, cap 2.80 s | blocking | 0 whistle + pay chips leave; 350 the locomotive noses out of the origin disc; 350 → +30 % ease-in (the slow first beat), cruise, the last 20 % ease-out; the locomotive runs under the destination disc; +200 settle (±1.5 unit overshoot, one clank). Steam tail 3.0 s **non-blocking**. |
| `cardTaken` market | 420 ms, replacement +140 → 520 ms | overlap (the next pick can start at 450) | slow start, glide, settle |
| `cardTaken` deck | 380 ms | overlap | the card turns face up on arrival (160 ms) in the owner's hand |
| `marketCleared` | ≤ 1100 ms | blocking | 5 × 320 ms off (50 ms stagger), then 5 × 360 ms in (70 ms stagger) |
| `deckReshuffled` | 500 ms | blocking | |
| `ticketsOffered` | 420 ms + 80 ms stagger | blocking | |
| `ticketsKept` | 360 ms | overlap | |
| `laneClosed` | 600 ms | overlap | |
| `finalRoundBegan` | 6000 ms | ambient (input live) | |
| `ticketRevealed` | 700 ms | blocking, skippable | capped at 5 s per seat |
| `trailLit` | 1500 ms | blocking, skippable | |
| AI think | 600 ms (second draw: 250 ms) | — | 0 at instant |
| hand-off cover | mounts in the same frame the last blocking event resolves; dismiss 240 ms | — | |

**`finish()` compresses rather than snaps.** A tap during motion runs every blocking animation to its end state
in **160 ms** (cars rush into their slots, cards finish their roll), then handles the tap. Nothing pops even when
it's skipped. Instant speed (tests only) does snap.

### 3.5 BoardView (render/BoardView.ts)

```
interface BoardView {
  mount(el: HTMLElement, board: BoardGeometry): Promise<void>   // bakes the golden plate; resolves when lit
  sync(view: PublicView): void                                  // snap to state (load, resume, after instant)
  play(e: BoardEvent, opts?: { speed?: 0|1|2, byHuman?: boolean }): Promise<void>
  finish(): void                                                // compress running motion to ≤ 160 ms
  setSpeed(x: 0|1|2): void
  setPick(p: { lane?: LaneId|null, dim?: LaneId[], ticketCities?: CityId[] }): void
  onLaneTap(cb: (lane: LaneId, at: {x,y}) => void): void        // pick only; never commits
  onLaneHover(cb: (lane: LaneId|null) => void): void
  setLight(to: 'golden'|'night', ms: number): Promise<void>
  setInsets(r: { top, right, bottom, left }): void              // the frame; re-fits and re-bakes (debounced 200 ms)
  setAudio(a: AudioBus|null): void                               // board plays whistle/chug/clank on their frames
  setReducedMotion(on: boolean): void
  onDepartureProgress(cb: (carsOut: number) => void): void      // HUD ticks trains-left per car
  project(p: CityId | LaneId): { x, y }                         // CSS px, for labels, UI anchors, tests
  stats(): BoardStats   // fps, frameMsP95, drawnFps, activeTweens, lastDeparture{whistleAt, firstMoveAt, settleAt},
                        // appearedOffStation, printDiffProbe?, plateBakeMs
}
```

**Sound ownership.** The board plays whistle, chug and clank, because they are bound to its motion. The UI plays
card and poster sounds. The controller plays nothing except the scoring stings and the strings' resolve.

---

## 4. The rendering approach

John's note on the frames was that they "don't quite capture the cel-shaded 2.5D feel". The build must, and here
is how.

### 4.1 Camera and relief

- **Fixed high-oblique perspective.** Looking north, pitch 56° down from horizontal, FOV 22°. The ratio between
  near (south) and far (north) scale is ≤ 1.15, checked in `tests/render/camera.test.ts`. It never moves, zooms
  or orbits.
- **Board space** is 1000 × 620 units, from an Albers conic projection (standard parallels 29.5° / 45.5°, centre
  −96°), fitted to the continental US plus the southern Canada strip up to Calgary, Winnipeg and Montréal.
- **Relief.** A heightfield of 1024 × 640 (16-bit PNG), built from `relief.json`: hand-authored ridge polylines
  (Cascades, Sierra, Rockies front and spine, Wasatch, Appalachians, Ozarks), basins and plateaus, with falloffs,
  plus low-frequency noise. Vertical exaggeration puts the Rockies peak at 26 units (2.6 % of width). That's
  enough for silhouettes, cast shadows and rim light, and still flat enough for slots. The terrain mesh is
  384 × 240 segments.
- **Coast** comes from `world-atlas` land-50m, projected. The Great Lakes are five hand-traced polygons in
  `relief.json`, checked against a reference overlay screenshot. There's no elevation dataset download.

### 4.2 The plate (the land is baked, the board is still)

The land, water, forest, clouds and cast shadows are rendered **once per size** into a render target at device
resolution. That's the plate. Each frame is then the plate, plus drift layers, plus print, plus trains. Why:

- (a) Pillar 1's stillness is exact rather than approximate.
- (b) High-quality shadows (a 4096 shadow map, soft banded) and 7,000 instanced trees cost nothing per frame.
- (c) The TV laptop keeps its frame budget.

Bake ≤ 1.5 s at 1920 × 1080 DPR 2 on an M-series Mac, hidden behind the title's first light (the plate comes up
from dark over 1.2 s). Resize re-bakes after a 200 ms debounce. The night fall renders live for its 6 s and then
bakes the night plate.

### 4.3 Board geometry (build-board.ts → board.json)

- City positions are projected from real lat/lon, then nudged by hand (`nudge: [dx, dy]`, |d| ≤ 25 units).
  Coastal cities stay within 6 units of the coast, and inland cities stay on land.
- Lanes are straight or bowed chords. Car length is 24–30 units, the gap 3–14 units, and slot width 10 units.
  Double lanes are offset ±7 units from the centreline. City clearance is 11 units, and the city disc radius is 7.
- `verify-board.ts` fails on any of the following: a slot overlapping another lane's slot or a non-endpoint disc
  (clearance ≥ 3 units); a pitch outside [26, 40]; a label overlapping a slot or disc (labels get 8 candidate
  positions and step down to 90 % size before failing); a slot within 2 units of a coastline; a city count, lane
  count or length that doesn't match `usa.ts`.
- Output per lane: an ordered slot list `{ x, y, z, angle }` from endpoint A to B, a hit polygon, and a label
  anchor per city.

### 4.4 The cel shader (land only)

- **Four toon bands** on N·L, with thresholds 0.75 / 0.45 / 0.15. The cast shadow drops a pixel to band 4.
  Band edges are perturbed ±0.06 by a **brush field**: a procedurally generated, tileable 512² gouache stroke
  texture, oriented along the slope aspect. That gives brushy edges rather than smooth shading, which is the
  Life is Strange look.
- **Hue-shifted bands**, warm against cool:
  - band 1: albedo × warm gold (+8 % value, hue → 45°)
  - band 2: albedo
  - band 3: albedo shifted toward lavender
  - band 4: albedo × #6E5E8E, blended 55 %
- **Rim.** West-facing ridges where N·L > 0.6 and N·V < 0.35 get one warm gold band. This is the warm rim light.
- **Atmospheric depth.** Toward the north (far), value rises and saturation drops by up to 12 %. Far things are
  paler and cooler.
- **Regions** (from `relief.json` to `paint.png`, with albedo proposals the L agent tunes):

  | Region | Albedo |
  |---|---|
  | plains | cream #EAD9A6 |
  | prairie | #C9C26A |
  | desert | ochre-coral #D99A5E |
  | ranges | lavender #9C86B8 (elevation + slope) |
  | high peaks | pale lavender-cream |
  | NW pine | understory #2E5A45 |
  | eastern forest | #5E8F4E |
  | southern pine | #4F7F48 |

- **Water** is flat, in three depth bands from teal #1F6F7A to the shallow #3FA3A0, with a static cream foam line
  1.5 px wide. Water never animates; the glint is a drift layer (§4.6).
- **Forest.** About 7,000 instanced low-poly pines (24 triangles each) in three toon bands, casting into the plate.
  Density tapers to 0 within 18 units of any slot centreline, and trees within 30 units drop to 60 % height.
- **Clouds.** A backlit bank over the Pacific at the west edge: three layered billboard SDF clouds, cel-quantized
  into three tones with a gold rim, baked into the plate.
- **Refused:** film grain, vignette, chromatic aberration, lens flare, bloom over print, and any post-process pass
  over the whole frame.

### 4.5 Palette (shared/palette.ts, proposals; gates decide)

- **Route hues** (outline at full strength, fill 18 % max): red #C8412E, orange #D9772A, yellow #E3D03C (lemon,
  kept away from the gold), green #3F8A4A, blue #2F62A8, purple #8A4E9C, black #23262B (with a 1 px cream inner
  keyline), white #F1ECDD (with a 1 px ink outer keyline), gray #9A968C. Every slot has a 1 px ink keyline at 40 %.
- **Gold** (the one thing now): #F0B24A.
- **Ink** (border, dock): #15130F, with a cream inner keyline #E9DFC6 1.5 px.
- **Lamp** (night windows, the same for every finish): #FFD58A.
- **Finishes** are toon metal ramps (shadow / base / highlight + a hard specular band):

  | Finish | Shadow | Base | Highlight / trim |
  |---|---|---|---|
  | brass | #5E4518 | #B8913A | #F3D98A |
  | copper | #5A2A18 | #B0603A | #F0A983 |
  | chrome | #4A5560 | #B9C3CC | #FFFFFF, cool, the widest spec band |
  | gunmetal | #1E2227 | #4A5058 | rim #9AA3AD |
  | cream enamel | #A89B7C | #EDE3C8 | #FFF8E6, matte, 1 px ink trim line |

- **Assertions** (palette.test.ts, ΔE2000):
  - route hues pairwise ≥ 20, and gray–black / gray–white ≥ 15
  - gold vs every route hue ≥ 12
  - gold vs brass mid band ≥ 12
  - finishes pairwise ≥ 15 at golden hour and ≥ 10 at night
  - tint ≤ 18 %
  - colour-blind simulation (deuteranopia and protanopia) of finishes ≥ 8

### 4.6 Light drift, the fall, the night

- **Drift.** This is the only idle motion, and each part has a pixel budget:
  - five sunbeam quads over the northern Rockies and Cascades (frame 2), additive gold, opacity 0.10–0.16 with
    23–37 s periods
  - the cloud rim's brightness, ±4 %, 41 s period
  - one lake glint sliding 20 units over 30 s

  Per-pixel change ≤ 6/255 per second. `?still=1` turns drift off, for gates.
- **The fall** (`setLight('night', 6000)`, easeInOutSine). The ramps lerp from golden to night. The sun sinks and
  the moon rises in the ENE at 30° (a cool teal key light). The land goes to value × 0.28 toward #0F2A33, the
  beams fade out, coasts get a 1 px pale edge, city discs get a small warm lamp (radius 9 units, alpha 0.5), and
  unclaimed slots drop to 35 %. Claimed cars light their windows in `lamp`. Two searchlights at New York sweep
  ±14° over the Atlantic on a 19 s period; they're light, so they're allowed. It happens once. Nothing ever
  brings the day back, except a new game.

### 4.7 Print (slots, cities, names)

- **Slots** are one instanced draw. A rounded-rect SDF with `fwidth` antialiasing is drawn after the plate with
  depth test off, lifted 0.3 units above the heightfield sample. The outline is 2.5 px at 1280 and 3.5 px at 1920.
- **States:**
  - open: outline + 18 % tint
  - picked: 2 px gold outer keyline + 5 px soft gold halo + slots raised 1.5 units over 90 ms
  - closed (2–3 p sibling): 25 % + a 45° hatch
  - claimed: the car covers the slot, with a 1.5 px hue edge still showing so the map still reads as Ticket to
    Ride
- **City discs:** radius 7 units, cream fill, 2 px ink ring. A disc is also the **station mask**: cars under it
  are hidden, which is how they emerge.
- **Names** are DOM labels positioned by `project()` once per resize, since the camera is fixed. Jost 600 caps,
  tracking 0.12 em, 14 px at 1280 and 20 px at 1920, cream with a 3 px ink halo at 55 %. At night the halo goes
  up to 75 %.
- **Picking** is in 2D: point-in-polygon against the projected hit polygons (the slot union inflated 6 px,
  ≥ 28 px across). Double lanes are split along their centreline. Hover takes one frame. No raycasting, so
  picking is unit-testable in Node.

### 4.8 Trains

- **Car.** A procedural mesh about 180 triangles: body with a rounded roof, 4 windows, bogies, a buffer at each
  end. 24 × 9 × 7 units. It's cel-shaded with its finish ramp and a hard warm rim from the sun side. Instead of a
  real shadow, it gets a contact shadow sprite in the plate's band-4 colour.
- **Locomotive.** Boiler, stack, cab and cowcatcher, in the seat's finish with a gunmetal smokebox. It exists
  only while a train is moving.
- **Steam.** Puffs emitted at the chug rate, rising 6–10 units and growing ×2.2, in two cel tones (cream and
  lavender) with a gold rim on the sun side, thinning over 2.4 s. At most 40 puffs alive.
- **Departure path.** A polyline through the lane's slots, extended under both station discs. The locomotive
  leads, and at rest car *k* sits in slot *k*.
- `appearedOffStation`: each frame, `metrics.ts` counts any car whose visibility turned on outside a station mask.
  The gate is 0.

### 4.9 Performance ladder

Budgets at 1920 × 1080 DPR 2: p95 frame ≤ 16.7 ms during a departure, and an idle drawn frame ≤ 4 ms GPU. Idle
may render at 30 fps (drift is slow). The ladder, stepped down automatically when p95 > 20 ms over 3 s: trees
from 7,000 to 3,500, then DPR 1.5, then beams off. The plate keeps its baked shadows at every level.

---

## 5. UI grammar and screens

### 5.1 Grammar

- **Board taps pick; buttons or a finished gesture commit.** A pick is always visible in gold and named in the
  dock. A commit is a word button (Enter) or a completed drag (card to hand).
- **One gold** means one referent: the thing happening now (the picked lane and its name in the title bar, the
  picked card, or the departing lane). Everything else is cream or ivory. The current seat is marked by a cream
  underline, not gold.
- **Words** are plain, sentence case in lines, geometric caps in the title bar. Records are in the past tense and
  instructions in the present. Real names and numbers, no exclamation marks, U+2212 for minus, ` · ` as the
  separator.
- **Nothing reflows.** Hand chips have fixed positions (zero-count chips stay at 30 %), market slots are fixed,
  and seat columns are fixed.
- **Motion.** Game pieces (cards, posters, cars) only ever travel from their source, using `travel()` with the
  departure curve. Text crossfades in 160 ms.

### 5.2 The frame at 1280 × 800 / 1920 × 1080 (CSS px)

| Region | 1280 × 800 | 1920 × 1080 | Holds |
|---|---|---|---|
| Top border | 44 | 60 | seat strip |
| Right border (the siding) | 164 | 236 | deck, 5 market slots, ticket deck, discard |
| Bottom border (dock) | 120 = hand tier 48 + title tier 72 | 172 = 68 + 104 | hand; title line, record, verbs, commit |
| Left border | 16 | 24 | — |
| Board | 1100 × 636 | 1660 × 848 | land ≈ 1.03 / 1.37 px per unit |

Couch sizes (the gate reads these from the DOM and from `project()`):

| Thing | 1280 | 1920 |
|---|---|---|
| Car | ≥ 24 × 10 | ≥ 33 × 14 |
| Slot outline | 2.5 | 3.5 |
| City name | 14 (cap height ≥ 10) | 20 (≥ 14) |
| Counts (tabular) | 18 | 26 |
| Title line (Jost 600, tracking 0.16 em) | 30 | 44 |
| Verbs / buttons (tracking 0.22 em) | 15 | 22 |
| Market card | 124 × 78 | 176 × 110 |
| Hand chip | 34 × 46 | 50 × 68 |
| Poster in fan | 44 × 66 | 64 × 96 |
| Poster in sheet | 168 × 252 | 240 × 360 |
| Min target | 32 × 32 (mouse) / 44 × 44 (touch) | same |

### 5.3 Seat strip (top)

Each seat in a fixed column shows: a finish swatch (a rendered car chip, 22 × 14), the name in caps, route points,
trains left (with a car glyph), cards held, and tickets held, all as tabular numerals. The current seat has a
cream 2 px underline. In the final round, `LAST ROUND` and one dot per remaining turn sit at the far right.

### 5.4 The siding (right)

A vertical rail, top to bottom:

- **The deck:** a face-down stack whose size is shown by its thickness, with the count under it.
- **Five market slots,** each on the rail. Every card carries its hue field, a painted carriage silhouette and a
  colour-blind glyph.
- **The ticket deck** (poster backs), with its count.
- **The discard,** face-up, top card showing, with its count.

Cards roll down and out toward the hand, and replacements roll in from the deck with a clank.

### 5.5 The dock (bottom): hand tier + title tier

- **Hand tier** (holding seat only):
  - 9 chips in the fixed order red, orange, yellow, green, blue, purple, black, white, loco, each with its count
  - at the right, the poster fan; a tap opens the ticket sheet read-only, which is how you "open your hand"
- **Title tier:**
  - left: the **place line** in gold caps when it names the thing now, otherwise cream (`HELENA · DULUTH`)
  - under it: the latest record at low ivory (`Priya's train left Helena for Duluth.`)
  - right: the verbs and the commit

**States of the right side:**

| State | Right side shows |
|---|---|
| Idle | `DRAW · CLAIM · TICKETS` as low-ivory words: Draw picks the deck, Tickets picks the ticket deck, Claim cycles affordable lanes (R) |
| Lane picked | `DEPART` (primary, Enter) + `CANCEL` (Esc); the line under the place names the payment: `Six orange, or orange and locomotives. You have 5 orange, 1 locomotive.` A payment chooser appears only when choices differ in kind (gray lanes with several colours, or a locomotive mix that matters) |
| Card picked | `TAKE` (Enter), or tap the same card again, or drag it to the hand; second draw: `TAKE ANOTHER` and the line `One more card. Not a face-up locomotive.` |
| Tickets | `DRAW TICKETS` → sheet → `KEEP 2` (disabled with a reason until the minimum is met) |
| Unaffordable pick | the line `Helena to Duluth needs 6 orange. You have 3.` No button. |

**Keys:** Enter commits, Esc cancels or opens the menu, D picks the deck, 1–5 pick a market slot, T picks tickets,
R cycles affordable lanes, Space finishes motion only (never commits).

### 5.6 Hand-off (the dock's covered state, not a full-screen modal)

With 2 or more humans, when the next seat is human, the hand tier goes blank in the same frame the last blocking
event resolves. The title tier reads `PASS TO SAM`, with the button `I'M SAM` (Enter). Everything public stays
visible and calm. Dismissing fades in 240 ms and the hand rises.

Setup: each human's initial ticket choice happens behind the same cover. AI setup choices resolve instantly
(`Sam kept 3 tickets.`). Resume shows the cover if the current seat is human.

### 5.7 Screens

- **Title.** The golden plate with no trains, `DEPARTURES` in gold caps in the title tier, and on the right `NEW
  GAME · CONTINUE`. Continue appears only if a save exists and shows `Turn 30 · Priya, Sam, John`. Only light
  drifts; there's no attract motion.
- **New game.** A sheet in the siding column, 2–5 seat rows. Each row has a finish swatch (tap to cycle among
  unused finishes), a name field (≥ 16 px), `Human · AI`, and for AI `Gentle · Steady · Sharp`, plus add and
  remove seat, and `START`. The first seat is drawn from the seed (`Sam goes first.`). Budget: title to first
  action ≤ 3 clicks with defaults (New game, Start, Keep) and ≤ 20 s.
- **Ticket sheet.** Rises from the ticket deck over the board's lower half. Tap a poster to toggle keep (a pick);
  `KEEP N` commits.
- **Menu** (Esc or the `MENU` word): Resume, Rules, Record, Settings, Save and quit, New game.
- **Settings:** Speed 1× / 2×; Sound master, music and effects; Reduced motion; Text size 1 / 1.15 / 1.3; Hand-off
  Auto / Off; Colour marks on slots (off by default).
- **Rules:** one plain-English page generated from RULES.md headings.
- **Record:** the ledger, public lines only.

### 5.8 Victory (the map is the victory screen)

After `gameEnded` the title tier reads `THE LAST TRAIN HAS LEFT`. The siding's cards roll away and the column
becomes the tally. Each seat's tickets are revealed in seat order: completed ones trace their connection in light
on the board, and failed ones get the CANCELLED stamp. Then `trailLit` runs the longest trail(s), then the
standings appear. Each row shows the finish, name, total, and `routes 64 · tickets 38 · longest 10`. A tie-break
line appears if one was used (`Priya and Sam tied at 112. Priya completed more tickets.`). The record line reads
`Priya's railroad won, 112 to 98.` The total is ≤ 25 s at 1× with 5 seats; a tap skips a step and Enter skips all.
No fanfare: the strings resolve. After 4 s without input, `NEW GAME · MENU` appears at low ivory. The map stays
uncovered for as long as anyone wants to look.

### 5.9 View model (game/viewModel.ts, the UI's only input)

```
GameVM { screen, seats: SeatVM[], siding: SidingVM, dock: DockVM, hand?: HandVM, sheet?: TicketSheetVM,
         cover?: { to: string }, victory?: VictoryVM, gold: GoldRef, settings: Settings }
DockVM { place: { text, gold: boolean }, record: string, line?: string,
         buttons: ButtonVM[] /* id, label, primary, disabled?, reason? */, verbs: VerbVM[] }
HandVM { chips: { color, count }[9], posters: PosterVM[] }
PosterVM { ticket, from, to, points, art: string|null, status: 'open'|'complete'|'blocked' }
```

UI intents going back are: `pickLane`, `pickSlot`, `pickDeck`, `pickTickets`, `toggleKeep`, `commit`, `cancel`,
`holdSeat`, `openHand`, `menu(...)`, `setting(...)`.

---

## 6. Rules coverage and how RULES.md is pinned

### 6.1 The pin

- `docs/RULES.md` lists every rule under an ID (R-S setup, R-D draw, R-C claim, R-T tickets, R-E end, R-X
  implementation resolutions). Each has a paraphrase (not the rulebook text), the rulebook page, an
  **interpretation** flag where the text is ambiguous, and the test titles that cover it.
- `tests/engine/rules-coverage.test.ts` parses RULES.md and fails if any ID doesn't appear, in the form `[R-D3]`,
  in at least one test title under `tests/engine/`.
- **Appendix A** is the full lane table (id, cities, length, colour, double group) and **Appendix B** the 30
  tickets. `data.test.ts` asserts that `usa.ts` equals both appendices, row for row, plus the aggregates: 36
  cities, 100 lanes, 78 pairs, 22 doubles, 309 spaces, 44 gray, 7 per colour, lengths 9/36/20/16/10/9, and a
  110-card deck of 12 per colour and 14 locomotives.
- **Independent check.** The appendices are verified against the 2015 rulebook's map by the E agent's reviewer:
  the lead, or a second agent with Iron Atlas out of view. It isn't copied through. Iron Atlas agrees with the
  real map on the rows I spot-checked (Helena–Duluth orange 6, the nine length-6 lanes, all 30 ticket values).

### 6.2 The edge cases (each one becomes an R-ID with at least one test)

**Setup**
- R-S1: a 110-card deck, shuffled; each seat is dealt 4; 5 are turned face up, and R-D6 applies at setup.
- R-S2: 45 trains per seat; 2–5 seats; one longest-path bonus worth 10.
- R-S3: each seat is offered 3 tickets and keeps ≥ 2, in seat order, privately. Returns go to the bottom of the
  ticket deck in offer order.
- R-S4: first seat. The rulebook says "most experienced traveller". *Interpretation:* drawn from the seed and
  recorded.

**Drawing train cards**
- R-D1: two cards, each face-up or the top of the deck.
- R-D2: a face-up locomotive as the first draw is the whole draw (`drawEnded: faceUpLoco`).
- R-D3: a face-up locomotive can't be the second draw. If the only second-draw options are face-up locomotives
  and the deck and discard are empty, the turn ends (`noSecondCard`).
- R-D4: a blind locomotive counts as one card, with no special effect.
- R-D5: a taken face-up card is replaced **immediately**, in the same slot, before the second draw, so the
  replacement is available as the second draw (unless it's a locomotive).
- R-D6: whenever the market is full (5 cards) and 3 or more are locomotives, all 5 are discarded and 5 new ones
  dealt. This repeats as needed.
- R-D7: when a card is needed and the deck is empty, the discard is shuffled into a new deck. Market cards and
  hands are untouched.
- R-D8: with deck and discard both empty, empty slots stay empty (`null`). Drawing is legal only if a legal card
  exists.
- R-D9 (R-X): the pathological market. If the non-locomotive cards across deck, discard and market can't produce
  a market with ≤ 2 locomotives, the market stays as dealt and no clearing happens. Resets per refill are bounded
  to `ceil(pool/5) + 1`, deterministically. Stated as an implementation resolution.
- R-D10: *interpretation:* the second draw is **mandatory** when a legal one exists (the digital editions play it
  this way). The UI can't end a turn after one card unless R-D2 or R-D3 applies.
- R-D11: no hand limit. After the first draw a seat can't claim or draw tickets (`mustFinishDraw`).

**Claiming a route**
- R-C1: any open lane, no connection needed.
- R-C2: pay exactly *length* cards. On a coloured lane: that colour plus any locomotives. On a gray lane: one
  colour of your choice plus locomotives. All locomotives is allowed. Mixed colours are rejected (`wrongColor`).
- R-C3: trains ≥ length, otherwise `notEnoughTrains`.
- R-C4: points by length (1, 2, 4, 7, 10, 15), scored immediately and in public.
- R-C5: paid cards go to the discard.
- R-C6: one lane per turn.
- R-C7: at 4–5 seats, different seats may claim both lanes of a double, but one seat may never hold both
  (`ownSibling`).
- R-C8: at 2–3 seats, claiming either lane closes the other to everyone (`laneClosed` event).
- R-C9: the seat count for R-C7/C8 is the number of seats at creation.

**Tickets**
- R-T1: draw 3 from the top and keep ≥ 1. Returns go to the bottom in offer order.
- R-T2: with fewer than 3 in the deck, draw all that remain; keep ≥ 1 still applies.
- R-T3: an empty ticket deck makes the action illegal.
- R-T4: tickets are secret and can't be discarded; the ticket count is public.
- R-T5: complete means a continuous chain of your own lanes between the two cities.
- R-T6: an incomplete ticket subtracts its value at the end.
- R-T7: in the final round, drawing tickets is legal (and usually a mistake).

**End and scoring**
- R-E1: at the end of a turn, if that seat has ≤ 2 trains and no final round is running, the final round begins.
  Every seat, including the trigger, gets exactly one more turn. `turnsLeft = seats`, decremented per turn.
- R-E2: it triggers only once. Other seats dropping to ≤ 2 during the final round changes nothing.
- R-E3: longest path is an edge-simple trail over your own lanes. Cities may repeat and loops are allowed, but no
  lane is used twice. Ties all get 10.
- R-E4 (R-X): the bonus requires a trail length ≥ 1. With zero lanes, nobody gets it (an implementation
  resolution; the rulebook is silent).
- R-E5: the winner has the most points. Ties go to the most completed tickets, then to holding the longest-path
  bonus. If still tied, the win is **shared** (R-X), and the record names both.
- R-E6 (R-X): stalemate. A seat with no legal action passes. If every seat passes in one cycle
  (`passStreak === seats`), the game ends as `stalemate` and is scored.

**Invariants** (asserted after every action, in fuzz):
- cards across deck, discard, market and hands = 110, per colour exact
- tickets across deck, hands and the offer = 30
- trains + claimed lengths = 45 per seat
- routePoints = the sum of points for owned lanes
- the market has < 3 locomotives unless R-D9 applies
- a blocked ticket never becomes unblocked
- replaying the action list reproduces the state

### 6.3 RNG

mulberry32, with the state in `state.rng`. Every shuffle and deal goes through it. The AI uses its own stream,
seeded as `hashInts(seed, turn, seat, actionIndex)`, and never advances `state.rng`. So AI choices don't change the
game's randomness, and a replay only needs the actions.

### 6.4 Views (redaction)

- `publicView`: seats with **counts** only (cards and tickets), the market, the discard, the deck size, the ticket
  deck size, claims, finalRound and phase kind.
- `seatView(seat)`: the public view plus that seat's hand, tickets, offer and ticket outlooks.

The AI receives only a `seatView`. The UI's hand is built only from `seatView(holding)`.

### 6.5 Save format

```
localStorage 'departures.save.v1' = {
  format: 'departures.save', v: 1, config: GameConfig, seed: uint32,
  actions: Action[],           // every action since createGame
  state: GameState,            // snapshot after the last action
  record: string[],            // public ledger, last 300
  meta: { savedAt: ISO, turn, seats: string[] }   // for Continue; written by storage.ts, not the engine
}
'departures.settings.v1' = Settings
```

- Saves happen on every committed action, **before** playback. A reload mid-animation resumes at the post-action
  state: the board syncs and the cover shows if needed.
- Loading runs `validateState`: structural checks, conservation (§6.2 invariants), the double-lane rule, and
  phase consistency (ported from Iron Atlas's validator, which is thorough). Then `replay(config, seed, actions)`
  is compared to the snapshot. On a mismatch the snapshot wins, and `__dep.warnings` records it (e2e fails on
  warnings).
- `migrate(save)` is a table keyed by `v`.
- A corrupt save shows `The saved game could not be read. A new game is ready.` The save is kept under `.bad` and
  never overwritten silently.

### 6.6 Ticket outlook (tickets.ts)

`ticketOutlook(state, seat, ticket) → { status, trainsNeeded, cut }`:

- It runs Dijkstra over the 36 cities, with weight 0 for the seat's own lanes, *length* for lanes open to the
  seat, and ∞ for claimed or closed lanes.
- `blocked` means the distance is ∞ or greater than the seat's trains. It is monotonic: claims only accumulate and
  trains only fall, and a test enforces this.
- `cut` is true when the last claim raised `trainsNeeded` (this is Soul question 2's alternative).

It runs for every seat and every ticket after each `departed`, and is cheap (≤ 0.5 ms for all seats).

---

## 7. Tests and gates

### 7.1 Unit (Vitest, `npm test`)

- **engine:**
  - one or more tests per R-ID
  - `fuzz.test.ts`: 2,000 seeded games at 2–5 seats, where each seat picks a random legal action with 70 %
    probability and a Steady AI action otherwise; invariants checked after every action, save round-trip every
    10 actions, replay equals the final state
  - `longest.test.ts`: brute-force comparison on 500 random graphs of up to 14 edges, plus a worst case of 20
    lanes ≤ 50 ms
  - `views.test.ts`: publicView contains no card colour or ticket id belonging to any seat
- **ai:**
  - 200 games per level at 3 and 4 seats with zero illegal actions and zero stalls
  - hidden-information invariance: permuting the deck order and other seats' hands and tickets leaves
    `chooseAction` unchanged
  - a face-up locomotive is never taken as the second draw
  - the keep minimums are respected
  - `chooseAction` p95 ≤ 40 ms (Steady) and ≤ 120 ms (Sharp) in Node
- **game:** with the controller and stubBoard in Node, tests cover:
  - the picks → commits flow
  - playback order
  - the HUD applying on resolve (no spoilers)
  - `finish()` compression
  - hand-off only with 2+ humans
  - private events never passed to `board.play`
  - resume at each phase kind
  - the scoring reel matching `finalStandings`
- **data / render:**
  - board.json passes verify-board
  - projection round-trip
  - pick polygons: every lane is hit at its slot centres and no lane is hit at another lane's slot centres
  - camera scale ratio ≤ 1.15
  - palette ΔE assertions
  - the import boundaries

### 7.2 Sim gates (`npm run sim`, reported in phase reports)

- 500 games per matchup at 3–4 seats: Sharp beats Steady ≥ 60 %, and Steady beats Gentle ≥ 70 %.
- Steady completes ≥ 75 % of its tickets.
- The median game at 4 seats is 45–75 total turns.
- No game exceeds 200 turns.

### 7.3 E2E lanes (tests/e2e/lanes.ts, War Table's model)

**Logic lane** (parallel, instant speed unless marked realtime):

| Flow | What it asserts |
|---|---|
| `smoke` (quick) | title → new game → first ticket choice → first turn: screens, seats, dock |
| `setup` | 2–5 seats, finishes unique, AI levels saved, Continue metadata |
| `rules` | fixture scenarios through real clicks: face-up loco ends the draw; loco refused as the second draw with its line; market clear; double lane closed at 3 seats and open at 4; keep minimums; deck exhausted and reshuffled; `noSecondCard`; gray payment chooser |
| `handoff` (realtime) | zero frames of the next seat's hand, sampled per mutation and per rAF across the real turn end; `I'M SAM` reveals it |
| `privacy` | while not holding, DOM text and `data-*` contain no ticket id or chip count of any seat's hand |
| `cancelled` | fixture: Priya's claim blocks Sam's ticket. Public DOM regions are byte-identical before and after, apart from the departure's own changes (strip counts, record, place line). Sam's hand shows the stamp after the cover. |
| `resume` (quick) | reload mid-turn, mid-second-draw, mid-ticket sheet, and during the final round; state equals the snapshot |
| `scoring` | fixture end state: the tally equals `finalStandings`, including the tie-break lines |
| `fullgame` | 4 AI to victory: no console errors, no warnings |
| `keys` | every key in §5.5 |

**Timing lane** (serial, real speed, a cold browser each time):

| Flow | What it asserts |
|---|---|
| `departure` | commit → settle ≤ 1.55 s at L1 and ≤ 2.80 s at L6; `firstMoveAt − whistleAt` ≥ 300 ms; chug intervals shrink monotonically over the first 40 % |
| `feel` | tap → gold ≤ 50 ms; a tap during a departure → settled ≤ 200 ms; idle has 0 tweens; with `?still=1` two frames 2 s apart are identical; with drift on, the max per-pixel change over 1 s ≤ 6/255 |
| `pops` | across one turn of each action type, `appearedOffStation` = 0, and every card or poster entry travels ≥ 24 px |
| `nightfall` | final-round trigger → fall completes in ≤ 6.2 s; a tap during it is acknowledged in ≤ 50 ms |
| `round` | AI turn at 1× median ≤ 3.6 s, p95 ≤ 4.5 s; a round of 4 AI turns ≤ 15 s |
| `budgets` | a claim ≤ 3 clicks, a draw ≤ 4, tickets ≤ 2 + toggles, hand-off 1, title → first action ≤ 3 clicks and ≤ 20 s |
| `perf` | 1920 × 1080 DPR 2: departure p95 frame ≤ 16.7 ms, plate bake ≤ 1.5 s, idle frame ≤ 4 ms |

### 7.4 Samplers (tests/e2e/samplers.ts)

- **one-gold:** per frame, counts on-screen gold referents (HUD elements inked `gold`, plus the board's pick
  halo). The limit is 1 referent; the place line and its lane count as one. Car pixels are masked by instance id,
  so brass is never mistaken for gold.
- **print-diff:** renders `?plate=flat`, then the real plate, and compares print-layer pixels (via a print-only
  mask render). Max diff 2/255.
- **hue / finish:** samples each open slot's outline pixel and each claimed car's body pixel, and classifies them
  to the nearest palette entry. It must be 100 % correct with a margin ΔE ≥ 6, at golden hour and at night.
- **sizes:** from the DOM and `project()`, checks §5.2's minimums, plus text contrast ≥ 4.5 : 1 against the
  sampled local background.

### 7.5 Legibility screenshots (looked at, then reviewed by the lead + a Fable second opinion)

`artifacts/legibility/`:
- `{1280x800,1920x1080}-{golden,night}.png`
- the same four downscaled to 25 % (the 3 m squint)

`artifacts/moment/`: `helena-duluth-{0,350,900,1600,2750}ms.png` at 1920 × 1080. This fixture is turn 30 with
brass Priya.

`artifacts/screens/`: `title`, `newgame`, `ticket-sheet`, `handoff`, `lane-picked`, `card-picked`, `victory`,
`victory+4s`.

Each is looked at with the Read tool before any "done". A phase is done only on **seen**.

---

## 8. Build phases

Every brief pastes the Intent, the moment and the pillars, names its owned files, and forbids the rest (anything
else goes under "Requests"). Ports: the lead uses 5390, agents use 5391–5399. No agent runs `npm install` (except
Scaffold), commits, or runs two e2e suites at once. Browser checks use Playwright from a node script with the
CLAUDE.md flags, always muted.

### Phase 0 · Scaffold and contracts (1 agent, port 5391, ~1 h)
- **Scaffold owns:** package.json, the lockfile, tsconfig.json, vite.config.ts (VITE_E2E hooks, no HMR under
  DEP_E2E), vitest.config.ts, index.html, render-sandbox.html, audio-lab.html, ui-gallery.html, `src/main.ts`
  (stub), `src/shared/fonts.css`, and all ★ contract files exactly as in §2.2 and §3, `src/engine/data/usa.ts`
  ported from Iron Atlas, `docs/RULES.md` (IDs, paraphrases, pages, appendices), `tests/e2e/{lanes,lib}.ts`,
  `scripts/e2e.ts`, `tests/engine/data.test.ts`, `tests/data/imports.test.ts`.
- **Accept:** `npm run typecheck`, `npm test` and `npm run build` pass. The dev server at 5391 shows the dark
  frame at 1280 × 800 with `DEPARTURES` in the title tier. data.test is green against the appendices. The lead
  checks the appendices against the rulebook map (a checklist in the report).

### Phase 1 · Playable vertical slice

**Slice definition.** John plays a whole game, 2 humans plus a Steady AI, at 1280 × 800 and on the TV at
1920 × 1080:
- title → new game → private ticket choices → turns of all three actions, with every rule enforced → the
  hand-off in the dock → the final round's light fall → scoring and tally → reload-resume mid-game
- departures with whistle, chug, steam and clank
- a cel-shaded land with ranges, lakes, coast, one pine region and the cloud bank
- typographic posters with a working CANCELLED stamp

**Wave A** (4 agents in parallel, after Phase 0):

- **E · Engine** (no dev server).
  - *Owns:* `src/engine/**` except types.ts and data (additive only), `tests/engine/**`.
  - *Delivers:* reducer, market, payment, lanes, tickets, longest, scoring, legal, views and save.
  - *Checkpoint* at about 90 min (the report names it): reducer + events + legal green, which unblocks Wave B.
  - *Accept:* every R-ID is covered (rules-coverage green); fuzz 2,000 green; longest brute check green;
    `validateState` rejects the 12 tamper fixtures ported from Iron Atlas's tests.
- **G · Geometry** (port 5393).
  - *Owns:* `scripts/{build-board,verify-board,bake-relief}.ts`, `src/data/{board,relief}.json`,
    `public/relief/**`, `tests/data/board.test.ts`, `tests/render/{projection,pick}.test.ts`,
    `src/render/print/pick.ts`, `src/render/camera.ts`.
  - *Delivers:* a v0 heightmap within 30 min (the report names the path) so L isn't blocked.
  - *Accept:* verify-board exits 0; an overlay screenshot `artifacts/geometry/overlay-1920.png` shows cities,
    slots, the coast and lakes on a flat plate, and has been looked at; the pick tests are green.
- **L · Land and light** (port 5394).
  - *Owns:* `src/render/plate/**`, `src/render/light/**`, the land portion of render-sandbox.html.
  - *Delivers:* the §4.2 bake, the §4.4 shader, water, clouds, one pine region, drift, and the fall with the
    night ramp (searchlights come in Phase 2).
  - *Accept:* sandbox screenshots `artifacts/land/{golden,night}-1920.png`, `rockies-2x.png`,
    `nw-pines-2x.png`, and a flat vs golden pair for the print-diff harness; bake ≤ 1.5 s reported.
  - **This is the look gate** (below).
- **S · Sound** (port 5395).
  - *Owns:* `src/audio/**`, audio-lab.html, `scripts/verify-audio.ts`.
  - *Delivers:* whistle (a 3-pipe chord, 900 ms, far reverb, panning), chug (filtered noise pulses driven by
    `rate(t)`), clank, card roll + couple, riffle, poster slide, a wind + birds bed, and a first strings pad.
  - *Accept:* verify-audio shows the whistle peak ≥ 3 dB above every other cue, and the bed is ≤ −24 LUFS
    under play; lab renders go to `artifacts/audio/*.wav` for the lead to listen to.

**The look gate** (the lead, with Fable 5.1 as a second opinion; John's one sitting). It happens at the end of
Wave A. L's four screenshots are held against frames 1 and 2 and the Life is Strange touchstone: banded, brushy,
2.5D, and a still poster. John answers the Soul questions in the same sitting, so the picker fires once. P and U
integrate onto the land only after this gate passes. If it fails, L iterates while P and U keep going on a flat
plate.

**Wave B** (starts at E's checkpoint; runs alongside L and S, 6 agents at most):

- **C · Controller** (port 5396 for one smoke only).
  - *Owns:* `src/game/**` except the viewModel/timing contracts, `tests/game/**`.
  - *Accept:* §7.1 game tests green; the Node full-game test drives 2 humans + AI through the controller with
    stubBoard to victory.
- **A · AI** (no port).
  - *Owns:* `src/ai/**`, `scripts/sim.ts`, `tests/ai/**`.
  - *Delivers:* Steady, and Gentle as a Steady with noise.
  - *Accept:* §7.1 AI tests green; sim at 3 and 4 seats reported (the Steady-vs-Gentle ≥ 70 % gate can wait for
    Phase 2).
- **P · Print and trains** (port 5397).
  - *Owns:* `src/render/index.ts`, `src/render/print/**` except pick.ts, `src/render/trains/**`,
    `src/render/metrics.ts`, the print and trains portion of render-sandbox.html.
  - *Delivers:* §4.7 and §4.8, with the departure matching timing.ts within ±10 %, steam, `appearedOffStation`,
    and `finish()`.
  - *Accept:* the sandbox plays Helena–Duluth at 1×. The `artifacts/moment/` five frames have been looked at.
    `stats().lastDeparture` shows the whistle 350 ms ahead. The L6 total is ≤ 2.80 s.
- **U · UI** (port 5398).
  - *Owns:* `src/ui/**`, ui-gallery.html.
  - *Delivers:* frame, seats, siding, dock, hand, the typographic posters with the stamp and punch, the ticket
    sheet, the cover, title, new game, a minimal victory tally, and the menu. It renders from viewModel fixtures
    in the gallery.
  - *Accept:* gallery screenshots of every §7.5 `screens/` state at both sizes have been looked at; the §5.2
    sizes are met.
- **Lead · Integration** (5390).
  - *Owns:* `src/main.ts`, `src/game/hooks.ts` wiring review, `tests/e2e/*.e2e.ts` for smoke, resume, handoff,
    departure and budgets.
  - *Accept, Phase 1:* `npm run test:e2e:quick` + `handoff`, `departure` and `budgets` green; §7.5 legibility
    screenshots at golden hour looked at; **John plays the slice** (seen).

### Phase 2 · The soul at quality (up to 6 agents)

- **L2** (5394): the full forest, sunbeams, brush-field tuning, the night plate with searchlights and lamps, and
  the perf ladder. *Accept:* night legibility shots; `perf` green.
- **P2** (5397): the five finishes final, night windows, the closed-lane hatch, and the trail light for victory.
  *Accept:* the hue/finish sampler at 100 % golden and night; the finish contact sheet looked at.
- **U2** (5398): poster art integration, the victory choreography (§5.8) with the controller's scoringReel,
  settings, rules, record, text size, reduced motion, and colour marks. *Accept:* `victory` and `victory+4s`
  looked at; `scoring`, `keys` and `privacy` green.
- **A2** (no port): Sharp; Gentle tuned. *Accept:* §7.2 gates.
- **S2** (5395): the strings bed with sparse phrasing and a resolve at victory, ducking under whistles, and the
  whistle's distance by origin. *Accept:* lab renders reviewed by the lead; John listens once.
- **Posters** (5396; C is done by now): *Owns* `public/posters/**`, `_claude/posters-src/**`, `scripts/posters.ts`.
  Thirty imagegen posters from one style brief (frame 3; land and light only, no people, no buildings), 2:3 at
  1024 × 1536, shipped as webp at 480 × 720 ≤ 120 KB each. *Accept:* a contact sheet `artifacts/posters/sheet.png`
  looked at; the lead's taste gate picks or regenerates. The typographic fallback stays for any poster that
  doesn't pass.

### Phase 3 · Gates, polish, review (2–3 agents)
- **Q · Gates** (5399): *Owns* the rest of `tests/e2e/**` and `samplers.ts`. Builds every §7.3 flow and every
  §7.4 sampler. *Accept:* `npm run test:e2e` is all green; the full screenshot sweep has been looked at.
- **Fix agents** (the ports freed up), with briefs written by the lead from Q's failures, each owning exactly the
  failing files.
- **The lead:** re-runs §1 against the build and pastes it into the final report with evidence labelled **seen**.
  Then a Fable 5.1 taste pass on the sweep, and John's evening playtest with friends is the last gate.

---

## 9. Risks and guards

| Risk | Guard |
|---|---|
| The cel-shaded 2.5D still doesn't land (John's standing note on the frames) | The look gate at the end of Wave A, in the sandbox, before integration. The look is decided on four screenshots against frames 1–2 and Life is Strange, not inside the game. The plate architecture means iterating on the look never touches rules or UI. |
| Painterly bleeds into print | Print is a separate unlit pass after the plate; the print-diff sampler (≤ 2/255); no full-frame post. |
| Route hues vs land, or yellow vs gold vs brass | palette.test ΔE floors; lemon yellow; the gold only as a pick keyline and halo; car pixels masked in the one-gold sampler. |
| Finishes don't separate (brass/copper, chrome/enamel), especially at night | Finish ΔE ≥ 15 golden and ≥ 10 night; colour-blind checks; enamel's ink trim; chrome's wide spec band; the classification sampler at night. |
| 100 lanes don't fit legibly (the Northeast) | verify-board hard checks; per-city nudges; car length 24–30; the projection may distort as the real board does; failures are reported as a list, never waved through. |
| Parallel agents drift from the engine | Contracts first, additive only; E's checkpoint gates Wave B; stubBoard lets C test without WebGL; import-boundary test. |
| Hidden information leaks (AI or DOM) | `seatView` redaction; AI invariance test; the `privacy` and `handoff` flows; `BoardEvent` excludes private kinds at the type level. |
| Market or stalemate loops | R-D9 bounded resets; R-E6 pass cycle; fuzz with 2,000 games and a 200-turn cap. |
| Longest path is slow | Exact DFS with bounds (Iron Atlas's pruning); a 20-lane worst case ≤ 50 ms test. |
| Tempo creep with 5 seats and AIs | Every duration in timing.ts and gated; `finish()` compression; 2× speed; AI think 600 ms. |
| Synthesized whistle sounds like a toy | Audio lab + offline render + John listens once; Soul question 5 offers recorded samples. |
| imagegen posters are inconsistent | One style brief, a contact sheet, the lead's taste gate, the typographic fallback. |
| TV laptop GPU | The baked plate; an idle frame ≤ 4 ms; the automatic ladder. |
| CANCELLED is too rare to sting | Soul question 2; the engine already computes `cut`, so switching is one line. |
| Brass reads as the UI's "one gold" | The gold is flat print colour #F0B24A, never shaded; brass always has its dark band. The sampler masks cars. |

---

## Commands (for CLAUDE.md once the scaffold lands)

```
npm run dev            vite --port 5390 --strictPort   (lead) · agents: npx vite --port <p> --strictPort
npm test               vitest run
npm run typecheck      tsc --noEmit
npm run build          tsc --noEmit && vite build
npm run test:e2e       tsx scripts/e2e.ts            (logic lane parallel, then timing lane serial)
npm run test:e2e:quick tsx scripts/e2e.ts --quick
npm run sim            tsx scripts/sim.ts --games 500 --seats 4
npm run board          tsx scripts/build-board.ts && tsx scripts/verify-board.ts
npm run relief         tsx scripts/bake-relief.ts
npm run verify:audio   tsx scripts/verify-audio.ts
```
