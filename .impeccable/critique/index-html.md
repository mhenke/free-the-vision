---
target: index.html
total_score: 27
p0_count: 0
p1_count: 1
p2_count: 2
p3_count: 1
date: 2026-06-26
---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active nav state tracks scroll well; timeline markers clearly distinguish GA vs Preview. Minor gap: no loading state while GitHub API fetches reactions. |
| 2 | Match System / Real World | 4 | Developer-native voice throughout. "Free Willy" metaphor is earned, not forced. No jargon leaks. |
| 3 | User Control and Freedom | 3 | Skip link, back-to-top, Escape dismisses mobile nav. Solid. |
| 4 | Consistency and Standards | 2 | Help section uses large numbered steps (1/2/3) that echo the numbered-section-marker pattern the brief bans. Inconsistent with the rest of the page's visual language. |
| 5 | Error Prevention | 3 | External links use `rel="noopener"`. No complex forms to guard. |
| 6 | Recognition Rather Than Recall | 3 | Labeled nav, skip link, section IDs. Clean. |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts. Share buttons are the only efficiency feature. Acceptable for a campaign page, but the single action (upvote discussion) could be more prominent. |
| 8 | Aesthetic and Minimalist Design | 4 | Strong hierarchy, committed color strategy, varied section shapes, no card grids. The amber-to-teal gradient is distinctive. |
| 9 | Error Recovery | 1 | GitHub API failure is completely silent. If the GraphQL call fails, the "11 total reactions" stat stays at `0` with no explanation. Users see a broken number, not a graceful fallback. |
| 10 | Help and Documentation | 2 | Footer has useful external links. No contextual guidance, but acceptable for a campaign page. |
| **Total** | | **27/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment**: Mostly no. The committed amber palette, Bungee display font, and asymmetric section shapes break from the AI monoculture. The "Free Willy" parallel gives it a real voice. However, two patterns are tells:

1. Demand section oversized quotation mark (3em) is a ubiquitous AI layout element.
2. Help section large display-font numbers (1, 2, 3) echo the numbered-section-marker trope.

**Deterministic scan**: Single-font flag is a false positive — project uses Bungee (display) + Sora (body).

## Priority Issues

- **[P1] Silent API failure on reactions**: When GitHub GraphQL call fails, reactions show `0` with no fallback. Fix: hide the stat or show a static fallback.
- **[P2] Help section numbered steps break visual language**: Large Bungee numbers echo banned numbered-section-marker pattern. Fix: replace with icon-based or iconographic treatment.
- **[P2] Demand section quote mark is an AI tell**: Oversized `"` at 3em. Fix: remove or replace with left-border accent.
- **[P3] Whale emoji decorative treatment**: Grayscale + opacity reads as watermark, not character. Fix: commit to it or remove.

## Persona Red Flags

- **Jordan**: Step 3 ("Tell Your Team") assumes knowledge of "file internal requests."
- **Sam**: Timeline horizontal scroll has no keyboard affordance.
- **Riley**: Share buttons use window.open() — no popup-blocker fallback.

## Minor Observations

- Single-instance eyebrow is fine (not repeated per section).
- Reduced motion override for scroll-behavior is correct.
- Image onerror fallback is reasonable.
