export type Highlight = {
  value: string
  label: string
  note: string
  /** Rendered as a "TBC" chip: the figure must come from official programme docs. */
  tbc?: boolean
}

export const highlights: Highlight[] = [
  {
    value: '4',
    label: 'Degree Duration',
    note: 'Full-time undergraduate programme of four academic years.',
  },
  {
    value: '8',
    label: 'Academic Structure',
    note: 'Eight semesters spread across four years of study.',
  },
  {
    value: '—',
    label: 'Academic Credits',
    note: 'Total credit value to be confirmed against the approved programme handbook.',
    tbc: true,
  },
  {
    value: '—',
    label: 'Student Intake',
    note: 'Number of students admitted per academic year.',
    tbc: true,
  },
]
