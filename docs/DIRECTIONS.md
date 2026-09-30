# Ticket to Ride: five directions (revised to John's moodboard)

> **Settled with John, 2026-09-30 (supersedes the ranking below where they differ):** the board is one still golden
> hour, a lithograph print, one screen pass-and-play. The verb is *departing* (every action is a train leaving), with
> steam as its material. The feeling is Train Dreams: America on the eve of the railroad, already romanticising what
> it was ending, more vivid than it was. Palette vivid not muted; land as a character; words in plain past tense;
> sparse strings and a far whistle; the sting is a CANCELLED stamp found later on a ticket's poster. Next step is a
> SOUL.md, not another directions pass. Sunbeams (C) is dropped in favour of Golden Hour with one ending night fall.

Written 2026-09-30. Revision 2 after John's moodboard: Leslie Ragan's *Chicago* (New York Central Lines, 1929),
Mario Borgoni's *Capri*, a WPA-revival *Redwoods State Park*, a modern *Yosemite* poster, and Chesley Bonestell's
*New York Central Building* (1930). Revision 1 (ink sibling, diorama, transit map, deco poster, living landscape) is
superseded; what survived from it is noted where it survived.

Inputs still standing: War Table (SOUL.md, INK2, UX spec, live build), the Astra clone "Iron Atlas" on
127.0.0.1:5193, and the research pass on Ticket to Ride's art lineage, digital adaptations, and Opus 5.5 demos.

---

## 1. What the moodboard says

Five posters, one grammar:

- **Light is the subject.** Every image is about a light source: sun behind cloud, rays through canopy, a floodlit
  crown, golden hour on granite. The buildings and trees are there to catch it.
- **Lithograph flatness with luminous gradients.** Flat gouache planes, hard silhouettes, then soft airbrushed
  light inside them. No line art, no texture for its own sake.
- **A limited palette, warm against cool.** Gold and cream against teal, indigo and lavender shadow. Borgoni's
  Capri is the warm outlier: coral rock, cobalt sea, yellow bloom.
- **Atmospheric depth by value, not detail.** Far things are paler and cooler. Nothing is drawn at the back.
- **The frame is part of the picture.** A dark border, the image bleeding to it, and a title bar in wide-tracked
  geometric capitals (Ragan's CHICAGO, Bonestell's NEW YORK CENTRAL BUILDING).
- **Romance of the destination.** These are posters for going somewhere. That is Ticket to Ride's own subject.

This is not Cassandre's geometric deco (revision 1's Grand Tour). It is the painterly American travel poster, the
WPA park poster tradition, and their modern revival. Warmer, more atmospheric, less graphic.

## 2. How a poster becomes a board

A poster is one vista. A board is a hundred routes. The translation that keeps both:

- **The frame is the UI.** The poster's dark border becomes the screen's edge; the title bar becomes the dock.
  `CHICAGO · NEW YORK CENTRAL LINES` is, letter for letter, War Table's one line plus the phase words on a
  hairline. Geometric caps, wide tracking, one gold. No panels, no pills.
- **The map is the vista.** America seen from high and oblique, painted as flat planes with light on them, like a
  1930s pictorial map done by Ragan. Routes are ruled lines over it. The land is the poster; the routes are the
  print.
- **Tickets are posters.** Each destination ticket is a small travel poster of its destination in this style. The
  hand is a stack of them. Completing one hangs it on your wall. This is the single best idea in the set and it
  belongs in every direction below (it was direction C in a draft; it is a feature, not a direction).
- **Light is the state.** Whatever is live on the board is lit; whatever is not recedes into shadow and haze.
  That is the poster's own device, and it replaces War Table's dimming rule with something warmer.

Two constraints carry over unchanged from revision 1:

- **Cost versus ownership.** Eight carriage colours mark what a route costs; five player colours mark who owns it.
  Rule: cards are hues, players are finishes. Player trains read as brass, copper, chrome, gunmetal and cream
  enamel, so ownership never argues with a route's colour. In a poster palette this is doubly right, since the
  eight hues can be tuned to the poster's inks and the finishes stay out of their way.
- **Readable from the couch.** The land is quiet and the routes are the loudest thing on screen, or the direction
  fails. Iron Atlas fails here, and War Table's pillar 2 is the gate.

## 3. Why Opus 5.5 still matters

The build is an Opus 5.5 fleet. Its praised strengths are procedural Three.js: geometry, materials, dynamic light
(day and night, weather), volumetric rays, emissive surfaces and bloom, all with no external art. Its gap is
painted illustration at poster quality, which comes from `imagegen` and gets integrated.

The moodboard splits along exactly that line. The **light** (rays, haze, floodlights, golden hour, lit windows) is
what the fleet does best in code. The **painting** (the plates of land and the city posters) is imagegen work. A
direction that leans on light is a faster, stronger build; a direction that leans on many paintings is slower and
lands in taste review more. All five below use both; they differ in the ratio.

## 3b. The rendering answer: painterly cel-shade (Life is Strange)

John's addition. Life is Strange is not a sixth direction; it is *how the five get rendered*. Its look is the
travel poster running in real time: light posterised into a few soft bands instead of smooth shading, textures
that read as brush strokes and gouache rather than photographs, warm rim light on silhouettes, dusty light shafts,
a gentle bloom, and a muted-but-warm palette with golden hour as the default hour. Arcadia Bay is Ragan's Chicago
with a camera in it.

What it does for this project:

- **It makes the land geometry, not a painting.** A low-relief 3D America (plains, ranges, lakes, coast) under a
  painterly toon shader gives every direction its plate for free. Ramps set the palette per hour: Ragan's ramp at
  four in the afternoon, Bonestell's after dark. One model, any poster.
- **It closes the imagegen gap.** The fleet's weak spot was painted plates. With cel-shading the plate is code:
  a colour ramp, a brush-stroke normal or noise texture, rim light, a shaft pass. Imagegen keeps only the city
  posters (tickets) and any hero illustration, which is where it belongs.
- **It makes real pieces natural.** Trains are small toon-shaded models with a painted finish (brass, cream
  enamel, gunmetal) and a hard rim, so ownership reads as silhouette plus sheen. Cards can be cel-shaded objects
  on the table rather than flat sprites.
- **It is 2.5D by construction.** A fixed high-oblique camera over shallow relief, with parallax and light but no
  free orbit, is exactly the 2.5D John asked for.
- **It is the demo genre.** Custom toon shaders, gradient ramps, rim light, volumetric shafts and dynamic sky are
  what Opus 5.5 gets shared for. This raises the build fit of every direction and raises C's the most.

Guards, because Life is Strange also has habits this game cannot afford:

- No film grain, no vignette pulsing, no chromatic aberration, no lens flare across the board. War Table's noise
  budget stands. The painterly texture lives in the surfaces, not in a post filter over the routes.
- Bands and brushwork are for the land and sky. Routes and numbers are crisp print (direction D's rule). Nothing
  painterly ever touches a route slot, a train count or a city name.
- The camera is a poster's: still. It never drifts on its own. Light moves; the frame does not.

Effect on the ranking below: A and E stop being painting-heavy (the plate is geometry), so their build cost drops
to roughly D's. B and C gain the most, because dynamic ramps and shafts are the whole point. The recommendation in
§6 stands and gets stronger.

---

## 4. The five directions

### A. Golden Hour
*Ragan's Chicago as a map: the whole board is one late-afternoon lithograph.*

- **The moment.** The continent lies in flat gouache planes, plains in cream, the Rockies in lavender, the Great
  Lakes in teal. Sun comes low from the west and one backlit cloud bank glows over the Pacific. Sam lays five brass
  carriages from Salt Lake City to Denver and the ruled line fills in like a stroke of ink, then the light catches
  the new brass once. The board does not change hour. It is always four in the afternoon somewhere.
- **Look.** Ragan's palette exactly: gold, cream, teal, lavender shadow, one warm gold accent. Flat land, soft
  light, atmospheric haze toward the far edge. Geometric caps in the title bar. Cities as small pale marks with
  names; the big ones get a tiny skyline silhouette.
- **Where the beauty lives.** In the plate. One painting, done very well, that you play on for an hour.
- **Build ratio.** Painting-heavy. The base plate is imagegen (one hero render plus tiles), the light and haze are
  shader. Routes, trains and UI are code.
- **Risk.** A painted plate under a hundred routes is the readability trap. The guard is a plate painted for the
  routes: low contrast, no detail where routes run, all the drama pushed to the edges and the sky.
- **Touchstones.** Ragan's *Chicago*; 1930s pictorial maps; the Yosemite poster's flat planes.

### B. Gateway to a Continent
*Bonestell's night: a dark board where everything claimed is lit.*

- **The moment.** Near-black teal sky, the land in deep shadow, the coast a pale edge. Every city is a small lit
  building, windows gold. Two searchlight beams cross slowly over the Atlantic. Priya claims Pittsburgh to New
  York and the route lights up as a string of station lamps, then the New York tower floods gold for a breath.
  Unclaimed routes are faint, like unlit track.
- **Look.** Bonestell's palette: deep teal, near-black, gold light, a little brick red in the streets. Emissive
  windows, lamps and beams; soft bloom; haze. Geometric caps in gold on black.
- **Where the beauty lives.** In the light. The board is dark and the game paints it with lamps. By the end the
  continent is lit the way the players built it.
- **Build ratio.** Light-heavy. The dark plate is simple; the emissives, beams, bloom and haze are the fleet's home
  turf. City buildings are small procedural silhouettes, not paintings.
- **Why it works.** This is War Table's proven dark-board legibility (indigo paper, one gold) in a new material:
  electric instead of ink. The tempo tests, the dock and the one-gold sampler port straight over.
- **Risk.** Too much bloom and it is a casino. The guard is Bonestell himself: a few lit things against a lot of
  dark. Also the least "travel by day" of the five; the Capri warmth is absent.
- **Touchstones.** Bonestell's *New York Central Building*; night-time pictorial maps; War Table's board.

### C. Sunbeams
*Redwoods and Yosemite: the board is one long day, and the light is the game clock.*

- **The moment.** Turn one is dawn: pale, cool, mist in the valleys. By mid-game it is Golden Hour (direction A).
  As trains run low the shadows lengthen, the sky goes coral and lavender, and the cities start to light. The
  final round plays as Gateway to a Continent (direction B), every claimed route lit, the searchlights on. Nobody
  has to be told the game is ending; you can see it in the sky. Rays of light move across the board over the hour
  the way they move through the redwoods.
- **Look.** A and B joined by time. Flat lithograph land, volumetric rays, moving cloud shadow, sky gradient tied
  to the trains-remaining count of the leading player. Geometric caps. One gold, which is warmer at noon and
  hotter at night.
- **Where the beauty lives.** In the change. The board is different every time someone looks up from their cards.
- **Build ratio.** Light-heaviest. Dynamic sky, rays, shadows and emissives are exactly the demo genre. One
  painted plate serves the whole day because the light does the work.
- **Risk.** Motion against readability, and "decoration over information" is the misread it sits nearest. The
  guards: the land never moves, only light does; routes are the only saturated marks at every hour; the
  read-from-3-metres gate runs at dawn, noon and night.
- **Touchstones.** *Redwoods State Park* rays; the Yosemite poster's sky; Ragan by day, Bonestell by night.

### D. Screen Print
*The WPA revival: fewer inks, hard edges, halftone grain, the boldest of the five.*

- **The moment.** The board is a six-colour screen print. Land in two flat greens, mountains in one purple, water
  in one teal, sky in a hard coral-to-gold band. Edges are crisp with a hair of misregistration. Routes are thick
  printed lines. John claims Houston to New Orleans and the ink lays down in one pass with a paper-drag sound. The
  title bar sets `NEW ORLEANS` in heavy geometric caps.
- **Look.** The Yosemite and Redwoods posters' modern flavour: saturated flat inks, no soft airbrush, halftone
  dots in the shadows, 2.5D from layered ink sheets a few millimetres apart. The most graphic and least
  atmospheric direction.
- **Where the beauty lives.** In the print. Bold, clean, poster-on-the-wall confidence.
- **Build ratio.** Balanced and cheap. Flat planes and hard edges are easy in code; imagegen supplies the few
  illustrated elements (city posters, a skyline or two). Fastest build of the five.
- **Why it works.** Highest legibility. Flat inks and thick lines read from across the room without any guard.
- **Risk.** Loses the light that the moodboard is about. It is the poster without the glow. Can read as a modern
  brand rather than a 1930 lithograph.
- **Touchstones.** Anderson Design Group's park posters; the Yosemite poster; 1930s WPA silkscreens.

### E. The Grand Tour, Capri
*Borgoni's Mediterranean warmth: the same grammar, tuned hot, with an eye on the Europe map.*

- **The moment.** Coral rock, cobalt sea, yellow bloom, a white sun. The board is warm everywhere; shadows are
  violet, not grey. Cities are small whitewashed marks. A ferry route across the sea is a pale wake on cobalt. The
  title bar sets `CAPRI · L'ISOLA DEL SOLE` and the tickets are Italian, French and Swiss posters.
- **Look.** Borgoni's palette and brushwork: more painterly than Ragan, blooming edges, saturated warm light.
  Geometric caps, but softer (Ragan's lettering, not Bonestell's).
- **Where the beauty lives.** In the warmth. The most romantic and most sociable of the five.
- **Build ratio.** Painting-heavy, like A.
- **Why it is here.** The US map in this palette is possible but a little false (Kansas is not Capri). This
  direction is really the case for building the **Europe** map first, or planning for it: tunnels, ferries and
  stations are visual objects that this warmth suits.
- **Risk.** Scope. Europe's extra rules are real work, and a hot palette fights eight carriage colours harder
  than a cool one does.
- **Touchstones.** Borgoni's *Capri*; Roger Broders' Riviera posters; the Ticket to Ride Europe box.

---

## 5. Comparison

| | A Golden Hour | B Gateway | C Sunbeams | D Screen Print | E Capri |
|---|---|---|---|---|---|
| True to the moodboard's light | high | high | highest | low | high |
| Couch legibility | medium (plate guard) | high | medium (motion guard) | highest | medium |
| Opus 5.5 build fit (cel-shaded) | high | high | highest | high | high |
| Painting needed (imagegen) | tickets only | tickets only | tickets only | tickets only | tickets only |
| Demo / share value | medium | high | highest | medium | medium |
| Nearest misread | detail under routes | casino bloom | decoration over information | poster without the glow | wrong continent |

## 6. My position

**Build C, Sunbeams, rendered as painterly cel-shade.** It is the moodboard's common thread made literal: the
board is about light, and the light is the game clock. It contains A and B as its noon and its midnight, so the
fleet builds one board and gets three looks by swapping colour ramps. With the Life is Strange rendering the whole
plate is code, which is squarely what Opus 5.5 does best, and imagegen is reserved for the ticket posters. The risk is
the one War Table already taught us to guard, and the guards are simple: land never moves, routes are the only
colour, legibility gated at three hours of the day.

**Runner-up: B, Gateway to a Continent.** If the day cycle feels like too much, the night alone is the safest
beautiful thing here. It is War Table's dark-board legibility in electric light, the tempo and dock work ports
straight over, and it needs the least painting.

**Take from D regardless:** thick printed route lines and hard edges on the routes themselves, even over a soft
plate. Routes should read as print, not paint.

**Take from E regardless:** plan the data model for Europe (tunnels, ferries, stations) even if the US ships
first, and build tickets as posters from day one so a second map is a second poster set.

**Pass on A and E as whole directions.** A is C frozen at one hour, which is less for the same painting. E is the
right warmth on the wrong continent until Europe is in scope.

## 7. Before a SOUL.md

Three calls only John can make, unchanged from revision 1:

1. **Who is in the room.** One laptop or TV with pass-and-play and a hand-off cover, or a public board on the TV
   with phones as private hands? This changes the hand and the hand-off entirely.
2. **How much Ticket to Ride.** US 2015 rules first, with Europe planned for? Say so now so the model and the
   poster set budget for it.
3. **The one gold.** The route you are about to claim, or the ticket that just completed. Pick one; the other
   finds another way (in Sunbeams, the completed ticket could be the thing that lights a city).

## Sources

- [Cyrille Daujean on Ticket to Ride's visuals (Mojo Nation)](https://mojo-nation.com/art-asmodee-days-wonders-cyrille-daujean-talks-ticket-ride-seduction-great-game-visuals/)
- [Ticket to Ride, Wikipedia (Delval and Daujean credits)](https://en.wikipedia.org/wiki/Ticket_to_Ride_(board_game))
- [Marmalade's 2023 Ticket to Ride, mixed on Steam](https://store.steampowered.com/app/2477010)
- [Mini Metro and Harry Beck (HERE)](https://www.here.com/learn/blog/expert-takes-beck-meaning-underground)
- [Wingspan digital review (TouchArcade)](https://toucharcade.com/2021/08/16/wingspan-review-iphone-ipad-ios-board-game-adaptation-monster-couch/)
- [Making of Lumino City (SIGGRAPH)](https://history.siggraph.org/?p=70586)
- [Opus 5.5 one-shot Three.js games](https://www.aiezz.com/en/tutorial/tutorial-8f972e0c24acb1360c24d051)
- [Opus 5.5 demos, curated](https://github.com/magiccreator-ai/awesome-claude-opus-5-5-demos)
- [Opus 5.5 examples (aiidelist)](https://aiidelist.com/blog/claude-opus-5-5-examples)
