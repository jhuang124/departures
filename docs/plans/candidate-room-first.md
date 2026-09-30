# Departures: plan candidate, room first

**SOUL.md outranks this file on intent and feel.** The settled block at the top of `docs/DIRECTIONS.md` binds; the
ranking below it is history. The rules are Ticket to Ride USA, 2015 rulebook, and "board taps pick, buttons
commit" binds (SOUL Open). Where this plan and SOUL disagree, the plan is wrong.

Angle: plan from the couch outward. The evening comes first (§2): who is in the room, what they see at 3 m, what
each turn costs in clicks and seconds, where the hand hides, how the sting is found, how the night falls. The
engine, controller, renderer and sound (§3 to §5) are then specified as what the room needs from them, and every
budget in §2 comes back as a gate in §7.

Where the nine required parts live: (1) SOUL checklist and Soul questions §1 · (2) stack, architecture, layout,
contracts §3 · (3) event vocabulary §4 · (4) rendering §5 · (5) UI grammar and screens §2 · (6) rules coverage and
`docs/RULES.md` §6 · (7) tests and gates §7 · (8) phases, agents, ports, acceptance §8 · (9) risks §9.

Evidence in this file is **promised** unless marked otherwise. What I actually looked at: the four moodboard frames
(seen), War Table's `docs/UX.md`, `docs/INK2.md`, `docs/MOBILE.md`, `src/ui/hud/strip.ts`, `tests/e2e/lanes.ts`,
`src/engine/types.ts`, `src/render/BoardView.ts` (read), Iron Atlas's `docs/RULES.md`, `src/game/{types,data,
engine,ai}.ts` and its test names (read).

---

## 1. SOUL checklist, run against this plan

### 1.1 The moment, walked through the plan

> Turn 30. The continent lies still in late golden light.

Board at rest: relief land under one fixed sun (azimuth 255°, elevation 14°), four-band toon ramps per biome, the
Pacific cloud bank backlit (§5.3). Nothing moves except the sunbeam shafts' intensity, on 40 to 70 s sine periods
at ±12 % (§5.4). The `idle` gate proves it: 10 s of idle with zero tweens and zero change in the print layer
(§7.3). **Serves.**

> Priya taps the route from Helena to Duluth and pays five yellow cards.

One tap picks the route: its outline turns gold, the title bar reads `HELENA · DULUTH` in gold, the dock's line
reads `6 orange · 15 points · 39 → 33 trains`, and the cards that will pay lift 6 px in her hand rail. `Claim`
commits (§2.4.2): two clicks. **Conflict found:** on the 2015 board Helena–Duluth is **6 orange**, not five yellow
(Iron Atlas `data.ts` line 103, and the physical board). The plan follows the rulebook, so Priya pays six orange,
or four orange and two locomotives. Soul question 1.

> A whistle, far off. Her brass train pulls out of Helena, slow on the first beat, then the chug picks up, steam
> trailing, and the last car settles at Duluth with a soft clank.

The departure beat (§5.6): the whistle starts at t = 0 and the train moves at t = 350 ms, so the claim is heard
before it is seen. The cars emerge from under Helena's station roundel (the roundel is print and draws above the
trains), so nothing appears. Travel follows a slow-in curve with coupling slack (the first beat is slow), chug
cadence rises from 2.2 to 5 Hz, painterly steam puffs trail and thin over 2.5 s, and on arrival a clank ripple
runs front to back at 45 ms a car. Total for six cars: 2280 ms, and any tap finishes it. **Serves.**

> The title bar reads `HELENA · DULUTH`.

The dock's title slot names the thing happening now, in departure order (`departureEnd()`, §3.5). The record line
under it: `Priya's train left Helena for Duluth.` **Serves.**

> Sam, watching, says nothing; that was the route his ticket needed.

Nothing on any public surface mentions tickets: not the log, the cover, the roster, the record line, or the AI
narration (the `cancelled` flow, §7.3, scans every public DOM node and every record for ticket ids and the word
CANCELLED). **Serves.**

> He finds out for sure three turns later, when he opens his hand and the Duluth poster wears a small CANCELLED
> stamp.

The controller computes `ticketStatus()` after every claim (§3.5) but the stamp is only painted inside Sam's
private sheet, and it lands with a soft rubber thunk (180 ms, §2.8) the first time Sam sees it, never again.
**Works against, as the rules stand:** the USA board is dense, and a pure "no path left" test almost never fires
in a real game. The plan defines cancelled as "cannot be finished with the trains you have left, over routes
still open to you", which fires in the late game when the sting matters, and `sim.ts` measures how often (§7.1).
That definition is my taste, not SOUL's: Soul question 2. With it, **serves**.

> The board has not moved since. It never does, until the last round, when the light goes down once and the lit
> trains are all that is left.

The camera is fixed (§5.1); no automatic camera move exists in the code at all. When the final round is
triggered, `lightFall` runs once over 12 s, never blocking input (§5.7): sun below the horizon, ramps to night,
warm lamps in every claimed carriage and in every city that a claimed route touches, faint coasts, two static
searchlights at New York. Print stays unlit, so every route still reads at night (§5.5). **Serves**, with one
choice that is mine: the light falls at the trigger, so the last round is played at night (Soul question 3).

> And after: someone looks at the finished map for a while before anyone reaches for the menu.

After the scoring reel (≤ 18 s for four players, tap-through) the sheets fold away and the finished night map is
left alone. `Rematch · New game · Title` appear at 40 % ivory only on pointer movement or after 20 s (§2.9).
**Serves.**

### 1.2 One bad day

- **Idle.** Six friends argue for ten minutes about pizza. The board does nothing but let light drift; no
  "your turn" pulse, no attract mode, no nag sound. The land pass is cached while idle, so the laptop stays
  quiet (idle GPU ≤ 4 ms a frame, §7.4). **Serves pillar 1.**
- **Skipped.** Dev plays fast and taps through every departure. A skip snaps the train to its slots with one
  clank and a single steam puff that thins over 600 ms, so even skipped, the claim still reads as a train that
  left. The AI `skip` speed still slides trains 300 ms, never zero (only the test lane runs at 0). **Serves
  pillar 2.**
- **Losing.** Sam ends 60 points behind with two stamped posters. The scoring reel turns each of his posters over
  in the same rhythm as the winner's, the minus counted in plain numbers, no red flash, no sad sound; his
  cancelled Duluth is the one he found three turns after it happened. **Serves pillar 4.**

### 1.3 Pillars

| Pillar | Verdict | Where, and the contradicting detail hunted for |
|---|---|---|
| 1 The calm is the country | **Serves** | Idle = light only (§5.4). Hunted: the market column over the Atlantic (§2.3) is still UI on the painting. It is print, static, and never animates while idle. The hand-off cover leaves the board clear and unblurred, so the hand-off is a moment of looking at the country rather than a grey screen (§2.6). |
| 2 Departing is the only verb | **Serves** | Claims are departures (§5.6); card draws are carriages shunted off the siding and slid in, never faded or popped (§2.4.1); tickets rise and settle. Hunted: the whistle. SOUL says a whistle before *every* departure, and whistling at 150 card draws an evening would stop it being the loudest thing. The plan whistles on claims only (Soul question 4). |
| 3 Vivid as memory, readable as print | **Serves** | Two passes: painterly land, then an unlit, un-post-processed print pass at full DPR (§5.2). The print mask flattens the land in a 10 px halo under every slot and name. Hunted: steam. The moment wants steam trailing, and steam is painterly and drifts over other routes. The plan caps steam at 35 % alpha wherever it crosses print (Soul question 5). |
| 4 Wonder and loss in the same move | **Serves** with the cancelled definition | §1.1; the stamp only in the owner's sheet; `sim.ts` reports how often it fires. |
| 5 The land is a character | **Serves** | Forests, ranges, lakes, backlit cloud, light shafts, cast shadows (§5.3). No people, no landmarks, no ornaments on the board. Hunted: city skylines. DIRECTIONS §4A gave big cities a skyline silhouette; this plan does not (roundels only). Posters may show land and a small train, never landmarks, since the board rule covers the board and SOUL takes frame 3 whole. |

### 1.4 Inherited commitments (up to five)

1. **War Table's hand-off cover defaults off** (its UX §6.3: on a shared TV the cover hides nothing). Here the hand
   is private (Intent: "passed hand to hand"; the task's room constraint). A clean-room build from SOUL would need
   a private hand. **Conflicts, so the plan changes it:** the cover is on by default whenever 2+ humans sit, and
   it is a dock state that leaves the board visible, not War Table's smoked glass (§2.6).
2. **War Table's tempo gates, lanes and click budgets.** Traces: Touchstones, War Table, "take the tempo gates and
   the hand-off cover". Carried as `tests/e2e/lanes.ts` with the same logic/timing split (§7.3).
3. **Iron Atlas's board data (36 cities, 100 lanes, 30 tickets) and its RULES.md.** Traces: Open, "the rules
   (Ticket to Ride USA, 2015 rulebook) bind". Reused as a checked reference, not copied as code; its coordinates
   are replaced with real latitude and longitude (§5.1).
4. **Frame 1's dock words `DRAW · CLAIM · TICKETS · END TURN`.** Traces in part: Touchstones take "the title bar as
   the dock". `END TURN` is dropped: every Ticket to Ride action ends the turn by itself, so the word would be a
   dead click. The remaining words are **open**.
5. **The moment's five yellow cards and frame 3's `HELENA · DULUTH · 8` ticket.** Neither exists on the 2015 board
   (Helena–Duluth is six orange; there is no Helena–Duluth ticket). **Conflicts with the rules, which bind.** John's
   own words wrote the moment, so it is a question for him, not a silent change (Soul question 1). Posters use
   real tickets, e.g. `DULUTH · HOUSTON · 8`.

### 1.5 The Misread this plan comes closest to repeating

"imagegen frames 1 and 4: painted every slot saturated and lit every carriage in its card colour." The plan's
nearest edges: the market's eight hues (they are cards, so they are hues, fine), unclaimed slots, and the night.
Guards: unclaimed slots are outlines with a faint cream wash, not saturated fills (§5.5); at night every lit
window is the same warm 2700 K lamp whatever the finish or route colour, and only claimed trains and connected
cities light (§5.7). Runner-up: "a full day cycle as the game clock". Guard: `light.ts` has exactly two states
and one transition, which fires once (`finalRoundTriggered`); a unit test asserts the light uniforms are
identical at turn 1 and turn 40 of a seeded game.

### 1.6 Soul questions for John

Each has a default the plan builds unless John says otherwise.

1. **The moment's route.** On the 2015 board Helena–Duluth is six orange. Default: the rules win, so Priya pays six
   orange (or orange plus locomotives), and the SOUL moment is edited to match. Or do you want the moment kept
   as written and the route data bent? (I'd say no: the rules bind.)
2. **What CANCELLED means.** Default: a ticket is stamped when it can no longer be finished with the trains you
   have left, over routes still open to you. The strict version (no path left at all) almost never happens on
   this map, so the stamp would almost never land.
3. **When the light goes down.** Default: at the trigger (someone ends a turn on 0–2 trains), so the last round is
   played at night and `THE LAST TRAIN HAS LEFT` closes it. The alternative is at game end, so night is the
   finished map only.
4. **The whistle.** Default: a far whistle before every *claim* only; card draws and tickets use couplings and
   rail ticks. SOUL says "before every departure", and whistling at every draw would make it background noise.
5. **Steam over other routes.** Default: steam draws over the land, and wherever it crosses another slot, a
   count or a name its alpha is capped at 35 %. SOUL says nothing painterly touches a slot.
6. **Unfinished tickets at the end.** Default: on the scoring reel every unfinished ticket gets the CANCELLED
   stamp, so the stamp is the one mark of loss. The alternative stamps only the ones that became impossible.
7. **A private mark for a finished ticket.** Default: a conductor's punch hole appears on a completed poster
   inside your own sheet (found, never announced). The alternative is that completion stays silent until the end.
8. **Life is Strange leave list.** SOUL marks it as a guess (no grain, vignette or lens flare). The plan follows
   it, since DIRECTIONS §3b says the same.
9. **Prompts.** SOUL says past tense. Default: records are past tense (`Sam drew a yellow card.`), states are noun
   phrases (`ONE MORE CARD`, `6 orange · 15 points`), and nothing is imperative except button verbs.
10. **The market's place.** Default: a column over the Atlantic, east of the coast, rather than in the dock
    (§2.3). It keeps the dock to one line of words.

---

## 2. The room and the evening (UI grammar, screens, click and tempo budgets)

### 2.0 The room

One laptop on a coffee table, or a TV, with 2–5 seats, humans and AIs mixed. The driver holds the trackpad; the
rest watch from up to 3 m. Two kinds of information, never mixed on one surface:

| Public (always on screen) | Private (only after `I'm Sam`, only for Sam) |
|---|---|
| The board: every route's colour, length, owner (finish) | Carriage cards in hand (the hand rail) |
| The five-card market, the deck count, the ticket deck count | Tickets (the poster sheet), their stamps and punches |
| Each seat's score, trains left, card count, ticket count | Payment preview's *source* cards (the payment itself goes public when paid) |
| The record line (what just happened), the title bar | Ticket hints (`9 trains to go`) |

Spectators must read from the couch: whose turn, what just happened, every route's colour, length and owner,
every score and trains-left, the market. They never need to read a hand.

### 2.1 Screen grammar (every screen)

The poster frame is the UI. Measurements at 1280×800; everything scales by `s = min(w / 1280, h / 800)`
(1920×1080 → s = 1.35). All sizes below are CSS px at s = 1.

- **Mat and keyline:** 8 px cream mat (`--mat #efe3c8`) round the whole viewport, then a 2 px ink keyline
  (`--ink #14161b`). The image bleeds to the keyline.
- **Top band** (roster), 40 px, ink. **Bottom band** (the dock), 112 px, ink. The map sits between.
- **Type:** one family, Jost variable (OFL, geometric, Futura lineage) via `@fontsource-variable/jost`. Display caps
  weight 500, tracking 0.16 em. Numerals always `font-variant-numeric: tabular-nums lining-nums`; the scaffold
  agent verifies Jost's `tnum` and falls back to Inter for numerals only if it fails.
- **Colour:** ink ground, cream words (`--cream #f3e6c9` at 100 % current, 62 % quiet), **one gold**
  (`--gold #e8b04a`) for the one thing happening now: the picked route and its name, or the departure under way,
  or the one button that commits. One thing may show gold in up to three places (the route on the board, its name
  in the title, the commit's underline); the `gold` gate checks they share one `data-gold` id (§7.3).
- **Marks:** words, hairlines (1 px cream 22 %), underlines (2 px gold, 1.1× the word). No pills, no rounded
  boxes, no panels. Straight-edged rectangles only for things that are rectangles: cards, posters, the sheet of
  paper the posters lie on.
- **Hit boxes:** ≥ 44×44 px on every control, ≥ 8 px apart, the visible word inside a transparent box.
- **Motion:** UI crossfades 160 ms; sheets rise 220 ms easeOutQuart with 12 px travel and fall 140 ms. The dock
  container never resizes.

### 2.2 The top band (roster), public

Left to right per seat, in seat order, evenly spaced across 1240 px: finish roundel 16 px (a rendered sprite of
that finish, §5.6), name 14 px caps, score 20 px, then 12 px quiet `31 trains · 7 cards · 3 tickets`. The seat
whose turn it is: name at 100 % cream and a 2 px cream underline; others at 62 %. At the far right, `≡` (menu)
and the AI speed words `watch · fast · skip` whenever an AI seat exists. At 1920×1080 the score is 27 px.

Score is public and live (route points land when the departure settles, not at commit: the HUD follows the
board, War Table UX §8.1). Tickets are counted, never named.

### 2.3 The market column (the siding), public

A 136 px column inside the right edge of the map, over the Atlantic, top to bottom: the ticket deck (a stack of
poster backs 60×90 with its count), the carriage deck (card back 112×70 with its count), then the five face-up
cards 112×70, 8 px apart. Column height 558 px of the 628 available. The continent is fitted into the map area
left of the column (§5.1).

Cards are print: a flat hue field, a 2 px ink keyline, and a large carriage silhouette glyph distinct per colour so
colour-blind players never need the hue: box car (purple), passenger car (white), tanker (blue), reefer (yellow),
freight car (orange), hopper (black), coal car (red), caboose (green), locomotive (all eight hues in bands with a
locomotive glyph). No text on cards.

### 2.4 A turn, click by click

`Click` = one press on a route, a card or a word. Turn start costs **0 clicks and 0 s forced**: the title reads
`SAM`, the line holds the last record, the hand rail rises (160 ms). Input during the first 250 ms after a
human-to-human change is ignored (War Table's double-click guard), except with the cover on, where the cover is
the guard.

#### 2.4.1 Draw two carriage cards (target 2 clicks, 1 for a face-up locomotive)

| Intent | Clicks | What the room sees |
|---|---|---|
| Two face-up | 2 | Card 1 departs the siding: slides left 24 px then down into the hand rail (320 ms, easeInOutCubic), a coupling tick. The gap closes as the replacement slides down from the deck (260 ms), rail tick at contact. Title `ONE MORE CARD`. Card 2 the same. The turn ends. |
| Face-up locomotive first | 1 | Same motion; the turn ends at once. |
| Blind + blind, or mixed | 2 | A card back departs the deck into the hand rail and turns face up there (private) as it lands, 320 ms. |

- Market cards and the deck are **buttons**: tapping draws (they are not the board). Hover lifts a card 3 px.
- Second draw: a face-up locomotive is shown at 45 % and is not clickable. Its line on tap attempt reads
  `A face-up locomotive has to be the first card.`
- Three face-up locomotives after a refill: the five slide off to the discard edge together (staggered 60 ms,
  400 ms each), five new slide in (staggered 60 ms), total ≤ 900 ms. Record: `The market had three locomotives
  and was replaced.`
- Deck runs out: `The deck was reshuffled from 38 discards.` A 600 ms riffle of card backs under the deck.
- Records (public): `Sam drew a yellow card and one from the deck.` Face-up colours are public, blind draws are not.

#### 2.4.2 Claim a route (target 2 clicks; 3 for another gray payment)

| Intent | Clicks |
|---|---|
| Coloured route, default payment | 2: the route, then `Claim` |
| Gray route, default colour | 2 |
| Gray route, another colour | 3: the route, the colour word, `Claim` |
| Change your mind | 0: tap another route, or empty land, or Esc |

- **Tap a route = pick** (never commit, even on a second tap). The picked lane's outline turns gold and 1.5 px
  wider, its two roundels ring gold, every other slot eases to 70 % opacity (180 ms). The land does not dim.
- The dock during a pick: title `HELENA · DULUTH` in gold (departure order), line
  `6 orange · 15 points · 39 → 33 trains`, and in the hand rail the cards that would pay lift 6 px (120 ms).
  Gray routes add colour words after the line: `pay with  orange · red · locomotives` (the default underlined).
- `Claim` is the gold word at the dock's right. Enter also commits.
- **Default payment** (`defaultPayment()`, §3.5): coloured route, the route's colour first, then locomotives.
  Gray: the colour that uses the fewest locomotives; ties go to the colour you hold most of; ties then go to the
  earlier colour in the fixed order.
- **Cannot afford:** the pick still works (so you can see the cost), `Claim` is shown at 45 % and the line reads
  the fact: `Short 2 orange · 4 orange, 0 locomotives in hand`. No shake, no buzzer, the `uiRefuse` tick at −12 dB.
- **Double routes:** each lane has its own hit ribbon (§5.8). At 2–3 players, once one lane is taken the other
  shows a 1 px dashed cream outline, and a tap reads `Closed at 3 players · Priya's train runs the other lane.`
- **On commit:** the hand rail folds down (160 ms) so no hand shows during the departure, the paid cards slide
  from the rail's position to the discard edge (public, 280 ms), then the departure (§5.6). Record:
  `Priya's train left Helena for Duluth.` then quietly `+15 · 33 trains left`.

#### 2.4.3 Draw tickets (target 3 clicks)

| Intent | Clicks |
|---|---|
| Keep one | 3: `Tickets`, a poster, `Keep 1` |
| Keep two | 4 |
| Opening, keep two of three | 3 after the cover: two posters, `Keep 2` |

- `Tickets` (a dock word) raises three posters (fewer if the deck is short) from the ticket deck into the hand
  sheet: 360 ms, staggered 70 ms. Nothing is preselected; the commit word reads `Keep at least 1` at 45 % until one
  is chosen, then `Keep 2 · return 1`.
- Tapping a poster toggles it: chosen posters sit 8 px higher with a 2 px cream underline. Holding a poster for
  300 ms rings its two cities on the board in cream (never gold), and releasing clears it.
- Each offered poster carries `about 9 trains` (the shortest remaining cost over your routes and open routes;
  setting `Ticket hints`, default on).
- On commit: kept posters settle into the sheet (300 ms), returned ones slide back under the deck (300 ms).
  Record: `Sam kept 2 tickets and returned 1.`

#### 2.4.4 A typical human turn, totalled

Two, two or three clicks, **0 s forced waiting**. Whatever animation is running, the next click finishes it
(≤ 1 frame to settled, the settle sound only) and then does what was clicked. An evening with 2 humans and 2 AIs
is about 45–60 min; 4 humans about 60–75 min (estimate; `sim.ts` measures turns per game, §7.1).

### 2.5 The hand (private)

- **Hand rail**, in the dock's right half, only for the current human and only after `I'm Sam`: nine chips 48×44
  in fixed order (red, orange, yellow, green, blue, purple, black, white, locomotive), each the card's hue with its
  glyph and a 20 px count; zeros at 30 %. To its right: `Tickets 3` (the private sheet) as a word.
- **The sheet** opens on `Tickets 3` or `H`: a sheet of paper rises from the dock (220 ms) over the lower 45 % of
  the map, holding the posters 132×198 in a row (up to 8, then a horizontal scroll) and, above them, the carriage
  cards at 1.5× the rail size. The upper map stays visible. Any board tap, Esc or `H` closes it (140 ms); it is
  also closed whenever a turn ends.
- **Posters** (§2.8) show their painting, the hero city in 30 px caps, and `DULUTH · HOUSTON · 8` in 13 px caps.
  States: open (plain, with the hint), completed (a round punch hole 14 px through the lower right corner, with
  a paper shadow), cancelled (the stamp).
- Never in the rail or the sheet: other seats' anything.

### 2.6 The hand-off cover (a dock state, not an overlay)

- Fires when the incoming seat is human, 2+ humans sit, and the setting `Hide hands between turns` is on
  (**default on** with 2+ humans; with one human it never fires).
- It is the dock only. The board stays fully visible and unblurred; the market and roster stay public. The hand
  rail and the sheet are unmounted in the **same frame** the previous turn ends (at commit, §2.4.2), and the next
  hand is never rendered until `I'm Sam` is pressed. The `handoff` gate samples every frame and every DOM mutation
  for hand content (§7.3).
- Dock during the cover: title `PASS TO SAM` (cream, the seat's finish roundel 24 px before it), line: up to three
  departures since Sam's last turn, past tense, 15 px, one per line on the band's two rows
  (`Priya's train left Helena for Duluth. · Cobalt's train left Denver for Omaha.`), or `A quiet round.` Right:
  `I'm Sam` in gold (Enter or Space). Never mentioned: tickets, cards drawn, anything about Sam's hand.
- Order: Priya's departure plays in full in front of the room, AI turns play as reels (§2.7), then the cover for
  the next human. Pressing `I'm Sam` fades the cover words (200 ms), and the hand rail rises (160 ms).
- On resume after a reload, the game always lands on the cover for the current human.

### 2.7 AI turns as highlight reels

Weight follows stakes: claims are the show, draws are headlines.

| AI action | Beat at `watch` | Budget |
|---|---|---|
| Think, before the first action | nothing moves | 250 ms |
| Draw two | each taken card departs the siding up to that seat's roster slot (380 ms), refill slides in (260 ms); 150 ms between | ≤ 1.3 s |
| Claim | the route turns gold and the title names it for 400 ms (the telegraph), then the full departure | ≤ 0.65 s + departure |
| Tickets | poster backs rise off the ticket deck (300 ms) and settle toward the roster slot or return (300 ms) | ≤ 1.2 s |

- AI turn at `watch`: **median ≤ 2.5 s, p95 ≤ 3.6 s** (a six-car claim is 0.65 + 2.28 = 2.93 s). A round of four
  AI turns ≤ 12 s.
- `fast` = every AI beat at 0.5×, departures at 0.6× (the whistle lead stays 350 ms). `skip` = a 250 ms beat per
  AI turn, departures slide 300 ms with one clank, never snapped to 0. `instant` (0) exists only for the e2e
  logic lane.
- During a watched turn a click or Space skips the current beat only; it never acts.
- Narration in the dock title: `COBALT` then the claim's `DENVER · OMAHA`; the record line in past tense.
- AI claims of routes do not flash or tell anyone whose ticket they hurt, since tickets are secret.

### 2.8 Tickets as posters, and the stamp found later

- 30 posters, one per ticket, painted by `imagegen` in Phase 0 against frame 3 as the style reference (§8.1,
  agent P). Each paints its **hero city's land and light**, a small train somewhere, no people and no
  landmarks, portrait 2:3, 1024×1536 source, shipped as 264×396 and 528×792 webp. **No lettering in the
  painting**: the caps are set in Jost over a 22 % ink band, so the print stays print. `src/board/posters.json`
  maps ticket id → file, hero city (hand-chosen so the 30 posters spread over as many of the 36 cities as
  possible), and a one-line brief. The poster back: the Departures crest on ink.
- Fallback if a poster fails review: a procedural poster rendered by the board renderer itself from a low camera
  over the hero city at sunset ramp (`render/posterCam.ts`), so a missing painting never blocks a build.
- **The stamp:** `CANCELLED` in 18 px condensed caps inside a 2 px double rule, vermilion ink `#b8412c` at 88 %,
  rotated −8°, with an SVG roughness mask so the ink is uneven. It is print (crisp edges, no blur).
- **Found, never announced:** `ticketCancelled` is a private event (§4). The controller records `seenStamp[seat]
  [ticket] = false`. The first time that seat's sheet is open with the poster visible, the stamp lands: 180 ms
  from 1.3× scale and 0 opacity to 1×, a soft rubber thunk at contact, then it is simply there. The flow
  `cancelled` (§7.3) proves no public surface ever carries it.
- **The punch:** a completed ticket gets its hole with a paper click (140 ms), found the same way.

### 2.9 The end: the light falls, the last train, the scoring, the finished map

1. **Trigger.** A seat ends a turn on 0–2 trains. After that departure settles: record `John had 2 trains left.
   The last round began.` Title for 2.4 s: `THE LAST ROUND`. Then `lightFall` (12 s, §5.7), which never blocks
   input and plays under whatever happens next.
2. **Last round.** Each seat, the trigger seat included, takes one more turn. The roster marks seats that have
   had their last turn with a small `last` at 62 %.
3. **The last train.** When the final turn's departure settles (or the final draw), title
   `THE LAST TRAIN HAS LEFT` in gold, 2.5 s of nothing, clicks ignored for the first 1.5 s only.
4. **Scoring reel** (a sheet on the lower 45 %, per seat in final seat order, tap-through per step):
   route points (already on the roster) → each ticket turned face up in turn, 450 ms each: completed ones lift and
   the path along that seat's trains brightens (a lamp running along the trail, 600 ms) with `+12`; unfinished
   ones get the stamp (Soul question 6) and `−8` → longest line: the trail lights end to end along the owner's
   trains over 1600 ms, `+10`, ties share → total. **≤ 4 s per seat, ≤ 18 s for four.**
5. **Result.** Title `PRIYA · 142` (gold). Line `Priya won with 142. Sam finished 3 of 5 tickets.` The standings
   stay in a two-row table in the dock: seat, routes, tickets `+34 −17`, longest, total.
6. **The finished map.** The sheet folds away (140 ms). The night board is left alone: lamps static,
   searchlights with a ±3° sway over 30 s. `Rematch · New game · Title` are hidden until the pointer moves or
   20 s pass, then fade in at 40 % over 600 ms. `Rematch` is one click with the same seats and a new seed.
7. **End early.** Menu → `End the game now?` (the only confirm besides `New game` over a save): ends with the
   scoring reel as it stands, subline `Called at turn 31`.

### 2.10 New game to first tap (≤ 4 clicks, ≤ 20 s, ≤ 5 s of machine time)

1. **Title** (0 s): the empty golden board, the dock reads `DEPARTURES` in cream, right side `Continue · New game
   · How to play`, the default one gold (Continue when a save exists).
2. **New game** (click 1): a paper sheet over the Pacific half of the map, one row per seat, 2–5 rows: finish
   roundel (tap cycles brass → copper → chrome → gunmetal → cream enamel, unique per table), name field,
   `Human · AI`, and for AI `Easy · Normal · Hard`. `Add a seat`, `×` to remove. One summary line:
   `3 seats · 45 trains each · the second lane of a double closes at 3 seats`. The last setup is remembered.
   `Start` in gold.
3. **Start** (click 2): the sheet falls (140 ms). The deal (≤ 1.8 s): four card backs slide from the deck to each
   roster slot (staggered 40 ms), three poster backs to each (staggered 40 ms). AI seats keep their opening
   tickets instantly (`Cobalt kept 3 tickets.`).
4. **Opening tickets**, each human in seat order: the cover `PASS TO JOHN` (click 3: `I'm John`; with one human
   there is no cover), the three posters rise (360 ms), **first tap on a poster (click 4)**. `Keep 2` finishes it;
   the next human's cover follows. Then seat 1's first turn.

### 2.11 Copy rules

- Records are **past tense**, a full sentence, real names and numbers, ending in a full stop:
  `Sam's train left Helena for Duluth.` · `Sam drew a yellow card and one from the deck.` · `Sam kept 2 tickets
  and returned 1.` · `The deck was reshuffled from 38 discards.` · `John had 2 trains left. The last round
  began.` · `Priya won with 142.`
- Titles are **noun phrases in caps**: `SAM` · `ONE MORE CARD` · `HELENA · DULUTH` · `PASS TO SAM` · `THE LAST
  ROUND` · `THE LAST TRAIN HAS LEFT`.
- Facts and costs are **noun phrases joined by ` · `**: `6 orange · 15 points · 39 → 33 trains` · `Short 2 orange
  · 4 orange, 0 locomotives in hand` · `Closed at 3 players · Priya's train runs the other lane.`
- Controls are one or two words: `Claim` · `Tickets` · `Keep 2 · return 1` · `I'm Sam` · `Rematch`.
- No imperatives outside buttons, no exclamation marks, no poetry, no `Error`, no `Invalid`. Minus is U+2212,
  arrows `→`. Numbers never in display caps weight; always tabular.
- One file, `src/game/copy.ts`, holds every string; `tests/game/copy.test.ts` lints it (§7.1).

### 2.12 Settings, rules card, menu

- `≡` opens a sheet: `Resume · How to play · Settings · End the game now · Title`.
- Settings: AI speed, animation speed (`1× · 2×`), volume (master, music, effects), `Hide hands between turns`,
  `Ticket hints`, `Colour symbols on routes` (a 10 px glyph on each coloured route's middle slot at 55 % ink;
  default on), reduced motion, text size (`1.0 · 1.15 · 1.3`).
- How to play: one static sheet: the three actions (two lines each), claiming and doubles, tickets, the end and
  scoring (1, 2, 4, 7, 10, 15; tickets ±; longest line +10), keys. Esc closes.
- Keys: `1`–`5` market slots, `D` deck, `T` tickets, `H` sheet, Enter the gold commit, Esc clear the pick or close
  a sheet, Space skip the running animation (never commits; ignored for 300 ms after a skip).

### 2.13 Budgets, in one table (each is a gate in §7)

| What | Budget |
|---|---|
| New game → first tap | ≤ 4 clicks; ≤ 5 s machine time (≤ 20 s with human reading) |
| Draw turn / claim turn / tickets turn | 2 (1 for face-up loco) / 2 (3 alt gray) / 3 clicks |
| Forced wait on your own turn | 0 ms |
| Click or key → first visible response | ≤ 50 ms; hover ≤ 1 frame |
| Tap during motion → settled | ≤ 1 frame (≤ 17 ms) plus the settle sound |
| Departure, L cars | 1050 + 205·L ms (L = 1 → 1255, L = 6 → 2280); hard cap 2400 |
| Whistle lead before first motion | 350 ms ± 20 |
| Market take / refill / reset | 320 / 260 / ≤ 900 ms |
| Tickets rise / settle | 360 + 70 stagger / 300 ms |
| AI turn at watch | median ≤ 2.5 s, p95 ≤ 3.6 s; round of 4 AIs ≤ 12 s |
| Light fall | 12 000 ms, non-blocking; input acknowledged ≤ 50 ms during it |
| Scoring reel | ≤ 4 s per seat, ≤ 18 s total; tap-through per step |
| Idle | 0 tweens; print layer unchanged over 10 s; GPU ≤ 4 ms a frame |
| Frame time | p95 ≤ 16.7 ms at 1920×1080 DPR 1 during a departure; worst ≤ 50 ms on the first departure after a cold load |

---

## 3. Stack and architecture

### 3.1 Stack

**Vite 8 + TypeScript + three.js (WebGL2), vanilla DOM for the UI, Vitest, Playwright, tsx.** Why: it is War
Table's stack, so its lanes, runner, hook patterns and the fleet's habits port over without translation; three.js
is where Opus 5.5 is strongest (custom toon shaders, instancing, light); the UI is words on hairlines, which
wants DOM text for crispness and testability, not a framework. No React: the dock is patched in place like
`strip.ts`. Build-time only: `d3-geo`, `topojson-client`, `world-atlas` (the land outline), `sharp` (poster and
relief packing). Runtime deps: `three`, `@fontsource-variable/jost` (and `@fontsource-variable/inter` if the
numeral fallback is needed).

### 3.2 Module boundaries (who may import whom)

```
engine  ← pure. No DOM, no three, no Date.now(), no Math.random(). Imports board data only.
board   ← pure data: cities, routes, tickets, posters, generated layout. Imports nothing.
ai      ← pure. Imports engine + board. Sees only a PublicView + its own hand and tickets.
game    ← controller. Imports engine, ai, board, shared. Talks to render/ui/audio only through the contracts.
render  ← three.js. Imports board layout, shared, and the BoardView contract. Never engine state directly;
          it receives a BoardSnapshot.
ui      ← DOM. Imports the ViewModel contract, shared, copy (via the VM). Never engine.
audio   ← WebAudio. Imports cues contract and shared/timing.
shared  ← palette, timing, tiny math. Imports nothing.
```

### 3.3 Directory layout

```
departures/
  index.html · package.json · tsconfig.json · vite.config.ts · vitest.config.ts
  data/geo/            lakes.json (Great Lakes, Great Salt Lake, Lake Winnipeg, authored ~40 pts each)
                       ridges.json (Cascades, Sierra, Rockies, Wasatch, Ozarks, Appalachians, Laurentians splines)
                       warp.json (≤ 8 control points that spread the Northeast for labels)
                       biomes.json (forest/plain/desert/wetland polygons, coarse)
  scripts/             build-relief.ts · build-map.ts · stub-layout.ts · posters.ts · sim.ts · e2e.ts
                       verify-audio.ts · perf.ts
  public/relief/       height-2048.png · biome-2048.png · coast-sdf-2048.png · forest-points.bin · relief.json
  public/posters/      <ticketId>-264.webp · <ticketId>-528.webp · back-264.webp
  _claude/posters-src/ imagegen candidates and picks (not shipped)
  src/
    main.ts            boot: fonts, contracts wired, title screen
    engine/            types.ts (CONTRACT) · rng.ts · setup.ts · rules.ts · reducer.ts · tickets.ts ·
                       longest.ts · scoring.ts · views.ts (publicView, handView) · validate.ts · index.ts
    board/             layout.ts (CONTRACT: layout types) · usa.ts (cities with lat/lon, 100 lanes, 30 tickets) ·
                       posters.json · usa.layout.json (generated by build-map.ts)
    ai/                index.ts (chooseAction) · plan.ts (ticket paths) · draw.ts · claim.ts · tickets.ts ·
                       levels.ts (Easy, Normal, Hard weights)
    game/              controller.ts · viewModel.ts (CONTRACT: VM + UiIntent types) · vm.ts (builds the VM) ·
                       beats.ts (event → Beat composer) · reel.ts (AI pacing) · copy.ts · explain.ts ·
                       payment.ts · departure.ts · privacy.ts · storage.ts · metrics.ts · hooks.ts (__dep)
    render/            BoardView.ts (CONTRACT) · index.ts (BoardView impl) · scene.ts (renderer, passes) ·
                       camera.ts · light.ts · picking.ts · posterCam.ts · quality.ts
      land/            relief.ts · toon.glsl.ts · brush.ts · forest.ts · water.ts · sky.ts · shafts.ts ·
                       printMask.ts
      print/           slots.ts · slot.glsl.ts · cities.ts · names.ts (DOM overlay) · highlights.ts
      trains/          model.ts · finishes.ts · motion.ts · steam.ts · lamps.ts
    ui/                dom.ts · tokens.css · styles.css · frame.ts · dock.ts · roster.ts · market.ts ·
                       hand.ts (rail + sheet) · poster.ts · stamp.ts · cover.ts · sheet.ts · settings.ts ·
                       rulesCard.ts · screens/title.ts · screens/newgame.ts · screens/scoring.ts
    audio/             cues.ts (CONTRACT) · engine.ts · mixer.ts · synth/whistle.ts · synth/chug.ts ·
                       synth/clank.ts · synth/cards.ts · synth/stamp.ts · bed.ts (strings, wind, birds, night)
    shared/            palette.ts (CONTRACT) · timing.ts (CONTRACT) · ease.ts · oklab.ts
  tests/
    engine/*.test.ts · board/*.test.ts · ai/*.test.ts · game/*.test.ts · render/*.test.ts (pure helpers only)
    e2e/lib.ts · e2e/lanes.ts · e2e/<flow>.e2e.ts · e2e/screens.ts · e2e/squint.ts
  docs/                PLAN.md (this, once chosen) · RULES.md · plans/
  artifacts/<area>/    screenshots and reports (not committed beyond the latest sweep)
```

### 3.4 Contract files (lead writes them in Phase 0; additive optional fields only after)

| File | Holds |
|---|---|
| `src/engine/types.ts` | `CardColor`, `RouteColor`, `Seat`, `GameState`, `GameAction`, `GameEvent` (§4.1), `ActionResult`, `TicketStatus`, `Standing` |
| `src/board/layout.ts` | `CityLayout {id, world:[x,y,z], labelAnchor, labelSide}`, `LaneLayout {routeId, lane, spline: [x,y,z][], slots: {pos, dir, len}[], hitRibbon}`, `BoardLayout` |
| `src/render/BoardView.ts` | the renderer's interface (§4.3) and `BoardSnapshot`, `PickVM`, `BoardStats` |
| `src/game/viewModel.ts` | `GameVM` (dock, roster, market, hand?, cover?, sheet?, scoring?), `UiIntent` (§4.4) |
| `src/shared/timing.ts` | every ms constant in §2.13 and §5, by name; speed multipliers |
| `src/shared/palette.ts` | ink, cream, gold, mat; the eight route and card hues; five finishes (PBR-ish toon params); light ramps for `golden` and `night` |
| `src/audio/cues.ts` | cue names and their parameters (§4.5) |

### 3.5 Pure helpers the room depends on (owner in brackets)

- `departureEnd(state, seat, routeId) → {from, to}` [game]: the end touching the seat's network; if both or
  neither, the end nearer the seat's nearest open ticket city; then the western end.
- `defaultPayment(hand, route) → CardCounts` and `paymentOptions(hand, route)` [game].
- `ticketStatus(state, seat, ticketId) → 'open' | 'complete' | 'cancelled'` [engine, `tickets.ts`]: complete =
  connected by the seat's routes; cancelled = the cheapest completion over own routes (cost 0) and routes still
  claimable by this seat (cost = length) exceeds the seat's trains left, or no such path exists.
- `ticketDistance(state, seat, ticketId) → number` [engine]: that same cheapest cost, for the hint.
- `longestTrail(routes) → {length, routeIds}` [engine, `longest.ts`]: exact edge-trail search; returns the ids so
  the scoring reel can light it.
- `explain(state, vm, target) → {ok, code, text}` [game]: every refusal line in §2.4.
- `publicView(state)` and `handView(state, seat)` [engine, `views.ts`]: the only things AI and UI may read.

---

## 4. Event vocabulary

Three layers, each with one owner: the engine says what happened (events), the controller decides how the room
sees it (beats), the renderer/UI/audio perform it. UI speaks back only in intents.

### 4.1 Engine → controller: `GameEvent` (in `src/engine/types.ts`)

Full information; privacy is applied by the controller (`game/privacy.ts`), never by leaving data out.

| Event | Fields | Visibility |
|---|---|---|
| `gameStarted` | seed, seats, firstSeat | public |
| `cardsDealt` | seat, cards | owner (count public) |
| `ticketsOffered` | seat, ticketIds, minKeep, opening | owner (count public) |
| `ticketsKept` | seat, kept, returned | owner (counts public) |
| `turnStarted` | seat, turn, round, lastRound | public |
| `cardDrawn` | seat, source `'deck' \| 0..4`, card, drawIndex `1 \| 2`, endsTurn | public if face-up, else owner |
| `marketRefilled` | slot, card | public |
| `marketReset` | discarded[5], dealt[5] | public |
| `deckReshuffled` | count | public |
| `routeClaimed` | seat, routeId, payment, points, trainsLeft | public |
| `laneClosed` | routeId (the sibling closed at 2–3 seats) | public |
| `ticketCompleted` | seat, ticketId | owner |
| `ticketCancelled` | seat, ticketId | owner |
| `finalRoundTriggered` | seat, trainsLeft | public |
| `turnEnded` | seat | public |
| `gameOver` | standings (routes, per-ticket results, longest trail ids, totals, rank, tie-break used) | public |

`ActionResult = {ok: true, state, events} | {ok: false, code, text}`. The UI pre-validates through `explain()`, so
the error branch is a fallback only.

### 4.2 Controller → presentation: `Beat` (in `src/game/beats.ts`, types in `viewModel.ts`)

Every beat carries `id`, `seat`, `visibility: 'public' | 'owner'`, `style: 'full' | 'brief' | 'snap'` and a
precomputed `durMs`, so audio can be scheduled on contact frames before motion starts.

| Beat | From events | Performed by |
|---|---|---|
| `departure {routeId, lane, finish, from, to, length}` | routeClaimed | render (train), audio (whistle, chug, clank), ui (title, record) |
| `pay {cards}` | routeClaimed | ui (paid cards leave the rail to the discard edge) |
| `marketTake {slot, card, toSeat}` / `deckTake {toSeat, card?}` | cardDrawn | ui (siding), audio (tick) |
| `marketRefill {slot, card}` / `marketReset` / `reshuffle` | marketRefilled / marketReset / deckReshuffled | ui, audio |
| `ticketsRise {count}` / `ticketsSettle {kept, returned}` | ticketsOffered / ticketsKept | ui (sheet or roster-bound backs) |
| `stampDue {ticketId}` / `punchDue {ticketId}` | ticketCancelled / ticketCompleted | ui, only when the owner's sheet shows it |
| `handoff {toSeat, since: Record[]}` | turnEnded → next human | ui (cover) |
| `turnBegin {seat}` | turnStarted | ui (roster, title) |
| `lastRound {seat}` then `lightFall {ms}` | finalRoundTriggered | ui (title), render (light), audio (bed crossfade) |
| `lastTrain` | gameOver | ui, audio |
| `scoreStep {seat, kind: 'ticket' \| 'longest' \| 'total', ticketId?, delta, routeIds?}` | gameOver | ui (sheet), render (path light), audio |
| `record {text}` | all public events | ui (the line) |

Blocking: the controller awaits `departure`, `marketReset`, `ticketsSettle`, `lastTrain`, `scoreStep` before the
next input is **applied**, but never before it is **accepted**: an input during a blocking beat calls `skip()`,
waits for the drain (≤ 1 frame), then applies. `lightFall`, `record`, `marketTake`, `turnBegin` never block.

### 4.3 Renderer interface (`src/render/BoardView.ts`)

```
mount(container, layout, snapshot): Promise<void>     // builds passes; resolves when first frame is drawn
syncState(snapshot: BoardSnapshot): void               // claims {routeId, lane, finish}, light 'golden'|'night'
setPick(pick: PickVM | null): void                     // routeId, lane, goldId; recedes other slots
setCityRings(cities: CityId[] | null): void            // ticket hold-to-see (cream)
playDeparture(beat, opts): Promise<void>
playPathLight(routeIds, finish, ms): Promise<void>     // scoring: ticket path, longest trail
startLightFall(ms): void                               // non-blocking; idempotent
skip(): void                                           // settle everything now
setSpeed(mult: number): void                           // 1, 2, 0.5 (fast AI), 0 (tests)
setInsets({top, right, bottom, left}): void            // top band, dock, market column
onRoutePointer(cb) · onEmptyPointer(cb)                // pick / clear; hover included
cityScreen(): Record<CityId, {x, y}>                   // for anything the UI anchors
setQuality(level: 0 | 1 | 2 | 3): void
stats(): BoardStats                                    // fps, frameMsP95, activeTweens, printHash, departures[]
```

### 4.4 UI → controller: `UiIntent`

`pickRoute {routeId, lane}` · `clearPick` · `choosePayment {colour}` · `claim` · `drawMarket {slot}` ·
`drawDeck` · `drawTickets` · `toggleTicket {id}` · `keepTickets` · `openSheet` · `closeSheet` · `holdTicket
{id | null}` · `confirmSeat` · `skip` · `openMenu` · `setSetting {key, value}` · `newGame {config}` ·
`continue` · `rematch` · `endNow`.

### 4.5 Audio cues (`src/audio/cues.ts`)

`whistle {distance 0..1, pan}` · `chug {startHz, endHz, durMs}` · `clank {cars, stepMs}` · `steamHiss` ·
`cardTick` · `railTick` · `riffle` · `posterRustle` · `stamp` · `punch` · `uiPress` · `uiRefuse` · `bed
{scene: 'golden' | 'night', fadeMs}` · `lastTrain`. Sound fires on the contact frame (±30 ms), scheduled from
`AudioContext.currentTime`.

---

## 5. Rendering

### 5.1 The map, the projection, the camera

- **Geography:** real latitude and longitude for all 36 cities (the board includes southern Canada), land from
  `world-atlas` 50m clipped to lon −127…−64, lat 24…53, lakes from `data/geo/lakes.json`.
- **Projection:** Lambert conformal conic, standard parallels 33° and 45°, central meridian −96°, then the
  poster warp (`warp.json`, ≤ 8 radial basis control points, ≤ 18 % displacement) that spreads the Northeast so
  Boston, New York, Washington, Pittsburgh, Toronto and Montréal get label room. Land and cities warp together:
  the poster exaggerates, it never lies about neighbours.
- **Relief:** `build-relief.ts` bakes a 2048² height field from `ridges.json` splines (Gaussian ridge profiles +
  domain-warped noise, peak exaggeration so the Rockies read at ~2.5 % of map width), a biome map, a coast SDF
  and forest scatter points. The mesh is a 512×320 grid, displaced in the vertex shader.
- **Camera:** perspective, FOV 24°, elevation 56° above the map plane, looking north, no azimuth, no roll.
  Fitted so the continent's bounding box fills the map area (inside the top band, dock and market column) with a
  3 % margin. **It never moves**, and there are no orbit, pan or zoom controls. (No camera code path exists
  beyond fit-on-resize.)
- **Slot sizes, checked by `build-map.ts` at 1280×800:** every slot ≥ 30 px long, 11 px wide, 3 px gaps; double
  lanes 3 px apart; every route's hit ribbon ≥ 18 px wide (doubles split at the midline). The build fails if any
  route falls short, and the warp is tuned until it passes.

### 5.2 Two passes: paint, then print

1. **Land pass** (painterly): relief, forests, water, sky edge, cloud bank, shadows, shafts, steam. Rendered to a
   render target at 1.0× (0.75× at quality L1, 0.5× at L0), with a soft bloom on highlights above 0.85 luminance
   (threshold, radius 12 px at 1280). **No** grain, vignette, chromatic aberration or lens flare, ever.
2. **Print pass** (crisp): route slots, city roundels, trains, pick highlights. Full DPR, MSAA 4×, drawn after the
   land composite, depth-tested against its own layer only, **never** post-processed and **not lit by the
   scene's light** (slots and roundels are flat colour; trains use their own toon light rig).
3. **DOM layer**: city names (§5.5), the frame, the bands, the market, the sheets.

The **print mask** (`land/printMask.ts`): a 1024² texture of every slot, roundel and name footprint dilated by
10 px (screen-scaled at fit), fed to the land shaders, which within it clamp brush amplitude to 15 %, cull forest
instances, and pull value toward the local mean. So the land is quiet exactly where routes run (DIRECTIONS §4A's
guard), and nothing painterly touches print.

### 5.3 The land: cel-shaded 2.5D, painterly surfaces

- **Toon ramp:** `N·L` against the fixed sun quantised into 4 bands with 0.04-wide smoothstep edges; each biome
  has its own 4-colour ramp from `palette.ts` (plains: cream → wheat → apricot shadow → lavender; ranges: rose
  gold → mauve → lavender → indigo; forest: yellow-green → pine → deep teal → blue-black; desert: coral → ochre
  → plum). Warm against cool.
- **Brushwork:** band thresholds are modulated by a world-space brush field (`land/brush.ts`): elongated stroke
  stamps oriented along the slope aspect, 3 scales, baked once at boot into a 2048² texture. Band edges become
  brushy; inside a band a ±4 % value jitter follows the strokes. This is the Life is Strange surface; it lives in
  the land only.
- **Rim light:** a warm rim (`#ffd79a`) on silhouettes facing the sun, width by `pow(1 − N·V, 3)`; strongest on
  ridges and forest crowns.
- **Shadows:** one 2048² directional shadow map, rendered once (the sun is still) and again only during the light
  fall. Long shadows east of the ranges.
- **Forests:** instanced conifers (3-tier cone, 24 tris, toon-shaded with rim, 2 bands), ≤ 40 000 instances from
  `forest-points.bin`: dense in the Pacific Northwest, northern Rockies, the Great Lakes, the Appalachians and the
  Southern pine belt; culled inside the print mask. At quality L0 they collapse to a canopy texture.
- **Water:** depth ramp (coast shelf light teal → deep blue-teal), lakes deep teal, a static golden glint band on
  the Pacific under the sun. No waves, no shimmer.
- **Sky edge and cloud bank:** at the map's far (north-west) edge, a backlit cloud bank over the Pacific: 6–10
  layered cloud cards with the toon ramp and a hot rim, static.

### 5.4 Idle motion: only the light

Three to five sunbeam shafts (`land/shafts.ts`): additive screen-aligned wedges from the sun's direction with
soft edges, masked to land and water (never over the bands or the market), intensity drifting on independent sine
periods of 40–70 s at ±12 %. That is all that moves while idle. The land pass is cached in a render target and the
shafts composite on top, so idle costs one composite a frame. `stats().activeTweens` is 0 at idle and the print
pass hash (`printHash`) is unchanged.

### 5.5 Print: slots, roundels, names

- **Unclaimed slot:** a rounded-rect SDF (r 3 px) drawn with a 2.5 px outline in the route hue, a 1 px ink
  keyline outside it, and inside a cream wash at 30 %. Gray routes: warm gray-cream outline `#b8b0a2`. Hues are
  in `palette.ts` and tuned against the land (starting values: red `#c8372d`, orange `#e27a1f`, yellow `#f2c230`,
  green `#3f8f45`, blue `#2f6fb8`, purple `#b0508f`, black `#1d1d22`, white `#f4f1ea`); the squint gate (§7.4)
  decides the final values.
- **Closed lane (2–3 seats):** 1 px dashed cream outline, no wash.
- **Colour symbols:** the carriage glyph from the cards, 10 px, 55 % ink, on each coloured route's middle slot.
- **City roundel:** cream disc Ø 14 px with a 2 px ink ring; it draws above trains, so trains emerge from under it.
- **Names:** DOM, Jost 600 caps 14 px (19 px at 1920×1080), tracking 0.08 em, cream with a 2 px ink halo
  (`text-shadow`), anchored per `labelAnchor/labelSide` from `build-map.ts`, which also resolves collisions (a
  name never covers a slot or roundel; it steps down to 12 px before moving farther out).
- **Night:** print does not darken. Slot washes drop to 18 % and outlines stay full hue, so colour, length and
  owner still read in the last round.

### 5.6 Trains: finishes, the departure

- **Models** (procedural, `trains/model.ts`): carriage ≈ 200 tris (rounded roof, window strip, bogies), locomotive
  ≈ 600 tris (boiler, stack, cab, cowcatcher). Footprint = slot inset 1 px; height ~6 px at 1280. Instanced per
  finish. A claimed route of length L is a locomotive at the arrival end and L − 1 carriages.
- **Finishes** (`trains/finishes.ts`, never hue-coded): distinct by value, sheen and trim, so they read in
  greyscale.

  | Finish | Body value (L*) | Sheen | Trim |
  |---|---|---|---|
  | Brass | 72 | wide warm specular band | dark green windows |
  | Copper | 52 | medium, red-warm band | ink windows |
  | Chrome | 82 | tight bright white highlights, dark reflections | ink windows |
  | Gunmetal | 30 | low, cool | cream window strip |
  | Cream enamel | 90 | matte | ink trim band along the roof |

  Toon lighting with 3 bands plus the sheen band and a hard rim; the roster roundel is a render of the same
  material.
- **The departure** (`trains/motion.ts`), at 1×:

  | t (ms) | What happens |
  |---|---|
  | 0 | `whistle` (far: low-passed, pan by the departure city's x). Title and record swap in. Nothing moves. |
  | 350 | The locomotive's nose passes out from under the departure roundel. `chug` starts at 2.2 Hz. Steam puffs from the stack every chug. |
  | 350 → 350 + T | Travel along the lane's spline, T = 700 + 160·L. Speed: easeInQuad for the first 30 % (the slow first beat), cruise, easeOutCubic for the last 25 %. Each car follows with spring slack (3 % of a car's length), so the pull-out ripples back through the couplings. Chug climbs to 5 Hz and slows with the brake. |
  | 350 + T | The locomotive reaches the arrival slot. `clank` ripple front to back, 45 ms a car; each car settles 1 px into its slot on its clank. `steamHiss`. |
  | 350 + T + 45·L | Settled. Score and trains-left count on the roster tick (+15). Steam thins and drifts east over 2.5 s (it never blocks). |

- **Steam** (`trains/steam.ts`): brush-alpha sprites, two toon bands (lit cream, lavender shadow), rising and
  drifting downwind, growing 1 → 2.4× and fading over 2.5 s, ≤ 60 alive. Drawn above the land, below the
  print, except that it is also drawn over print at an alpha capped at 35 % (Soul question 5).
- **Skip:** a tap mid-departure places all cars in their slots in the same frame, plays one `clank`, and emits one
  puff that thins over 600 ms.

### 5.7 The light falls once (`render/light.ts`)

`light.ts` holds two states, `golden` and `night`, and a single parameter `t ∈ [0, 1]`; every land and train
uniform is a function of `t`, lerped in OKLab. `startLightFall(12000)` animates `t` with easeInOutSine:
sun elevation 14° → −6°; the ramps slide to night palettes (indigo, teal, blue-black, lavender edges); shafts fade
out over the first 4 s; the cloud bank loses its gold rim and takes a faint moon edge; water darkens; coasts gain a
pale 1 px line from the coast SDF (frame 4's faint coasts); from t = 0.55 the lamps come up: a warm 2700 K
emissive in the window strip of every claimed carriage, and a warm point in every city that at least one claimed
route touches (the railroad lit them; the rest stay dark roundels); from t = 0.7 two static searchlights at New
York fade in, swaying ±3° over 30 s. The shadow map re-renders each frame only while `t` moves. Bloom threshold
drops to 0.7 at night so the lamps glow slightly; print is still untouched.

### 5.8 Picking and hover

Raycast against flat, un-displaced hit ribbons (one per lane, ≥ 18 px wide), so relief and trains never change
what is under the pointer. Hover (desktop): the lane's outline gains 0.5 px and the dock line shows
`Helena · Duluth · 6 orange · 15 points` in quiet cream (not gold). Click = pointer up within 6 px and 350 ms of
pointer down. Cursor `pointer` over lanes. A tap on empty land clears the pick. No drag, no zoom.

### 5.9 Quality ladder and performance

`quality.ts`: L3 (default on M-series and discrete GPUs) everything; L2 forests at half density, shafts at half
resolution; L1 land pass at 0.75×, no bloom; L0 land at 0.5×, canopy texture, no shafts. Stepped down when
`frameMsP95` > 18 ms over 3 s; never stepped up mid-game. Print is at full DPR on every level. Budgets: idle ≤ 4
ms GPU; departure frame ≤ 12 ms at 1920×1080 DPR 1 (L3); boot to first frame ≤ 2.5 s.

---

## 6. Rules coverage and `docs/RULES.md`

### 6.1 How RULES.md is pinned

- Header: edition (Ticket to Ride, USA, official 2015 English rulebook), the source URLs Iron Atlas cites (its
  `docs/RULES.md`), and "verified against" with a date. Rules are paraphrased in plain English, never quoted at
  length.
- Every rule has an id `R##`, a one-line statement, its rulebook page, and the name of the unit test that proves
  it (`test('R13 a face-up locomotive cannot be the second card')`). A board test fails if any `R##` in RULES.md
  lacks a test with that prefix, or any test cites an id RULES.md lacks.
- Things the rulebook does not settle are `IR##` (implementation resolutions), each marked as such and tested the
  same way.
- A data section records the counts `tests/board/usa.test.ts` asserts.

### 6.2 The rule list

| Id | Rule |
|---|---|
| R01 | 110 carriage cards: 12 of each of 8 colours, 14 locomotives. |
| R02 | 45 trains per player; 2–5 players. |
| R03 | Each player is dealt 4 carriage cards; 5 are turned face up. |
| R04 | 30 destination tickets; each player is dealt 3 and keeps at least 2; the rest go to the bottom of the deck. |
| R05 | Three face-up locomotives at any time: discard all five and deal five new; repeat as needed. |
| R10 | On a turn a player does exactly one: draw carriage cards, claim a route, or draw tickets. |
| R11 | Draw two cards, each from the face-up five or the deck; a face-up card is replaced before the next draw. |
| R12 | A face-up locomotive taken as the first card is the only card that turn. |
| R13 | A face-up locomotive cannot be the second card. |
| R14 | A locomotive drawn blind counts as one card. |
| R15 | When the deck runs out, the discards are shuffled into a new deck. |
| R20 | Claim by playing cards equal to the route's length, all one colour; locomotives are wild. |
| R21 | A gray route takes any single colour. |
| R22 | A player needs trains at least equal to the length. |
| R23 | Any open route may be claimed; it need not connect to your own. |
| R24 | One route per turn, claimed whole. |
| R25 | 4–5 players: both lanes of a double may be claimed, by different players. |
| R26 | 2–3 players: once one lane of a double is claimed, the other is closed. |
| R27 | No player may claim both lanes of a double. |
| R28 | Route points on claiming: 1, 2, 4, 7, 10, 15 for lengths 1–6. |
| R29 | Cards played go to the discard. |
| R30 | Drawing tickets takes 3 (fewer if fewer remain); keep at least 1; returned tickets go to the bottom. |
| R31 | Tickets are secret until the end; there is no limit on tickets held; kept tickets cannot be discarded. |
| R32 | With no tickets left, tickets cannot be drawn. |
| R40 | When a player ends a turn with 0, 1 or 2 trains, every player, that player included, takes one final turn. |
| R41 | A ticket is complete if the player's own routes connect its cities: + its value; otherwise − its value. |
| R42 | Longest continuous path: 10 points, shared by ties; a path may loop and revisit cities but not reuse a route. |
| R43 | Highest total wins; tie → most completed tickets; then → holder of the longest path bonus. |
| IR01 | First player: seat 1 (the rulebook's "most experienced traveller" has no digital equivalent). |
| IR02 | A market that cannot avoid three locomotives after 3 resets stays as dealt (bounded loop). |
| IR03 | A second draw with no legal source (empty deck, only locomotives face up) ends the turn. |
| IR04 | A player with no legal action at all passes (Iron Atlas's `pass`). |
| IR05 | A tie after both tie-breakers is shared. |
| IR06 | `cancelled` is a presentation status only (§3.5); it changes no score until the end. |

### 6.3 How it is proven

- Every `R`/`IR` has at least one Vitest case in `tests/engine/rules.test.ts` or `tests/engine/scoring.test.ts`.
- Iron Atlas's test list (read above) is the checklist of edge cases to port as *scenarios*, not code: seeded
  setup repeatable and serialisable; opening keeps; ticket draw with fewer than three; face-up and blind
  locomotive draws; three-locomotive resets and bounded refill; deck recycle and an unavailable second draw;
  gray and colour payments with locomotives; double routes by seat count; exactly one final turn each; ticket
  completion ignores opponents; longest trail with cycles and revisits against an exhaustive search; tie-breaks;
  pass only when nothing is legal; save validation rejects tampering.
- **Differential check (`tests/engine/diff.test.ts`):** for 300 random claim sets, our `longestTrail` and ticket
  completion must equal Iron Atlas's `longestRoute` and `isTicketComplete`, imported read-only by relative path
  in the test only (dev-only; if the import is awkward, its algorithm is re-run from a vendored copy under
  `tests/fixtures/`, not shipped).
- **Board data (`tests/board/usa.test.ts`):** 36 cities, 30 tickets with Iron Atlas's values (e.g. Los Angeles–New
  York 21, Seattle–New York 22), 100 lanes, doubles grouped with equal lengths, route count per colour recorded,
  a connected graph, every city with a lat/lon inside the relief box. Any count that differs from Iron Atlas is
  reconciled against the physical board and noted in RULES.md.

---

## 7. Tests and gates

### 7.1 Unit (Vitest, `npm test`)

- **engine:** every R/IR (§6.3); `ticketStatus` fixtures (complete, open, cancelled by severed path, cancelled by
  trains left, and never cancelled by an opponent's claim on a lane you do not need); `publicView` never exposes a
  hand, the deck order or tickets; `validate` rejects malformed saves; a seeded 5-seat game is deterministic.
- **ai:** Easy, Normal and Hard each finish 200 seeded games at every seat count 2–5 with only legal actions;
  decisions do not change when hidden information is shuffled (hands, deck order, other tickets); a second draw
  never takes a face-up locomotive; opening keeps meet the minimum. Strength, from `sim.ts` at 3 seats over 300
  games: Hard beats Normal ≥ 60 %, Normal beats Easy ≥ 70 %.
- **sim report** (`npm run sim`): turns per game by seat count, AI turn length, and **how often a stamp lands**:
  target ≥ 1 cancelled ticket for some human-equivalent seat in ≥ 40 % of 4-seat games. Below that, Soul question
  2 goes back to John with the number.
- **game:** `departureEnd`, `defaultPayment`, `paymentOptions`, `explain` covers every refusal code with its
  exact line; beats composer (events → beats) including privacy: no `owner` beat reaches a non-owner VM; the
  stamp's `seenStamp` bookkeeping survives save/resume; light uniforms at turn 1 equal turn 40 in a seeded game
  (the day-cycle guard).
- **copy lint** (`tests/game/copy.test.ts`): every record renders a sentence ending in `.` whose verb is in the
  past-tense allow list (`left, drew, kept, returned, had, began, was, won, finished, ran`); no `!`; no
  `Error`/`Invalid`; titles are caps noun phrases; no string outside `copy.ts` in `src/ui` (grep).
- **render (pure):** `build-map.ts` slot-size assertions; finish greyscale separation (pairwise ΔL* ≥ 8, or the
  sheen signature differs) from `palette.ts`.

### 7.2 Test hooks (`window.__dep`, only with `VITE_E2E=1`)

`state()`, `vm()`, `intent(i)`, `seed(n)`, `setSpeed(board, ai)`, `metrics()` (forcedWaitMs, clickToVisible[],
departures[{L, ms}], aiTurns[], lightFall, scoring), `frames()` (per-frame log: activeTweens, printHash, visible
cars per departing route, gold ids), `stamp(seat)` (the private stamp record), `scenario(name)` (loads a fixture:
`moment-turn-30`, `last-round`, `market-three-locos`, `double-3p`).

### 7.3 E2E flows and lanes (`tests/e2e/lanes.ts`, War Table's model)

Logic lane runs in parallel at instant speed unless `realtime`; timing lane runs one flow at a time on an idle
machine, cold Chromium per open. Playwright from node with
`chromium.launch({ args: ['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--mute-audio'] })`.

| Flow | Lane | What it asserts |
|---|---|---|
| `start` | timing, quick | title → first poster tap ≤ 4 clicks, machine time ≤ 5 s |
| `tempo` | timing | forced wait 0 over a scripted 12-turn human game; departure ms per L within ±5 % of 1050 + 205·L; whistle lead 350 ± 20; tap-through ≤ 17 ms to settled |
| `reel` | timing | AI turn median ≤ 2.5 s, p95 ≤ 3.6 s at watch; a round of 4 AIs ≤ 12 s |
| `feel` | timing | click → first visible ≤ 50 ms; hover ≤ 1 frame; worst frame ≤ 50 ms on the first departure after cold load; departure p95 ≤ 16.7 ms at 1920×1080 |
| `idle` | timing | 10 s idle: activeTweens 0, printHash constant, only shaft uniforms change; GPU frame ≤ 4 ms |
| `dusk` | timing | light fall 12 s ± 3 %, fires exactly once per game; a claim made during it acknowledged ≤ 50 ms |
| `gold` | timing | per-frame sampler over a real turn: all gold pixels in DOM and canvas belong to one `data-gold` id |
| `moment` | logic, realtime | `moment-turn-30`: Priya claims Helena–Duluth; per frame, visible car count never decreases and the first car's first visible pixel is inside Helena's roundel mask (nothing pops); screenshots at 0, 350, 900, 1600 ms and settled |
| `handoff` | logic, realtime | zero frames and zero DOM mutations carrying the next seat's hand before `I'm Sam`; the cover's text never includes ticket or card data |
| `cancelled` | logic, realtime | a scripted cut: no public DOM node, record, cover line or AI narration carries the ticket id or "CANCELLED"; the stamp appears only when the owner opens the sheet, animates once, is static on the second open |
| `victory` | logic, realtime | last train → reel ≤ 18 s → the finished map: menu words absent for 20 s without pointer movement; `Rematch` one click |
| `smoke` | logic, quick | title, new game with 5 seats, first turn |
| `turn` | logic, quick | the three turns by clicks, with every refusal line from `explain` |
| `rules-ui` | logic | face-up loco first ends the turn; second-draw loco refused; gray payment words; double lane closes at 3 seats and stays open at 4 |
| `opening` | logic | sequential opening choices with covers; AI keeps instant |
| `resume` | logic, quick | reload mid-draw lands on the cover and still owes the second card; reload mid-tickets restores the offer |
| `autoplay` | logic | all-AI 5-seat games at each difficulty reach `gameOver` with valid standings |
| `legibility` | logic | the screenshot sweep (§7.4) plus the squint classification |
| `printmask` | logic | land brush amplitude sampled under every slot ≤ 15 %; steam alpha over print ≤ 0.35 |
| `settings` · `rulescard` | logic | every setting applies and persists; the rules sheet opens and closes |

`npm run test:e2e:quick` = `start`, `smoke`, `turn`, `resume`.

### 7.4 Legibility (the couch gate)

- **Sweep** (`tests/e2e/screens.ts` → `artifacts/sweep/`): 1280×800 and 1920×1080 × {title, new game, empty
  golden board, turn with a pick, departure mid-travel, market reset, hand sheet with a stamp, cover, AI reel,
  late golden board with 70 % of routes claimed across 5 finishes, night last round, scoring reel, finished map}.
  The lead looks at every shot before calling a phase done.
- **Squint classification** (`tests/e2e/squint.ts`): downscale each board shot to what a 55" 1080p screen at 3 m
  resolves (factor 0.45) and a 14" laptop at 1.5 m (factor 0.6); sample every unclaimed slot's centre and
  classify it to the nearest of the nine route colours in OKLab: **100 % correct** at golden and at night; sample
  every claimed train and classify its finish from greyscale: **100 % correct**; every city name's contrast
  against its halo ≥ 4.5:1; the title bar ≥ 38 px (51 px at 1080p) and roster scores ≥ 20 px (27 px). Rerun under
  deuteranopia and protanopia simulation: slots may misclassify by hue only if the colour glyph is on.

### 7.5 Sound check

`npm run verify:audio` renders every cue offline to `artifacts/audio/*.wav` with a loudness report: whistle peak
−6 dBFS and the loudest cue; chug, clank ≤ −14 dBFS; bed ≈ −30 LUFS; night bed crossfade 12 s. A report is
**built** evidence, not **seen**: sound is only done when John has heard it in a game.

---

## 8. Build phases

Every brief pastes SOUL's Intent, the moment and the five pillars, names the owned files, and forbids the rest
(needs go under "Requests" in the report). No agent runs `npm install` except S, and nobody commits; the lead
commits. Each agent runs its own dev server (`npx vite --port <p> --strictPort`, background) and kills it at the
end; screenshots go to `artifacts/<area>/` and are looked at with the Read tool before any visual claim. Only one
e2e suite runs at a time on the machine; the lead holds the timing lane.

**Ports:** lead 5390 · S 5391 · B 5392 · C 5393 · D 5394 · E 5395 · F 5396 · T 5397 · R 5398 · P 5399.

### 8.1 Phase 0 · Contracts and scaffold (~1.5 h; lead + S + P)

- **Lead (5390)** writes the seven contract files (§3.4) and `docs/PLAN.md` from this candidate, then freezes the
  contracts.
- **S, scaffold (5391).** Owns `package.json`, `package-lock.json`, `node_modules`, `tsconfig.json`,
  `vite.config.ts`, `vitest.config.ts`, `index.html`, `src/main.ts` (boot stub that draws the mat, keyline and
  both bands), `scripts/e2e.ts`, `scripts/stub-layout.ts` → a flat `src/board/usa.layout.json` from lat/lon so
  C, D and E can start before B's real layout, `tests/e2e/lib.ts`, `tests/e2e/lanes.ts`, `src/game/hooks.ts`
  (the `__dep` shell). **Accept:** `npm run dev` on 5391 shows the frame; `npm test`, `npm run typecheck`,
  `npm run build`, `npm run test:e2e smoke` (a placeholder flow) green; Jost `tnum` verified with a screenshot.
- **P, posters (5399, contact sheets only).** Owns `_claude/posters-src/`, `scripts/posters.ts`,
  `public/posters/`, `src/board/posters.json`. Uses the `imagegen` skill with frame 3 as the style reference: 30
  posters + the back, no lettering, hero cities spread out; 2–3 candidates each, picks by eye. **Accept:** 30 +
  1 posters at both sizes (≤ 90 KB at 528 px); a 6×5 contact sheet at 264 px in `artifacts/posters/` looked at;
  each passes "land and light, a small train, no people, no landmarks, no text". Runs on into Phase 1.

### 8.2 Phase 1 · The evening, end to end (the vertical slice; ~5 h; A, B, C, D, E, F + lead)

**Definition of the slice:** a full game of 2–5 seats, humans and Normal AIs, from title to the finished map, on
the real relief and real layout, with the moment at close to final quality (the departure, whistle, chug, clank,
steam, title bar, record line), the market as a siding, tickets drawn and kept on placeholder posters (or P's if
ready), the hand-off cover, the scoring reel without path lights, save and resume. What waits for Phase 2:
brushwork, forests, shafts and the cloud bank; the light fall and night; the stamp and punch; Easy and Hard AI;
the music bed.

- **A, rules (no dev server).** Owns `src/engine/*` except `types.ts`, `src/board/usa.ts`, `docs/RULES.md`,
  `tests/engine/*`, `tests/board/*`. **Accept:** every R/IR tested; `diff.test.ts` green; `publicView` tests;
  `ticketStatus` and `ticketDistance` fixtures green (built in P1, surfaced in P2).
- **B, land (5392).** Owns `data/geo/*`, `scripts/build-relief.ts`, `scripts/build-map.ts`, `public/relief/*`,
  `src/board/usa.layout.json` (replaces the stub), `src/render/scene.ts`, `src/render/camera.ts`,
  `src/render/light.ts` (golden state only), `src/render/land/*` (P1: relief, toon ramp, rim, shadows, water,
  print mask; no brush, forest, shafts yet). **Accept:** layout passes the slot-size assertions; screenshots at
  1280×800 and 1920×1080 of the empty golden board, and a side-by-side with frame 1 and frame 2, looked at; boot
  to first frame ≤ 2.5 s. **Lookdev check-in at +2 h:** B posts the empty board to the lead, who decides whether
  the cel-shaded 2.5D read is on track before B continues (John's note on the frames makes this the riskiest
  call in the project).
- **C, print and trains (5393).** Owns `src/render/index.ts`, `src/render/picking.ts`, `src/render/print/*`,
  `src/render/trains/*`, `src/render/quality.ts`. **Accept:** all slots, roundels and names crisp at both sizes;
  pick and hover; the departure table (§5.6) measured within ±5 %; skip; five finishes; `moment` flow green on
  C's own server; screenshots of the moment's five beats.
- **D, controller and AI (5394).** Owns `src/game/*` except `viewModel.ts`, `src/ai/*` (Normal), `scripts/sim.ts`,
  `tests/game/*`, `tests/ai/*`. **Accept:** unit tests green; `sim.ts` report; 50 all-AI games through the
  controller at instant speed with no stuck state; AI turn median ≤ 2.5 s at watch measured headless.
- **E, the room (5395).** Owns `src/ui/*`. Builds §2.1–2.7, 2.9 (without night), 2.10–2.12. **Accept:**
  screenshots at both sizes of title, new game, turn with a pick, market take mid-slide, tickets offer, hand sheet,
  cover, scoring reel, finished map, looked at; every control ≥ 44×44; one gold per screen; no pills.
- **F, sound (5396).** Owns `src/audio/*`, `scripts/verify-audio.ts`. P1: whistle, chug, clank, steam hiss,
  card and rail ticks, riffle, poster rustle, ui press and refuse; a bare wind bed. **Accept:** offline renders
  and loudness report; the whistle is the loudest cue; cues schedule on `AudioContext.currentTime` offsets.
- **Lead (5390).** Wires `src/main.ts`; writes the P1 e2e flows (`start`, `smoke`, `turn`, `handoff`, `moment`,
  `tempo`, `resume`, `opening`); integrates.

**Phase 1 acceptance (the slice is done only on seen):** `npm test`, `npm run typecheck`, `npm run build` pass;
`npm run test:e2e:quick` plus `handoff moment tempo opening` green; the lead plays a 2-human + 2-AI game to the
finished map at 1× and posts screenshots; the SOUL checklist rerun against the build with evidence labelled.

### 8.3 Phase 2 · Wonder and loss (~5 h; B, C, D, E, F, P)

- **B:** brush field, forests, shafts with the idle drift, cloud bank, quality levels for land, night ramps in
  `light.ts`. Accept: `idle` and `printmask` green; the empty board beside frames 1 and 2, looked at; a Fable
  5.1 taste read of the land shots against the touchstones (read-only, via the lead).
- **C:** `startLightFall`, lamps, searchlights, faint coasts, night print tuning, painterly steam with the print
  cap, `playPathLight`. Accept: `dusk` green; a 12-frame strip of the light fall; the night board beside frame 4.
- **D:** Easy and Hard AI; strength targets; `ticketCancelled` and `ticketCompleted` emission; stamp bookkeeping;
  the scoring beats; recap lines for the cover; End the game now. Accept: AI and sim targets; stamp fire rate
  reported against §7.1.
- **E:** real posters, the stamp and punch, the scoring reel with path lights, night styling of the bands, the
  finished-map menu behaviour, settings and the rules sheet. Accept: `cancelled` and `victory` green on E's
  server; screenshots of the stamp landing (4 frames), the reel, the finished map.
- **F:** the bed: sparse strings (two- to four-note phrases, 20–40 s apart, long attack), wind, birds for golden;
  crickets and low strings for night; the 12 s crossfade; AI-vs-AI claims at 70 % volume. Accept: renders and
  report; John listens to one departure and the dusk before Phase 3 (the one piece that cannot be judged from a
  file).
- **P:** remaining posters and any re-rolls E or the lead asks for.

### 8.4 Phase 3 · Gates and the soul (~3 h; T, R, lead)

- **T, tests (5397).** Owns `tests/e2e/*` flows not yet written (`reel`, `feel`, `idle`, `dusk`, `gold`,
  `cancelled`, `victory`, `rules-ui`, `autoplay`, `legibility`, `printmask`, `settings`, `rulescard`),
  `tests/e2e/screens.ts`, `tests/e2e/squint.ts`, `scripts/perf.ts`. Accept: `npm run test:e2e` all green; the
  sweep and squint report in `artifacts/sweep/`.
- **R, review (5398, read-only).** Runs the build, reads SOUL, walks the moment and the bad day, and returns
  findings ranked by pillar; edits nothing. Route: Opus 5.5 for the pass, Fable 5.1 for a second opinion on the
  land and posters if the Opus read comes back soft.
- **Lead:** fixes or routes findings, reruns the full suite, looks at every sweep shot, plays a full evening
  game, and asks John to play one. **Done = seen:** John on the couch.

---

## 9. Risks and guards

| Risk | Guard |
|---|---|
| The land reads as generic low-poly toon, not a painted 2.5D cel-shade (John already said the frames miss it) | Brush-modulated band edges, rim light, cast shadows and forests as instanced toon pieces; the B lookdev check at +2 h in Phase 1; side-by-sides with frames 1–2; a Fable taste read in Phase 2. If it still misses, a short `/off` round with John before Phase 2 goes further. |
| Painterly land kills route legibility | Separate unlit print pass, never post-processed; print mask quiets the land within 10 px; the squint classification at 100 % at golden and at night. |
| The stamp almost never lands | The trains-left definition; `sim.ts` fire rate against ≥ 40 % of 4-seat games; Soul question 2 goes back with the number. |
| Departures make the evening slow | Budgets in §2.13 are gates; tap-through ≤ 1 frame; AI claims telegraphed 400 ms, draws brief; `fast` and `skip` speeds. |
| Hidden information leaks (cover, log, AI, ticket hold rings) | Privacy in one module (`privacy.ts`), beats carry visibility, `handoff` and `cancelled` flows, AI reads only `publicView` + its own hand (unit test that shuffles hidden info). Hold-to-see rings are cream, only while held, only on your turn. |
| Parallel agents clobber each other | Seven frozen contracts, additive only; stub layout so C, D, E start at once; owned-file lists with no overlap; one npm owner; one e2e suite at a time. |
| imagegen posters inconsistent, or letters baked in | No lettering in prompts; style locked to frame 3 as a reference image; 2–3 candidates each, contact-sheet review; `posterCam` fallback. |
| Performance on a laptop (forests, shafts, bloom) | Cached land pass at idle; quality ladder L3 → L0; print always full DPR; `feel` and `idle` gates; `perf.ts` at DPR 2. |
| Procedural strings sound cheap | Keep the bed sparse (wind first, strings rare); offline renders; John hears it in Phase 2 before anything is called done. |
| Northeast crowding (labels, short routes) | The poster warp; `build-map.ts` fails the build under 30 px a slot or on any label collision. |
| The night makes the last round unreadable | Print is unlit; washes drop only to 18 %; the squint gate at night. |
| Rules edge cases disagree with Iron Atlas or the rulebook | R/IR ids with page citations; the differential test; counts reconciled against the physical board and written down. |
| The light fall reads as a day cycle creeping in | Two light states and one transition; the turn-1-equals-turn-40 unit test; `dusk` asserts exactly one fall per game. |
