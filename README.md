# PiePal kiosk

Self-serve pie kiosk for piepal.co. Product spec: [MVP.md](MVP.md) · design: [looknfeel.md](looknfeel.md) · business: [business.md](business.md).

Vite + React + TypeScript, static, deployed on Vercel.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # stock / payment-timer logic
npm run build
```

The project `.npmrc` pins the public npm registry so installs work locally and on Vercel.

## Configure

Everything lives in [src/config/pies.json](src/config/pies.json):

- `paymentQrImage` per pie: a ready-made payment QR in `public/`. Currently `/payment-qr.png`, the Bancolombia QR from `assets/qr.png` (static, $8.000 COP built in), shared by both pies. To replace it, update `assets/qr.png` and regenerate the optimized copy:
  ```bash
  python3 -c "from PIL import Image; im=Image.open('assets/qr.png').convert('RGBA'); bg=Image.new('RGBA', im.size, 'white'); bg.alpha_composite(im); bg.convert('L').save('public/payment-qr.png', optimize=True)"
  ```
  If a QR's amount ever differs from the pie's `price`, customers will be charged the QR's amount.
- `paymentUrl` per pie: used only when `paymentQrImage` is not set; the kiosk generates a QR from this link. If both are empty, the Pay screen shows a "missing link" notice.
- `image` per pie: put photos in `public/pies/` and set e.g. `"/pies/lemon.jpg"`. `null` shows the illustrated placeholder.
- `price`, `initialStock`, `paymentTimeoutSeconds`, `lowStockThreshold`, `pickupNote`, `ownerPin`.

UI text is in [src/i18n/es.json](src/i18n/es.json) and [src/i18n/en.json](src/i18n/en.json).

Changes need a redeploy.

## Owner panel

On the start screen, hold the **PiePal** logo for 5 seconds and enter the PIN. From there you can adjust stock, reset it to the initial counts, and see today's sales (confirmed vs. unconfirmed).

Stock and the sales log are stored in the kiosk browser's `localStorage`, so they belong to that one device and browser profile.

## Mascot

Source art is in [assets/mascot-poses](assets/mascot-poses). The kiosk uses WebP copies in `public/mascot/` (1200 px wide):

```bash
for p in idle choose pay thanks sold-out owner; do
  cwebp -quiet -resize 1200 0 -q 88 -alpha_q 100 assets/mascot-poses/piepal-$p.png -o public/mascot/$p.webp
done
```

## Deploy

Vercel detects Vite automatically (build `npm run build`, output `dist`).

```bash
vercel deploy --prod
```

On the office device, open the deployed URL in kiosk mode, e.g. `chrome --kiosk https://<your-domain>`.

## iPad setup

1. In **Safari**, open https://piepal-kiosk.vercel.app → **Share** → **Add to Home Screen**. Keep **Open as Web App** on → **Add**.
2. Open **PiePal** from the Home Screen icon. It runs without Safari's address bar and tabs; only the iPad status bar (clock, battery) stays.
3. Lock the iPad to the kiosk with **Guided Access**: Settings → Accessibility → Guided Access → on, set a passcode, and set **Display Auto-Lock** to *Never*. Open PiePal, triple-click the top button → **Start**. Triple-click + passcode to exit.
4. Keep it plugged in.

The home-screen app has its own storage, separate from Safari: set stock from the owner panel inside the home-screen app.
