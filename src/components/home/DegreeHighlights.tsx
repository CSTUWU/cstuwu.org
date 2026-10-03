import { gsap, staggerReveal } from '../../lib/motion'
import { useGsapSection } from '../../hooks/useGsapSection'
import { highlights } from '../../content/highlights'
import { Section, SectionHeading } from '../ui/Section'

const COUNT_DURATION = 1.5

export function DegreeHighlights() {
  const root = useGsapSection<HTMLElement>((section, scope) => {
    staggerReveal(scope('[data-anim="card"]'), {
      trigger: section,
      from: { y: 60, rotateX: -5 },
    })

    /* Count numeric figures up as they scroll into view. Values marked TBC
       render no `data-count`, so they are skipped. */
    scope('[data-count]').forEach((el) => {
      const target = Number.parseInt(el.getAttribute('data-count') ?? '', 10)
      if (Number.isNaN(target)) return

      const counter = { value: 0 }
      gsap.to(counter, {
        value: target,
        duration: COUNT_DURATION,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        onUpdate: () => {
          el.textContent = String(Math.round(counter.value))
        },
      })
    })
  })

  return (
    <Section id="highlights" tone="alt" ref={root}>
      <SectionHeading index="02" eyebrow="Programme" title="Degree at a Glance" />

      {/* `perspective` gives the rotateX in the reveal its 3D read; without it
          the cards would just squash flat. */}
      <div className="grid grid-cols-4 border-t border-line perspective-distant max-lg:grid-cols-2 max-sm:grid-cols-1">
        {highlights.map((item, i) => (
          /* Base: a divider after every card but the last, and a gutter before
             every card but the first. At two columns the even cards end each row
             and the odd cards start each one, so their divider and gutter go;
             at one column both go entirely. */
          <div
            key={item.label}
            data-anim="card"
            /* Dividers and gutters key off *column*, not sibling position. `not-first` and
               `not-last` would indent the second row differently from the first
               once the grid wraps, so the two-column overrides are expressed
               with `nth-*` instead. Those variants compile to an extra
               pseudo-class and therefore outrank a bare responsive utility —
               the one-column resets must carry the same pseudo-class or they
               silently lose and the cards stay ruled and indented. */
            className="relative border-b border-line py-8 pr-6 not-first:pl-6 not-last:border-r max-lg:nth-[2n]:border-r-0 max-lg:nth-[2n+1]:pl-0 max-sm:not-last:border-r-0 max-sm:not-first:pl-0 max-sm:pr-0"
          >
            <span className="mb-4 block text-xs tracking-[0.06em] text-ink-300" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="flex items-baseline gap-2 text-3xl leading-none font-bold tracking-[-0.04em] text-ink-900">
              {item.tbc ? (
                <span className="text-ink-200">—</span>
              ) : (
                <span data-count={item.value}>{item.value}</span>
              )}
              {item.tbc && <span className="tbc">TBC</span>}
            </p>
            <h3 className="mt-3 text-xs font-medium tracking-[0.08em] text-ink-500 uppercase">
              {item.label}
            </h3>
            <p className="mt-2 text-sm leading-[1.6] text-ink-400">{item.note}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
