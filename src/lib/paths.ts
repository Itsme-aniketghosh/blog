// Base-path-aware helpers. This is a GitHub Pages *project* site served under
// /blog, so every internal href/asset must go through here — a hard-coded
// "/posts/x" resolves to the wrong place in production ("/blog/posts/x").
const BASE = import.meta.env.BASE_URL; // "/blog/" in prod, "/" in some dev setups

/** Build an internal URL that respects the configured base path. */
export function href(path = ''): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  if (!path) return base || '/';
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

/** Build an absolute URL to a static asset in /public (fonts, katex, images). */
export function asset(path: string): string {
  return href(path);
}
