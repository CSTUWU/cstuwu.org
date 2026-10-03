import { byDateDescending, formatDateLabel } from '../lib/date'
import {
  ACADEMIC_UPDATES_PATH,
  ANNOUNCEMENTS_PATH,
  type AcademicUpdate,
  type Announcement,
} from './news'

/**
 * Read models.
 *
 * Components should not be doing list merging and sorting inside their render
 * body — that work is derived from content, so it belongs here where it can be
 * tested without mounting anything.
 */

/** A single row in the merged news feed. */
export type NewsFeedItem = {
  /** Stable React key. */
  key: string
  to: string
  category: string
  title: string
  /** ISO `YYYY-MM-DD`, for the `dateTime` attribute on `<time>`. */
  date: string
  /** Human-readable date, derived from `date`. */
  dateLabel: string
}

export type NewsFeedSources = {
  announcements?: readonly Announcement[]
  academicUpdates?: readonly AcademicUpdate[]
}

/**
 * Merge announcements and academic updates into one chronological feed.
 *
 * The two record types are separate because they are separate editorial
 * streams, but the home page presents them as a single list. Sorting happens
 * here rather than at the content-file level so authors can keep each file in
 * whatever order reads best for them.
 */
export function buildNewsFeed(
  {
    announcements = [],
    academicUpdates = [],
  }: NewsFeedSources = {},
  limit = Number.POSITIVE_INFINITY,
): NewsFeedItem[] {
  const fromAnnouncements: NewsFeedItem[] = announcements.map((item) => ({
    key: `announcement:${item.slug}`,
    to: `${ANNOUNCEMENTS_PATH}/${item.slug}`,
    category: item.category,
    title: item.title,
    date: item.date,
    dateLabel: formatDateLabel(item.date),
  }))

  const fromUpdates: NewsFeedItem[] = academicUpdates.map((item) => ({
    // Titles are not guaranteed unique, so include the date to keep keys stable.
    key: `update:${item.date}:${item.title}`,
    to: ACADEMIC_UPDATES_PATH,
    category: item.kind,
    title: item.title,
    date: item.date,
    dateLabel: formatDateLabel(item.date),
  }))

  return [...fromAnnouncements, ...fromUpdates].sort(byDateDescending).slice(0, limit)
}
