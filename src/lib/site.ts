// Single source of truth for identity + the outbound hub links.
// This site is a bridge: it indexes writing and routes readers to where each
// piece actually lives. Update the URLs below to your real handles.

export const site = {
  title: 'Aniket Ghosh — Writing',
  author: 'Aniket Ghosh',
  description:
    "Aniket Ghosh's writing. Research on what goes on inside neural networks, and essays on most other things. Whatever I publish, wherever it lands, gets tracked here.",
  // Absolute base for RSS/OG. Matches astro.config `site` + `base`.
  url: 'https://itsme-aniketghosh.github.io/blog',
  locale: 'en',
} as const;

export type PlatformId = 'lesswrong' | 'substack' | 'medium' | 'site';

// Platform display metadata. `label` is used on cards/bridge links.
export const platforms: Record<
  Exclude<PlatformId, 'site'>,
  { label: string; verb: string; home: string }
> = {
  lesswrong: {
    label: 'LessWrong',
    verb: 'Read on', // research discussion home
    home: 'https://www.lesswrong.com/users/aniket-ghosh',
  },
  substack: {
    label: 'Substack',
    verb: 'Read on',
    home: 'https://itsmeaniketghosh.substack.com/',
  },
  medium: {
    label: 'Medium',
    verb: 'Read on',
    home: 'https://medium.com/@aniket.ghosh',
  },
};

// The "Elsewhere" hub on the home page — every place a reader can find the work.
export const elsewhere: { label: string; href: string; note: string }[] = [
  {
    label: 'Portfolio',
    href: 'https://itsme-aniketghosh.github.io',
    note: 'What I build. Projects, research, the résumé.',
  },
  {
    label: 'LessWrong',
    href: platforms.lesswrong.home,
    note: 'Where the interpretability work goes.',
  },
  // Hidden until there's actually something to point to there. Un-comment each
  // once the first Substack / Medium piece is up. (The `platforms` labels above
  // still resolve, so any post that sets `platform:` keeps linking out fine.)
  // {
  //   label: 'Substack',
  //   href: platforms.substack.home,
  //   note: 'Essays, straight to your inbox.',
  // },
  // {
  //   label: 'Medium',
  //   href: platforms.medium.home,
  //   note: 'The same essays, mirrored.',
  // },
];
