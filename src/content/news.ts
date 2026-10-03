import { paths } from './paths'

/** Route prefix for a single announcement. */
export const ANNOUNCEMENTS_PATH = paths.announcements

/** Where the "all academic updates" list lives. */
export const ACADEMIC_UPDATES_PATH = paths.academicUpdates

export type Announcement = {
  slug: string
  /** ISO `YYYY-MM-DD`. Display text is derived — never store a label. */
  date: string
  category: string
  title: string
}

export const announcements: Announcement[] = [
  {
    slug: 'student-intake-2026-2027',
    date: '2026-09-24',
    category: 'Admissions',
    title: 'Student intake for the 2026/2027 academic year',
  },
  {
    slug: 'undergraduate-research-symmetryposium',
    date: '2026-09-12',
    category: 'Research',
    title: 'Undergraduate research symposium — abstract submissions now open',
  },
  {
    slug: 'extended-laboratory-access-hours',
    date: '2026-08-30',
    category: 'Facilities',
    title: 'Extended computing laboratory access hours for the semester',
  },
  {
    slug: 'industry-internship-placements',
    date: '2026-08-18',
    category: 'Careers',
    title: 'Industry internship placements open to third-year students',
  },
]

export type AcademicUpdateKind = 'Examinations' | 'Timetable' | 'Calendar' | 'Registration'

export type AcademicUpdate = {
  date: string
  kind: AcademicUpdateKind
  title: string
}

export const academicUpdates: AcademicUpdate[] = [
  {
    date: '2026-09-20',
    kind: 'Timetable',
    title: 'Semester 1 lecture timetable published for all year groups',
  },
  {
    date: '2026-09-15',
    kind: 'Examinations',
    title: 'Mid-semester examination schedule released',
  },
  {
    date: '2026-09-05',
    kind: 'Calendar',
    title: 'Academic calendar for the 2026/2027 academic year',
  },
  {
    date: '2026-08-28',
    kind: 'Registration',
    title: 'Course registration opens for continuing students',
  },
]
