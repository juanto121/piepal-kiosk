# PiePal Self-Serve POS — MVP Spec

A friendly, single-screen kiosk for piepal.co that runs all day on a screen in the office. A customer walks up, picks one of (at most) two pies, scans a QR code to pay, and grabs their pie. The mascot is a dinosaur that loves pies.

---

## 1. Goals

- **Dead simple:** a first-time visitor can buy a pie in under 30 seconds, with no instructions.
- **One decision per screen:** idle → pick pie → pay → thanks.
- **Delightful:** the dino mascot gives the kiosk its personality and pulls people over.
- **Unattended:** runs 24/7 in a browser in kiosk/fullscreen mode, and resets itself.
- **Knows its stock:** tracks how many pies of each kind are left and shows "sold out" automatically.

## 2. Non-goals (not in the MVP)

- Cart, quantities > 1, or mixing pies in one order
- User accounts, login, loyalty points
- Automatic payment confirmation (see §5)
- Admin dashboard, sales analytics (only a simple local sales log, see §6)
- Stock synced across multiple devices (single kiosk only)
- Languages beyond Spanish and English

---

## 3. Screen flow

```
┌──────────┐   tap    ┌──────────┐   tap pie   ┌──────────────┐  "Ya pagué"   ┌──────────┐
│  IDLE    │ ───────▶ │  CHOOSE  │ ──────────▶ │     PAY      │ ────────────▶ │  THANKS  │
│ (attract)│          │  2 pies  │             │ QR + 2:00 ⏱  │  stock −1     │  enjoy!  │
└──────────┘          └──────────┘             └──────────────┘               └──────────┘
     ▲                     │ 60s idle            │ back: no stock change          │ 8s
     │                     │                     │ 2:00 timeout: stock −1         │
     └─────────────────────┴─────────────────────┴────────────────────────────────┘
```

### 3.1 Idle / attract screen
- Big PiePal logo + the dino sniffing the air or drooling at a pie (looping animation).
- Headline (brand line): **"La IA no hace pies"** / **"AI doesn't make pies"**
- Subline / call to action below it: "¿Antojo? Toca para pedir tu pie 🥧"
- The whole screen is the tap target.
- Optional: a slow, gentle bob or blink animation so it reads as "alive", not frozen.
- If **both** pies are sold out: show the dino with an empty plate and "Se acabaron los pies por hoy 🦖" instead of the tap prompt; tapping does nothing.

### 3.2 Choose a pie
- Two **large** cards, side by side (stacked on a portrait screen).
- Each card has: photo, pie name, one-line description, **price in big type**.
- When a pie has **3 or fewer** left, show a small badge: "¡Quedan 3!".
- The dino sits between or below the cards and looks toward the card being touched.
- "← Volver" link in a corner (small, secondary).
- If a pie's stock is **0**: grey out the card, disable it, and label it "Agotado — el dino se los comió todos 🦖".

### 3.3 Pay (with 2-minute confirmation timer)
- Header: **"Escanea para pagar"**
- Selected pie name + thumbnail + **total price** (largest text on the screen).
- **QR code**, at least 300×300 px, high contrast, with a quiet zone around it.
- Short instruction: "Escanea el código con la app de tu banco."
- Dino holding a sign / tapping its foot while waiting.
- **Visible countdown starting at 2:00** (e.g. a ring or progress bar around the button, plus `m:ss` text).
  - In the last 30 seconds the countdown turns accent-colored and a nudge appears: "¿Ya pagaste? Toca el botón 👇".
  - The countdown is a fixed window: touches and language switching do **not** reset it.
- Primary button: **"Ya pagué ✓"**
- Secondary: "← Elegir otro pie".

**Outcomes:**

| What happens | Stock | Next screen | Sales log status |
|---|---|---|---|
| Customer taps **"Ya pagué ✓"** before 2:00 runs out | −1 for the chosen pie | Thanks | `confirmed` |
| **2:00 runs out** without the button being tapped | −1 for the chosen pie | Idle | `unconfirmed` |
| Customer taps **"← Elegir otro pie"** | no change | Choose | not logged |

> **Why the timeout still counts as a sale:** the most likely case is that the customer paid on their phone, took the pie, and walked away without tapping the button. Counting it keeps the stock number matching what's physically left. Because it's logged as `unconfirmed`, the owner can check those entries against the payment app (see §6.2).

- **Reload safety:** the pending order (pie id + start time) is saved to device storage when the Pay screen opens. If the kiosk reloads or crashes mid-countdown, on startup it resolves that pending order as a timeout (stock −1, `unconfirmed`) and goes to Idle.

### 3.4 Thanks
- Dino doing a happy chomp / celebration animation (confetti or crumbs optional).
- **"¡Disfruta tu pie! 🦖🥧"**
- Small "Recoge tu pie en [la nevera / la bandeja]" instruction.
- Auto-returns to Idle after ~8 seconds.

### 3.5 Language (Español / English)
- Two buttons, **ES** and **EN**, always visible in the top-right corner of every screen.
- **Default: Español.** The active language button is highlighted (filled); the other is outlined.
- Tapping a button switches all text instantly, staying on the current screen (no reload, no lost selection, Pay countdown keeps running).
- When the kiosk returns to Idle (after a purchase, timeout or inactivity), the language **resets to Español** so the next customer always starts in the default.
- Each button ≥ 64 px tall, like every other tap target. Labels can include a flag emoji (🇨🇴 ES / 🇺🇸 EN) but must also show the text code.
- All UI copy lives in a translations file (`i18n/es.json`, `i18n/en.json`); pie names and descriptions are translated in `pies.json` (see §6).

### 3.6 Copy (ES / EN)

| Key | Español (default) | English |
|---|---|---|
| Idle headline | La IA no hace pies | AI doesn't make pies |
| Idle call to action | ¿Antojo? Toca para pedir tu pie 🥧 | Hungry? Tap to get pie 🥧 |
| All sold out | Se acabaron los pies por hoy 🦖 | All out of pie for today 🦖 |
| Choose title | Elige tu pie | Pick your pie |
| Low stock badge | ¡Quedan {n}! | Only {n} left! |
| Back | ← Volver | ← Back |
| Sold out | Agotado — el dino se los comió todos 🦖 | Sold out — the dino ate them all 🦖 |
| Pay title | Escanea para pagar | Scan to pay |
| Pay instruction | Escanea el código con la app de tu banco. | Scan the code with your banking app. |
| Countdown nudge | ¿Ya pagaste? Toca el botón 👇 | Paid already? Tap the button 👇 |
| Paid button | Ya pagué ✓ | I've paid ✓ |
| Change pie | ← Elegir otro pie | ← Choose a different pie |
| Thanks title | ¡Disfruta tu pie! 🦖🥧 | Enjoy your pie! 🦖🥧 |
| Pickup note | Recoge tu pie en [la nevera / la bandeja] | Grab your pie from [the fridge / the tray] |
| Pie: Berries | Pie de frutos rojos | Berry pie |
| Pie: Lemon | Pie de limón | Lemon pie |

---

## 4. Content needed from the owner

| Item | Notes |
|---|---|
| Pie #1: **Berries**, $8.000 COP, **10 units** | Need: description + square photo, ≥ 800×800 px |
| Pie #2: **Lemon**, $8.000 COP, **10 units** | Need: description + square photo, ≥ 800×800 px |
| Payment QR or payment link | Both pies cost the same, so a single $8.000 COP QR can serve both |
| Dino mascot art | Poses: idle, looking, waiting, celebrating, empty plate (SVG or PNG/Lottie) |
| Logo | SVG preferred |
| Where the pies are picked up | Text for the Thanks screen |
| Owner PIN | 4 digits, for the restock panel (§6.1) |
| Currency | COP ✓ |

---

## 5. Payments (MVP approach)

**MVP = static QR per pie, honor system.**

- Each pie has its own payment link / QR (from your payment provider) with the amount pre-set to $8.000 COP. Since both pies cost the same, one shared QR also works; the config still allows a separate one per pie in case prices diverge later.
- The kiosk only *displays* the QR; it never handles money or card data.
- "Ya pagué" is trust-based, like an office honesty box. The 2-minute timer (§3.3) decides what happens to stock if it's never tapped.

**Later (v2):** generate a unique payment per order via the provider's API and show "Pago recibido ✓" automatically via webhook. This replaces the button + timer and needs a small backend.

---

## 6. Configuration & stock

Menu and starting stock are editable in **one config file** (e.g. `pies.json`), so changing prices or the menu never requires code changes:

```json
{
  "currency": "COP",
  "defaultLanguage": "es",
  "paymentTimeoutSeconds": 120,
  "lowStockThreshold": 3,
  "pickupNote": {
    "es": "Recoge tu pie en la nevera de la izquierda.",
    "en": "Grab your pie from the fridge on the left."
  },
  "pies": [
    {
      "id": "berries",
      "name": { "es": "Pie de frutos rojos", "en": "Berry pie" },
      "description": {
        "es": "Frutos rojos con masa de mantequilla.",
        "en": "Mixed berries, buttery crust."
      },
      "price": 8000,
      "initialStock": 10,
      "image": "/pies/berries.jpg",
      "paymentUrl": "https://..."
    },
    {
      "id": "lemon",
      "name": { "es": "Pie de limón", "en": "Lemon pie" },
      "description": {
        "es": "Relleno cítrico de limón con masa de mantequilla.",
        "en": "Zesty lemon filling, buttery crust."
      },
      "price": 8000,
      "initialStock": 10,
      "image": "/pies/lemon.jpg",
      "paymentUrl": "https://..."
    }
  ]
}
```

- The QR code is generated on the client from `paymentUrl` (or a provided QR image is used directly).
- Descriptions above are placeholders. Prices are shown as **$8.000 COP** in both languages (Colombian format: `.` as thousands separator), since payment is always in COP.
- **Current stock** is stored on the kiosk device (browser storage), seeded from `initialStock` (10 each) on first run. It survives reloads and reboots. Stock never goes below 0.

### 6.1 Owner restock panel (hidden)
- Opened by **long-pressing the logo for 5 seconds** on the Idle screen, then entering the owner PIN.
- Shows each pie with its current count and **− / +** buttons, plus **"Reiniciar a 10"** (reset to `initialStock`).
- Shows today's sales log (§6.2).
- Closes automatically after 60 s of inactivity and returns to Idle.

### 6.2 Sales log (local)
- Each stock decrease writes an entry: `{ time, pieId, price, status: "confirmed" | "unconfirmed" }`.
- Shown in the restock panel with totals per pie and per status, so the owner can compare `unconfirmed` sales against the payment app.

---

## 7. Visual & brand direction

- **Palette:** crust gold + cream base, with each pie owning an accent: berry purple/red for Berries, sunny yellow for Lemon. Dark brown text. One accent color for primary buttons.
- **Type:** rounded, friendly display font (e.g. Fredoka or Baloo 2) + a clean body font.
- **Shapes:** generous border-radius, soft shadows, wavy "pie crust" dividers.
- **Tone of copy:** short, warm, a little silly; the dino "speaks" in first person sometimes ("Yo pediría el de limón. Solo digo." / "I'd pick the lemon one. Just saying."). Spanish copy should read as natural Colombian Spanish, not a literal translation (use "tú", "celular", "nevera").
- **Inspiration:** Duolingo's reactive mascot, Honeybear Bake Shop / Sugarfire Pie landing pages, minimal self-order kiosk concepts on Dribbble.

---

## 8. Kiosk & UX requirements

- **Touch-first:** all tap targets ≥ 64 px; no hover-only interactions.
- **Readable from ~1.5 m:** prices, headlines and the countdown ≥ 48 px.
- **Inactivity reset:** Choose returns to Idle after 60 s without a touch. Pay is governed only by its 2-minute timer (§3.3).
- **Fullscreen:** no browser UI, no scrollbars, no text selection, no right-click/long-press menus (except the hidden owner long-press), no pinch zoom.
- **Orientation:** works in both landscape and portrait.
- **Offline-tolerant:** assets cached and stock stored locally, so the UI keeps working if Wi-Fi blips (the customer's phone handles the actual payment).
- **Screen burn-in:** idle animation keeps the dino and elements gently moving.
- **Accessibility:** high contrast text, no info conveyed by color alone, animations are subtle (respect `prefers-reduced-motion`).

---

## 9. Tech (suggested)

- Static single-page app (e.g. Next.js or plain Vite + React), hosted on Vercel at `piepal.co/kiosk` or similar.
- Client-side QR generation library (e.g. `qrcode`).
- Simple i18n: two JSON dictionaries (`es`, `en`) + a language state in the app; no i18n framework needed for this size. Set `<html lang>` to match the active language.
- Stock, pending order and sales log in `localStorage` on the kiosk device. Fine for one kiosk; move to a small database in v2 for remote restock and multiple devices.
- Countdown computed from the saved start timestamp (not a decrementing counter), so it stays accurate if the tab is throttled or reloaded.
- Run on the office device in browser kiosk mode (e.g. Chrome `--kiosk`), with auto-launch on boot.

---

## 10. MVP acceptance checklist

**Flow**
- [ ] Idle screen with animated dino; tapping anywhere goes to Choose
- [ ] Choose screen shows both pies from config with name, photo, price
- [ ] Pay screen shows the correct QR + price for the chosen pie
- [ ] Scanning the QR on a phone opens the right payment with the right amount
- [ ] "Ya pagué" → Thanks → auto-return to Idle
- [ ] Choose returns to Idle after 60 s of inactivity
- [ ] Runs fullscreen on the office device for a full day without manual intervention
- [ ] Changing a price in config updates the kiosk without code changes

**Payment timer & stock**
- [ ] First run starts with 10 Berries and 10 Lemon
- [ ] Pay screen shows a 2:00 countdown; touches and language switches don't reset it
- [ ] Tapping "Ya pagué" decreases the chosen pie's stock by 1 and logs `confirmed`
- [ ] Letting the countdown reach 0:00 decreases the chosen pie's stock by 1, logs `unconfirmed`, and returns to Idle
- [ ] Tapping "← Elegir otro pie" does not change stock
- [ ] Reloading the kiosk mid-countdown resolves the pending order as a timeout on startup
- [ ] A pie with stock 0 is shown as "Agotado" and can't be selected
- [ ] "¡Quedan {n}!" badge appears at 3 or fewer
- [ ] Both pies at 0 → Idle shows "Se acabaron los pies por hoy"
- [ ] Stock survives a browser restart
- [ ] Owner can open the hidden panel (long-press + PIN), adjust stock, reset to 10, and see the sales log

**Language**
- [ ] Kiosk starts in Español; ES / EN buttons are visible on every screen
- [ ] Switching language updates all text instantly without leaving the current screen
- [ ] Language resets to Español when the kiosk returns to Idle
- [ ] No untranslated strings in either language

---

## 11. Post-MVP ideas

1. Automatic payment confirmation (webhook) instead of the button + timer
2. Stock stored in a database, with remote restock / sold-out toggle from the owner's phone
3. Daily sales summary sent to the owner
4. Dino reacts to time of day ("¿Pie de desayuno? No te juzgo.")
5. Chrome-dino-style mini-game on the idle screen as an easter egg
6. Public landing page at piepal.co reusing the same brand and mascot
