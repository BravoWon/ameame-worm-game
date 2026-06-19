# 🌸 The Endless Bloom — for Ameame

Steer a tiny glowworm, graze the glowing motes, and **bloom** into ever-bigger worlds you grow yourself — flower → garden → meadow → … There's no losing, just wonder. ✨

**▶ Play it:** https://bravowon.github.io/ameame-worm-game/

## How to play
- Steer with the **← →** arrow keys (or **A** / **D**, or tap the big left/right buttons).
- Graze the glowing motes 🌟 to fill the **bloom meter** — when it's full, your world *blooms* into a bigger one.
- What you eat **shapes your worm** (her colors and little parts) and carries upward forever.
- You can't lose — just wiggle, grow, and explore as long as you like 💕

## Dev
Single self-contained `index.html` (Three.js via CDN, no build). `test/` holds Node unit tests that run the game under THREE/DOM stubs — run `node --test test/*.test.js`, or the full gate `verify.ps1` (syntax + suite). Tiers are data-driven, so new worlds and the closing fractal loop are added definitions.
