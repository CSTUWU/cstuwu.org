export type StaffMember = {
  name: string
  designation: string
  expertise: string
  initials: string
}

export const staff: StaffMember[] = [
  {
    name: 'Dr. Anuja Bandara',
    designation: 'Head of Department',
    expertise: 'Software Engineering · Distributed Systems',
    initials: 'AB',
  },
  {
    name: 'Dr. Nuwan Rajapaksa',
    designation: 'Professor',
    expertise: 'Machine Learning · Computer Vision',
    initials: 'NR',
  },
  {
    name: 'Dr. Iresha Silva',
    designation: 'Senior Lecturer',
    expertise: 'Algorithms · Computational Theory',
    initials: 'IS',
  },
  {
    name: 'Dr. Chamara Fernando',
    designation: 'Lecturer',
    expertise: 'Computer Networks · Cyber Security',
    initials: 'CF',
  },
]
