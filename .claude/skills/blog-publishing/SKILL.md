---
name: blog-publishing
description: >-
  Use when adding or publishing a post, or working on Aniket Ghosh's blog — the
  Astro "writing hub" served at itsme-aniketghosh.github.io/blog. Covers the
  site architecture, the external-pointer vs native-post model, the exact
  frontmatter schema, copy-paste templates (Substack / Medium / LessWrong / native
  MDX), how to add a post and deploy it, editing the outbound hub links, and the
  known gotchas (base path, empty-collection message, Node 22 CI, stale content
  cache). Trigger on: "new post", "add a post", "publish", "link my Substack/
  Medium/LessWrong piece", "write on the blog", or any edit under this repo.
---

# Publishing to the blog

## What this site is

A **writing hub / bridge**, not a place that re-hosts other platforms. It's the
running index of everything Aniket publishes and it routes readers *outward* to
wherever each piece actually lives. It does **not** copy-paste content from
Substack / Medium / LessWrong.

- **Stack:** Astro (static), MDX, Tailwind v4, KaTeX (math), Expressive Code.
- **Deployed:** GitHub Pages *project* site → `https://itsme-aniketghosh.github.io/blog`.
- **Repo:** `Itsme-aniketghosh/blog`, default branch `main`. Push to `main` → GitHub Actions builds and deploys automatically.
- **Design:** dark two-tone (warm cream on near-black, no accent hue), Playfair Display / Onest / JetBrains Mono — matches the portfolio. Full brief in `CLAUDE.md`. Don't redesign; match it.

## The one thing to understand: two kinds of entry

Every post is **one file** in `src/content/posts/`. What makes it external vs
native is whether it has a `url`:

| | External (the common case) | Native |
|---|---|---|
| **When** | The piece lives on Substack / Medium / LessWrong | You wrote it here originally |
| **File** | `.md` with frontmatter only (a pointer) | `.mdx` with a real body |
| **`url` field** | Set it (+ `platform`) | Omit it |
| **Result** | Card links straight out; no local page built | Full local reader page with math/code/side-notes |
| **Body text** | Ignored — leave a one-line note | The actual post |

## How to add a post (do this)

1. Pick a template from `templates/` in this skill folder:
   - `substack-external.md`, `medium-external.md`, `lesswrong-external.md` → external pointer
   - `native-research.mdx` or `native-personal.mdx` → written-here post
2. Copy it into `src/content/posts/` and rename to a URL-friendly slug, e.g.
   `src/content/posts/attention-heads-are-weird.md`. The filename (minus
   extension) becomes the slug for native posts.
3. Edit the frontmatter (see schema below). For external, set `url` + `platform`.
4. Preview: `npm run dev` → open `http://localhost:4321/blog`.
5. Publish: commit and push to `main`.
   ```bash
   git add src/content/posts/
   git commit -m "Add post: <title>"
   git push
   ```
   GitHub Actions deploys in ~1 min. Confirm at the live URL.

That's it. No index to update, no nav to touch — the home "Recent", the `/posts`
archive, the kind filter, and `/rss.xml` all pick it up automatically from the
frontmatter.

## Frontmatter schema (enforced in `src/content.config.ts`)

```yaml
title: "…"                    # required
description: "…"              # required — one honest sentence (cards + RSS + OG)
kind: "research"              # required — "research" | "personal"
pubDate: 2026-07-24           # required — YYYY-MM-DD
updated: 2026-07-30           # optional
tags: ["interpretability"]    # optional
draft: false                  # optional — true hides it from build
featured: false               # optional

# --- Bridge (set these for an EXTERNAL pointer; omit for native) ---
url: "https://…"              # where the full piece lives
platform: "substack"          # "lesswrong" | "substack" | "medium" | "site"

# --- Native-only ---
math: true                    # optional — only loads KaTeX when true
crosspost:                    # optional mirrors, rendered as "Also on"
  lesswrong: "https://…"
  substack: "https://…"
  medium: "https://…"
```

Rules:
- `kind` drives affordances, not sections: `research` reads like a paper (math,
  side-notes, a "discuss on LessWrong" note); `personal` reads like an essay.
  Both share one design and one unified archive stream with a quiet filter.
- If `url` is set the entry is a pointer — no local page, nothing duplicated.
- `draft: true` removes a post from the build entirely (use for WIP).

## Native authoring (only for `.mdx` posts you write here)

- **Math:** set `math: true`, then use `$x^2$` inline or `$$ … $$` display. KaTeX
  CSS loads only on pages that set `math: true`.
- **Code:** fenced blocks with a language and optional title:
  ~~~
  ```python title="example.py"
  print("hi")
  ```
  ~~~
- **Side-notes** (the signature element): `<SideNote>…</SideNote>` anywhere in the
  MDX. Margin note on wide screens, tap-to-expand inline footnote on mobile. No
  import needed — it's injected into scope.

## Editing the outbound hub links

The home-page "Elsewhere" section and platform labels come from `src/lib/site.ts`.
Update the URLs there if a handle changes (Substack/Medium/LessWrong/Portfolio).

## Commands

```
npm install        # first time / new laptop
npm run dev        # local server at /blog
npm run build      # static output to dist/
npm run preview    # serve the build
npm run check      # type + content-schema validation (keep at 0 errors)
```

## Gotchas (things that will bite on a fresh session)

- **Base path.** The site is served under `/blog`. For internal links in code use
  `href()` from `src/lib/paths.ts` — never hard-code `/posts/x` (breaks in prod).
- **"The collection posts is empty" at build.** Harmless info message when there
  are zero posts. Disappears once a post exists.
- **CI needs Node 22.** `.github/workflows/deploy.yml` pins `node-version: 22`
  (Astro requires ≥22.12; the action defaults to 20). Don't lower it.
- **Deleted a post but it still shows / build errors with the old slug?** Astro's
  content layer caches in `node_modules/.astro/data-store.json`. Clear it:
  `rm -rf .astro node_modules/.astro dist && npm run build`.
- **Design.** No color accent, no light mode, no neural-net motifs. Match the
  portfolio. When two options are close, ship the calmer one.
```
