# Departures: plan candidate, render first

**SOUL.md outranks this file on intent and feel.** The settled block at the top of docs/DIRECTIONS.md binds;
its ranking does not. Everything here is *promised* (a plan line) until it is built, and done only when seen.

Angle: plan from the picture outward. §4 (the picture) is the longest section on purpose. The engine and UI
are specified as what feeds the picture, but they are specified completely, because the picture is worthless
if the rules are wrong or the friend who forgot the rules gets stuck.

---

## 1. SOUL checklist, run against this plan

### 1.1 The moment, walked through the plan

Turn 30, on the couch, 1920×1080 TV. A 4-seat game with a fixture of about 40 % of the lanes claimed.

| Beat in SOUL | What the plan shows and does | Verdict |
|---|---|---|
| "The continent lies still in late golden light: cream plains, lavender ranges, deep teal lakes, dark pine in the Northwest, a backlit cloud bank over the Pacific." | §4.2–4.5: a baked relief under a banded toon shader with the palette in `palette.ts` (cream/gold plains, lavender range shadows, teal lakes, dark fir in the NW forest zone); the cloud bank is real geometry off the Oregon coast with a warm rim. Camera fixed (§4.8). Idle: only light uniforms change (§4.6, gated by the `poster` flow). | serves |
| "Priya taps the route from Helena to Duluth" | Tap = pick (§5.3). The lane's slots rise to full tint and a gold rail runs through them; the title bar reads `HELENA · DULUTH` in gold. Nothing else changes. | serves |
| "and pays five yellow cards." | **Contradiction found**: on the 2015 board Helena–Duluth is **6 orange** (Iron Atlas `data.ts:103`). The rules bind (SOUL Open), so the build pays six orange. Soul question 1. | works against (the words only; the beat is intact) |
| "A whistle, far off." | §4.10 beat 0–300 ms: the whistle starts on commit, the train is not yet visible; the whistle is the loudest cue in the mix (§4.12, gated by `verify:audio`). | serves |
| "Her brass train pulls out of Helena, slow on the first beat, then the chug picks up, steam trailing" | §4.10: the train emerges from under Helena's station ring (clipped, never popped), eases in over 500 ms with chuffs at 420 → 260 ms intervals, steam puffs per chuff, drifting east and thinning. Brass is a finish (§4.9), not a hue. | serves |
| "and the last car settles at Duluth with a soft clank." | §4.10 stop + settle: couplers bunch front to back, 30 ms stagger, the clank on the last car's settle. | serves |
| "The title bar reads `HELENA · DULUTH`." | §5.2: after the clank the line keeps the route in gold caps; the sub-line records `Priya's train left Helena for Duluth.` | serves |
| "Sam, watching, says nothing; that was the route his ticket needed." | Engine emits nothing public about Sam's tickets. `ticketCancelled` is private and has no render, sound or line (§3). | serves |
| "He finds out for sure three turns later, when he opens his hand and the Duluth poster wears a small CANCELLED stamp." | §5.6: CANCELLED means the ticket can no longer be completed (no path through free-or-own lanes within Sam's trains). It is already on the poster when he opens it: no animation, no sound. Also: there is no Helena–Duluth ticket in the 30; frame 3's `HELENA · DULUTH · 8` does not exist. Sam's ticket would be Duluth–Houston 8 or Duluth–El Paso 10. Soul question 1. | serves (definition is Soul question 2) |
| "The board has not moved since. It never does" | Fixed camera, no attract orbit, no idle tweens, no land changes on claim; trees never sway. | serves |
| "until the last round, when the light goes down once and the lit trains are all that is left." | §4.11: `finalRoundBegan` plays a 6 s light change, once; claimed trains light their windows (warm lamps, never card hues), unclaimed print stays readable but unlit; the one light change is gated by the `ending` flow. | serves |
| "And after: someone looks at the finished map for a while before anyone reaches for the menu." | §5.7: at `gameOver` the title bar reads `THE LAST TRAIN HAS LEFT`; nothing else appears for 4 s; the scores wait behind a word the players press. No modal ever covers the finished map unasked. | serves |

**One bad day.** Sam, losing, in a 5-seat game with three Normal AIs. His two long tickets are blocked by
turn 25. He opens his hand and finds two stamps, with no toast, no red flash and no pity line. His AI turns
are watched at about 2 s each, so he never waits longer than roughly 8 s for his turn. The last round falls
while he has 19 trains; the light goes down on his short scattered lines. The scoring sheet counts his
tickets down in the same flat past tense as everyone else's (`Sam finished with 38 points.`). Nothing
consoles him and nothing mocks him: serves pillar 4. **Idle day**: Priya leaves mid-turn for 10 minutes.
The board drifts light only; no nag line appears, no "are you still there", no screensaver. Her train hand
stays in the dock, face up (Soul question 4). **Skipped day**: a seat with no legal action passes, and the
line records `Sam had no card to draw and no route he could pay for. He passed.` That serves.

### 1.2 Pillars

1. **The calm is the country.** Serves. §4.6 is the whole idle budget: cloud-shadow drift, shaft breathing,
   water glitter, cloud rim. The `poster` flow (§7) fails the build if any mesh transform or tween changes
   during 60 s idle. Nearest contradiction I found in my own plan: the ticket sheet's scrim darkens the land
   when you view tickets. It is user-initiated and 180 ms, so I kept it.
2. **Departing is the only verb.** Serves. A claim is a departure (§4.10). A card draw is a car shunted off
   the siding (§5.4). A ticket draw pulls three posters off the ticket rack like carriages. A market reset is
   five cars leaving and five shunting in. Nothing is spawned at full opacity: the `pop` detector (§7) fails
   any board or siding element that goes from 0 to ≥ 60 % visible in one frame. "Heard before seen": the
   whistle leads the first visible train pixel by ≥ 250 ms (measured in `tempo`). The 50 ms
   acknowledgement rule (War Table UX §8.1) is kept by the paid cards leaving the hand, not by the train.
3. **Vivid as memory, readable as print.** Serves, with the heaviest guard in the plan. Print is a separate
   pass drawn after everything painterly; slot interiors are opaque printed tiles, so no painterly layer
   can change their colour; names and numbers are DOM. The `legibility` flow gates slot size, hue
   classification at 25 % scale, owner classification, keyline contrast, and ΔE ≤ 3 at every slot centre
   between the full composite and a print-only render.
4. **Wonder and loss in the same move.** Serves. The loss channel is private and silent (CANCELLED, found
   later). In 2–3 player games the closed sibling of a double route fades to a hairline, so every claim can
   visibly close something. The wonder channel is the departure itself.
5. **The land is a character, never a prop.** Serves. Forest zones, rivers, ranges, a weather bank, light.
   No people, no landmarks, no towns, no ornaments on the board. The night's searchlights are two still
   beams from beyond the Atlantic edge with no source drawn (Soul question 8).

### 1.3 Evidence labels

Every claim in this file is **promised**. Nothing is built or seen. The phase acceptance lists (§8) say what
"seen" means for each phase: a screenshot or a 200 ms-cadence capture that the agent opened with the Read
tool, and for Phase 1 a full game the lead played in the browser.

### 1.4 Inherited commitments (the five with the most effect)

| Commitment | Outcome SOUL requires | Mark |
|---|---|---|
| Ticket to Ride USA 2015 rules and the board data (36 cities, 100 lanes, 30 tickets, from Iron Atlas `data.ts`, re-verified) | "The rules (Ticket to Ride USA, 2015 rulebook) ... bind" | **traces** (SOUL Open). It contradicts the moment's "five yellow" and frame 3's ticket. That is a question for John, not a plan change (Soul question 1). |
| War Table's controller: an event queue with a displayed state that follows the board, and click-through | "A tap during motion finishes it. Nothing new makes you wait." | **traces** (Feel, Hands) |
| War Table's hand-off cover | "take ... the hand-off cover" (Touchstones, War Table) | **traces**, but I change its shape: it covers the dock's private half, not the screen, so the board stays the picture. That is my taste, so it goes to John (Soul question 3). |
| The frames' dock verbs `DRAW CLAIM TICKETS END TURN` | Frames are "palette references only" (Misreads) | **open**. `END TURN` is dropped because Ticket to Ride turns end themselves. Draws are taps on the siding. |
| Three AI difficulties with a watchable AI tempo | The brief requires them; SOUL is silent | **open** (current docs decide) |

### 1.5 Closest Misread

"imagegen frames 1 and 4: painted every slot saturated and lit every carriage in its card colour." This
plan is nearest to it in two places: the unclaimed slots have to show their hue (I use a pale opaque tile
with a full-strength hue stroke, not a saturated fill), and the night lamps (warm windows and headlamps in
one lamp colour, never the card hue). Guard: palette tunables for tile tint live in one file and are
checked by the legibility flow at golden and night; there is a lamp-colour rule in §4.11. The runner-up is
the "full day cycle" misread: the sun's direction and colour are constants until `finalRoundBegan`, and
the `ending` flow asserts the light state never changes before it.

### 1.6 Soul questions (for John; each has a default that is built unless he says otherwise)

1. **The moment's route.** Helena–Duluth is 6 orange on the 2015 board, and no Helena–Duluth ticket exists.
   Default: the board wins, and the moment is illustrative. Should I also make one of the 30 posters the
   Duluth lake shore from frame 3 (the Duluth–Houston 8 ticket)?
2. **What CANCELLED means.** Default: it means impossible, i.e. there is no path through free-or-own lanes
   within your remaining trains (and lane closures in 2–3 player games). That's honest, and it will mostly
   appear mid-to-late game. The softer alternative is "a lane on your shortest path was taken". It would
   fire often, but it would sometimes be wrong.
3. **Hand-off cover shape.** Default: the cover darkens and hides only the dock's private half (hand, ticket
   stack) and says `PASS TO SAM`. The board stays lit and in view. War Table covers the whole screen.
4. **Train hand visibility on the TV.** Default: face up in the dock during your own turn. The alternative
   is a "hold to look" hand, which is more private but costs one press on nearly every turn.
5. **Poster subjects.** Default: land, water and light of the destination only, with at most a distant
   steam train or trestle. No towns or buildings, because this is the eve of the railroad. Is a Chicago
   poster with no Chicago right?
6. **Completed tickets during play.** Default: a quiet conductor's punch hole in the poster's corner, seen
   only in your hand. No gold, no sound. DIRECTIONS once said "hangs it on your wall".
7. **Scores wait to be asked for.** Default: 4 s of the finished night board with only the sentence, then
   the word `SCORES` fades in. Nothing opens by itself.
8. **The night.** Default: two still searchlight beams from beyond the Atlantic edge (no source drawn), faint
   pale coasts, lit windows on claimed trains. The light change does not block input.
9. **Which way a train leaves.** Default: from the endpoint already in your network. If both or neither
   endpoint is in it, the train leaves from the endpoint nearer where you tapped.
10. **The warped continent.** Default: the land is warped to a board layout, like the real Ticket to Ride
    board (the Northeast is enlarged about 1.6×), so the couch gate holds at 1280×800. Geography purists
    will notice.

---

## 2. Stack and architecture

**Stack**: Vite 8 + TypeScript + Three.js r186 (WebGL2, hand-written `ShaderMaterial`s, one land composite
pass, no EffectComposer chain) + a DOM print layer for every word and number + WebAudio synthesis +
Vitest + Playwright driven from a Node script. This is War Table's stack, so every agent can read War Table
for patterns. The fixed camera is what makes it the right renderer here: the land, its shadows, the trees
and even the tree-vs-route occlusion can be baked once at build time, and the runtime only does light.
Rejected: Pixi or Canvas2D over a pre-rendered plate (it loses the lit relief, the modelled trains and the
light change). Babylon and Godot-web (the fleet is less fluent, and there's no DOM print). React (War Table
proved a small `h()` DOM helper is enough, and React adds a render loop that fights the event queue).

### 2.1 Directory layout

```
departures/
  SOUL.md  CLAUDE.md  AGENTS.md
  docs/PLAN.md (the chosen plan)  docs/RULES.md  docs/UX.md (copy table, click budgets)  docs/plans/*
  data/                      source data for build scripts (hand-authored, committed)
    geo/lakes.json           Great Lakes, Lake Winnipeg, Great Salt Lake: lon/lat polygons, ≤ 0.25° error
    geo/rivers.json          Mississippi, Missouri, Ohio, Columbia–Snake, Colorado, Rio Grande, Arkansas: lon/lat polylines
    geo/relief.json          range spines (lon/lat polyline, height 0–1, half-width °), plateaus, basins
    geo/forests.json         forest zones (lon/lat polygons, density 0–1, kind: fir | pine | broadleaf)
    board/cities.json        36 cities: id, lon/lat, board x/y (1000×650 layout), label side
    board/routes.json        per-lane overrides: bend sign/amount, lane offset side, label-avoid hints
  scripts/
    build-board.ts           TPS warp + slot solver + bakes → src/board/board.json, public/land/*
    verify-board.ts          clearance, overlap, fold, slot-uniformity, projected-size checks
    brush-tex.ts             procedural gouache stroke texture → public/tex/brush.png
    posters/briefs.json      30 imagegen briefs, one per ticket
    pack-posters.ts          crop/resize/encode (via Playwright canvas) → public/posters/, manifest
    rules-coverage.ts        fails if any R-/E- id in docs/RULES.md has no test
    simulate.ts              N seeded AI games → legality + strength table
    verify-audio.ts          offline render of every cue → loudness order, clipping
    e2e.ts                   lane runner (War Table's scripts/e2e.ts pattern)
  public/
    land/height.png (16-bit)  land/normal.png  land/paint.png  land/coast.png  land/trees.bin
    tex/brush.png            posters/<ticketId>.webp (512×768) + <ticketId>@thumb.webp (256×384)
  src/
    main.ts                  boot: fonts, board data, BoardView, audio, controller, UI
    engine/                  PURE. No DOM, no Date, no Math.random.
      types.ts ◆ data.ts rng.ts setup.ts reducer.ts rules.ts payment.ts market.ts tickets.ts
      reach.ts (cancelled test) longest.ts scoring.ts save.ts index.ts
      ai/ index.ts plan.ts draw.ts claim.ts tickets.ts profiles.ts (easy | normal | hard)
    board/                   types.ts ◆  board.json (generated)  stub.json (Phase 0)  index.ts
    render/
      BoardView.ts ◆  stageTypes.ts ◆  index.ts (createBoardView, event dispatch)
      stage.ts (renderer, RTs, pass order, camera fit, on-demand loop, quality ladder)
      land/ terrain.ts landGlsl.ts ramps.ts water.ts forest.ts clouds.ts shafts.ts composite.ts light.ts night.ts
      print/ slots.ts cities.ts rail.ts printGlsl.ts mask.ts
      trains/ models.ts finishes.ts trainGlsl.ts outline.ts depart.ts steam.ts lamps.ts consist.ts
      labels.ts (DOM city names)  pick.ts (screen-space lane picking)  metrics.ts (beat timings, hashes)
    game/
      controller.ts display.ts (displayed state, blocking set) viewModel.ts ◆ copy.ts input.ts
      aiDriver.ts handoff.ts storage.ts presets.ts hooks.ts (window.__dep) fakeBoard.ts
    ui/
      dom.ts frame.ts seats.ts dock/{titlebar,hand,payment}.ts siding.ts cover.ts
      tickets/{poster,stamps,sheet}.ts screens/{title,newgame,scoring,menu,settings,rules}.ts
      css/{base,frame,dock,siding,tickets,cover,screens}.css
    audio/ types.ts ◆ engine.ts mixer.ts reverb.ts synth/{whistle,chuff,clank,card,paper}.ts
           ambience/{strings,wind,birds,night}.ts lab.ts
    shared/ palette.ts ◆ tempo.ts ◆ ids.ts
  tests/ engine/*.test.ts game/*.test.ts e2e/{lanes.ts,lib.ts,*.e2e.ts,legibility.ts,screens.ts}
  artifacts/<area>/          screenshots (gitignored except the looked-at sweep the lead keeps)
```

◆ = **contract file**. Written in Phase 0 by the scaffold agent from §2.2–§3, reviewed by the lead. After
that it is additive-only (optional fields), and every addition is named in the adding agent's report.

### 2.2 The contract files

| File | Holds | Consumers |
|---|---|---|
| `src/engine/types.ts` | `SeatId`, `CityId`, `LaneId`, `TicketId` as branded strings; `CardColor` (8 hues + `loco`); `RouteColor` (8 + `gray`); `GameConfig`; `GameState`; `Action`; `GameEvent` (§3); `ActionResult {state, events, error?: ReasonCode}`; `ReasonCode` union; `Standing` | everyone |
| `src/board/types.ts` | `BoardData`: `cities[] {id, pos:[x,z], ring:r, label:{anchor,[dx,dy],side}}`; `lanes[] {id, pair, slots[] {pos:[x,y,z], yaw, pitch}, rail: polyline, siblingOf?}`; `camera {fovDeg, pitchDeg, target, fitRect}`; `slot {length, width, gap}`; `land {heightScale, bakes: file names}` | render, ui (label anchors), tests |
| `src/render/BoardView.ts` | the renderer interface (§3.3) | controller |
| `src/render/stageTypes.ts` | `Stage.addLayer(layer: 'land' \| 'print' \| 'trains' \| 'steam', obj)`, `Stage.requestFrame(reason)`, `Stage.onResize(cb)`, `Stage.project(world) → css px`, `LightUniforms` | land, print, trains agents |
| `src/game/viewModel.ts` | `GameVM`: `frame {seats[]}`, `dock {line, lineGold, sub, verbs[], hand, payment?}`, `siding {market[5], deckCount, ticketCount, locked[]}`, `tickets? {mode: offer \| view, posters[]}`, `cover? {seat, name}`, `screen`, `gold {subject}` | ui |
| `src/audio/types.ts` | `CueName` = `whistle \| whistleLong \| chuff \| clank \| cardSlide \| shunt \| paper \| riffle \| stampless`; `AudioEngine.play(cue, {at?, gain?, rate?})`, `setAmbience('golden' \| 'night' \| 'off', ms)`, `setVolume` | render, controller |
| `src/shared/palette.ts` | route hues, tile tints, keyline, gold, finishes, land ramps (golden and night), lamp colour | render, ui, tests |
| `src/shared/tempo.ts` | every ms in §4.10, §5, §6 as named constants; `departMs(length)` | render, controller, tests |

---

## 3. Event vocabulary

### 3.1 Flow

`input | AI → engine.applyAction(state, action) → {state, events[]}` → the controller queues
`{event, stateAfter}` → `pump`: `board.playEvent(publicView(event), opts)` for board events, and UI/audio
for the rest → `display.ts` applies each event's delta to the **displayed** state when its playback resolves
(the HUD follows the board, not the state; War Table UX §8.1) → queue empty: pending click-through input
runs; then the next AI beat.

**Privacy line.** Events carry private fields (drawn deck colours, ticket ids). `publicView(event)` strips
them before anything reaches `BoardView` or audio. The VM builder shows private fields only for the
`viewer`, the human seat whose cover has been lifted. A unit test asserts that no private field reaches
`BoardView.playEvent`.

### 3.2 The events

| Event | Payload (private fields *italic*) | Renderer | UI | Audio | Blocks input | 1× ms |
|---|---|---|---|---|---|---|
| `gameStarted` | seats, firstSeat, market | `syncState` | seats row, siding dealt (5 shunts, 80 ms stagger) | ambience in over 3 s | no | 720 |
| `ticketsOffered` | seat, *ids*, minKeep, initial | – | 3 posters leave the rack into the sheet (owner only, after cover) | paper | waits for choice | 420 + 2×60 |
| `ticketsKept` | seat, *kept*, keptCount, returnedCount | – | kept posters to the seat's stack, returned back under the rack | paper | yes | 360 |
| `cardDrawn` | seat, source `market`\|`deck`, slot?, color (*if deck*) | – | card leaves the siding to the hand (or to the seat's row for others) | cardSlide + chuff(0.4) | no | 380 |
| `marketRefilled` | slot, color | – | replacement shunts in from the deck end | shunt | no | 320 (starts +120) |
| `marketReset` | discarded[5], dealt[5] | – | five leave to the discard, five shunt in | shunt ×5 | yes | 1100 |
| `deckReshuffled` | count | – | discard slides under the deck | riffle | no | 400 |
| `routeClaimed` | seat, lane, paid[], trainsLeft, points | departure (§4.10), `departFrom` from opts | paid cards leave hand at 0 ms; score/trains apply at the clank | whistle → chuffs → clank | yes | `departMs(L)` |
| `laneClosed` | lane (the sibling, 2–3 seats) | slots fade to hairline | – | none | no | 600 (starts at clank) |
| `ticketCompleted` | seat, *ticket* | – | punch hole on the next open | none | no | 0 |
| `ticketCancelled` | seat, *ticket* | – | stamp on the next open | none | no | 0 |
| `turnEnded` | seat | – | – | – | no | 0 |
| `finalRoundBegan` | trigger seat, trainsLeft | `setLight('night', 6000)` | sub-line record | whistleLong; ambience → night | **no** | 6000 |
| `turnStarted` | seat, turn | – | cover or line swap | – | yes, until the cover is lifted | 360 |
| `passed` | seat | – | line | – | no | 0 |
| `gameOver` | standings[], longest {seats, length, *path per seat*} | holds | `THE LAST TRAIN HAS LEFT`; `SCORES` at +4000 | strings final | ignores input for 1.5 s | – |

Scoring-sheet playback (§5.7) is UI-driven from `standings`, not engine events.

### 3.3 `BoardView` (render contract)

`syncState(state)`; `playEvent(e, opts: {departFrom?: CityId, style: 'full' | 'watch' | 'fast', sting?: false}) → Promise`
(resolves at the clank); `setAnimationSpeed(0 | 1 | 1.8)`; `skipAnimations()` (fast-forwards everything
running at 6× so it finishes within ≤ 180 ms, never a snap); `setHighlights({picked?: LaneId, hover?: LaneId,
tickets?: CityId[]})`; `onLaneTap(cb)`, `onLaneHover(cb)`, `onCityTap(cb)`;
`setLight(state: 'golden' | 'night', ms)`; `setViewportInsets({top, right, bottom, left})`;
`laneScreenRects(lane)` and `cityScreen(city)` for the UI and the tests; `setReducedMotion(on)`;
`setQuality(level)`; `stats() → {fps, frameMsP95, drawCalls, drawnFps, activeTweens, lightGroupHash,
transformsHash, trainVisibility, lastBeat: {whistleAt, firstPixelAt, clankAt}}`; `dispose()`.

---

## 4. Rendering

### 4.1 What the picture is made of, and who makes it

| Layer | Made by | Moves? |
|---|---|---|
| Relief, water, lakes, rivers, coasts, cast shadows | code (build-time bake + land shader) | only light on it |
| Forest (about 14k trees) | code (build-time placement, instanced cones and blobs) | never |
| Pacific cloud bank, light shafts | code (geometry + shader) | only light |
| Slots, rail, city rings | code (SDF print shader) | tint on pick, fade on close |
| City names, every number, the dock, the siding, cards | code (DOM, SVG card faces) | UI transitions |
| Trains and steam | code (procedural models, toon finishes, sprite steam) | departures only |
| Brush texture | code (`brush-tex.ts`); imagegen fallback only if the procedural one reads mechanical | – |
| **Ticket posters (30)** | **imagegen**, art only, no text; typography and stamps in code | – |

### 4.2 Geometry source and the warp

- **Land**: `world-atlas/land-50m.json` → `polygon-clipping` to lon [-131, -60], lat [21, 55] → projection
  `geoConicEqualArea().parallels([29.5, 45.5]).rotate([96, 0])`. Canada and Mexico stay in as land to the
  frame edges; beyond the play area they fade 12 % toward haze (atmospheric depth, not a hard mat).
- **Water**: the ocean is a separate flat plane at y = 0 that runs past every frame edge. The lakes come
  from `data/geo/lakes.json`. The Phase 1 board agent traces them by hand at ≤ 0.25° error, or transcribes
  them from Natural Earth 50 m lakes if the lead has already vetted and installed a package that ships them.
- **The warp**: the playable board is laid out first (`data/board/cities.json` board x/y, seeded from Iron
  Atlas's original 1000×650 coordinates, which already carry the Ticket to Ride board's proportions). A
  thin-plate spline from projected city lon/lat to board x/y, plus 16 fixed frame anchors, is then applied to
  every geo feature: coast, lakes, rivers, relief spines, forest zones. The continent becomes a slightly
  caricatured America whose Northeast is large enough to print on. Fold guard: the Jacobian determinant
  is ≥ 0.35 on a 200×130 grid.
- **World units**: the board spans x ∈ [-50, 50], z ∈ [-32.5, 32.5] (north is -z), with y up. At 1280×800
  that is about 11.5 css px per unit. Slot: **length S = 3.0 u, width W = 1.05 u, gap g = 0.28 u**. City ring
  radius is 0.62 u, and its screen size is fixed (§4.7).
- **Slot solver** (`build-board.ts`): every slot on the board is exactly S×W (length has to read by count).
  For each lane, the target arc length is `n·S + (n−1)·g + 2c`, with city clearance c ∈ [0.75, 1.3] u.
  If the straight distance is too long, c absorbs the slack. If it's too short, the lane becomes a quadratic
  Bézier whose sag is solved to ±2 % (the sign comes from `routes.json`, and defaults to away from the
  sibling or neighbour). Double lanes are offset ±0.62 u from the pair's centreline. Each slot gets
  `pos`, `yaw`, and `pitch`, where pitch is sampled from the height field along the slot.
- **`verify-board.ts`** fails on any of these: slot OBBs of different lanes closer than 0.25 u; a slot
  within 0.35 u of a foreign city ring; a label box (projected with the camera spec at 1280×800) over any
  slot or ring; a Bézier sag above 0.22·chord; a lane's arc length off target by > 2 %; a fold. It also
  writes `artifacts/board/layout-1280.png` and `layout-1920.png` (a 2D print-only render), and the agent looks at both.

### 4.3 Height, paint and the bakes (all build time, all deterministic)

- **Height** (`public/land/height.png`, 1024×666, 16-bit): `h = max(spines) + plateaus − basins + tilt`.
  - A spine contributes `height · smoothstep(halfWidth, 0, dist)^1.6 · (0.75 + 0.25·ridged(p·k))`, using seeded ridged fBm with 4 octaves.
  - Authored spines: Cascades, Sierra Nevada, Coast Ranges, northern and central and southern Rockies, Wasatch, Bighorns, Black Hills, Ozarks, Appalachians, Laurentian rim.
  - Plateaus: Colorado Plateau 0.28, Great Basin 0.22 with basins cut 0.08, High Plains tilt 0.18 → 0.04 west to east.
  - The coast falloff forces h → 0 within 0.8 u of the coast.
  - Vertical scale: 2.4 u at h = 1, i.e. a shallow relief of 2.4 % of the board width. That is the 2.5D.
- **Normals** (`normal.png`): RG = the broad normal (height blurred σ = 6 texels), BA = the detail normal
  (σ = 1.5). The broad normal drives the bands and the detail normal drives the brush, so the forms read as
  big painted planes rather than noisy terrain.
- **Paint** (`paint.png`, RGBA): R = forest density (from zones, feathered 1.2 u), G = aridity, B = river
  and lake ink (rivers rasterised as tapering 0.18 → 0.32 u ribbons), A = **baked cast shadow** from the fixed golden sun
  (a horizon march of 48 steps toward azimuth 250°, elevation 16°, softened σ = 1.5), with tree contact
  shadows added as 0.6 u ellipses offset ENE.
- **Coast** (`coast.png`): a signed distance to the coast in ±2 u, for the foam line, the shallow bands,
  the beach band and the night coast glow.
- **Trees** (`trees.bin`): Poisson disk r = 0.45 u inside forest density > 0.35, scale 0.7–1.3, kind from the
  zone (fir in the NW, dark and tall; pine in the SE; broadleaf blobs in the East), about 14k and capped at 16k.
  **Print clearance**: no tree whose footprint is within 0.9 u of any slot, rail or ring, and none whose
  top, projected along the fixed view direction, overlaps a slot, ring or 1280×800 label box. The camera is
  data in `board.json`, so occlusion is solved once in world space.

### 4.4 The land shader (`landGlsl.ts`): banded, brushed, rim-lit

Seven texture taps per land pixel: normal, paint, coast, brush ×2, cloud-noise, ramp.

- **Light**: `ndl = dot(Nbroad, L)` with L = golden sun (azimuth 250° = from the WSW, elevation 16°),
  multiplied by the baked shadow.
- **Bands**: four bands, shadow / mid / lit / highlight, with edges at 0.18, 0.46 and 0.80.
  - The terminator is wobbled by brush: `t = ndl + (brushG − 0.5)·0.12`, and each band edge is `smoothstep(e − 0.012, e + 0.012, t)`. The edges are decisive, and slightly soft the way a gouache edge is, never a gradient.
  - The highlight band only exists on crests (negative Laplacian of height) that face the sun.
- **Ramp**: `ramps.ts` builds a 4 × 16 DataTexture. Rows = biome × light state. The golden rows are:

  | Biome | shadow | mid | lit | highlight |
  |---|---|---|---|---|
  | plains | #9c86b5 | #e3b765 | #f5e2a8 | #fff3cf |
  | farmland (East) | #56679a | #5f8f4a | #a9c46a | #e4d98a |
  | forest floor | #1d3f33 | #2d5e40 | #6e9447 | #c9c46a |
  | arid | #8a6fa8 | #d98b5a | #f0b877 | #ffd9a0 |
  | range rock | #6b5a9e | #b58bb8 | #f0a36a | #ffd08a |
  | snow (h > 0.82) | #9aa6d6 | #d9dcf0 | #fff4e6 | #ffffff |
  | beach | #b39a8a | #e6c89a | #f1d9a4 | #fff0c8 |

  Biome weights come from the paint channels and height. Colours blend between biomes, never between
  bands: the band index is chosen first and then the biome mix is applied inside it, so the bands stay hard.
  Shadows are cool lavender and light is warm cream. That is the warm-against-cool rule.
- **Brush**: `brush.png` channels R = stroke value and G = edge wobble. It's sampled at two rotations picked
  from the terrain aspect (4 bins, blending the two nearest), so strokes follow the contours the way a
  painter's do. Value variation is ±6 % inside a band. There is no paper grain, film grain or vignette
  (SOUL's Life is Strange leave list).
- **Rim**: crests facing the sun within 30° of the view silhouette get a warm rim band `#ffb86b` at 0.35.
  Trees get fresnel rim in their own shader.
- **Water** (`water.ts`): three depth bands from `coast.png` (shallow #2f8f98, mid #1f5f7e, deep #163a5c),
  plus a 0.12 u pale foam line at the coast.
  - Sun glitter is a banded specular stripe along the sun's reflection, broken into stroke-shaped dashes by the brush texture. The dashes drift at 0.05 u/s, which counts as light, not water.
  - Lakes use deep teal #1c5566 with the same foam.
  - Rivers are painted into the land (B channel), teal #2c6f86, and never wider than 0.32 u, so they never read as routes.
- **Haze**: toward the north edge, mixes to #e9dcc6 by up to 18 % (by view depth). Land only.
- **Forest** (`forest.ts`): one InstancedMesh per kind. A fir is two stacked 6-sided cones (26 tris), a pine is
  one cone and a trunk, a broadleaf is a 42-tri blob. The shader has three bands on the same ramp as the forest floor but one step darker, a warm rim, and a baked ambient occlusion
  from density.
- **Clouds** (`clouds.ts`): 6 cumulus clusters, each 6–12 merged spheres, placed at x ∈ [-60, -47],
  altitude 5–10 u over the Pacific.
  - Shaded as a backlit bank: the body is two bands of lavender-grey (#b8a9c9 / #8c7fa6), with a wide warm rim `#ffd79a` on the sun side.
  - They sit fully outside the play area, so they never cover a slot.
- **Shafts** (`shafts.ts`): 4 long additive wedges fanning ESE from the cloud-bank gaps over the NW
  forests (frame 2). Each has a gradient along its length, a brush-noise edge, and alpha ≤ 0.16. They draw in the land layer, under print.
- **Composite** (`composite.ts`): the land layer (terrain, water, forest, clouds, shafts) renders to an RT
  with MRT colour + normal/depth, MSAA 4 (samples 0 on the fallback ladder). One fullscreen pass then adds:
  - **cel ink lines**: Sobel on depth and normal, thresholded to tree silhouettes and major ridge crests, 1 css px, colour #2a2140 at 45 %;
  - haze.

  The result is written to the screen. This pass is what makes the relief read as cel-shaded rather than as
  a painting. Frames 1 and 2 don't have it, which is part of why John said they miss the 2.5D feel.

### 4.5 Pass order (every frame that draws)

1. **land** → RT → composite → screen.
2. **print** (depth test off, render order): rails for the picked lane, slots, city rings.
3. **trains** (depth cleared): contact blobs, then cars and locomotives with inverted-hull outlines, then lamps (at night).
4. **steam**: sprites, with alpha multiplied by `(1 − 0.7·printMask)`.
5. **DOM**: names, dock, siding, seats (above the canvas).

`print/mask.ts` renders `printMask` (slots dilated 2 px, rings, label boxes) into an R8 target at half
resolution. It re-renders only on resize or when a lane changes state. The camera is fixed, so the mask is effectively free.

### 4.6 The idle light (pillar 1's whole budget)

Everything here is a uniform in `LightUniforms`. The loop draws at most 30 fps while idle (on demand;
War Table MOBILE §7). No mesh transform changes.

- **Cloud shadow**: two octaves of soft noise scroll ENE at 0.28 u/s, so one shadow crosses the continent
  in about 6 minutes. In lit bands it darkens by 0.08, and never by more than one band step.
- **Shafts**: each wedge's alpha is `base · (0.75 + 0.25·n(t / 9 s))`, desynchronised.
- **Glitter** drifts 0.05 u/s. The **cloud rim** breathes ±15 % on a 20 s cycle.
- **Never, before the last round**: the sun direction, the sun colour, the ramp row, and the shaft count.

### 4.7 Print (`print/*`, `printGlsl.ts`): crisp at any light

- **Slots** are one InstancedMesh of quads draped 4×1 on the terrain at +0.02 u. The fragment shader computes
  an analytic rounded-rect SDF (corner 0.14 W) antialiased with `fwidth`:
  - an outer **keyline** #1b1a1f of 1.25 css px;
  - a **hue stroke** of 2 css px at full strength;
  - an **opaque interior**: paper #efe4c8 mixed toward the hue by the per-hue `tileTint`.

  The land never shows through a slot, so no painterly layer can change a slot's colour. The land shows only in the gaps.
- **Hues** (tuned to the poster inks) and `tileTint`:

  | Hue | colour | tint |
  |---|---|---|
  | red | #c8402f | 0.35 |
  | orange | #e0842b | 0.38 |
  | yellow | #e8c43a | 0.50 |
  | green | #3f8a4a | 0.45 |
  | blue | #2f68b0 | 0.38 |
  | purple | #9a4f9e | 0.38 |
  | black | #2a2a30 | 0.70 |
  | white | #f7f4ec | 0.90, with the stroke drawn in #6f6a63 |
  | gray | stroke #8c8a86 | 0.10 |

  The tints are tunables, gated by `legibility`. At rest the board is mostly pale tiles with strong hue
  edges, which is John's "most slots are empty outlines".
- **Picked** (the one gold): the lane's tint rises to 0.80 over 160 ms, and a **gold rail** (#e9b949, 2.5 css
  px, with a keyline) runs ring to ring through the slot centres (frame 2's line). **Hover**: the keyline goes
  to 2 px with a 1 px cream inner line, in the same rAF as the pointermove.
- **Closed sibling** (2–3 seats): over 600 ms the lane fades to its keyline only, at 40 %, and can no longer be picked.
- **City rings**: screen-aligned billboards, 13 css px at 1280 wide (19 at 1920), a cream disc #f7ecd2 with a
  2 px keyline and a 3 px darker inner dot. Endpoints of the tickets you're viewing get a gold ring of +6 px.
- **Names** (`labels.ts`): DOM, Jost 600 caps, 12.5 / 18 px, tracking 0.12 em, cream #f7ecd2 with a
  2.5 px #1b1a1f outline (`paint-order: stroke`). Anchors are projected once per resize.
- **Picking** (`pick.ts`): projected slot OBBs are held in a 32 px screen grid. A tap picks the nearest lane
  within 10 px (touch: 18 px), and the nearer lane of a double pair. Gestures: a tap is up within 6 px and 350 ms.

### 4.8 Camera

- `PerspectiveCamera`, **FOV 22°**, **pitch 57° below horizontal**, yaw 0 (looking north), target (0, 0, 1.5).
  The distance is fitted so the board plus 1.5 % fits the board rect inside the insets, with `setViewOffset`
  moving the principal point.
- The narrow FOV keeps the view near-orthographic: north/south slot size varies by ≤ 12 %, and vertical
  foreshortening is sin 57° = 0.84. So a north–south slot is 1.05·0.84 ≈ 0.88 u, which is 10.1 css px at
  1280×800.
- It never moves on its own and has no user orbit, pan or zoom. Resize refits it.
- Board rect: at 1280×800, 1148 × 660 css px (after the 14 px border, 34 px seat row, 92 px dock and 104 px siding). At 1920×1080, 1728 × 882.

### 4.9 Trains (`models.ts`, `finishes.ts`, `trainGlsl.ts`, `outline.ts`)

- **Car**: 2.58 × 0.82 × 0.62 u (0.86 S by 0.78 W). The body is an extruded rounded rect with an arched roof
  and an inset window band of 6 windows with cream frames. Two dark bogies. About 300 tris.
- **Locomotive**: a 1.5 u boiler (r 0.30), a flared lathe smokestack, a steam dome, a 0.7 u cab, a cowcatcher
  wedge, 3 drivers per side, and a headlamp. About 800 tris. A lane of length n = the locomotive in the arrival-end
  slot plus n−1 cars, one piece per slot, as on the table.
- **Finishes**. Ownership reads by value, sheen and outline, never by hue alone:

  | Finish | Diffuse (shadow → lit) | Specular band | Target lit L* |
  |---|---|---|---|
  | cream enamel | #b9ad93 → #f4ecd8 | soft white, broad | 88 |
  | chrome | #4d555e → #c9d2da | a hard white band over a dark horizon band | 74 |
  | brass | #7a5a22 → #e7c46a | sharp #fff1c4, anisotropic along the length | 70 |
  | copper | #5e2f1c → #c9764a | #ffd2b0 | 52 |
  | gunmetal | #1c2024 → #56606a | soft #aab4bd | 30 |

  Shading: 2 diffuse bands, one hard specular band, and a warm fresnel rim (sun side). Every car carries a
  0.035 u #16151a inverted-hull outline, so a cream train on cream plains still reads.
- **Placement**: cars sit on their slot at terrain + 0.10 u, with yaw and pitch from the slot. The contact blob is #1b1a1f at 22 %.
- **Instancing**: one InstancedMesh per part per finish (loco body, car body, bogies), so at most 15 draw calls for trains.

### 4.10 The departure, beat by beat (`depart.ts`, `consist.ts`, `steam.ts`)

`departMs(L) = 300 + 500 + 190·(L − 1) + 260 + 180`

| L | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| ms | 1240 | 1430 | 1620 | 1810 | 2000 | 2190 |

| t (ms, 1×) | Beat | Picture | Sound |
|---|---|---|---|
| 0 | commit | The paid cards leave the hand for the discard (240, ease-in); the line holds `HELENA · DULUTH` in gold; the rail stays. The acknowledgement lands in ≤ 50 ms. | **whistle** (far: 3 partials A4, C♯5, E5, band-passed, 45 % wet 2.8 s reverb, peak −6 dBFS) |
| 0–300 | lead | Nothing on the board changes. The claim is **heard before it is seen**. | whistle sustains |
| 300–800 | pull-out | The locomotive emerges from under the departure ring. Cars inside the ring radius × 1.1 are discarded in the fragment shader, so the train is revealed, never scaled or faded in. Ease-in cubic over 0.8 S of travel. Chuffs at 420, 340, 290 ms intervals; a steam puff on each; body rocking ±0.6° at the chuff rate. | chuff (band-passed noise, 90 ms) |
| 800 → 800 + 190(L−1) | run | Cruise at 1 slot per 190 ms. Chuff interval `clamp(0.9 u / v, 110, 260)`. Cars follow the rail by arc length, at a pitch of 0.92 S. | chuffs |
| next 260 | brake | Ease-out to the locomotive's stop in the arrival slot. | chuffs thin, the last one soft |
| next 180 | settle | Couplers bunch front to back, each car overshooting 0.04 u and settling, 30 ms stagger. The **last car settles**, the promise resolves, and the seat's score and trains apply. | **clank** (modal: 310, 742, 1210, 1980 Hz, 250 ms decay) on the last car |
| clank → +2400 | afterwards (non-blocking) | Steam thins. Each puff grows from r 0.25 to 1.3 u over 2.8 s, rises 1.6 u, drifts east 0.3 u/s, and dissolves by a rising alpha threshold on the brush texture (it thins, it doesn't fade). The sibling lane, if any, fades to its hairline. | – |

- Steam: puffs are toon-shaded (cream #fbf3e0 lit, #b8b0c8 shadow, warm rim), capped at 48 per train and one moving train at a time.
- **Speeds**: `watch` (AI) = 1×. `fast` = 1.8× (whistle lead 180 ms). Instant = 0 (tests).
- **Click-through**: a tap or commit key during the beat calls `skipAnimations()`, and the train runs out at 6×
  so it arrives in ≤ 180 ms with the clank. It never snaps.
- **Reduced motion**: whistle lead kept, a 450 ms glide with no rocking, 3 puffs.
- **Gates** (`tempo` flow): each length is within `departMs(L)` + 5 %; `firstPixelAt − whistleAt` ≥ 250 ms;
  click-through ≤ 200 ms; `trainVisibility` never jumps by more than 12 % of a car's area in a frame.

### 4.11 The one light change (`light.ts`, `night.ts`, `lamps.ts`)

This is triggered only by `finalRoundBegan`. It lasts 6000 ms, does not block input, and is not skippable.
A tap finishes the running departure but not the light.

| t (ms) | Change |
|---|---|
| 0–400 | whistleLong (two tones, farther: 60 % wet); the strings begin their descent |
| 0–2000 | The shafts fade out; glitter off; the cloud rim goes coral #ff9a6a then dark |
| 400–5200 | Ramp rows lerp golden → dusk (key at 0.45) → night; the sun lowers to 2° and cools; the baked shadow fades out (it's golden-only) |
| 3000–5600 | Claimed trains light up, west to east with a 40 ms stagger per lane: window lamps and headlamps in **one lamp colour #ffd58a** as small additive sprites, never the card hue; the night finish variant is diffuse × 0.35 |
| 3600–6000 | Coasts gain a faint pale edge #9fc6c4 at 40 %; print switches to its night style: interiors on paper #3a3d44 mixed by `tileTint·0.8`, hue stroke unchanged, keyline #0b0c0f |
| 4800–6000 | Two still searchlight beams (additive cones, #cfe6ff at ≤ 0.22) from beyond the Atlantic edge, no source drawn |

Night rows (shadow → lit): land #0d1a22 → #26394a; forest #07120f → #173026; range #151a33 → #3a3f6a;
water #06111c → #0f2a3e. Night must pass the same `legibility` gate as golden.

### 4.12 Sound, as the picture's other half

The mix is ordered by loudness: whistle > clank > chuff > card and paper > strings > wind and birds.

- **Buses**: sfx, ambience and music feed a DynamicsCompressor limiter at −3 dBFS.
- **Ambience**:
  - Strings are a generative pad of 3 detuned saws through a 1.2 kHz lowpass with a 3 s attack. One phrase every 20–40 s from D-major pentatonic, and silence between. At night the register drops and the phrases are half as frequent.
  - Wind is pink noise band-passed through a slow sweep of 300–800 Hz at −34 dB.
  - Birds are FM chirps (2.5–5 kHz), one every 8–25 s, day only; faint crickets at night.
- **Ducking**: ambience ducks 6 dB under the whistle.
- **Autoplay**: audio starts on the first gesture.
- **Gate** (`verify:audio`): the whistle's peak is ≥ 4 dB above every other cue; no clipping; ambience RMS ≤ −30 dBFS.

### 4.13 Couch legibility (the gate)

Meaning of "3 m": the viewport shown on a 55″ screen at 3 m. At 1280×800 that is about 0.95 mm per css
px, so a 9 px cap height subtends about 10 arcmin (comfortable reading), and a 10 px slot width is 9.5 mm.

| Measure (css px) | 1280×800 | 1920×1080 |
|---|---|---|
| Slot long side, minimum (across the whole board) | 30 | 45 |
| Slot short side, minimum (north–south slots) | 10 | 15 |
| Gap between lanes | ≥ 3 | ≥ 4 |
| City ring | 13 | 19 |
| City name cap height | ≥ 9 | ≥ 13 |
| Dock line (gold caps) | 30 | 44 |
| Dock sub-line | 15 | 21 |
| Hand chip / count | 40×56 / 18 bold | 58×82 / 26 bold |
| Market card | 84×54 | 122×78 |
| Seat row: name / score | 14 / 18 | 20 / 26 |

- **Automated** (`legibility` flow, §7): hue classification, owner classification, keyline contrast,
  the painterly-leak ΔE, and the sizes above.
- **Human**: the lead looks at the 1280×800 golden and night shots at 25 % and names every lane he can't read.
- The text-size setting (1 / 1.25 / 1.5) scales DOM print only. Slots are fixed by the board.

### 4.14 Performance and the ladder

Budgets:
- idle ≤ 6 ms GPU per frame at 1920×1080 DPR 1 on an M-series laptop;
- during a departure, p95 ≤ 16.7 ms;
- worst frame on the first departure after a cold load ≤ 50 ms;
- ≤ 40 draw calls;
- texture VRAM ≤ 48 MB.

Ladder (in `stage.ts`, steps down only):
- **L3**: MSAA 4, full.
- **L2**: DPR 1, and the cloud-shadow noise is sampled at half resolution.
- **L1**: no MSAA, no cel ink lines. Cloud shadows are frozen, and the land re-renders only when a light uniform changes by more than 1 %.
- **L0**: the land renders once into a cached RT and the drift is off.

**Print, trains and steam never step down.**

---

## 5. UI grammar and screens

### 5.1 Grammar

- Board taps only pick. Buttons commit. The siding's cards and decks are buttons: a draw commits, because
  it reveals information.
- A tap during motion finishes the motion and then does what was tapped. On watched turns (AI), a tap only skips.
- **One gold** means one subject at a time. The subject may appear in two places: its board mark and its
  name in the line. The subject is the picked lane, or during victory the sentence. Everything else is
  cream, ink or hue.
- Words are on a hairline, with no pills and no panels. Frames are dark borders. Copy is plain English and
  past tense for the record, with real names and numbers, no exclamation marks and no poetry.
- Every refused tap answers in one sentence in the sub-line and holds it for 2 s. For example:
  - `That route is Sam's.`
  - `You need 6 orange. You have 4 orange and 1 locomotive.`
  - `A locomotive from the market can't be your second card.`
  - `With 3 players, only one of the two Omaha · Duluth routes can be claimed.`

  Each reason code has one line in `copy.ts`, tested.
- Keys: `1`–`5` take market cards, `D` the deck, `T` tickets, `Enter` is the primary, `Esc` un-picks,
  `Space` commits or skips, `H` holds your tickets open.

### 5.2 The frame and the title bar dock (frames 1 and 4)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ ▰ PRIYA 64  ▮12 ▭7 ▯3    ▰ SAM 51 ...    ▰ JOHN 70 ...    ▰ NELL 33 ...            ≡      │ seat row 34 px
│                                                                               ┌────────┐ │
│                                                                               │TICKETS │ │
│                          the board (1148 × 660 at 1280×800)                   │ ▭ ▭ ▭  │ │ siding 104 px
│                                                                               │ ▭ ▭    │ │
│                                                                               │ DECK   │ │
│                                                                               └────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ HELENA · DULUTH                                   ▭3 ▭0 ▭4 ▭1 ▭0 ▭2 ▭0 ▭5 ▭2   ▯▯▯      │ title bar 92 px
│ 6 orange · 15 points · you have 4 orange, 2 locomotives        CLAIM                     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Frame**: #111014, a 14 / 20 px border, the image bleeding to it.
- **Seat row** (top border): for each seat, a finish chip (a 28×14 sprite rendered from the loco model at boot,
  so it *is* the finish), NAME in caps, route score, and trains ▮, cards ▭ and tickets ▯ as tiny glyphs with
  numbers. The current seat gets a 2 px cream underline (not gold).
- **The line** (gold caps, Jost 500, tracking 0.14 em): the subject. When nothing is picked it is the
  current seat's name in cream, not gold. Long pairs shrink to fit (down to 22 / 32 px). When the wording
  changes, the old line dries out in 160 ms and the new one comes in over 200 ms, never two at once
  (War Table `strip.ts`).
- **Sub-line**: the latest record (`Sam's train left Denver for Omaha.`), or the pick's facts and payment. The
  prompt hint (`Draw two cards, claim a route, or take tickets.`) shows only on each seat's first two
  turns, or after a refusal.
- **Hand**: 9 fixed positions (the 8 hues in board order, then loco). Each chip is an SVG card face with a
  distinct period carriage silhouette per hue (boxcar, reefer, tanker, hopper, coal car, passenger, stock car,
  caboose) as a colour-blind aid. A zero count dims to an empty keyline. The ticket stack thumbnails sit at
  the far right with a count.
- **Payment**: if unambiguous, a single cream `CLAIM` word-button. If ambiguous (gray, or locomotives
  optional), up to 4 choices like `6 ORANGE` and `4 ORANGE + 2 LOCO`. The default is the one that uses
  the fewest locomotives and, for gray, the colour you hold most of.

### 5.3 A turn, tap by tap (click budgets)

| Action | Taps | Detail |
|---|---|---|
| Draw two cards | 2 | Tap a market card or the deck, then again. Market locomotives dim after the first draw and explain on tap. |
| Draw a face-up locomotive | 1 | It ends the turn. The sub-line says so before you tap (`A locomotive from the market is your whole draw.`). |
| Claim, unambiguous | 2 | Tap lane → `CLAIM` (or Enter). |
| Claim, gray or with locomotives | 2–3 | Tap lane → optional choice → `CLAIM`. |
| Take tickets | 3–4 | Tap the ticket rack → toggle posters → `KEEP 2`. |
| Hand-off | 1 | `I'M SAM` (Space). |

A typical human turn is ≤ 3 taps and **0 ms forced waiting**. A 250 ms input guard applies after a
human→human change.

### 5.4 The siding (public)

A vertical dark column inside the right border: the ticket rack (the back of a poster, with a count), five
market cards (landscape, like carriages on a siding), then the train deck with a count.
- **Draw**: the card leaves along a shallow arc to the hand (380 ms, ease in-out) with a small chuff. For
  another seat it goes to that seat's chip.
- **Refill**: the replacement shunts up from the deck end (320 ms, starting +120).
- **Reset**: five leave, then five shunt in (1100 ms).

### 5.5 The hand-off cover (`cover.ts`)

The cover fires when the incoming seat is human, there are 2+ humans, and the setting is on (on by default
with 2+ humans).
- **Timing**: mounted in the same frame the turn ends, with zero frames of the next hand.
- **Shape**: it covers the **dock's private half** (hand, tickets, payment) with #111014 at 100 % and
  shows `PASS TO SAM` in the line, the finish chip, and the sub-line `Sam has 12 trains and 7 cards.`
  Button `I'M SAM` (Space/Enter). The board, siding and seat row stay in view (Soul question 3).
- **Transitions**: fade out 180 ms; the hand then arrives by sliding up 220 ms.
- **Initial tickets** are chosen seat by seat, each behind its own cover.

### 5.6 Tickets as posters (`tickets/*`)

- **Poster**: 2:3. The art comes from imagegen and paints one of the ticket's two cities (whichever has the
  stronger land; `briefs.json` names it). The lower 24 % is a #111014 band where code sets that city in
  gold caps and `DULUTH · HOUSTON · 8` below it in cream caps (frame 3).
- **Sizes**: 220×330 in the sheet and 88×132 as a thumbnail at 1280, or 320×480 and 128×192 at 1920.
- **Sheet**: posters sit side by side over the board with a 70 % #111014 scrim over the board area (180 ms).
  - Offer mode: tap to toggle keep (a kept poster lifts 8 px with a cream underline), then `KEEP n`. The minimum is enforced with copy.
  - View mode: all your tickets, with the endpoints of the focused poster ringed in gold on the board.
- **Stamps** (`stamps.ts`, SVG):
  - **CANCELLED**: 46 % of the poster width, rotated −8°, ink #a23a2a at 85 %, a double-rule box, distressed by an feTurbulence mask. It sits over the art, never the type. It is present on open with no animation.
  - **Completed**: a 10 px conductor's punch hole in the upper right corner.
  - At scoring, open tickets gain `UNFINISHED` in the same stamp style.
- **Placeholders** (Phase 1): a code-drawn poster (a two-band sky gradient, one horizon silhouette sampled from
  the relief along that city's latitude) with the same typography, so the grammar exists before the art.

### 5.7 Screens

- **Title**: the board at golden hour with no trains; the title bar reads `DEPARTURES`. Verbs: `NEW GAME`,
  `CONTINUE` (if a save exists), `RULES`. Light drift only; no orbit.
- **New game** (`newgame.ts`): a timetable over the board.
  - 2–5 rows. Each row has a finish chip (tap to cycle the free finishes), a name field, `HUMAN`/`AI`, and `EASY`/`NORMAL`/`HARD` for AI.
  - Settings: hand-off cover, AI speed (`WATCH`/`FAST`), and first seat (the first row, "the most experienced traveller", or random).
  - `DEPART` starts the game. Seats are remembered, so title → first action is ≤ 3 taps plus the initial-ticket picks.
- **Victory** (`scoring.ts`):
  - At `gameOver` the line becomes `THE LAST TRAIN HAS LEFT` (gold), and the sub-line is empty. Input is ignored for 1.5 s.
  - At +4000 ms the word `SCORES` fades in (400 ms). The players press it.
  - The scoring sheet, per seat in finishing order:
    1. route points;
    2. tickets revealed one at a time (260 ms each, completed +, unfinished and cancelled −);
    3. the longest continuous path, traced by one lit locomotive running it at 8 slots/s (capped at 3 s, a departure, not a highlight), +10;
    4. the total counting up over 600 ms.
  - Ties follow the rulebook (§6). The sheet then collapses, and the line records `Priya won with 142 points.` The verbs become `BOARD` (hide the sheet and look again), `REMATCH` and `TITLE`.
- **Menu** (≡): Resume, Rules, Settings, Save and quit, New game.
- **Settings**: volume per bus, AI speed, hand-off cover, reduced motion, text size, colour symbols (a small glyph on each lane's middle slot, off by default).
- **Rules card**: one screen, the turn in three lines plus scoring, with page references to the rulebook.
- **Save/resume** (`storage.ts`): autosaves to `departures.save.v1` after every action batch (engine state
  with rng, seat meta, settings, the last record line). It is validated on load, and a corrupt save never
  overwrites a good one. Resume restores the night if the final round has begun, and it restores
  mid-turn states (between two draws, or with a ticket offer pending). A human seat gets the cover on resume.

---

## 6. Rules coverage and how docs/RULES.md is pinned

- **Source**: the official 2015 English rulebook (`tt_rules_2015_en.pdf`). Before Phase 0, the lead fetches it
  with John's OK into `_claude/rules/`. Iron Atlas's `docs/RULES.md` is the starting reference and is re-checked line
  by line against the PDF, not trusted.
- **Format**: every rule is `R<n>` with a page citation, and every edge case is `E<n>`, labelled either
  *rulebook* or *implementation resolution*. The engine agent writes it in Phase 0. A cross-family read by
  Codex `gpt-6-astra` against the PDF is recommended before Phase 1 closes (the lead routes it).
- **Rules** (abbreviated; the file states each in full):
  - **Setup**: R1 45 trains per seat; R2 110 cards (12 × 8 hues + 14 loco); R3 four cards dealt; R4 five face-up, reset on three locomotives; R5 30 tickets; three dealt, keep ≥ 2.
  - **Turn**: R6 exactly one action per turn (draw cards, claim a route, or draw tickets).
  - **Drawing cards**: R7 up to two cards; a face-up loco as the first draw is the whole draw; a face-up loco can't be the second draw; a blind loco counts as one card; R8 face-up cards are replaced at once, and three face-up locos discard and replace all five; R9 the discards are reshuffled when the deck runs out.
  - **Claiming routes**: R10 pay a route's length in one colour, with locos wild; gray takes any one colour; R11 no network connection is required; R12 sufficient trains are required; R13 double routes: with 2–3 seats only one lane may be used, and with 4–5 no seat may own both; R14 route points by length 1, 2, 4, 7, 10, 15.
  - **Tickets**: R15 draw three and keep ≥ 1 (fewer if the pile is short); returns go to the bottom; tickets are secret and can't be discarded.
  - **End of game**: R16 when a seat ends a turn with ≤ 2 trains, every seat including it gets one more turn; R17 completed tickets are added and incomplete ones subtracted; R18 longest continuous path +10, shared by ties, as a trail (cities may repeat, trains may not); R19 ties go to the most completed tickets, then to the longest-path holder.
- **Edge cases**:
  - Rulebook: E1 the deck and discard are both empty (the market only; if that is empty too, drawing is unavailable); E2 no second card is available (the turn ends after the first); E3 the replacement after the first draw is a loco (it can't be taken; a blind draw is still legal); E4 a reset triggered mid-turn by the first draw's replacement (the second draw comes from the new market); E5 the initial market has three locos; E6 the ticket pile is short or empty; E7 all-loco payment on a coloured route; E8 the trigger seat's final turn; E9 ticket completion counts only your own lanes; E10 longest path with a cycle and a revisited city; E11 2 players use the 2–3 double-route rule.
  - Implementation resolutions: E12 no legal action at all → `pass`; E13 a pathological market that can't avoid three locos → stop resetting and keep what is there (Iron Atlas's bounded fallback, reviewed); E14 a full tie after both tie-breaks → shared victory; E15 **CANCELLED** = unreachable (Soul question 2), computed after every claim for every seat by a 0–1 weighted shortest path (own lanes 0, free lanes cost their length, blocked and closed lanes removed), cancelled when the cost exceeds the trains left or no path exists; E16 departure direction (render only).
- **Data**: `src/engine/data.ts` is transcribed from Iron Atlas and re-verified. Invariants tested: 36
  cities; 100 lanes; 78 pairs; 22 doubles; 309 spaces; 44 gray lanes and 7 of each hue; 30 tickets; the map
  connected. Any disagreement with the board image the lead supplies is reported, not fixed silently.
- **Coverage**: `scripts/rules-coverage.ts` fails CI if any R/E id lacks a test whose name starts with that
  id. `npm test` runs it.

---

## 7. Tests and gates

### 7.1 Unit (Vitest, `tests/engine`, `tests/game`)

- **Engine**: every R and E id; seeded determinism; `applyAction` never mutates its input.
- **Brute-force cross-checks**: `longest.ts` against an exhaustive trail search on 500 random graphs; `reach.ts` against exhaustive path enumeration on 300 random boards.
- **Save**: round-trip at every phase kind; tamper rejection.
- **AI** (`simulate.ts`):
  - 1,000 seeded games across 2–5 seats and 3 difficulties end legally with no exceptions;
  - strength over 200 heads-up seeds: Hard beats Normal ≥ 60 %, Normal beats Easy ≥ 65 %;
  - Easy completes ≥ 1 ticket in 80 % of games;
  - no-peek: decisions are identical when hidden hands are permuted;
  - speed: p95 decision time Normal ≤ 40 ms, Hard ≤ 120 ms.
- **Controller**: the display follows the board; no private field reaches `BoardView`; one-gold subject
  invariant on every VM; every reason code has copy; no `!` in `copy.ts`; record lines match the past-tense
  patterns list.

### 7.2 e2e lanes (`tests/e2e/lanes.ts`, War Table's model)

`logic` flows run in parallel at instant speed unless marked `realtime`. `timing` flows run serially at 1×
on an idle machine with a cold Chromium. `quick` = `npm run test:e2e:quick`.

| Flow | Lane | Why |
|---|---|---|
| `smoke` | logic, quick | title → new game (1 human + 2 AI) → initial tickets → first draw |
| `claim` | logic, realtime, quick | claim by taps; departure plays; line and record; score applies at the clank |
| `handoff` | logic, realtime | zero frames of the next hand, sampled per mutation and per frame across the change; the board stays visible |
| `draw` | logic | every draw rule by taps: loco first, loco refused second, reset, reshuffle, empty deck |
| `tickets` | logic | initial and later keeps, minimums, posters render. Scripted fixture: a ticket becomes impossible and **no line, sound or event reaches the UI at that moment**; the stamp is present when the owner opens the tickets |
| `reasons` | logic | every refusal is reachable by taps, with its copy |
| `resume` | logic, quick | reload between two draws, with an offer pending, and in the final round (night restored) |
| `endgame` | logic | final-round trigger → one light change → last turns → the scoring sheet equals `standings` |
| `autoplay` | logic, realtime | an all-AI 4-seat game at `fast` to victory; no console errors |
| `legibility` | logic | §7.3 |
| `poster` | timing | 60 s idle with nothing picked: `transformsHash` constant, `activeTweens` 0, only `lightGroupHash` changes; drawn fps ≤ 30 |
| `pop` | timing | over a real turn per action type, no board or siding element goes 0 → ≥ 60 % visible in one frame |
| `tempo` | timing | `departMs(L)` + 5 % for L = 1…6; whistle-to-first-pixel ≥ 250 ms; click-through ≤ 200 ms; forced wait 0 on your own turn; draws 380 ms + 5 % |
| `ai-pace` | timing | AI turn median ≤ 2.2 s, p95 ≤ 2.9 s at watch; a round of 4 AI turns ≤ 12 s |
| `ending` | timing | the light state is constant for every turn before `finalRoundBegan`; the change is 6000 ms ± 5 %; it happens exactly once |
| `feel` | timing | worst frame on the first departure after a cold load ≤ 50 ms; idle GPU ≤ 6 ms (reported) |
| `onegold` | timing | a real turn sampled every 50 ms: every gold pixel group (DOM plus `__dep` board query) refers to one subject |

### 7.3 Legibility gate (`legibility` flow, `tests/e2e/legibility.ts`)

- **Fixtures**: `mid-game` (40 % claimed across all 5 finishes), `picked`, `night`.
- **Viewports**: 1280×800 at DPR 1 and 2, and 1920×1080 at DPR 1.
- **Sizes**: every slot's projected short and long side, gaps, ring size and name cap height against the §4.13 table.
- **Hue**: downscale the screenshot to 25 % (area average) and classify each unclaimed slot's centre to
  the nearest of the 9 lane colours in CIEDE2000. The gate is ≥ 98 % correct and 100 % for gray against coloured,
  at golden and at night.
- **Owner**: at 25 %, classify each claimed car's centre to the nearest of 5 finish references (lit average).
  Gate ≥ 95 %. Deuteranope and protanope simulations (Machado matrices) keep every finish pair ΔE ≥ 10.
- **Keyline**: the luminance ratio between each slot's keyline ring and the land 3 px outside it is ≥ 3:1.
- **Painterly leak**: render `?layers=print` (land off) and the full composite from the same fixture. ΔE is ≤ 3
  at every slot centre and every name's pixels. This one check enforces "nothing painterly ever touches a
  slot, a count or a city name".
- **Output**: shots go to `artifacts/legibility/`, and the agent looks at them before reporting.

### 7.4 Test hooks (`src/game/hooks.ts`, with `?e2e` or `VITE_E2E`)

`window.__dep`: `state()`, `vm()`, `load(fixture)`, `seed(n)`, `speed(0 | 1)`, `ai(speed)`, `metrics()` (per-event
beat timings), `board.stats()`, `laneRects(id)`, `goldSubjects()`, `layers(list)`.

---

## 8. Build phases

Every brief pastes SOUL's Intent, the moment and the five pillars (SOUL checklist #7), names the owned
files, and forbids everything else (anything outside goes under "Requests" in the report). No agent runs `npm install`
except S, and no agent commits. Each agent runs `npx vite --port <p> --strictPort` in the background and kills
it at the end. Playwright uses War Table's launch args, muted. Screenshots go to `artifacts/<area>/` and
are opened with Read before anything visual is claimed. The lead is on **5390**.

### Phase 0 · Scaffold, contracts, rules pin (2 agents in parallel, about 1 h)

- **S · Scaffold and contracts** (5391)
  - **Owns**: `package.json`, the lockfile, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`,
    `.gitignore`, `src/main.ts` (stub), every ◆ contract file, `src/shared/ids.ts`, `src/board/stub.json`
    (Iron Atlas coordinates linearly mapped to world units, straight lanes, no warp), `scripts/e2e.ts`,
    `tests/e2e/{lib,lanes}.ts`, `tests/e2e/smoke.e2e.ts` (boots and shows the frame).
  - **Installs everything the whole build needs**: `three`, `@types/three`, `@fontsource-variable/jost`, `d3-geo`,
    `@types/d3-geo`, `topojson-client`, `@types/topojson-client`, `world-atlas`, `polygon-clipping`, `pngjs`,
    `@types/pngjs`, `vite`, `typescript`, `vitest`, `playwright`, `tsx`, `@types/node`. Later needs are Requests, and the lead installs them between phases.
  - **Accept**: `npm run typecheck`, `npm test` and `npm run test:e2e:quick` (smoke) green; the contracts match §2.2–3.3; the lead reviews them before Phase 1.
- **R · Rules pin** (no server)
  - **Owns**: `docs/RULES.md`, `src/engine/data.ts`, `tests/engine/data.test.ts`, `scripts/rules-coverage.ts`.
  - Ids are branded strings in `types.ts`, so R doesn't wait on S.
  - **Accept**: every R/E id is stated with a page citation; the data invariants pass; the coverage script runs (it will fail until Phase 1, and it says so).

### Phase 1 · The playable vertical slice (6 agents in parallel, about 4 h, then lead integration)

**The slice**:
- 2–5 seats (default 1 human + 1 Normal AI, or 2 humans), on the real warped board at golden hour;
- the full engine: every rule, the final round and scoring;
- draw, claim with the full departure beat and sound, draw and keep tickets (placeholder posters), the hand-off cover, CANCELLED found later;
- the final round (no light change yet), and the result as a standings line with the rulebook tie-break.

**Not in the slice**: the night, real posters, the scoring sheet, title and new-game screens (a
`?seats=` boot preset instead), save/resume, Easy and Hard, strings and birds.

| Agent | Port | Owns | Builds | Accept (seen) |
|---|---|---|---|---|
| **E · Engine and Normal AI** | 5392 | `src/engine/**` except `types.ts` (additive) and `data.ts`; `tests/engine/**`; `scripts/simulate.ts` | §6 in full; `ai/` Normal (Iron Atlas `ai.ts` as reference: ticket path plans, card deficit, draw choice) | §7.1 engine and AI lines green; coverage script green; 1,000 simulated games legal |
| **B · Board layout and bakes** | 5393 | `data/**`, `scripts/build-board.ts`, `scripts/verify-board.ts`, `src/board/board.json`, `src/board/index.ts`, `public/land/**` | §4.2, §4.3 | `verify:board` green; `layout-1280.png`/`layout-1920.png` looked at; bakes as 8-bit previews in `artifacts/board/bakes/`, looked at |
| **L · Land** | 5394 | `src/render/stage.ts`, `src/render/land/**` (golden only; `light.ts` exposes the night API as a stub), `scripts/brush-tex.ts`, `public/tex/brush.png`, `land.html` (sandbox) | §4.4–4.6, §4.8, §4.14 L3–L1 | sandbox shots at 1280×800 and 1920×1080 next to frames 1 and 2 (`artifacts/land/`), looked at; the `poster` flow run locally reports the hashes; GPU ms reported |
| **P · Print, trains, departure** | 5395 | `src/render/index.ts`, `src/render/print/**`, `src/render/trains/**` (not `lamps.ts`), `labels.ts`, `pick.ts`, `metrics.ts` | §4.5, §4.7, §4.9, §4.10, and `BoardView` in full | a 200 ms-cadence capture of an L6 and an L2 departure (`artifacts/depart/`), looked at; `tempo` numbers reported; `legibility` sizes and hue checks green on golden |
| **U · Controller and UI** | 5396 | `src/game/**`, `src/ui/**` except `ui/screens/**`, `ui/tickets/stamps.ts` placeholder only; `src/main.ts` | §3.1 controller, §5.1–5.6, copy and reason codes; `fakeBoard.ts` until P lands | shots of the dock in 6 states, the siding, the ticket sheet (offer and view), and the cover, at 1280×800 and 1920×1080 (`artifacts/ui/`), looked at; `claim`, `handoff`, `draw`, `reasons` flows green against the real board after integration |
| **A · Sound, part 1** | 5397 | `src/audio/**`, `scripts/verify-audio.ts`, `audio-lab.html` | whistle, whistleLong, chuff, clank, cardSlide, shunt, paper, riffle; wind; mixer and limiter | `verify:audio` green; a 20 s lab render of the moment's beat (`artifacts/audio/moment.wav`) listened to, if the agent can, or its loudness report pasted |

**Lead integration (5390)**: wire the real board into U, then run the quick lane plus `claim handoff draw
tickets reasons tempo poster legibility`. Play a full 1 human + 1 AI game in the browser, and then a 2-human
game with the cover. Put frames 1 and 2 beside the 1920×1080 golden shot for the taste gate: does it read as
cel-shaded 2.5D? If not, `/off` before Phase 2.

**Phase 1 accept**: a game played to the standings line (seen); the moment's departure seen in a capture;
the legibility gate green at golden; the quick lane plus the flows above green; §1 re-run against what was seen.

### Phase 2 · The whole game (6 agents in parallel, about 4 h)

| Agent | Port | Owns | Builds | Accept (seen) |
|---|---|---|---|---|
| **N · Night and the ending** | 5393 | `src/render/land/light.ts`, `land/night.ts`, `trains/lamps.ts`, `print/printGlsl.ts` (the night branch; P's file passes to N) | §4.11 | a 500 ms-cadence capture of the 6 s change and the night board at both viewports, looked at; `ending` green; `legibility` green at night |
| **T · Posters** | 5398 | `scripts/posters/**`, `scripts/pack-posters.ts`, `_claude/poster-src/**`, `public/posters/**`, `src/ui/tickets/poster.ts`, `src/ui/tickets/stamps.ts`, `src/ui/css/tickets.css` | 30 briefs using a shared style prefix, with frame 3 as the style reference: art only, no text, no people, no towns, the lower 24 % a flat dark band. The imagegen skill runs 2–3 candidates each; the agent looks at every one, rejects any with text or figures, picks one, and packs it. If the agent lacks imagegen, the lead runs `generate_batch` from `briefs.json`. | a contact sheet of all 30 at thumbnail and sheet sizes, plus CANCELLED, punch and UNFINISHED states (`artifacts/posters/`), looked at |
| **S2 · Screens and persistence** | 5396 | `src/ui/screens/**`, `src/ui/css/screens.css`, `src/game/storage.ts`, `src/game/presets.ts` | §5.7 | shots of the title, new game, menu, settings, rules, and victory at +0 / +4 s / the sheet mid-count / done; `resume` and `endgame` green |
| **I · AI difficulties** | 5392 | `src/engine/ai/**`, `tests/engine/ai*.test.ts`, `scripts/simulate.ts` | Easy (greedy, no blocking, sometimes misreads its payment), Hard (ticket values weighed against the trains left, late long-route preference, denial of contested doubles, ticket draws when ahead; no peeking) | the strength table in the report; the no-peek test green |
| **M · Sound, part 2** | 5397 | `src/audio/ambience/**`, `src/audio/mixer.ts` | strings, birds, the night variant, the descent on `finalRoundBegan`, the final chord | `verify:audio` green; the ambience RMS report |
| **G · Gates** | 5399 | `tests/e2e/**` except `lib.ts` core (additive), `scripts/e2e.ts` | every flow in §7.2 and the legibility module in §7.3 | `npm run test:e2e` all green against the integrated build (it runs last and blocks the phase) |

**Phase 2 accept**: `npm test`, `npm run typecheck`, `npm run build` and `npm run test:e2e` green; the lead
plays a 3-seat game (2 humans + Hard AI) to the scoring sheet and looks at the finished map; the full
screenshot sweep is looked at shot by shot.

### Phase 3 · Polish and the couch (lead + 2 agents, about 2 h)

- **C1 · Render polish** (5394): the ladder L0, reduced motion everywhere, the colour-symbols setting, perf numbers against §4.14.
- **C2 · Words and hands** (5396): copy pass against SOUL Words, the keyboard map, text size, the rules card, 44 px targets.
- **Lead**: a TV playtest with John at 3 m, the soul checklist on the seen build, and CLAUDE.md §Commands.

**Commands** (for PLAN.md): `npm run dev` (5390), `build`, `typecheck`, `test`, `test:e2e`, `test:e2e:quick`,
`build:board`, `verify:board`, `brush`, `posters:pack`, `verify:audio`, `sim`.

---

## 9. Risks and guards

| Risk | Guard |
|---|---|
| The land reads as generic low-poly toon, not Life is Strange | Bands chosen before biome mixing; brush strokes follow the contours; cel ink lines only on silhouettes; warm rim; lavender shadows. The Phase 1 taste gate puts it beside frames 1 and 2. The procedural brush has an imagegen fallback. `/off` before Phase 2 if it misses. |
| Painterly layers leak onto print | Print is a later pass; opaque slot interiors; `printMask` attenuates steam; the ΔE leak check in `legibility`. |
| The Northeast is too crowded at 1280×800 | The TPS warp to a board layout; `verify-board` projected sizes; the slot minimums gated. |
| A cream train on cream plains, or brass read as copper | Inverted-hull outlines; the L* value ladder; the owner classification and colour-blind ΔE gate. |
| Trees hide slots at the oblique angle | Occlusion clearance solved in world space at bake time along the fixed view direction. |
| Departures make the evening slow | ≤ 2.19 s for the longest route; a 4-seat game has about 70 claims, so about 2 minutes in total; click-through ≤ 180 ms; `fast` for AI. |
| The light change becomes a day cycle | Sun and ramp constants until `finalRoundBegan`; the `ending` flow asserts no change before it and exactly one after. |
| Hidden information leaks on one screen | The dock cover in the same frame; `publicView` stripping, unit-tested; the `handoff` per-frame sampler; AI no-peek. |
| The rules drift from 2015 | R/E ids with page citations; the coverage script; a cross-family review; data invariants. |
| Posters inconsistent, with text or people | No-text briefs with a style prefix and frame 3 as reference; reject rules; typography in code; code placeholders already shipping. |
| Parallel agents clobber each other | File ownership per phase in §8; contracts additive-only; CSS split per area; only S installs. |
| A weak GPU on the TV laptop | The ladder L3 → L0 steps the land down, never print, trains or steam; render on demand. |
| The scoring sheet steals the finished map | No auto-open; 4 s of pure board; `BOARD` returns to it. |
| The whistle startles at TV volume | A limiter at −3 dBFS; "far off" reverb and lowpass; a volume per bus. |
