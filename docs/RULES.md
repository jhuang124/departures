# Departures rules: Ticket to Ride USA, pinned to the 2015 rulebook

**What binds.** SOUL.md says the rules (Ticket to Ride USA, 2015 rulebook) bind. This file is the pin. The engine
implements exactly this, and `tests/engine/rules-coverage.test.ts` fails if any ID below doesn't appear, as `[R-D3]`
or `[H2]`, in at least one test title under `tests/engine/`. The rules are paraphrased here, never quoted, and
`src/engine/data/usa.ts` must equal the appendices row for row (`tests/engine/data.test.ts`).

**Edition.** The classic North America game, 2015 English printing (`tt_rules_2015_en.pdf`, Days of Wonder).
Its setup:
- 30 destination tickets
- 4 opening train cards per player
- 3 opening tickets, of which the player keeps at least 2
- 45 trains per player

**Excluded:**
- **the 2025 rulebook's changes:** 33 tickets, 4 opening tickets
- **USA 1910:** its Mega Game, Big Cities and Globetrotter
- **every other map**

**How this was verified, and what is still open.**
- **Seen:** Iron Atlas's `docs/RULES.md` and `src/game/{data,engine}.ts`, read as a checked reference.
- **Checked from memory:** every rule and every row of Appendices A–C, against the 2015 rulebook and the physical
  board. They agree.
- **Page numbers** follow Iron Atlas's citations of the 2015 PDF: p. 2 components and setup, p. 3 the turn,
  drawing and claiming, p. 4 double routes, tickets, the end and scoring.
- **Open (Phase 0):** with John's OK the lead fetches the PDF into `_claude/rules/`, and Codex `gpt-6-astra` reads
  this file against it. Corrections are listed in §Differences with the date.

**ID scheme.**

| Prefix | Covers |
|---|---|
| R-S | setup |
| R-A | the turn |
| R-D | drawing train cards |
| R-C | claiming routes |
| R-T | destination tickets |
| R-E | the end and scoring |
| R-X | implementation resolutions (the rulebook is silent or ambiguous; marked *resolution*) |
| H | house rules John can toggle; the defaults equal the rulebook |

*Interpretation* marks a reading of ambiguous text.

---

## Components

| Thing | Count | Note |
|---|---|---|
| Cities | 36 | Appendix C |
| Routes | 78 city pairs, 100 lanes (22 pairs are doubles) | Appendix A; each lane is claimed separately |
| Route spaces | 309 | 93 gray; 27 per colour |
| Lanes by length | 1: 9 · 2: 36 · 3: 20 · 4: 16 · 5: 10 · 6: 9 | |
| Lanes by colour | gray 44; each of the 8 colours 7 | |
| Train cards | 110 = 12 × 8 colours + 14 locomotives | |
| Destination tickets | 30, totalling 349 points (4–22) | Appendix B |
| Trains per player | 45 | |
| Longest path bonus | 1 card, 10 points | |
| Players | 2–5 | |

**Card colours and the rulebook's car types.** The glyphs let colour-blind players read cards without the hue:

| Colour | Car type |
|---|---|
| purple | Box (some printings call it pink) |
| white | Passenger |
| blue | Tanker |
| yellow | Reefer |
| orange | Freight |
| black | Hopper |
| red | Coal |
| green | Caboose |
| locomotive | wild |

---

## Setup (p. 2)

- **R-S1.** Shuffle the 110 train cards. Deal 4 to each player, face down, private.
- **R-S2.** Turn 5 cards face up as the market. R-D6 applies at setup too: three or more locomotives clear it.
- **R-S3.** Each player takes 45 trains. The longest path bonus (10) sits beside the board.
- **R-S4.** Shuffle the 30 tickets. Deal 3 to each player. Each player privately keeps at least 2 and may keep all 3.
  Returned tickets go to the bottom of the ticket deck. *Resolution:* offers are made in seat order, starting with
  the first player, and returns go under the deck in the order they were offered.
- **R-S5.** First player. The rulebook says the most experienced traveller goes first, then play passes clockwise.
  *Interpretation:* the first seat is drawn from the game seed and recorded. H3 lets John set it to the first seat
  row. Seat order is clockwise.

## The turn (p. 3)

- **R-A1.** On your turn you do exactly one of three things:
  1. draw train cards
  2. claim one route
  3. draw destination tickets
- **R-A2.** Once you have drawn a train card you may not claim a route or draw tickets this turn (reason
  `mustFinishDraw`).

## Drawing train cards (p. 3)

- **R-D1.** You take two cards. Each one is either a face-up market card or the top card of the deck (a blind draw).
- **R-D2.** A face-up locomotive taken as your **first** card is your whole draw; the turn ends.
- **R-D3.** You may not take a face-up locomotive as your **second** card (`locoAsSecondDraw`). This includes a
  locomotive that was just turned up as the replacement for your first card.
- **R-D4.** A locomotive drawn blind counts as one card, with no special effect.
- **R-D5.** A face-up card that is taken is replaced from the deck **immediately**, before the second draw, so the
  replacement is available for the second draw (unless R-D3 forbids it). *Resolution (presentation):* the
  replacement goes into the same market slot that emptied. Slots are fixed.
- **R-D6.** Whenever 3 or more of the 5 face-up cards are locomotives, all 5 are discarded and 5 new cards are turned
  up. This repeats as often as needed, including at setup and mid-draw.
- **R-D7.** When a card is needed and the deck is empty, the discard pile is shuffled to form a new deck. The market
  and hands are untouched.
- **R-D8.** If the deck and the discard are both empty, empty market slots stay empty. You may draw only if a legal
  card exists. If none does, you must claim a route or draw tickets instead.
- **R-D9.** If after your first card no legal second card exists, your turn ends (`drawEnded: noSecondCard`). This
  happens when the deck and discard are empty and the market is empty or holds only locomotives.
- **R-D10.** *Interpretation:* the second draw is **required** whenever a legal one exists. This is how the digital
  editions play it. H2 makes it optional.
- **R-D11.** There is no hand limit.

## Claiming a route (p. 3; doubles p. 4)

- **R-C1.** You may claim any open lane anywhere on the board. It doesn't need to connect to your other routes.
- **R-C2.** You pay exactly as many cards as the route has spaces.
  - **Coloured lane:** cards of that colour, and any of them may be locomotives.
  - **Gray lane:** cards of **one** colour of your choice, plus any number of locomotives.
  - All locomotives is always allowed.
  - Mixing two colours is not allowed (`wrongColor`), and neither is the wrong number of cards (`wrongCount`).
- **R-C3.** You must have at least as many trains left as the route's length (`notEnoughTrains`).
- **R-C4.** You score the route at once, in public, by length:

  | Length | 1 | 2 | 3 | 4 | 5 | 6 |
  |---|---|---|---|---|---|---|
  | Points | 1 | 2 | 4 | 7 | 10 | 15 |

- **R-C5.** The cards you pay go to the discard pile.
- **R-C6.** You claim at most one route per turn.
- **R-C7.** Double routes, 4–5 players: different players may claim the two lanes of a double. One player may never
  hold both lanes of the same pair (`ownSibling`).
- **R-C8.** Double routes, 2–3 players: only one lane of each double can be used. Once either is claimed, the other
  is closed to everyone (`laneClosedDouble`; event `laneClosed`). H1 opens them.
- **R-C9.** *Resolution:* the player count for R-C7 and R-C8 is the number of seats when the game is created.
- **R-C10.** *Resolution (presentation):* a claim records an origin city, one of the lane's two endpoints. It
  changes nothing in the rules. It exists for the record (`Priya's train left Helena for Duluth.`) and the
  departure animation.

## Destination tickets (p. 4)

- **R-T1.** Drawing tickets: take the top 3 and keep at least 1. You may keep 2 or all 3. The rest go to the bottom
  of the ticket deck, in offer order.
- **R-T2.** If fewer than 3 tickets remain, you draw all that remain. Keep at least 1 still applies.
- **R-T3.** If the ticket deck is empty, drawing tickets is not a legal action (`noTickets`).
- **R-T4.** Tickets are secret until the end and can't be discarded. How many tickets each player holds is public.
- **R-T5.** A ticket is complete when a continuous chain of **your own** claimed routes joins its two cities.
  Opponents' routes never count.
- **R-T6.** At the end, a completed ticket adds its value and an incomplete one subtracts it.
- **R-T7.** Drawing tickets is legal during the final round (and usually a mistake).

## The end and scoring (p. 4)

- **R-E1.** Final round trigger. At the **end** of a turn, if that player has 0, 1 or 2 trains left and no final
  round is running, the final round begins. Every player, **including** the one who triggered it, gets exactly one
  more turn; the game ends after the triggering player's final turn. *Implementation:* `turnsLeft = number of
  seats`, decremented at each turn's end.
- **R-E2.** The final round triggers once. Other players dropping to 2 or fewer trains during it changes nothing.
- **R-E3.** Longest continuous path. Each player's longest path is the longest **trail** over their own routes,
  measured in trains (the sum of lane lengths), not in routes. It may pass through a city more than once and may
  include loops. It may never use the same route (the same plastic trains) twice. *Implementation:* an exact
  edge-simple longest trail.
- **R-E4.** The player or players with the longest path each get the 10-point bonus. Tied players all get it.
  *Resolution:* the bonus requires a path of length at least 1. A player with no routes never gets it. (Iron Atlas
  differs; see §Differences.)
- **R-E5.** Final score = route points + completed tickets − incomplete tickets + the bonus.
- **R-E6.** The winner has the most points. Ties are broken first by the most completed tickets, then by holding the
  longest path bonus. *Resolution:* if players are still tied, the win is **shared**, and the record names every
  winner.
- **R-E7.** *Resolution:* stalemate. A player with no legal action passes (`pass` is legal only then). Passing
  happens only when all of these hold:
  - no card can be drawn (R-D8)
  - the ticket deck is empty (R-T3)
  - no route is affordable

  If every seat passes in one full cycle (`passStreak === seats`), the game ends as `stalemate` and is scored
  normally.

## Deck exhaustion and loop safeguards

These are the only places the rulebook can loop or starve. Each one is fuzzed (2,000 games, invariants after every
action).

- **R-X1.** *Resolution:* refilling empty slots. Whenever cards enter the discard (a claim) and market slots are
  empty because the deck ran dry, the empty slots are refilled from the deck, reshuffling the discard first if
  needed (R-D7), in slot order, at the end of that action. R-D6 then applies.
- **R-X2.** *Resolution:* the pathological market. Sometimes the cards available (market, deck and discard) can't
  make a market with 2 or fewer locomotives. This happens when fewer than `min(5, pool) − 2` of them are not
  locomotives. Then the market stays as dealt and no clearing happens.
  - Otherwise, clears within one refill are capped at `ceil(pool / 5) + 1`. After the cap, the market stays as
    dealt until the next refill.
  - It is deterministic from the seed.
  - The invariant "fewer than 3 face-up locomotives" is waived only in these cases.
- **R-X3.** *Resolution:* reshuffle order. A reshuffle uses the game rng. The new deck is the whole discard. Cards in
  the market and in hands never enter it.
- **R-X4.** *Resolution:* tickets run out. When the ticket deck is empty, the `TICKETS` word shows the plain reason
  (`No tickets are left.`), and the turn goes on with the other two actions.
- **R-X5.** *Resolution:* conservation. After every action:
  - cards in deck + discard + market + hands = 110, exactly 12 per colour and 14 locomotives
  - tickets in the deck + hands + the pending offer = 30
  - trains + claimed lengths = 45 per player
  - route points = the sum of the R-C4 values of owned lanes

  A save that breaks any of these is rejected on load.
- **R-X6.** *Resolution:* turn cap for tests only. The fuzz harness fails any game longer than 200 turns. The game
  itself has no cap; R-E7 ends every starved game.

## House rules John can toggle (§H)

These are set in **New game → House rules**, fixed for the whole game, stored in `GameConfig.house`, saved with the
game, and shown on the Rules page. The defaults are the rulebook. The engine supports them from Phase 1; the UI fold
comes in Phase 2.

| ID | Setting | Default (rulebook) | Alternative | Effect |
|---|---|---|---|---|
| **H1** | Doubles at 2–3 players | `Closed` (R-C8) | `Open` | Both lanes of a double may be claimed by different players at any player count. R-C7's ownSibling still applies. |
| **H2** | Second card | `Required` (R-D10) | `Optional` | After one card, `END TURN` ends the draw (`drawEnded: chose`). |
| **H3** | First player | `Drawn` from the seed (R-S5) | `First row` | The seat in the first row of New game goes first: "the most experienced traveller". |
| **H4** | Ticket hints | `Off` | `On` | Offered and held posters show `about N trains`: the fewest trains still needed over your routes plus open lanes (`ticketOutlook.trainsNeeded`). Presentation only; the rules are unchanged. |

**Not toggles:**
- **What CANCELLED means** (truthful or cut) is a presentation decision for John (PLAN Soul question 2), not a rule.
- **Hand-off and speed** are Settings, not rules.

## Not rules, but read from rules state (so nobody mistakes them for rules)

- **Fixed market slots** (R-D5 resolution) and the recorded **origin** (R-C10).
- **CANCELLED stamp:** shown when `ticketOutlook.status === 'blocked'`. That means no path over your own routes plus
  lanes still open to you fits in your trains left. It is monotonic.
- **Punch:** shown when a ticket is complete (R-T5).
- **UNFINISHED:** shown at scoring on tickets that are incomplete but were never blocked.

None of these changes a score.

---

## Differences

**From Iron Atlas** (checked reference; our pin wins):

| Topic | Iron Atlas | Departures | Why |
|---|---|---|---|
| Longest path with no routes | when every maximum is 0, everyone gets 10 | the bonus needs length ≥ 1 (R-E4) | the rulebook is silent; a bonus for no railroad reads wrong |
| Market order | splices the taken card out; the rest shift | fixed slots, refilled in place (R-D5) | presentation, for pillar 2; no rules effect |
| Pathological market | up to 32 clears, then a constructed legal market | the market stays as dealt; clears are capped (R-X2) | simpler, deterministic, keeps every card where it was dealt |
| Stalemate | ends when a pass happens and no player has a legal claim | ends after a full cycle of passes (R-E7) | a player may still draw tickets or cards on a later turn; one cycle proves nobody can act |
| Empty-slot refill after the deck dries | refills on the next draw | refills at the end of the action that fed the discard (R-X1) | slots never sit empty while cards exist |
| Colour names | `wild` | `loco` | naming only |
| Ticket and lane data | 36 / 100 / 30 | identical, row for row | verified from memory against the 2015 board |

**From the 2015 PDF:** none recorded yet. The Phase 0 cross-read fills this in. Each correction gets a date, the
rule ID, what changed, and the PDF page.

**From SOUL's moment and the moodboard** (the rules win; raised with John as PLAN Soul question 1):
- SOUL's moment has Priya pay "five yellow cards" for Helena–Duluth. On this map that lane is **orange, length 6**.
- Frame 3's band reads `HELENA · DULUTH · 8`. No such ticket exists. The 8-point Duluth ticket is Duluth–Houston.
  The moment's fixture uses Duluth–El Paso (10).

---

## Appendix A · Lanes (100)

Lane IDs are stable, save-format keys. A double group names the pair. Both lanes of a double always have the same
length. Colours use the card names above; `gray` accepts any one colour.

| # | Lane id | A | B | Len | Colour | Double group |
|---|---|---|---|---|---|---|
| 1 | `vancouver-calgary` | Vancouver | Calgary | 3 | gray | — |
| 2 | `vancouver-seattle-1` | Vancouver | Seattle | 1 | gray | `vancouver-seattle` |
| 3 | `vancouver-seattle-2` | Vancouver | Seattle | 1 | gray | `vancouver-seattle` |
| 4 | `calgary-seattle` | Calgary | Seattle | 4 | gray | — |
| 5 | `calgary-helena` | Calgary | Helena | 4 | gray | — |
| 6 | `calgary-winnipeg` | Calgary | Winnipeg | 6 | white | — |
| 7 | `seattle-portland-1` | Seattle | Portland | 1 | gray | `seattle-portland` |
| 8 | `seattle-portland-2` | Seattle | Portland | 1 | gray | `seattle-portland` |
| 9 | `seattle-helena` | Seattle | Helena | 6 | yellow | — |
| 10 | `portland-san-francisco-1` | Portland | San Francisco | 5 | green | `portland-san-francisco` |
| 11 | `portland-san-francisco-2` | Portland | San Francisco | 5 | purple | `portland-san-francisco` |
| 12 | `portland-salt-lake-city` | Portland | Salt Lake City | 6 | blue | — |
| 13 | `san-francisco-salt-lake-city-1` | San Francisco | Salt Lake City | 5 | orange | `san-francisco-salt-lake-city` |
| 14 | `san-francisco-salt-lake-city-2` | San Francisco | Salt Lake City | 5 | white | `san-francisco-salt-lake-city` |
| 15 | `san-francisco-los-angeles-1` | San Francisco | Los Angeles | 3 | yellow | `san-francisco-los-angeles` |
| 16 | `san-francisco-los-angeles-2` | San Francisco | Los Angeles | 3 | purple | `san-francisco-los-angeles` |
| 17 | `los-angeles-las-vegas` | Los Angeles | Las Vegas | 2 | gray | — |
| 18 | `los-angeles-phoenix` | Los Angeles | Phoenix | 3 | gray | — |
| 19 | `los-angeles-el-paso` | Los Angeles | El Paso | 6 | black | — |
| 20 | `las-vegas-salt-lake-city` | Las Vegas | Salt Lake City | 3 | orange | — |
| 21 | `phoenix-santa-fe` | Phoenix | Santa Fe | 3 | gray | — |
| 22 | `phoenix-el-paso` | Phoenix | El Paso | 3 | gray | — |
| 23 | `phoenix-denver` | Phoenix | Denver | 5 | white | — |
| 24 | `salt-lake-city-helena` | Salt Lake City | Helena | 3 | purple | — |
| 25 | `salt-lake-city-denver-1` | Salt Lake City | Denver | 3 | red | `salt-lake-city-denver` |
| 26 | `salt-lake-city-denver-2` | Salt Lake City | Denver | 3 | yellow | `salt-lake-city-denver` |
| 27 | `helena-winnipeg` | Helena | Winnipeg | 4 | blue | — |
| 28 | `helena-duluth` | Helena | Duluth | 6 | orange | — |
| 29 | `helena-omaha` | Helena | Omaha | 5 | red | — |
| 30 | `helena-denver` | Helena | Denver | 4 | green | — |
| 31 | `denver-santa-fe` | Denver | Santa Fe | 2 | gray | — |
| 32 | `denver-oklahoma-city` | Denver | Oklahoma City | 4 | red | — |
| 33 | `denver-kansas-city-1` | Denver | Kansas City | 4 | black | `denver-kansas-city` |
| 34 | `denver-kansas-city-2` | Denver | Kansas City | 4 | orange | `denver-kansas-city` |
| 35 | `denver-omaha` | Denver | Omaha | 4 | purple | — |
| 36 | `santa-fe-el-paso` | Santa Fe | El Paso | 2 | gray | — |
| 37 | `santa-fe-oklahoma-city` | Santa Fe | Oklahoma City | 3 | blue | — |
| 38 | `el-paso-oklahoma-city` | El Paso | Oklahoma City | 5 | yellow | — |
| 39 | `el-paso-dallas` | El Paso | Dallas | 4 | red | — |
| 40 | `el-paso-houston` | El Paso | Houston | 6 | green | — |
| 41 | `winnipeg-duluth` | Winnipeg | Duluth | 4 | black | — |
| 42 | `winnipeg-sault-ste-marie` | Winnipeg | Sault Ste. Marie | 6 | gray | — |
| 43 | `duluth-sault-ste-marie` | Duluth | Sault Ste. Marie | 3 | gray | — |
| 44 | `duluth-toronto` | Duluth | Toronto | 6 | purple | — |
| 45 | `duluth-chicago` | Duluth | Chicago | 3 | red | — |
| 46 | `duluth-omaha-1` | Duluth | Omaha | 2 | gray | `duluth-omaha` |
| 47 | `duluth-omaha-2` | Duluth | Omaha | 2 | gray | `duluth-omaha` |
| 48 | `omaha-chicago` | Omaha | Chicago | 4 | blue | — |
| 49 | `omaha-kansas-city-1` | Omaha | Kansas City | 1 | gray | `omaha-kansas-city` |
| 50 | `omaha-kansas-city-2` | Omaha | Kansas City | 1 | gray | `omaha-kansas-city` |
| 51 | `kansas-city-st-louis-1` | Kansas City | St. Louis | 2 | blue | `kansas-city-st-louis` |
| 52 | `kansas-city-st-louis-2` | Kansas City | St. Louis | 2 | purple | `kansas-city-st-louis` |
| 53 | `kansas-city-oklahoma-city-1` | Kansas City | Oklahoma City | 2 | gray | `kansas-city-oklahoma-city` |
| 54 | `kansas-city-oklahoma-city-2` | Kansas City | Oklahoma City | 2 | gray | `kansas-city-oklahoma-city` |
| 55 | `oklahoma-city-little-rock` | Oklahoma City | Little Rock | 2 | gray | — |
| 56 | `oklahoma-city-dallas-1` | Oklahoma City | Dallas | 2 | gray | `oklahoma-city-dallas` |
| 57 | `oklahoma-city-dallas-2` | Oklahoma City | Dallas | 2 | gray | `oklahoma-city-dallas` |
| 58 | `dallas-houston-1` | Dallas | Houston | 1 | gray | `dallas-houston` |
| 59 | `dallas-houston-2` | Dallas | Houston | 1 | gray | `dallas-houston` |
| 60 | `dallas-little-rock` | Dallas | Little Rock | 2 | gray | — |
| 61 | `houston-new-orleans` | Houston | New Orleans | 2 | gray | — |
| 62 | `little-rock-new-orleans` | Little Rock | New Orleans | 3 | green | — |
| 63 | `little-rock-nashville` | Little Rock | Nashville | 3 | white | — |
| 64 | `little-rock-st-louis` | Little Rock | St. Louis | 2 | gray | — |
| 65 | `st-louis-chicago-1` | St. Louis | Chicago | 2 | green | `st-louis-chicago` |
| 66 | `st-louis-chicago-2` | St. Louis | Chicago | 2 | white | `st-louis-chicago` |
| 67 | `st-louis-pittsburgh` | St. Louis | Pittsburgh | 5 | green | — |
| 68 | `st-louis-nashville` | St. Louis | Nashville | 2 | gray | — |
| 69 | `chicago-pittsburgh-1` | Chicago | Pittsburgh | 3 | orange | `chicago-pittsburgh` |
| 70 | `chicago-pittsburgh-2` | Chicago | Pittsburgh | 3 | black | `chicago-pittsburgh` |
| 71 | `chicago-toronto` | Chicago | Toronto | 4 | white | — |
| 72 | `sault-ste-marie-toronto` | Sault Ste. Marie | Toronto | 2 | gray | — |
| 73 | `sault-ste-marie-montreal` | Sault Ste. Marie | Montréal | 5 | black | — |
| 74 | `toronto-montreal` | Toronto | Montréal | 3 | gray | — |
| 75 | `toronto-pittsburgh` | Toronto | Pittsburgh | 2 | gray | — |
| 76 | `montreal-boston-1` | Montréal | Boston | 2 | gray | `montreal-boston` |
| 77 | `montreal-boston-2` | Montréal | Boston | 2 | gray | `montreal-boston` |
| 78 | `montreal-new-york` | Montréal | New York | 3 | blue | — |
| 79 | `boston-new-york-1` | Boston | New York | 2 | yellow | `boston-new-york` |
| 80 | `boston-new-york-2` | Boston | New York | 2 | red | `boston-new-york` |
| 81 | `new-york-pittsburgh-1` | New York | Pittsburgh | 2 | white | `new-york-pittsburgh` |
| 82 | `new-york-pittsburgh-2` | New York | Pittsburgh | 2 | green | `new-york-pittsburgh` |
| 83 | `new-york-washington-1` | New York | Washington | 2 | orange | `new-york-washington` |
| 84 | `new-york-washington-2` | New York | Washington | 2 | black | `new-york-washington` |
| 85 | `pittsburgh-washington` | Pittsburgh | Washington | 2 | gray | — |
| 86 | `pittsburgh-raleigh` | Pittsburgh | Raleigh | 2 | gray | — |
| 87 | `pittsburgh-nashville` | Pittsburgh | Nashville | 4 | yellow | — |
| 88 | `washington-raleigh-1` | Washington | Raleigh | 2 | gray | `washington-raleigh` |
| 89 | `washington-raleigh-2` | Washington | Raleigh | 2 | gray | `washington-raleigh` |
| 90 | `raleigh-nashville` | Raleigh | Nashville | 3 | black | — |
| 91 | `raleigh-atlanta-1` | Raleigh | Atlanta | 2 | gray | `raleigh-atlanta` |
| 92 | `raleigh-atlanta-2` | Raleigh | Atlanta | 2 | gray | `raleigh-atlanta` |
| 93 | `raleigh-charleston` | Raleigh | Charleston | 2 | gray | — |
| 94 | `nashville-atlanta` | Nashville | Atlanta | 1 | gray | — |
| 95 | `atlanta-charleston` | Atlanta | Charleston | 2 | gray | — |
| 96 | `charleston-miami` | Charleston | Miami | 4 | purple | — |
| 97 | `atlanta-miami` | Atlanta | Miami | 5 | blue | — |
| 98 | `atlanta-new-orleans-1` | Atlanta | New Orleans | 4 | yellow | `atlanta-new-orleans` |
| 99 | `atlanta-new-orleans-2` | Atlanta | New Orleans | 4 | orange | `atlanta-new-orleans` |
| 100 | `new-orleans-miami` | New Orleans | Miami | 6 | red | — |

## Appendix B · Destination tickets (30)

Points are printed values, added if complete and subtracted if not (R-T6).

| # | Ticket id | From | To | Points |
|---|---|---|---|---|
| 1 | `boston-miami` | Boston | Miami | 12 |
| 2 | `calgary-phoenix` | Calgary | Phoenix | 13 |
| 3 | `calgary-salt-lake-city` | Calgary | Salt Lake City | 7 |
| 4 | `chicago-new-orleans` | Chicago | New Orleans | 7 |
| 5 | `chicago-santa-fe` | Chicago | Santa Fe | 9 |
| 6 | `dallas-new-york` | Dallas | New York | 11 |
| 7 | `denver-el-paso` | Denver | El Paso | 4 |
| 8 | `denver-pittsburgh` | Denver | Pittsburgh | 11 |
| 9 | `duluth-el-paso` | Duluth | El Paso | 10 |
| 10 | `duluth-houston` | Duluth | Houston | 8 |
| 11 | `helena-los-angeles` | Helena | Los Angeles | 8 |
| 12 | `kansas-city-houston` | Kansas City | Houston | 5 |
| 13 | `los-angeles-chicago` | Los Angeles | Chicago | 16 |
| 14 | `los-angeles-miami` | Los Angeles | Miami | 20 |
| 15 | `los-angeles-new-york` | Los Angeles | New York | 21 |
| 16 | `montreal-atlanta` | Montréal | Atlanta | 9 |
| 17 | `montreal-new-orleans` | Montréal | New Orleans | 13 |
| 18 | `new-york-atlanta` | New York | Atlanta | 6 |
| 19 | `portland-nashville` | Portland | Nashville | 17 |
| 20 | `portland-phoenix` | Portland | Phoenix | 11 |
| 21 | `san-francisco-atlanta` | San Francisco | Atlanta | 17 |
| 22 | `sault-ste-marie-nashville` | Sault Ste. Marie | Nashville | 8 |
| 23 | `sault-ste-marie-oklahoma-city` | Sault Ste. Marie | Oklahoma City | 9 |
| 24 | `seattle-los-angeles` | Seattle | Los Angeles | 9 |
| 25 | `seattle-new-york` | Seattle | New York | 22 |
| 26 | `toronto-miami` | Toronto | Miami | 10 |
| 27 | `vancouver-montreal` | Vancouver | Montréal | 20 |
| 28 | `vancouver-santa-fe` | Vancouver | Santa Fe | 13 |
| 29 | `winnipeg-houston` | Winnipeg | Houston | 12 |
| 30 | `winnipeg-little-rock` | Winnipeg | Little Rock | 11 |

## Appendix C · Cities (36)

City IDs are stable, save-format keys. Lat/lon for the projection live in `usa.ts` (R adds them in Phase 0), not here, because they are not rules.

| City id | Name |
|---|---|
| `vancouver` | Vancouver |
| `calgary` | Calgary |
| `winnipeg` | Winnipeg |
| `montreal` | Montréal |
| `boston` | Boston |
| `seattle` | Seattle |
| `portland` | Portland |
| `helena` | Helena |
| `duluth` | Duluth |
| `sault-ste-marie` | Sault Ste. Marie |
| `toronto` | Toronto |
| `new-york` | New York |
| `san-francisco` | San Francisco |
| `salt-lake-city` | Salt Lake City |
| `denver` | Denver |
| `omaha` | Omaha |
| `kansas-city` | Kansas City |
| `st-louis` | St. Louis |
| `chicago` | Chicago |
| `pittsburgh` | Pittsburgh |
| `washington` | Washington |
| `raleigh` | Raleigh |
| `nashville` | Nashville |
| `atlanta` | Atlanta |
| `charleston` | Charleston |
| `miami` | Miami |
| `new-orleans` | New Orleans |
| `houston` | Houston |
| `dallas` | Dallas |
| `oklahoma-city` | Oklahoma City |
| `little-rock` | Little Rock |
| `santa-fe` | Santa Fe |
| `el-paso` | El Paso |
| `phoenix` | Phoenix |
| `las-vegas` | Las Vegas |
| `los-angeles` | Los Angeles |
