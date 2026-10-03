import { staggerReveal } from '../../lib/motion'
import { useGsapSection } from '../../hooks/useGsapSection'
import { staff } from '../../content/staff'
import { paths } from '../../content/paths'
import { Section, SectionHeading } from '../ui/Section'

export function StaffPreview() {
  const root = useGsapSection<HTMLElement>((section, scope) => {
    staggerReveal(scope('[data-anim="card"]'), {
      trigger: section,
      from: { y: 40, scale: 0.96 },
      to: { duration: 0.8 },
    })
  })

  return (
    <Section id="academic-staff" ref={root}>
      <SectionHeading
        index="06"
        eyebrow="People"
        title="Academic Staff"
        action={{ to: paths.academicStaff, label: 'View All' }}
      />

      <div className="grid grid-cols-2 gap-1 max-lg:grid-cols-1">
        {staff.map((member) => (
          <article
            key={member.name}
            data-anim="card"
            className="flex gap-6 border border-line bg-white p-8 will-change-transform transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center border border-accent-border bg-accent-bg"
              aria-hidden="true"
            >
              <span className="text-md font-bold tracking-[0.02em] text-accent">
                {member.initials}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-md font-semibold tracking-[-0.015em] text-ink-900">
                {member.name}
              </h3>
              <p className="text-sm text-ink-500">{member.designation}</p>
              <p className="mt-1 text-xs tracking-[0.02em] text-ink-400">{member.expertise}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
