# AGENTS.md

- Source of truth: `PRODUCT.md` and `DESIGN.md`. Read them before changing UX, copy, palette, typography, motion, or accessibility.
- Real app surface: `index.html`, `style.css`, `script.js`. There is no `package.json`, build pipeline, or test runner in this repo.
- Preview locally with `python3 -m http.server 4173 --bind 127.0.0.1` from the repo root.
- The page is a static campaign site, not a product dashboard. Keep the image-led, long-scroll, one-signature-hero structure.
- Preserve the existing register: amber/honey primary color, ocean accent, `Bungee` for display, `Sora` for body.
- Keep the anti-slop constraints intact: no cream/sand background reset, no gradient text, no frosted glass, no generic card grids, no template marketing layout.
- Maintain accessibility: semantic landmarks/headings, visible focus states, keyboardable nav and share controls, and `prefers-reduced-motion` fallbacks.
- External dependencies are live: Google Fonts, Unsplash images, and GitHub GraphQL reaction fetches in `script.js`.
- The reactions fetch can 403 without auth; the current fallback is to hide the reactions block, so do not rely on that data for core content.
- Preserve the mobile behavior in `script.js` and `style.css` when editing navigation, timeline, share controls, or back-to-top interactions.
- Treat files under `.impeccable/` and `.playwright-mcp/` as generated artifacts, not source.
