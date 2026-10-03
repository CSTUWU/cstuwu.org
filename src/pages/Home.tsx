import { usePageTitle } from '../hooks/usePageTitle'
import { Hero } from '../components/home/Hero'
import { Marquee } from '../components/home/Marquee'
import { AboutProgramme } from '../components/home/AboutProgramme'
import { DegreeHighlights } from '../components/home/DegreeHighlights'
import { NewsUpdates } from '../components/home/NewsUpdates'
import { StudentProjects } from '../components/home/StudentProjects'
import { EventsGallery } from '../components/home/EventsGallery'
import { StaffPreview } from '../components/home/StaffPreview'
import { FinalCta } from '../components/home/FinalCta'

export function Home() {
  usePageTitle()

  return (
    <>
      <Hero />
      <Marquee />
      <AboutProgramme />
      <DegreeHighlights />
      <NewsUpdates />
      <StudentProjects />
      <EventsGallery />
      <StaffPreview />
      <FinalCta />
    </>
  )
}
