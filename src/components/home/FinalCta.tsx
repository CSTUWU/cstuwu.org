import { Link } from 'react-router-dom'
import { parallax, staggerReveal } from '../../lib/motion'
import { useGsapSection } from '../../hooks/useGsapSection'
import { programme } from '../../content/programme'
import { paths } from '../../content/paths'
import { ArrowRight } from '../ui/icons/ArrowRight'

const BG_GRID_LINES = 8

export function FinalCta() {
  const root = useGsapSection<HTMLElement>((section, scope) => {
    /* Background grid drifts slower than the page to read as depth */
    parallax(scope('[data-anim="bg"]'), { trigger: section, from: 30, to: -15 })

    staggerReveal(scope('[data-anim="reveal"]'), {
      trigger: section,
      from: { y: 50 },
      stagger: 0.15,
      start: 'top 60%',
      end: 'top 20%',
    })
  })

  return (
    <section
      ref={root}
      className="section-dark relative overflow-hidden border-t border-line py-section-y"
    >
      {/* Parallax background */}
      <div data-anim="bg" className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="flex h-full">
          {Array.from({ length: BG_GRID_LINES }, (_, i) => (
            <span key={i} className="flex-1 border-r border-ink-800 last:border-r-0" />
          ))}
        </div>
      </div>

      <div className="container relative z-1">
        <div className="max-w-3xl">
          <p data-anim="reveal" className="eyebrow">
            <span className="mr-1 font-normal text-ink-300">07</span>
            {programme.universityAbbrev} · Badulla, Sri Lanka
          </p>

          <h2
            data-anim="reveal"
            className="mt-6 text-[clamp(2.25rem,4.5vw,3rem)] text-white"
          >
            Begin your journey in
            <br />
            Computer Science &amp; Technology
          </h2>

          <div data-anim="reveal" className="mt-12 flex flex-wrap gap-8 max-sm:flex-col max-sm:gap-5">
            <Link
              to={paths.degree}
              className="inline-flex items-center gap-3 border-b border-ink-500 pb-2 text-sm font-medium tracking-[0.02em] text-white no-underline uppercase transition-[gap,border-color] duration-200 ease-out hover:gap-4 hover:border-white"
            >
              <span>Explore the Degree</span>
              <ArrowRight />
            </Link>
            <Link
              to={paths.about}
              className="inline-flex items-center gap-3 border-b border-ink-500 pb-2 text-sm font-medium tracking-[0.02em] text-white no-underline uppercase transition-[gap,border-color] duration-200 ease-out hover:gap-4 hover:border-white"
            >
              <span>About the Programme</span>
              <ArrowRight />
            </Link>
          </div>

          <address
            data-anim="reveal"
            className="mt-16 flex gap-8 border-t border-ink-800 pt-6 text-sm text-ink-500 max-sm:flex-col max-sm:gap-2"
          >
            <a
              href={`mailto:${programme.email}`}
              className="inline-block py-1 text-ink-300 no-underline transition-colors duration-200 ease-out hover:text-white focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px]"
            >
              {programme.email}
            </a>
            <span className="inline-block py-1">{programme.phone}</span>
          </address>
        </div>
      </div>
    </section>
  )
}
