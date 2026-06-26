# Design

## Color Strategy

**Committed** — amber/honey carries 30–60% of surfaces. The brand IS the color.

### Scene sentence

*"A developer at their terminal during golden hour. Warm amber light spills across the screen. Outside the window, a whale breaches — urgent, hopeful, defiant."*

### Palette (OKLCH)

| Role | Value | Notes |
|---|---|---|
| **bg** | `oklch(1.000 0.000 0)` | Pure white. Let amber carry the warmth. |
| **surface** | `oklch(0.970 0.005 75)` | Near-white, barely warm. Cards, panels. |
| **ink** | `oklch(0.10 0.015 250)` | Deep navy. ≥7:1 vs bg. |
| **primary** | `oklch(0.817 0.161 75)` | Honey/amber seed. The brand anchor. |
| **accent** | `oklch(0.75 0.12 190)` | Ocean teal. Distinct hue + lightness from primary. |
| **muted** | `oklch(0.25 0.008 250)` | Muted navy. ≥3.5:1 vs bg. |

### Text-on-color fills

- On primary (amber L=0.817): dark text (ink) for contrast — primary is pale enough.
- On accent (teal L=0.75): dark text (ink) — also pale enough.
- On saturated mid-luminance fills (if any): white text.

## Typography

### Font selection procedure

Brand-voice words: **urgent, oceanic, rebellious**

Three fonts to reach for by reflex and then reject from the reflex-reject list:
- ~~Inter~~ (reflex-reject) → **Sora** (geometric, warm, readable)
- ~~Playfair Display~~ (reflex-reject) → **Bungee** (shouty, activist-poster energy, bold display)
- ~~Space Grotesk~~ (reflex-reject) → **Onest** (warm humanist sans for body)

Final pairing:
- **Display / headings**: Bungee — bold, shouty, campaign-poster energy. All-caps allowed for short phrases.
- **Body**: Sora — warm geometric sans, readable at length, distinct from Bungee on the contrast axis.

### Scale

Modular scale, fluid `clamp()` for headings, ≥1.25 ratio.

## Layout

- Asymmetric compositions. Break grid for emphasis.
- Fluid spacing with `clamp()`. Varied rhythm: tight groupings, generous separations.
- One dominant idea per fold. Long scroll, deliberate pacing.
- No card grids. Different section shapes.

## Imagery

- Real Unsplash photos: orca/whale, ocean, sunset, developer terminal.
- Verified URLs before referencing.
- Alt text is part of the voice.
- Hero imagery carries the visual weight — not CSS scenery.

## Motion

- One signature hero entrance. Everything else quieter.
- Ocean wave animation (CSS).
- Reduced motion: all animations have `prefers-reduced-motion` fallback.
- No section-by-section fade-reveal. Reserve scroll-triggered motion for the impact counters.
