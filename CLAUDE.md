# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page landing site for STOLYAROV — an architectural/interior-design bureau — modeled on their existing site (stolyarov.pro), redesigned with a more modern look. Plain HTML/CSS/JS, no build step, no dependencies, no package manager.

## Running it

There is no dev server, bundler, or test suite. Just open `index.html` in a browser, or serve the directory statically:

```
python3 -m http.server 8000
```

Deployed via GitHub Pages, source = this branch, root folder. Any push to the branch updates the live URL directly — no CI/build step in between.

## Architecture

- `index.html` — the entire page markup: topbar, hero, advantages, portfolio grid, lightbox modal.
- `assets/css/style.css` — all styles. Custom properties for the palette live at the top of the file (`:root`); the site does not support a dark/light toggle, it's a single fixed brand look.
- `assets/js/main.js` — vanilla JS, no framework. Owns exactly one piece of behavior: the portfolio lightbox (open/close, prev/next, swipe, keyboard nav, thumbnail strip). Gallery content is declared inline as a `galleries` object keyed by project slug (currently just `"chistye-prudy"`) — each entry lists `{src, alt}` for its photos in display order.
- `assets/img/` — real photos plus one placeholder. Project photos live under `assets/img/projects/<project-slug>/`, numbered `01`, `02`, ... in the order they should appear in that project's gallery. `chistye-prudy/01.svg` is a **labeled placeholder** (text on a solid rect saying what real photo belongs there) — the actual sauna photo for that project hasn't been delivered yet. Any other `.svg` under `assets/img` follows the same placeholder convention if one reappears.

### Wiring a new portfolio project

Three places need to agree on the same slug:
1. Add `assets/img/projects/<slug>/01.webp`, `02.webp`, ... (or `.svg` placeholders).
2. Add a `galleries["<slug>"]` entry in `main.js` (title, sub, `images` array in the order thumbnails/lightbox should show them).
3. Add a `.project-card` in the `.portfolio__grid` in `index.html` with `data-gallery="<slug>"`, a cover `<img>`, and the `.project-card__info` caption. Clicking anywhere on `.project-card__media` opens that gallery's lightbox at index 0.

The portfolio grid currently has 4 cards but only one real project exists — the same `chistye-prudy` gallery is intentionally repeated across all 4 card slots as a placeholder until more real projects are ready.

### Hero layout

The hero is the one section with meaningfully different mobile vs. desktop structure, not just resized:
- **Mobile** (default styles): `.hero` stacks as a single column — copy, then the team portrait below the CTA, full width.
- **Desktop** (`min-width: 1080px`): `.hero` becomes a true two-column flex row — `.hero__inner` and `.hero__team` are each `flex: 0 1 50%`, copy top-aligned in the left half, portrait bottom-aligned in the right half. Don't reintroduce `.container`'s auto-centering on `.hero__inner` at this breakpoint — that previously pulled the copy toward the middle of the viewport instead of the left edge.

Most typography and spacing in the hero uses `clamp()` tied to `vw` rather than fixed breakpoint steps, so it scales continuously from phone widths up through ultra-wide monitors — extend that pattern rather than adding fixed pixel values when adjusting hero sizing.

## Known gaps (not bugs — just not done yet)

- The CTA button (`[data-cta="calc"]`) is a stub — logs to console instead of opening the Marquiz quiz widget. Wiring it up is a deliberate later step, not an oversight.
- Only one real portfolio project (`chistye-prudy`) has actual photos; the other 3 grid slots and the sauna photo are placeholders (see above).
