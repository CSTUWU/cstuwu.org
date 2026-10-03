import { parallax, staggerReveal } from '../../lib/motion'
import { useGsapSection } from '../../hooks/useGsapSection'
import { paths } from '../../content/paths'
import { LinkArrow } from '../ui/LinkArrow'

const VISUAL_CELLS = 12

export function AboutProgramme() {
  const root = useGsapSection<HTMLElement>((section, scope) => {
    /* Decorative panel drifts slowly behind the copy */
    parallax(scope('[data-anim="visual"]'), { trigger: section, from: 20, to: -10 })

    staggerReveal(scope('[data-anim="reveal"]'), {
      trigger: section,
      stagger: 0.12,
    })
  })

  return (
    <section
      id="about-programme"
      ref={root}
      className="relative overflow-hidden border-t border-line py-section-y"
    >
      {/* `relative` here, not on the section, so the decorative panel is
          positioned against the content column rather than the page box. */}
      <div className="container relative">
        <div className="relative z-1 grid grid-cols-[minmax(100px,0.3fr)_minmax(0,1fr)] items-start gap-x-16 gap-y-8 max-[720px]:grid-cols-[minmax(0,1fr)] max-[720px]:gap-y-4">
          <div className="pt-2">
            <span className="eyebrow">
              <span className="mr-1 font-normal text-ink-300">01</span>
              About
            </span>
          </div>

          <div className="max-w-[52ch]">
            <h2
              data-anim="reveal"
              className="text-[clamp(1.375rem,2.5vw,1.75rem)] leading-[1.35] font-medium tracking-[-0.02em] text-ink-900"
            >
              A rigorous grounding in computing — programming, algorithms, systems, software
              engineering, and data.
            </h2>
            <p
              data-anim="reveal"
              className="mt-6 leading-[1.7] text-base text-ink-500"
            >
              The Computer Science and Technology degree at Uva Wellassa University
              prepares graduates for industry, research, and public service. The programme
              combines theoretical foundations with laboratory and project work, shaped around
              the technology challenges of the Uva province and beyond.
            </p>
            <div data-anim="reveal" className="mt-8">
              <LinkArrow to={paths.about}>Read More</LinkArrow>
            </div>
          </div>
        </div>

        {/* Parallax decorative element */}
        <div
          data-anim="visual"
          className="pointer-events-none absolute top-1/2 right-gutter z-0 h-3/5 w-[30%] -translate-y-1/2 max-lg:hidden"
          aria-hidden="true"
        >
          <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-2">
            {Array.from({ length: VISUAL_CELLS }, (_, i) => (
              <span key={i} className="border border-blue-100 bg-blue-50" />
            ))}
          </div>
          <div className="absolute right-[10%] bottom-[10%] h-[30%] w-[40%] bg-accent opacity-15" />
        </div>
      </div>
    </section>
  )
}
