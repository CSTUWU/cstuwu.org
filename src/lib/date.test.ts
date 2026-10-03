import { afterAll, describe, expect, it, vi } from 'vitest'
import {
  byDateDescending,
  formatCalendarDate,
  formatDateLabel,
  parseIsoDate,
} from './date'

const ORIGINAL_TZ = process.env.TZ

describe('parseIsoDate', () => {
  it('parses as UTC midnight rather than local midnight', () => {
    // `new Date('2026-09-05')` is UTC midnight, which is the previous day for
    // anyone west of Greenwich. The explicit `Z` keeps the instant pinned.
    expect(parseIsoDate('2026-09-05').toISOString()).toBe('2026-09-05T00:00:00.000Z')
  })

  it.each([
    ['a single-digit month', '2026-9-05'],
    ['a single-digit day', '2026-09-5'],
    ['a two-digit year', '26-09-05'],
    ['slashes instead of hyphens', '2026/09/05'],
    ['a full timestamp', '2026-09-05T00:00:00Z'],
    ['an empty string', ''],
    ['prose', '5 September 2026'],
  ])('rejects %s rather than yielding an Invalid Date', (_case, input) => {
    expect(() => parseIsoDate(input)).toThrowError(/Expected an ISO date/)
  })
})

describe('formatCalendarDate', () => {
  it('splits a date into the parts an event card renders separately', () => {
    const { day, month, year } = formatCalendarDate('2026-01-01')
    expect(day).toBe('1')
    expect(year).toBe('2026')
    expect(month).toMatch(/^[A-Za-z]+$/)
  })
})

/**
 * The regression this module exists to prevent.
 *
 * Formatting an ISO date without a pinned `timeZone` renders the *previous day*
 * for anyone west of Greenwich, so the same content file would show "4 Sep" in
 * New York and "5 Sep" in Colombo. The assertions below compare output across
 * zones rather than against a literal, because the month *abbreviation* varies
 * with the ICU data the host was built against — "Sept" in en-GB versus "Sep" —
 * and pinning that here would make the suite fail on an ICU upgrade instead of
 * on a real bug.
 */
const TIME_ZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Pacific/Kiritimati', // UTC+14, the furthest zone ahead
  'Asia/Colombo',
]

describe('time zone independence', () => {
  afterAll(() => {
    process.env.TZ = ORIGINAL_TZ
  })

  it.each(['2026-01-01', '2026-03-15', '2026-09-05', '2026-12-31'])(
    '%s resolves to the same calendar day in every host time zone',
    async (iso) => {
      const rendered = new Set<string>()

      for (const zone of TIME_ZONES) {
        process.env.TZ = zone
        // The formatters are built at module load, so the module has to be
        // re-evaluated for the new zone to reach them.
        vi.resetModules()
        const { formatCalendarDate: format } = await import('./date')
        rendered.add(JSON.stringify(format(iso)))
      }

      expect(rendered.size).toBe(1)
      expect(formatCalendarDate(iso)).toEqual({
        day: String(Number(iso.slice(8, 10))),
        month: expect.any(String),
        year: iso.slice(0, 4),
      })
    },
  )
})

describe('formatDateLabel', () => {
  it('is the calendar parts joined, so the two can never disagree', () => {
    // Not asserted against a literal: `month: 'short'` is locale data, and the
    // point of the check is that both formatters read the same date.
    const parts = formatCalendarDate('2026-09-05')
    expect(formatDateLabel('2026-09-05')).toBe(
      `${parts.day} ${parts.month} ${parts.year}`,
    )
  })
})

describe('byDateDescending', () => {
  it('sorts newest first', () => {
    // Compares the `date` field of two records, as a feed's `.sort()` receives.
    const records = [{ date: '2026-01-01' }, { date: '2027-06-30' }, { date: '2026-12-31' }]

    expect([...records].sort(byDateDescending).map((r) => r.date)).toEqual([
      '2027-06-30',
      '2026-12-31',
      '2026-01-01',
    ])
  })

  it('reports equal dates as equal, so the sort stays a total order', () => {
    expect(byDateDescending({ date: '2026-01-01' }, { date: '2026-01-01' })).toBe(0)
  })
})