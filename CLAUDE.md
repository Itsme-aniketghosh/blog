# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal **writing hub** for **Aniket Ghosh**. Two registers of writing under one identity:
- **Research** — mechanistic interpretability and AI safety. Often lives on LessWrong / the Alignment Forum.
- **Personal** — life, notes, essays. Often lives on Substack / Medium.

**This site is a bridge, not a mirror.** It is the running index of everything Aniket publishes and it routes readers outward to wherever each piece actually lives. It does **not** copy-paste content from other platforms. Two entry shapes:

- **External (the common case):** an entry that points to a piece hosted elsewhere. Set `url` (+ `platform`); the card links straight out. No local reader page is generated for it.
- **Native (optional):** something written here originally. Omit `url`; the MDX body renders in a local reader with math, code highlighting, and side-notes. `crosspost` may still list mirrors.

The two registers share one design system and one unified stream; they are distinguished by a quiet `kind` signal, not by splitting the site into sections.

Hosting: a standalone GitHub Pages **project** site — repo `blog` → served at `https://itsme-aniketghosh.github.io/blog`. The root `itsme-aniketghosh.github.io` is the separate portfolio/user page.

## Design direction

**Match the portfolio** (`../new portfolio`, a single static `index.html`). The blog inherits its system exactly so the two sites read as one identity.

- **Dark, two-tone, no accent hue.** Warm cream ink on warm near-black. All hierarchy comes from opacity, weight, border, and space — never a color accent. Never `#000` / `#fff`. This is deliberate restraint; any future color must pass "does it add information, or just noise?"
- **Craft is the identity:** flawless typography, code and math rendered better than on any other research blog. Do **not** add neural-net / circuit motifs.
- The site is dark-only (the portfolio has no light mode). If a light mode is ever added, keep it warm and two-tone; do not introduce an accent.

### Tokens — source of truth (`src/styles/global.css`)

```css
--bg:       #0c0c0c   /* near-black, slightly warm */
--surface:  #141414   /* elevated surface */
--surface-2:#0f0f0f   /* code wells, insets */
--text:     #f0ece4   /* warm cream — primary foreground */
--text-rgb: 240 236 228 /* hierarchy via rgb(var(--text-rgb) / a) */
--muted:    #888      /* secondary labels, timestamps */
--border:   #1e1e1e   /* hairlines, card outlines */
--border-strong: #2a2a27
```

Hierarchy trick: instead of extra gray tokens, tint the foreground — `rgb(var(--text-rgb) / 0.62)` for muted body, `/ 0.4` for faint metadata, etc.

**Type — three deliberate roles (self-hosted via Fontsource, matches portfolio):**
- **Display / headings:** `Playfair Display` (700/800/900), tight negative tracking (`-0.02` to `-0.04em`).
- **Body / UI:** `Onest` (variable).
- **Mono / metadata / code:** `JetBrains Mono` (variable) — uppercase, tracked-out (`+0.08` to `+0.12em`) for labels.

**Reading:** body ~1.15rem, line-height 1.75, measure capped at `--measure` (68ch). `text-wrap: balance` on headings, `pretty` on body.

**Space:** generous vertical rhythm; sections ~5rem. Whitespace is a design element — when in doubt, add space, not lines or boxes.

**Motion — subtle, purposeful:**
- Exponential ease-out (`--ease: cubic-bezier(0.16,1,0.3,1)`), springy but restrained.
- Scroll reveal (fade + `translateY`, 80ms stagger) via `.reveal` / `.reveal-stagger` + an IntersectionObserver in `Base.astro`. One orchestrated moment: the home hero's word-rise.
- Never animate layout properties (`width`/`height`/`top`/`left`/`margin`). Banned: entrance animations on everything, scroll-jacking, parallax.
- `prefers-reduced-motion` fully respected; `<noscript>` keeps `.reveal` content visible without JS.

**Signature — spend boldness here:** Tufte-style **side-notes** (`<SideNote>`), margin notes on wide screens, collapsing to a toggled inline aside on mobile. Works with zero JS (checkbox toggle).

### Looks to avoid
No neon/vivid accents. No identical-size card grids (vary rhythm). No serif-body + white-background "academic CV" look. No generic SaaS gradient hero. The restraint is the point.

## Stack

- **Astro 7** (static output). Content Layer API: collections use the `glob` loader; render with the standalone `render(entry)` from `astro:content`; entry slug is `entry.id`.
- **MDX** for native posts.
- **Tailwind v4** via `@tailwindcss/vite` (not the old integration); tokens mirrored into `@theme` in `src/styles/global.css`.
- **Math:** `remark-math` + `rehype-katex`, wired through `markdown.processor: unified({...})` (Astro 7 replaced the top-level `remarkPlugins`/`rehypePlugins` fields). KaTeX CSS is self-hosted in `public/katex/` and linked **only** when a page sets `math: true`.
- **Code:** `astro-expressive-code` (before `mdx()` in the integrations array), themed to the two-tone palette (`#0f0f0f` well, JetBrains Mono, 8px radius).
- **Fonts:** self-hosted via `@fontsource/*` (no CDN, no layout shift).
- **Feeds/SEO:** `@astrojs/rss` (`/rss.xml`) + `@astrojs/sitemap`.
- **`motion`** is installed for future interactions (not yet used).

## Structure

```
blog/
├── astro.config.mjs           # site + base '/blog'; unified() math; expressive-code; tailwind vite
├── src/
│   ├── content.config.ts      # posts collection (glob loader + Zod schema)
│   ├── content/posts/         # .md (external pointers) / .mdx (native)
│   ├── lib/
│   │   ├── paths.ts           # href()/asset() — base-path-aware. USE THESE for internal links.
│   │   └── site.ts            # identity, platform metadata, "Elsewhere" hub links
│   ├── styles/global.css      # tokens (source of truth) + Tailwind @theme + base + reveal
│   ├── layouts/
│   │   ├── Base.astro         # head/meta/OG, nav, footer, reveal observer, conditional KaTeX
│   │   └── Post.astro         # article shell + side-note margin grid + "Also on" bridge
│   ├── components/
│   │   ├── Prose.astro        # reading container (measure + rhythm + prose typography)
│   │   ├── SideNote.astro     # signature margin note (zero-JS toggle)
│   │   ├── PostCard.astro     # archive/home entry — links out (external) or in (native)
│   │   ├── CrosspostLinks.astro # outbound bridge links (primary buttons / inline)
│   │   └── KindFilter.astro   # quiet all/research/personal filter over one stream
│   └── pages/
│       ├── index.astro        # home: hero + Recent + Elsewhere hub
│       ├── posts/index.astro  # unified archive + kind filter
│       ├── posts/[...slug].astro # native reader (getStaticPaths skips external entries)
│       ├── rss.xml.ts         # feed (external items link out, native to local page)
│       └── 404.astro
└── public/
    ├── favicon.svg
    └── katex/                 # self-hosted KaTeX css + fonts
```

## Content workflow

One file per piece in `src/content/posts/`. Frontmatter (enforced in `content.config.ts`):

```yaml
---
title: "Reading a single feature out of a residual stream"
description: "One honest sentence for cards and RSS."
kind: "research"               # "research" | "personal" — drives affordances
pubDate: 2026-07-15
updated: 2026-07-20            # optional
tags: ["interpretability", "mech-interp"]
draft: false
featured: false
# --- Bridge: set url + platform for an EXTERNAL pointer (no local page) ---
url: "https://www.lesswrong.com/posts/..."
platform: "lesswrong"          # lesswrong | substack | medium | site
# --- Native only ---
math: true                     # only loads KaTeX CSS when true
crosspost:                     # optional mirrors, shown as "Also on"
  lesswrong: "https://..."
  substack: "https://..."
  medium: "https://..."
---
```

Conventions:
- **External is the default.** If `url` is set the entry is a pointer — the card links out, no local reader is built, no content is duplicated. Set the canonical URL on the other platform back here where possible.
- **`kind` drives affordances, not sections.** `research` reads like a paper (math, side-notes, LW discussion note); `personal` reads like an essay. Same tokens/type for both. The archive is one unified stream with a quiet `kind` filter.
- **Discussion lives off-site by register:** research → LessWrong / AF; personal → Substack. Never replicate comment threads here.
- Math in `$…$` / `$$…$$` (needs `math: true`). Code fences take a language + optional `title=`. Side-notes via `<SideNote>…</SideNote>` in MDX (auto-injected into scope).

## Writing — copy is design material
- Plain verbs, sentence case, active voice, no filler. Specific beats clever. Sounds like the person wrote it, not an LLM.
- Titles are claims or findings, not clickbait. Descriptions are one honest sentence.
- Empty/error states give direction, not mood (see `404.astro`).

## Commands

```
npm install
npm run dev        # astro dev — local server at /blog
npm run build      # astro build — static output to dist/
npm run preview    # serve the build
npm run check      # astro check — type + content-schema validation (keep at 0/0/0)
npm run format     # prettier (incl. prettier-plugin-astro)
```

## Quality floor — non-negotiable
- Responsive down to ~360px; the reading column never feels cramped or too wide.
- Visible keyboard focus everywhere (`:focus-visible`) — cream ring, since there is no accent.
- `prefers-reduced-motion` fully respected; content never hidden without JS.
- No layout shift: fonts self-hosted; KaTeX self-hosted and loaded only when `math: true`.
- Contrast ≥ WCAG AA on the dark surface.
- Static site — Lighthouse Performance/SEO/Best-Practices near 100.

## Deployment — GitHub Pages
- `astro.config.mjs`: `site: 'https://itsme-aniketghosh.github.io'`, `base: '/blog'`.
- **Base-path gotcha (project pages):** every internal link/asset must respect `base`. Use `href()` / `asset()` from `src/lib/paths.ts` — a hard-coded `/posts/x` breaks in production (real path is `/blog/posts/x`).
- Deploy via GitHub Actions (`.github/workflows/deploy.yml`, `withastro/action`) on push to `main`. Set the repo's Pages source to **GitHub Actions**.

## Working style for Claude Code
- Match complexity to the vision: **minimal** direction — precision in spacing, type, and detail is the whole job. Get those pixel-right before adding anything.
- Spend boldness once (the side-notes / the hero moment). Keep everything else quiet; cut decoration that doesn't serve reading.
- Before calling a screen done: check mobile + desktop, reduced-motion on, and keyboard-only nav.
- Prefer removing an element to adding one. When two designs are close, ship the calmer one.
- Note: `.claude/` and `.agents/` contain installed design skills + the "impeccable" design hook (runs after edits / on stop). It's a linter, not a source of truth — this file and the portfolio are.
