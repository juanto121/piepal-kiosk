# PiePal mascot poses

Six individual transparent PNG illustrations based on the approved `../piepal-mascot.png`, the original `../../mascotmanual.jpeg`, and the kiosk page descriptions in `../../MVP.md`.

Each file is **1536 × 1024**, RGBA, with a transparent background. These are static poses; movement such as bobbing or foot tapping can be added by the kiosk.

| Page / state | PNG | Pose |
|---|---|---|
| Idle / attract | [piepal-idle.png](piepal-idle.png) | Eyes closed, sniffing a whole pie held near its nose |
| Choose a pie | [piepal-choose.png](piepal-choose.png) | Looking and gesturing up toward the right-hand card |
| Pay | [piepal-pay.png](piepal-pay.png) | Waiting with a left-arrow sign and one lifted foot |
| Thanks | [piepal-thanks.png](piepal-thanks.png) | Happy chomp, bitten pie, crumbs and a lifted foot |
| Both pies sold out | [piepal-sold-out.png](piepal-sold-out.png) | Slumped pose holding an empty plate |
| Owner restock panel | [piepal-owner.png](piepal-owner.png) | Checking two pie icons on a clipboard |

## Use in the kiosk

- Preserve each image's aspect ratio and use `object-fit: contain` so the tail and spikes remain visible.
- Place artwork over the kiosk's cream background (`#FFF8EC`).
- The choose pose looks right. Mirror it horizontally with `transform: scaleX(-1)` to look toward the left-hand card.
- Place the pay mascot to the right of the actual QR tile so its arrow points toward the code. Keep it outside the QR quiet zone.
- Page copy and language controls remain separate from the artwork.
- The owner pose is an extra asset to cover the requested pages. The current look-and-feel guide specifies a plain owner panel; using this asset there would be a design change.
- The sales log belongs to the owner panel, and ES/EN is a control on each page, so they do not need additional page poses.
- Respect `prefers-reduced-motion` if adding animation.

## Preview and provenance

Open [preview.html](preview.html) to see the complete set over the PiePal cream background.

Generated with the built-in image-generation tool. Exact final prompts (plus the idle pose's initial prompt before its facial correction) are saved in [generation-prompts.json](generation-prompts.json).
