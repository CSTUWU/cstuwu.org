import { Link } from 'react-router-dom'
import { maskReveal, staggerReveal } from '../../lib/motion'
import { useGsapSection } from '../../hooks/useGsapSection'
import { programme } from '../../content/programme'
import { paths, type RouteHref } from '../../content/paths'
import { BrandMark } from './BrandMark'
import { ArrowUpRight } from '../ui/icons/ArrowUpRight'

type FooterColumn = {
  title: string
  links: { to: RouteHref; label: string }[]
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Programme',
    links: [
      { to: paths.about, label: 'About' },
      { to: paths.degree, label: 'Degree Programme' },
      { to: paths.academicStaff, label: 'Academic Staff' },
      { to: paths.studentLife, label: 'Student Life' },
    ],
  },
  {
    title: 'Academics',
    links: [
      { to: paths.academics, label: 'Programme Overview' },
      { to: paths.academicStructure, label: 'Structure' },
      { to: paths.academicUpdates, label: 'Updates' },
      { to: paths.academicCalendar, label: 'Calendar' },
    ],
  },
  {
    title: 'Community',
    links: [
      { to: paths.projects, label: 'Projects' },
      { to: paths.achievements, label: 'Achievements' },
      { to: paths.events, label: 'Events' },
      { to: paths.announcements, label: 'News' },
    ],
  },
]

/** The wordmark, broken by hand into the lines it is set on. */
const WORDMARK_LINES = ['Computer', 'Science &', 'Technology'] as const

const UNIVERSITY_URL = 'https://www.uwu.ac.lk/'

export function SiteFooter() {
  /* The footer is the last thing on every page, so it is always below the fold.
     Two reveals run off one trigger: the wordmark as the block's focal point,
     then the link groups beneath it so the eye is walked down the page rather
     than dropped at the end of it. */
  const sectionRef = useGsapSection<HTMLElement>((root, scope) => {
    maskReveal(scope('[data-anim="wordmark-line"]'), {
      trigger: root,
      start: 'top 92%',
    })
    staggerReveal(scope('[data-anim="footer-block"]'), {
      trigger: root,
      start: 'top 64%',
      from: { y: 24 },
      stagger: 0.08,
    })
  })

  return (
    <footer
      ref={sectionRef}
      aria-label="Site footer"
      className="on-dark border-t border-white/5 bg-black bg-[radial-gradient(120%_120%_at_50%_0%,rgb(255_255_255/5%)_0%,rgb(255_255_255/0%)_70%)] pt-[clamp(3.5rem,7vw,5rem)] text-ink-400"
    >
      {/* `@container` makes the wordmark size itself from the measure it has to
          fill. `cqw` resolves against this element's content box, which
          `container` has already fixed at `min(80rem, 100%)` less the gutter —
          so the type tracks the real available width at every breakpoint instead
          of needing a hand-tuned `vw` coefficient. Inline-size containment is
          what makes that safe: the width comes from `width`/`max-width`, never
          from the contents being sized. */}
      <div className="@container container">
        {/* The wordmark is the footer's heading, its home link and its reason
            for existing, so it is set at the size a heading usually gets and
            nothing else competes with it. It is a link rather than an `h1`:
            there is no heading level here to claim, and inverting a span to
            uppercase keeps `programme.name` as the one place the name is
            written. */}
        <Link
          to={paths.home}
          aria-label={`${programme.award} home`}
          className="group block rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-[6px]"
        >
          {/* Uppercase only, so no descender reaches the clip and the wrapper
              needs no clearance padding. `leading-[0.84]` keeps roughly a tenth
              of the cap height between lines, which is tight enough to read as
              one block and loose enough that the ascenders of one line do not
              collide with the caps above. */}
          <div className="overflow-hidden pb-[0.08em] -mb-[0.08em] transition-transform duration-500 ease-out group-hover:-translate-y-1">
            <span className="flex flex-col text-[clamp(2.25rem,14cqw,10.5rem)] font-bold leading-[0.84] tracking-[-0.045em] text-white uppercase">
              {WORDMARK_LINES.map((line) => (
                <span key={line} data-anim="wordmark-line" className="block will-change-transform">
                  {line}
                </span>
              ))}
            </span>
          </div>
          <span
            aria-hidden="true"
            className="mt-[clamp(1.5rem,3vw,2rem)] block h-px w-full bg-white/12 transition-colors duration-300 ease-out group-hover:bg-blue-400 group-focus-visible:bg-blue-400"
          />
        </Link>

        {/* Navigation. The contact column leads, as it did before, because the
            wordmark sets up the left edge and this is what reads under it; the
            three link groups then close the row off to the right. */}
        <div className="mt-[clamp(2.5rem,5vw,3.5rem)] grid grid-cols-[minmax(260px,1.4fr)_repeat(3,minmax(0,1fr))] gap-x-[clamp(1.5rem,4vw,2.5rem)] gap-y-[clamp(2rem,5vw,2.5rem)] max-[900px]:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-y-[clamp(1.5rem,5vw,2rem)]">
          <div
            data-anim="footer-block"
            className="will-change-transform max-[900px]:col-span-full max-sm:col-span-1"
          >
            <p className="max-w-[40ch] text-sm leading-[1.75] text-ink-400">
              Computing, software engineering, and data science, grounded in the resources and
              communities of Sri Lanka.
            </p>
            <address className="mt-[clamp(1rem,3vw,1.25rem)] text-sm leading-[1.8] text-ink-500">
              {programme.address}
              <br />
              <a
                href={`mailto:${programme.email}`}
                className="inline-block py-0.5 text-ink-300 no-underline transition-colors duration-200 ease-out hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-[3px]"
              >
                {programme.email}
              </a>
            </address>
          </div>

          {COLUMNS.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
              data-anim="footer-block"
              className="will-change-transform"
            >
              <h2 className="mb-[clamp(0.75rem,2vw,1rem)] text-xs font-medium tracking-[0.12em] text-ink-300 uppercase">
                {column.title}
              </h2>
              <ul className="grid gap-[clamp(0.5rem,2vw,0.75rem)]">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="relative block py-1 text-sm text-ink-500 no-underline transition-colors duration-200 ease-out after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:opacity-40 after:transition-transform after:duration-200 after:ease-out hover:text-white hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-[3px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* The crest lives here rather than beside the wordmark: the giant type
            is the wordmark now, and setting the crest next to it as well would
            say the same thing twice. The strip is where a mark belongs anyway. */}
        <div className="mt-[clamp(3rem,6vw,4rem)] flex flex-wrap items-center justify-between gap-x-[clamp(1rem,4vw,1.5rem)] gap-y-3 border-t border-white/8 py-[clamp(1.25rem,3vw,1.5rem)] text-xs text-ink-500 max-sm:flex-col max-sm:items-start max-sm:gap-2">
          <div className="flex items-center gap-3">
            <BrandMark size={22} className="flex-none" />
            <p>
              © {new Date().getFullYear()} {programme.award}
            </p>
          </div>
          <p className="text-ink-400 text-balance max-sm:order-[-1]">
            {programme.universityName}
          </p>
          <a
            href={UNIVERSITY_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 py-1.5 text-ink-500 no-underline transition-colors duration-200 ease-out hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-[3px]"
          >
            uwu.ac.lk
            <ArrowUpRight className="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
