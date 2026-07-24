// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Pages *project* site: repo `blog` served under /blog.
// Every internal link/asset must respect BASE_URL — see src/lib/paths.ts.
export default defineConfig({
  site: 'https://itsme-aniketghosh.github.io',
  base: '/blog',
  trailingSlash: 'ignore',

  markdown: {
    // Astro 7: build the unified pipeline explicitly (replaces the deprecated
    // top-level remarkPlugins/rehypePlugins fields). mdx() extends this.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },

  integrations: [
    // Expressive Code must be registered BEFORE mdx().
    expressiveCode({
      themes: ['github-dark'],
      // Theme the code blocks to the portfolio's two-tone dark palette.
      styleOverrides: {
        borderRadius: '8px',
        borderColor: '#1e1e1e',
        codeFontFamily:
          "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace",
        codeFontSize: '0.85rem',
        codeLineHeight: '1.7',
        frames: {
          editorActiveTabIndicatorTopColor: 'transparent',
          editorTabBarBackground: '#0f0f0f',
          editorBackground: '#0f0f0f',
          terminalBackground: '#0f0f0f',
          terminalTitlebarBackground: '#0f0f0f',
          shadowColor: 'transparent',
        },
        codeBackground: '#0f0f0f',
        scrollbarThumbColor: '#2a2a27',
      },
      defaultProps: {
        wrap: true,
      },
    }),
    mdx(),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
