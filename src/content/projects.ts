export type Project = {
  /** Display index, e.g. '01'. Presentation-only, so it lives with the record. */
  index: string
  name: string
  team: string
  year: string
  summary: string
  tech: string[]
}

export const projects: Project[] = [
  {
    index: '01',
    name: 'AgriSense',
    team: 'Team Uva — Year 4',
    year: '2025',
    summary:
      'Low-cost soil moisture and crop-disease monitoring for smallholder tea estates across the Uva province.',
    tech: ['IoT', 'React', 'Firebase'],
  },
  {
    index: '02',
    name: 'MediRoute',
    team: 'Team Medi — Year 4',
    year: '2025',
    summary:
      'Clinic queue and triage prototype designed for rural healthcare centres with intermittent connectivity.',
    tech: ['Python', 'FastAPI', 'PostgreSQL'],
  },
  {
    index: '03',
    name: 'Dhala AI',
    team: 'Team Siri — Year 4',
    year: '2026',
    summary:
      'Sinhala and Tamil speech-to-text interfaces for first-time smartphone users and low-literacy communities.',
    tech: ['NLP', 'Python', 'TensorFlow'],
  },
  {
    index: '04',
    name: 'GridWatch',
    team: 'Team Helios — Year 4',
    year: '2024',
    summary:
      'An open dashboard for monitoring rooftop solar output and energy savings across university hostels.',
    tech: ['D3.js', 'ESP32', 'InfluxDB'],
  },
]
