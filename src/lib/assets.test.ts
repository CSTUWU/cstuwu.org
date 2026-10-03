import { afterEach, describe, expect, it, vi } from 'vitest'
import { assetUrl } from './assets'

afterEach(() => {
  vi.unstubAllEnvs()
})

/**
 * `BASE_URL` is `/cstuwu.org/` on GitHub Pages and `/` locally. Content files
 * store root-relative paths, so every asset on the site breaks under the
 * sub-path deployment unless this rebases correctly — and the failure is a
 * silent 404, not an error.
 */
describe('assetUrl', () => {
  it('rebases a root-relative path onto the deployment base', () => {
    vi.stubEnv('BASE_URL', '/cstuwu.org/')
    expect(assetUrl('/images/events/orientation.jpg')).toBe(
      '/cstuwu.org/images/events/orientation.jpg',
    )
  })

  it('normalises the leading slash instead of doubling it', () => {
    vi.stubEnv('BASE_URL', '/cstuwu.org/')
    expect(assetUrl('images/a.jpg')).toBe('/cstuwu.org/images/a.jpg')
  })

  it('treats a path opening with // as already absolute', () => {
    // The protocol-relative branch matches on `//`, so `//cdn…` is passed
    // through untouched rather than rebased into `/cstuwu.org//cdn…`.
    vi.stubEnv('BASE_URL', '/cstuwu.org/')
    expect(assetUrl('//cdn.example.com/a.jpg')).toBe('//cdn.example.com/a.jpg')
  })

  it('is a no-op when the base is the site root', () => {
    vi.stubEnv('BASE_URL', '/')
    expect(assetUrl('/images/a.jpg')).toBe('/images/a.jpg')
  })

  it.each([
    'https://example.com/a.jpg',
    'http://example.com/a.jpg',
    '//cdn.example.com/a.jpg',
    'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
  ])('leaves %s untouched', (input) => {
    vi.stubEnv('BASE_URL', '/cstuwu.org/')
    expect(assetUrl(input)).toBe(input)
  })

  it('passes the empty string through, so it can be used as a conditional src', () => {
    expect(assetUrl('')).toBe('')
  })
})