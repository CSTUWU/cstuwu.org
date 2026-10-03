import { paths, type PageHref } from '../content/paths'

/**
 * Route metadata for pages that are planned but not yet built.
 *
 * Keyed by href so the placeholder page can show a real title, description and
 * breadcrumb instead of echoing a raw URL.
 */
export type RouteMeta = {
  title: string
  description: string
  breadcrumb: readonly string[]
}

export const ROUTES = {
  [paths.about]: {
    title: 'About the Programme',
    description:
      'The Computer Science and Technology degree programme at Uva Wellassa University: its history, mission and day-to-day life.',
    breadcrumb: ['About'],
  },
  [paths.degree]: {
    title: 'The Degree Programme',
    description:
      'The full Computer Science and Technology degree: eligibility, course units, assessment and career outcomes.',
    breadcrumb: ['About', 'The Degree Programme'],
  },
  [paths.academicStaff]: {
    title: 'Academic Staff',
    description:
      'Lecturers, professors and researchers teaching the programme, with their areas of expertise and current supervision.',
    breadcrumb: ['About', 'Academic Staff'],
  },
  [paths.academics]: {
    title: 'Academics',
    description:
      'Course units, semester structure, assessment and the academic resources that support the programme.',
    breadcrumb: ['Academics'],
  },
  [paths.academicStructure]: {
    title: 'Academic Structure',
    description:
      'The eight-semester structure of the degree, broken down by year with credits and prerequisites.',
    breadcrumb: ['Academics', 'Academic Structure'],
  },
  [paths.academicUpdates]: {
    title: 'Academic Updates',
    description:
      'Examination schedules, timetable changes, academic calendar notices and course registration deadlines.',
    breadcrumb: ['Academics', 'Academic Updates'],
  },
  [paths.academicCalendar]: {
    title: 'Academic Calendar',
    description:
      'Key academic dates for the current year, including teaching weeks and examination periods.',
    breadcrumb: ['Academics', 'Academic Calendar'],
  },
  [paths.projects]: {
    title: 'Student Projects',
    description:
      'Final-year and research projects built by students on the programme, with teams, technologies and outcomes.',
    breadcrumb: ['Student Projects'],
  },
  [paths.studentLife]: {
    title: 'Student Life',
    description:
      'Student organisations, societies, clubs and the community that surrounds the programme at UWU.',
    breadcrumb: ['Student Life'],
  },
  [paths.events]: {
    title: 'Events',
    description:
      'Orientations, hackathons, seminars, competitions and social events run by the programme.',
    breadcrumb: ['Student Life', 'Events'],
  },
  [paths.achievements]: {
    title: 'Student Achievements',
    description:
      'Awards, competition results, hackathon wins, published research and industry recognition earned by students.',
    breadcrumb: ['Student Life', 'Student Achievements'],
  },
  [paths.announcements]: {
    title: 'Announcements',
    description: 'Official notices about the programme, newest first.',
    breadcrumb: ['News', 'Announcements'],
  },
} as const satisfies Record<PageHref, RouteMeta>

/** Every href the router can resolve to a page. */
export type KnownPath = keyof typeof ROUTES

const ANNOUNCEMENT_PREFIX = `${paths.announcements}/`

/**
 * Strip a trailing slash so `/about/` and `/about` resolve identically.
 * The root path is left alone — it is already normalised.
 */
export function normalisePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

/**
 * Look up page metadata for a pathname.
 *
 * Returns `null` for unknown paths, which the placeholder page renders as a 404.
 */
export function resolveRoute(pathname: string): RouteMeta | null {
  const normalised = normalisePath(pathname)

  const direct = (ROUTES as Record<string, RouteMeta>)[normalised]
  if (direct) return direct

  // Individual announcements have no page yet, but their section does.
  if (normalised.startsWith(ANNOUNCEMENT_PREFIX)) {
    return {
      title: 'Announcement',
      description: 'Full announcement text for this notice.',
      breadcrumb: ['News', 'Announcements', 'Announcement'],
    }
  }

  return null
}
