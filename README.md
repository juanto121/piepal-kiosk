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

- `paymentUrl` per pie: the link encoded in the QR. **Empty until you add your payment link**; the Pay screen shows a "missing link" notice instead of a QR.
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
