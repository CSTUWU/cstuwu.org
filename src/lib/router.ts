/**
 * Router base path, derived from the build's public base.
 *
 * `vite.config.ts` sets `base` to `/cstuwu.org/` for GitHub Pages and `/`
 * locally. `BrowserRouter` needs the same value without the trailing slash, and
 * reading it here keeps that coupling in one documented place.
 */
export const routerBasename = import.meta.env.BASE_URL.replace(/\/+$/, '')
