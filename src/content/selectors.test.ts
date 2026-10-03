import { describe, expect, it } from 'vitest'
import { buildNewsFeed } from './selectors'
import {
  ACADEMIC_UPDATES_PATH,
  ANNOUNCEMENTS_PATH,
  academicUpdates,
  announcements,
  type AcademicUpdate,
  type Announcement,
} from './news'
import { formatDateLabel } from '../lib/date'

const announcement = (over: Partial<Announcement> = {}): Announcement => ({
  slug: 'a-slug',
  date: '2026-09-24',
  category: 'Admissions',
  title: 'An announcement',
  ...over,
})

const update = (over: Partial<AcademicUpdate> = {}): AcademicUpdate => ({
  date: '2026-09-20',
  kind: 'Timetable',
  title: 'An academic update',
  ...over,
})

describe('buildNewsFeed', () => {
  it('returns an empty feed when given nothing', () => {
    expect(buildNewsFeed()).toEqual([])
    expect(buildNewsFeed({})).toEqual([])
    expect(buildNewsFeed({ announcements: [], academicUpdates: [] })).toEqual([])
  })

  it('merges both editorial streams into one list, newest first', () => {
    const feed = buildNewsFeed({
      announcements: [announcement({ slug: 'older', date: '2026-08-01' })],
      academicUpdates: [update({ date: '2026-09-20' })],
    })

    expect(feed.map((item) => item.date)).toEqual(['2026-09-20', '2026-08-01'])
  })

  it('ignores the order of the source arrays', () => {
    const forwards = buildNewsFeed({ announcements, academicUpdates })
    const backwards = buildNewsFeed({
      announcements: [...announcements].reverse(),
      academicUpdates: [...academicUpdates].reverse(),
    })

    expect(backwards.map((item) => item.key)).toEqual(forwards.map((item) => item.key))
  })

  it('does not mutate the arrays it was handed', () => {
    const source = [announcement({ slug: 'a' }), announcement({ slug: 'b', date: '2026-01-01' })]
    const snapshot = [...source]

    buildNewsFeed({ announcements: source })

    expect(source).toEqual(snapshot)
  })

  it('links announcements to their own page and updates to the shared list', () => {
    const feed = buildNewsFeed({
      announcements: [announcement({ slug: 'intake-2026' })],
      academicUpdates: [update()],
    })

    expect(feed.find((i) => i.key.startsWith('announcement:'))?.to).toBe(
      `${ANNOUNCEMENTS_PATH}/intake-2026`,
    )
    expect(feed.find((i) => i.key.startsWith('update:'))?.to).toBe(ACADEMIC_UPDATES_PATH)
  })

  it('derives the display label from the date rather than storing one', () => {
    const feed = buildNewsFeed({ announcements: [announcement({ date: '2026-09-24' })] })

    expect(feed[0].dateLabel).toBe(formatDateLabel('2026-09-24'))
    expect(feed[0].date).toBe('2026-09-24')
  })

  it('includes the date in an update key, since update titles are not unique', () => {
    const feed = buildNewsFeed({
      academicUpdates: [
        update({ date: '2026-09-01', title: 'Same title' }),
        update({ date: '2026-09-02', title: 'Same title' }),
      ],
    })

    expect(new Set(feed.map((i) => i.key)).size).toBe(2)
  })

  it('never repeats a key across the merged feed', () => {
    const feed = buildNewsFeed({ announcements, academicUpdates })
    expect(new Set(feed.map((item) => item.key)).size).toBe(feed.length)
  })

  it('truncates to the newest N, not the first N it happened to read', () => {
    const feed = buildNewsFeed(
      {
        announcements: [announcement({ slug: 'old', date: '2020-01-01' })],
        academicUpdates: [update({ date: '2026-09-20' })],
      },
      1,
    )

    expect(feed).toHaveLength(1)
    expect(feed[0].date).toBe('2026-09-20')
  })

  it('treats a limit of zero as zero, not as unlimited', () => {
    expect(buildNewsFeed({ announcements }, 0)).toEqual([])
  })

  it('produces a fully ordered feed from the real content files', () => {
    const feed = buildNewsFeed({ announcements, academicUpdates })

    expect(feed).toHaveLength(announcements.length + academicUpdates.length)
    // Every date must be >= the one after it.
    expect(feed.map((i) => i.date)).toEqual([...feed.map((i) => i.date)].sort().reverse())
  })
})