# blog

Aniket Ghosh's writing hub — a running index of everything published across
LessWrong, Substack, and Medium, plus the occasional piece written natively
here. The site is a **bridge**: it does not copy-paste content from other
platforms; each entry links out to wherever the piece actually lives.

Built with Astro. Design matches the [portfolio](https://itsme-aniketghosh.github.io):
warm cream on near-black, two-tone (no accent hue), Playfair Display / Onest /
JetBrains Mono. See [CLAUDE.md](./CLAUDE.md) for the full design brief.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # static output to dist/
npm run preview    # serve the build
npm run check      # type + content-schema validation
npm run format     # prettier (incl. prettier-plugin-astro)
```

## Adding writing

Create a Markdown/MDX file in `src/content/posts/`. Two shapes:

**External (the common case)** — a pointer to a piece hosted elsewhere. The
card links straight out; nothing is copied here.

```yaml
---
title: "…"
description: "One honest sentence."
kind: research        # research | personal
pubDate: 2026-07-20
tags: ["interpretability"]
url: "https://www.lesswrong.com/posts/…"   # where it lives
platform: lesswrong                         # lesswrong | substack | medium
---
```

**Native** — written here. Omit `url`; the MDX body renders in a local reader
with math, code highlighting, and side-notes.

```yaml
---
title: "…"
description: "…"
kind: research
pubDate: 2026-07-20
tags: ["mech-interp"]
math: true                    # only loads KaTeX when true
crosspost:                    # optional mirrors, shown as "Also on"
  lesswrong: "https://…"
---
```

- Math: `$…$` / `$$…$$` (needs `math: true`).
- Code: fenced blocks with a language and optional `title=`.
- Side-notes: `<SideNote>…</SideNote>` inside MDX (margin note on wide screens,
  inline footnote on mobile).

## Deployment

GitHub Pages **project** site: repo `blog` → `https://itsme-aniketghosh.github.io/blog`.
Pushing to `main` triggers `.github/workflows/deploy.yml` (`withastro/action`).
Set the repo's Pages source to **GitHub Actions**.

> Base-path note: this site is served under `/blog`. Use the `href()` helper in
> `src/lib/paths.ts` for internal links — never hard-code `/posts/x`.
