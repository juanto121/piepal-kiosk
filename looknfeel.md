# PiePal — Look & Feel

How the PiePal kiosk should look, move and sound. It goes with [MVP.md](MVP.md) (what the kiosk does) and [business.md](business.md) (what PiePal is).

---

## 1. In one sentence

**A warm, cozy bakery counter run by a goofy dinosaur:** cream and crust-gold, chunky rounded shapes, big friendly type, and a mascot who is clearly more excited about pie than you are.

**Headline: "La IA no hace pies" / "AI doesn't make pies."** In a world of screens and software, PiePal is proudly made by human hands. The kiosk is tech, but the pie isn't. This line sets the tone: dry, confident, a little cheeky.

### Feels like
- Warm, homemade, a little silly
- Calm and obvious: one thing to do per screen
- Toy-like and tappable: buttons look like you *want* to press them

### Doesn't feel like
- A bank, a checkout terminal, or a corporate POS
- Busy, cluttered, or "salesy" (no banners, no upsells, no flashing)
- Childish to the point of being hard to read

---

## 2. Color

The base is a warm bakery palette. Each pie owns one accent color, so customers learn "purple = berries, yellow = lemon" at a glance.

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#FFF8EC` | Page background |
| `--cream-deep` | `#F6E9D2` | Card backgrounds, subtle panels |
| `--crust` | `#E8A94B` | Brand accent, wavy dividers, logo, decorative only (not for text) |
| `--crust-dark` | `#B9772A` | Borders, secondary accents |
| `--cocoa` | `#3B2416` | All main text |
| `--cocoa-soft` | `#6E5544` | Secondary text, descriptions |
| `--berry` | `#9B2C5A` | Berries pie accent (card border, badge, button fill with white text) |
| `--berry-light` | `#F6D9E4` | Berries card background tint |
| `--lemon` | `#F5D547` | Lemon pie accent (card border, badge fill with cocoa text) |
| `--lemon-light` | `#FFF3B8` | Lemon card background tint |
| `--dino` | `#6BBF59` | Mascot body, decorative only |
| `--dino-deep` | `#2E7D4F` | Primary action button ("Ya pagué ✓") with white text |
| `--alert` | `#D9541E` | Countdown in last 30 s, low-stock badge |
| `--soldout` | `#CFC6B8` | Greyed-out sold-out cards |

**Rules**
- Text is always `--cocoa` on light backgrounds, or white on `--berry` / `--dino-deep`. Never put text on `--crust`, `--dino` or `--lemon` unless it's `--cocoa`.
- Every text/background pair must meet WCAG AA (4.5:1). Large display text must still meet 3:1.
- Color is never the only signal: sold out also gets a label and a crossed-out plate, and low stock also gets text.
- One kiosk theme only, always light. The kiosk doesn't switch to dark mode.

---

## 3. Typography

| Role | Font | Weight | Size (kiosk) |
|---|---|---|---|
| Price | **Fredoka** | 700 | 72–96 px |
| Headlines | **Fredoka** | 600 | 56–64 px |
| Countdown | **Fredoka** (tabular numbers) | 600 | 48–56 px |
| Buttons | **Fredoka** | 600 | 32–36 px |
| Pie names | **Fredoka** | 600 | 40–48 px |
| Body / descriptions | **Nunito** | 600 | 24–28 px |
| Small print (pickup note, ES/EN labels) | **Nunito** | 700 | 20–22 px |

- Both fonts are on Google Fonts and fully support Spanish accents (á, é, í, ó, ú, ñ, ¿, ¡).
- Fredoka is rounded and chunky, which matches the dino. Nunito keeps descriptions easy to read.
- Everything must be readable from **~1.5 m away**. When in doubt, go bigger.
- Sentence case everywhere ("Elige tu pie", not "ELIGE TU PIE").
- Prices are always formatted `$8.000 COP`.

---

## 4. Shape & surface

- **Rounded everything:** cards `32px` radius, buttons fully pill-shaped, badges pill-shaped.
- **Chunky "pressable" buttons:** solid fill with a darker 6 px bottom edge (like a physical key). On press the button sinks 4 px and the edge shrinks, as on Duolingo.
- **Soft warm shadows:** `0 12px 32px rgba(59, 36, 22, 0.12)`; never grey or black shadows.
- **Wavy crust divider:** a scalloped, pie-crust-edge SVG in `--crust` separates the header from content and frames the bottom of the screen.
- **Subtle texture (optional):** a very faint flour-dust or lattice pattern on `--cream`, at no more than 4% opacity.
- **Generous spacing:** at least 32 px between elements and 48 px+ screen padding. Empty space is a feature.

---

## 5. The dino mascot

**Name:** TBD. Shown on screen as "el dino" until it has one.

### Character
- A round, chubby **T-rex** in `--dino` green with a cream belly.
- **Tiny arms that can barely reach the pie.** That's the running joke.
- Big, friendly eyes; a smile showing one or two rounded teeth (never scary).
- Pie crumbs on the cheek, sometimes a little bib or baker's hat.
- Flat vector style with a thick `--cocoa` outline (3–4 px), matching the chunky UI.

### Poses (one per screen)

| Screen | Pose | Loop |
|---|---|---|
| Idle | Sniffing the air toward a pie, drooling slightly | Gentle bob + blink every 4–6 s |
| Choose | Looking at the card being touched, tail wagging | Eyes follow selection |
| Pay | Holding a sign that points to the QR, tapping its foot | Foot tap; sweats a little in the last 30 s |
| Thanks | Happy chomp with crumbs flying | Plays once, then a contented sway |
| Both sold out | Sitting with an empty plate, sad but cute | Slow sigh |
| Owner panel | No dino. Keep it plain and functional |

### Speech bubbles
- The dino "talks" in short first-person lines in a rounded speech bubble with a tail.
- At most one line per screen, never covering the price or the QR code.
- Examples:
  - Choose: "Yo pediría el de limón. Solo digo." / "I'd pick the lemon one. Just saying."
  - Pay (last 30 s): "¿Ya pagaste? ¡No me hagas esperar!" / "Paid yet? Don't keep me waiting!"
  - Sold out: "Me los comí todos. Lo siento. No lo siento." / "I ate them all. Sorry. Not sorry."

---

## 6. Screen layouts

Landscape layout shown. In portrait, side-by-side areas stack vertically in the same order.

### Idle
```
┌──────────────────────────────────────────────────────┐
│ [PiePal logo]                              [ES][EN]  │
│ ~~~~~~~~~~~~~~~~~~ crust edge ~~~~~~~~~~~~~~~~~~~~~~ │
│                                                      │
│              🦖  (big dino sniffing a pie)           │
│                                                      │
│               La IA no hace pies                     │
│        ¿Antojo? Toca para pedir tu pie 🥧            │
│                                                      │
│ ~~~~~~~~~~~~~~~~~~ crust edge ~~~~~~~~~~~~~~~~~~~~~~ │
└──────────────────────────────────────────────────────┘
```
- The dino takes up roughly 50% of the screen height.
- **"La IA no hace pies"** is the biggest text on the screen (Fredoka 700, 80–96 px, `--cocoa`) and stays perfectly still. It's a deadpan statement, not a sales pitch.
- The call to action below it is smaller (Fredoka 600, 40–48 px) and pulses very gently, so it reads as the thing to tap.

### Choose
```
┌──────────────────────────────────────────────────────┐
│ ← Volver            Elige tu pie           [ES][EN]  │
│                                                      │
│  ┌───────────────────┐   🦖   ┌───────────────────┐  │
│  │  [berries photo]  │        │   [lemon photo]   │  │
│  │ Pie de frutos     │        │ Pie de limón      │  │
│  │ rojos             │        │                   │  │
│  │ short desc        │        │ short desc        │  │
│  │    $8.000 COP     │        │    $8.000 COP     │  │
│  │      ¡Quedan 3!   │        │                   │  │
│  └───────────────────┘        └───────────────────┘  │
│     berry tint + border           lemon tint + border│
└──────────────────────────────────────────────────────┘
```
Each whole card is the tap target. Sold-out cards turn `--soldout`, the photo is desaturated, and an "Agotado" ribbon runs across the corner.

### Pay
```
┌──────────────────────────────────────────────────────┐
│ ← Elegir otro pie   Escanea para pagar     [ES][EN]  │
│                                                      │
│  [thumb] Pie de limón        ┌──────────────┐        │
│                              │              │        │
│     $8.000 COP               │   QR CODE    │  🦖    │
│                              │  (≥300 px)   │ (sign) │
│  Abre la cámara de tu        │              │        │
│  celular y escanea el código └──────────────┘        │
│                                                      │
│            ( ◔ 1:42 )   [   Ya pagué ✓   ]           │
└──────────────────────────────────────────────────────┘
```
- The QR code sits on a pure white tile with a 24 px quiet zone. It's never tinted.
- The countdown is a ring around a `m:ss` label next to the button. The ring is `--dino-deep`, turning `--alert` in the last 30 s.
- "Ya pagué ✓" is the biggest button in the kiosk: full `--dino-deep`, at least 96 px tall.

### Thanks
```
┌──────────────────────────────────────────────────────┐
│                                            [ES][EN]  │
│                 🦖 (happy chomp)                     │
│              ¡Disfruta tu pie! 🦖🥧                  │
│     Recoge tu pie en la nevera de la izquierda.      │
│        · crumbs falling across the screen ·          │
└──────────────────────────────────────────────────────┘
```

### Language toggle
- A pill-shaped segmented control in the top-right corner: `[ ES | EN ]`.
- Active language: filled `--cocoa` with cream text. Inactive: outline only.
- Same position on every screen. It's the only element that never moves.

---

## 7. Motion

Movement should feel **springy and soft**, like dough, never mechanical.

| Element | Animation | Timing |
|---|---|---|
| Screen change | Slide + fade toward the next step | 250 ms, ease-out |
| Button press | Sink 4 px + scale 0.97 | 100 ms in, 150 ms spring out |
| Card tap | Small squish (scale 0.97 → 1.02 → 1) | 250 ms spring |
| Dino idle | Bob up/down 6 px | 3 s loop, ease-in-out |
| Dino blink | Eyes close | 120 ms, every 4–6 s (random) |
| Countdown ring | Smooth continuous drain | Linear, 120 s |
| Last 30 s | Ring color shift + one gentle wobble of the button every 10 s | 400 ms wobble |
| Thanks | Crumb/confetti burst in crust + pie accent colors | 1.2 s, once |
| Low-stock badge | One small bounce when the card appears | 300 ms |

- **Respect `prefers-reduced-motion`:** swap all movement for simple fades, keep the dino static apart from blinking, and skip the crumb burst.
- Nothing flashes or strobes, and nothing moves faster than it needs to.
- The QR code never moves. Phones must be able to scan it instantly.

---

## 8. Sound

- **Muted by default.** It's an office.
- Optional later: a soft "chomp" on the Thanks screen, controlled by a setting in the owner panel.

---

## 9. Voice & copy

- **Short.** Headlines of 2–6 words, at most one sentence of instruction.
- **Warm and direct**, using "tú" and natural Colombian Spanish ("celular", "nevera", "¿Antojo?").
- **The headline is the attitude:** "La IA no hace pies" is said straight, with no exclamation marks or emoji. Other lines can echo the handmade theme ("Hecho a mano, no con prompts" / "Made by hand, not by prompts") but never explain the joke.
- **The dino is the joker, the UI is clear.** Buttons and instructions are always plain and literal; only the dino's speech bubble gets silly.
- Both languages should have the same tone and length, so a switch doesn't reflow the layout. Each one is written to sound natural, not translated word for word.
- Emoji are allowed sparingly: 🥧 🦖 ✓ 👇. At most one per line.

---

## 10. Imagery

- **Pie photos:** shot from slightly above, on a plain light background or cream cloth, with natural light. Show a cut slice so the filling is visible: deep red-purple for berries, bright yellow for lemon.
- All photos in the same style, same angle and the same crop (square).
- No stock photos of people.
- Illustrations (dino, crust edges, crumbs) are flat vector with the same 3–4 px cocoa outline.

---

## 11. Quick checklist

- [ ] Background is cream, never pure white (except behind the QR code)
- [ ] Every screen has exactly one obvious primary action
- [ ] Price and QR code are the most prominent things on the Pay screen
- [ ] The dino appears on every customer screen and never blocks content
- [ ] Berries = berry purple, Lemon = lemon yellow, consistently
- [ ] All text readable from 1.5 m; all tap targets ≥ 64 px
- [ ] Spanish and English versions fit the same layout
- [ ] Reduced motion works and nothing flashes
