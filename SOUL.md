# Soul: Departures

## Intent
A complete, fully featured Ticket to Ride for John and his friends, on one laptop or TV, passed hand to hand,
with the polish, intuitiveness and taste of War Table. It should feel like America on the eve of the railroad,
already romanticising the country it was ending: more vivid than it was, the way the travel posters painted it.
You build the railroad that finishes the picture, and every train that leaves makes it a little more gone.

## The moment
Turn 30, on the couch. The continent lies still in late golden light: cream plains, lavender ranges, deep teal
lakes, dark pine in the Northwest, a backlit cloud bank over the Pacific. Priya taps the route from Helena to
Duluth and pays six orange cards. A whistle, far off. Her brass train pulls out of Helena, slow on the first
beat, then the chug picks up, steam trailing, and the last car settles at Duluth with a soft clank. The title bar
reads `HELENA · DULUTH`. Sam, watching, says nothing; that was the route his ticket needed. He finds out for sure
three turns later, when he opens his hand and the Duluth poster wears a small CANCELLED stamp. The board has not
moved since. It never does, until the last round, when the light goes down once and the lit trains are all that
is left.
**And after:** someone looks at the finished map for a while before anyone reaches for the menu.

## Pillars
1. **The calm is the country, not a pause between turns.** An idle board is a poster you would leave on the wall.
   Test: with nothing selected, only light drifts; a spectator can watch it for a minute without wanting it to do
   something.
2. **Departing is the only verb, not appearing.** Every action is a train leaving, with the rhythm and the whistle
   of one. Test: no piece on the board ever pops into place; a claim can be heard before it is seen.
3. **Vivid as memory, readable as print.** Saturated land, crisp routes and numbers. Test: from the couch, every
   route's colour, length and owner reads; nothing painterly ever touches a slot, a count or a city name.
4. **Wonder and loss in the same move, not a polite win.** A claim is beautiful and it closes something for someone.
   Test: the cancelled ticket is found in your hand later, never announced, and it stings.
5. **The land is a character, never a prop.** Forest, river, range, weather and light. Test: no people, no
   landmarks, no ornaments on the board; nothing moves but the train that just left and the light, once.

## Touchstones
- **`_claude/moodboard/2-departure-helena-duluth.png`** (John: "I especially love 2 and 1"): take the forest as
  a character, the sunbeams, the steam, the brass train pulling out with the yellow slots waiting ahead; leave the
  landscape perspective, the board is flatter.
- **`_claude/moodboard/1-golden-hour-board.png`**: take the palette, the lavender ranges and cream plains, the one
  puffing locomotive, and the title bar as the dock; leave the fantasy geography and the route density, most
  slots are empty outlines and the land is quieter.
- **`_claude/moodboard/3-ticket-poster-duluth.png`**: take all of it as what a ticket is; the band reads the real
  ticket (there is no Helena–Duluth ticket; Sam's is Duluth · El Paso · 10).
- **`_claude/moodboard/4-ending-night-board.png`**: take the searchlights, the faint coasts, the sentence in the
  title bar; leave the lit carriage colours, a few lit things against a lot of dark.
- **Leslie Ragan's *Chicago* and Chesley Bonestell's *New York Central Building*** (`ref-ragan-chicago.webp`,
  `ref-bonestell-nyc.webp`): take the lithograph flatness with soft light inside it, the dark border, the
  wide-tracked geometric capitals; leave the buildings.
- **Train Dreams (2025)**: take nature as a character and the elegy of building the thing that ends what you
  love; leave the people and the violence.
- **Life is Strange**: take the painterly cel-shade, banded light, brushy surfaces, warm rim light and light
  shafts; leave the film grain, vignette and lens flare (guess: John named the vibe; the leave list is mine).
- **War Table**: take the board as the UI, words on a hairline, one accent, the tempo gates and the hand-off
  cover; leave the ink and the indigo.

## Feel
- Look: one still golden hour over a lithograph print of the continent, painted as a cel-shaded 2.5D relief seen
  from a fixed high oblique camera. Vivid, harmonious, warm against cool. A dark border and a title bar in
  geometric capitals; one gold for the one thing happening now.
- Motion: trains depart and arrive; steam drifts and thins; light drifts. Nothing else moves. The frame never moves
  on its own.
- Hands: tapping the board only picks; a button or a finished gesture commits. A tap during motion finishes it.
  Nothing new makes you wait.
- Sound: sparse strings, wind and birds underneath; a far whistle before every departure, the chug, the clank of
  the last car. The whistle is the loudest thing in the game.
- Words: plain English in past tense, like a record. `Sam's train left Helena for Duluth.` Real names and
  numbers. No poetry, no exclamation marks.

## Open
The stack, the renderer, how the relief map and the cel-shader are made, how trains are modelled, the exact
camera angle and timings, and whether tickets are generated or drawn are how this build works, not what
Departures is. The rules (Ticket to Ride USA, 2015 rulebook) and "board taps pick, buttons commit" bind and
live in the docs.

## Misreads
- 2026-09-30 · Fable directions v2: proposed a full day cycle as the game clock. Missed "the calm is the country";
  a poster is one frozen hour. John chose one still hour with a single light change at the end.
- 2026-09-30 · Fable directions v2: proposed "printed" and paper as the verb. John: "paper feels a bit too weak
  as a direction"; he reached for "chugging, train tracks, wistful". The verb is the train, not the surface.
- 2026-09-30 · imagegen frames 1 and 4: painted every slot saturated and lit every carriage in its card colour.
  Missed "readable as print" and "a few lit things against a lot of dark". John also noted the frames "don't
  quite capture the cel-shaded 2.5D feel"; the build must, the frames are palette references only.

## Before you plan, delegate, or call it done
1. Walk the moment, and one bad day (skipped, idle, or losing), through the
   plan or build. For the moment and each pillar: serves, ignores, or works
   against; one contradiction makes it works against. Judge what the user
   would see and do, not whether the plan repeats this file's words. Hunt for
   the detail that contradicts, not the sentence that agrees.
2. Label every piece of evidence promised (a plan line), built (code), or
   seen (a screen or playthrough). A build is done only on seen.
3. Name up to five inherited commitments (already in the code or docs,
   carried into the next round) with the most effect on the experience,
   including any that contradict a pillar. Would a clean-room build from this
   file alone need it? Name the outcome its line here requires, then mark it:
   traces (cite the line), open (the soul doesn't require it; current docs
   still decide), or conflicts (the plan changes, unless John's own words
   asked for it; then it's a question for him).
4. A (guess) binds nobody, and neither does your own taste on a call this file
   doesn't settle. If the plan turns on either, list it under "Soul questions"
   at the end of your report for John.
5. Name the Misread the plan comes closest to repeating.
6. Comparing several plans or builds: rank them this way first; technical
   merit breaks ties.
7. Delegating: paste Intent, the moment, and the pillars into the brief.
