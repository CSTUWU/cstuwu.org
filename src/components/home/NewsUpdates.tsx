import { Link } from 'react-router-dom'
import { staggerReveal } from '../../lib/motion'
import { useGsapSection } from '../../hooks/useGsapSection'
import { academicUpdates, announcements } from '../../content/news'
import { buildNewsFeed } from '../../content/selectors'
import { paths } from '../../content/paths'
import { Section, SectionHeading } from '../ui/Section'
import { ArrowRight } from '../ui/icons/ArrowRight'

const FEED_LIMIT = 6

/* Derived once at module load: the feed is static content, so there is no
   reason to re-merge and re-sort it on every render. */
const feed = buildNewsFeed({ announcements, academicUpdates }, FEED_LIMIT)

export function NewsUpdates() {
  const root = useGsapSection<HTMLElement>((section, scope) => {
    staggerReveal(scope('[data-anim="item"]'), {
      trigger: section,
      from: { x: -30 },
    })
  })

  return (
    <Section id="news" ref={root}>
      <SectionHeading
        index="03"
        eyebrow="News & Updates"
        title="Latest"
        action={{ to: paths.announcements, label: 'All News' }}
      />

      <ul className="border-t border-line">
        {feed.map((item) => (
          <li key={item.key}>
            <Link
              to={item.to}
              data-anim="item"
              className="group grid grid-cols-[8rem_auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-line py-5 no-underline transition-[padding-left] duration-200 ease-out will-change-transform hover:pl-3 max-[720px]:grid-cols-[minmax(0,1fr)_auto] max-[720px]:row-gap-1"
            >
              <time
                dateTime={item.date}
                className="text-xs tracking-[0.02em] whitespace-nowrap text-ink-400 max-[720px]:col-start-1 max-[720px]:row-start-1"
              >
                {item.dateLabel}
              </time>
              <span className="text-xs font-medium tracking-[0.08em] whitespace-nowrap text-accent uppercase max-[720px]:col-start-2 max-[720px]:row-start-1">
                {item.category}
              </span>
              <span className="text-base font-medium tracking-[-0.01em] text-ink-700 transition-colors duration-200 ease-out group-hover:text-ink-900 max-[720px]:col-span-full max-[720px]:row-start-2">
                {item.title}
              </span>
              <span
                className="grid place-items-center text-ink-300 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 max-[720px]:hidden"
                aria-hidden="true"
              >
                <ArrowRight />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
