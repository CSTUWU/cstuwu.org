export type Event = {
  date: string
  title: string
  location: string
  description: string
  /** Root-relative asset path; rebased onto `BASE_URL` by `lib/assets.ts`. */
  image: string
  category?: string
  status?: string
  time?: string
}

export const events: Event[] = [
  {
    date: '2026-10-17',
    title: 'CST Orientation Programme',
    location: 'Main Auditorium, UWU',
    description:
      'Introduction to the programme, degree structure, laboratories and student organisations for the new intake.',
    image: '/images/events/orientation.jpg',
    category: 'Academic Convocation',
    status: 'Upcoming',
    time: '09:00 — 14:00',
  },
  {
    date: '2026-11-07',
    title: 'Inter-University Build Hackathon',
    location: 'Computing Laboratory Complex, UWU',
    description:
      'A weekend of team-based software and hardware builds judged by faculty and industry partners.',
    image: '/images/events/hackathon.jpg',
    category: 'Software & Hardware Build',
    status: 'Registration Open',
    time: '48h Sprint',
  },
  {
    date: '2027-01-23',
    title: 'Alumni and Industry Day',
    location: 'University Main Hall, Badulla',
    description:
      'Graduates and industry partners meet current students to share research, career paths and internship routes.',
    image: '/images/events/alumni-day.jpg',
    category: 'Industry & Careers',
    status: 'Confirmed',
    time: '10:00 — 17:00',
  },
]
