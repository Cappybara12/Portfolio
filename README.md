# Akshay Kumar Sharma — portfolio

Single-page, scroll-driven pixel-art portfolio. The signature element is a
rotating CD anchored to the bottom of the viewport that acts as the spatial
narrator for the whole experience.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Build for production:

```bash
npm run build && npm start
```

Deploys to Vercel as-is — no extra config required.

## The CD / character system

The rotation, label, and character jump are coordinated by three pieces. If
you change one, you may need to touch the others.

- `app/page.tsx` keeps an `active` track index in state. Every `Section`
  reports when it scrolls into view via `onActive(index)`. That index is
  passed to `PixelCD` along with the label string from `lib/tracks.ts`.
- `components/PixelCD.tsx` watches `activeTrack`. When it changes, the CD
  swaps to the `spin-fast` keyframe for 800ms and tells the character to
  play its `jump-arc` animation for 600ms, then both settle back. The label
  is drawn as SVG text on a curved `<textPath>` so it rotates with the disc.
- `components/PixelCharacter.tsx` renders a 16x16 sprite from a string grid.
  Two walk frames cycle every 220ms; the jump frame is shown for the
  duration of the jump animation.

To add or rename a track, edit `lib/tracks.ts` and add a matching `<Section>`
in `app/page.tsx`. Indexes must stay aligned with the `TRACKS` array.

## Palette

Strict three colors — no grays, no gradients:

- `#000000` background
- `#FFFFFF` text
- `#4F46E5` accent (CD highlights, links, hover, active indicator)

## Reduced motion

`prefers-reduced-motion` disables the CD spin, character walk/jump, star
twinkle, and section slide transitions. Content is shown statically.
