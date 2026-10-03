import { describe, expect, it } from 'vitest'
import { ROUTES, normalisePath, resolveRoute } from './routes'
import { paths } from '../content/paths'

describe('normalisePath', () => {
  it('strips a trailing slash so /about/ and /about resolve identically', () => {
    expect(normalisePath('/about/')).toBe('/about')
    expect(normalisePath('/about///')).toBe('/about')
  })

  it('leaves the root path alone, which is already normalised', () => {
    expect(normalisePath('/')).toBe('/')
  })

  it('does not turn an empty string into the root path', () => {
    // `/`.replace(/\/+$/, '') is '', not '/'. Guarding on length > 1 keeps it
    // that way, and keeps '' from resolving as the home page.
    expect(normalisePath('')).toBe('')
  })
})

describe('resolveRoute', () => {
  it('has metadata for every navigable page except the home page', () => {
    for (const [key, href] of Object.entries(paths)) {
      if (key === 'home') continue
      expect(resolveRoute(href), `no metadata for ${href}`).not.toBeNull()
    }
  })

  it('resolves a trailing-slashed path the same as the bare one', () => {
    expect(resolveRoute('/about/')).toEqual(resolveRoute('/about'))
  })

  it('serves individual announcements from their section, since they have no page yet', () => {
    const route = resolveRoute('/news/announcements/some-notice')

    expect(route?.title).toBe('Announcement')
    expect(route?.breadcrumb).toEqual(['News', 'Announcements', 'Announcement'])
  })

  it('does not treat a path that merely starts with the same letters as an announcement', () => {
    // A prefix match without the trailing slash boundary would claim
    // '/news/announcements-archive' as a single announcement.
    expect(resolveRoute('/news/announcements-archive')).toBeNull()
  })

  it('returns null for the home page, which is a real page rather than a placeholder', () => {
    expect(resolveRoute('/')).toBeNull()
  })

  it.each(['/nope', '/about/nope', '/About', '/about/degre', '/about/degree/extra'])(
    'returns null for the unknown path %s',
    (path) => {
      expect(resolveRoute(path)).toBeNull()
    },
  )
})

describe('ROUTES', () => {
  it('is keyed only by paths from the single source of truth', () => {
    const known = new Set<string>(Object.values(paths))
    for (const href of Object.keys(ROUTES)) {
      expect(known.has(href), `${href} is not in paths`).toBe(true)
    }
  })

  it('gives every entry a non-empty title, description and breadcrumb', () => {
    for (const [href, meta] of Object.entries(ROUTES)) {
      expect(meta.title.length, `${href} title`).toBeGreaterThan(0)
      expect(meta.description.length, `${href} description`).toBeGreaterThan(0)
      expect(meta.breadcrumb.length, `${href} breadcrumb`).toBeGreaterThan(0)
    }
  })
})