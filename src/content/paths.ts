/**
 * Every navigable path in the site, in one place.
 *
 * These strings previously appeared in the nav, the footer, the placeholder
 * suggestions, the content files and the route metadata — six copies of each
 * URL. Deriving everything from this map means a rename happens once, and
 * `RoutePath` gives type-checked links.
 */
export const paths = {
  home: '/',
  about: '/about',
  degree: '/about/degree',
  academicStaff: '/about/academic-staff',
  academics: '/academics',
  academicStructure: '/academics/structure',
  academicUpdates: '/academics/updates',
  academicCalendar: '/academics/calendar',
  projects: '/projects',
  studentLife: '/student-life',
  events: '/student-life/events',
  achievements: '/student-life/achievements',
  announcements: '/news/announcements',
} as const

/** A path the router knows about. */
export type RoutePath = keyof typeof paths

/** `'/about' | '/academics' | ...` — useful for typing link targets. */
export type RouteHref = (typeof paths)[RoutePath]

/**
 * Every href except the home page.
 *
 * The home page has no entry in the route metadata table, because it is a real
 * page rather than a placeholder.
 */
export type PageHref = Exclude<RouteHref, '/'>
