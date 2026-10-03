/**
 * Resolve a public asset path against the deployment base.
 *
 * Vite's `BASE_URL` is `/cstuwu.org/` on GitHub Pages and `/` locally. Content
 * files store root-relative paths like `/images/events/orientation.jpg`, which
 * would 404 under a sub-path deployment unless rebased here.
 */
const ABSOLUTE_URL = /^(?:[a-z]+:)?\/\//i
const DATA_URL = /^data:/i

export function assetUrl(path: string): string {
  if (path === '') return path
  if (ABSOLUTE_URL.test(path) || DATA_URL.test(path)) return path

  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\/+/, '')}`
}
