/**
 * Date formatting for content records.
 *
 * Content stores a single ISO `YYYY-MM-DD` string. Everything the UI shows —
 * "5 Sep 2026", or the split day/month/year an event card renders — is derived
 * here, so a record can never drift out of sync with its own display label.
 */

/** A calendar date broken into the parts an event card renders separately. */
export type CalendarDate = {
  day: string
  month: string
  year: string
}

/**
 * Every formatter pins `timeZone: 'UTC'`.
 *
 * A bare `new Date('2026-09-05')` parses as UTC midnight, which is the previous
 * day for anyone west of Greenwich. Formatting without a pinned zone would
 * therefore render the 4th in New York. Pinning UTC makes the output identical
 * for every visitor.
 */
const formatters = {
  day: new Intl.DateTimeFormat('en-GB', { day: 'numeric', timeZone: 'UTC' }),
  month: new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' }),
  year: new Intl.DateTimeFormat('en-GB', { year: 'numeric', timeZone: 'UTC' }),
  full: new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }),
} as const

/** Matches `YYYY-MM-DD`. Content authors should only ever write this shape. */
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Parse an ISO date into a UTC `Date`.
 *
 * Throws on malformed input rather than yielding an `Invalid Date`, so a typo
 * in the content layer fails loudly at module load instead of rendering
 * "Invalid Date" in the browser.
 */
export function parseIsoDate(iso: string): Date {
  if (!ISO_DATE.test(iso)) {
    throw new Error(`Expected an ISO date (YYYY-MM-DD), received "${iso}"`)
  }
  return new Date(`${iso}T00:00:00Z`)
}

/** "24 Sep 2026" */
export function formatDateLabel(iso: string): string {
  return formatters.full.format(parseIsoDate(iso))
}

/** `{ day: '17', month: 'Oct', year: '2026' }` */
export function formatCalendarDate(iso: string): CalendarDate {
  const date = parseIsoDate(iso)
  return {
    day: formatters.day.format(date),
    month: formatters.month.format(date),
    year: formatters.year.format(date),
  }
}

/**
 * Newest first. Used to order feeds, where the content file itself is free to
 * stay in whatever order reads best for whoever maintains it.
 */
export function byDateDescending(a: { date: string }, b: { date: string }): number {
  return b.date.localeCompare(a.date)
}
