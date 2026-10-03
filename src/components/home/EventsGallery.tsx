import { gsap, parallax, staggerReveal } from '../../lib/motion'
import { useGsapSection } from '../../hooks/useGsapSection'
import { events } from '../../content/events'
import { paths } from '../../content/paths'
import { formatCalendarDate } from '../../lib/date'
import { assetUrl } from '../../lib/assets'
import { Section, SectionHeading } from '../ui/Section'

export function EventsGallery() {
  const root = useGsapSection<HTMLElement>((section, scope) => {
    /* Cards unveil upward from behind a clip edge */
    staggerReveal(scope('[data-anim="card"]'), {
      trigger: section,
      from: { y: 60, clipPath: 'inset(100% 0 0 0)' },
      to: { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power4.out' },
      stagger: 0.15,
      start: 'top 60%',
      end: 'top 20%',
    })

    /* Each photo drifts within its frame. The image is taller than the frame
       (and scaled up by GSAP below) so the drift never exposes an edge:
       140% height plus 1.15 scale leaves ~10% of headroom above and below,
       while the ±6% drift only moves it by ~8.4%. */
    scope('[data-anim="card"]').forEach((card) => {
      const image = card.querySelector('[data-anim="photo"]')
      if (!image) return
      parallax(image, { trigger: card, from: -6, to: 6, scrub: true })
    })

    gsap.set(scope('[data-anim="photo"]'), { scale: 1.15 })
  })

  return (
    <Section id="events" tone="dark" className="overflow-hidden" ref={root}>
      <SectionHeading
        index="05"
        eyebrow="Events"
        title="Upcoming"
        action={{ to: paths.events, label: 'All Events' }}
      />

      <ul className="grid grid-cols-3 gap-1 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {events.map((event) => {
          const { day, month, year } = formatCalendarDate(event.date)

          return (
            <li
              key={event.date}
              data-anim="card"
              className="group relative flex flex-col will-change-transform max-lg:last:col-span-full max-sm:last:col-span-full"
            >
              <div className="relative aspect-3/4 overflow-hidden bg-ink-800 max-lg:last:aspect-21/9 max-sm:last:aspect-3/4">
                <img
                  data-anim="photo"
                  src={assetUrl(event.image)}
                  alt={event.title}
                  loading="lazy"
                  decoding="async"
                  className="h-[140%] w-full object-cover brightness-[.85] contrast-[1.05] will-change-transform transition-[filter] duration-200 ease-out group-hover:brightness-[.98] group-hover:contrast-[1.08]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.6)_0%,transparent_50%)]" />
              </div>

              <div className="relative z-1 flex gap-6 pt-6 pr-4 pb-8">
                <time
                  dateTime={event.date}
                  className="flex min-w-14 flex-none flex-col items-center"
                >
                  <span className="text-2xl leading-none font-bold tracking-[-0.04em] text-white">
                    {day}
                  </span>
                  <span className="mt-1 text-xs font-medium tracking-[0.08em] text-ink-400 uppercase">
                    {month} {year}
                  </span>
                </time>

                <div className="flex flex-col gap-2">
                  {event.category && (
                    <span className="text-xs font-medium tracking-[0.08em] text-accent-dim uppercase">
                      {event.category}
                    </span>
                  )}
                  <h3 className="text-base leading-[1.3] font-semibold tracking-[-0.015em] text-white">
                    {event.title}
                  </h3>
                  <p className="text-xs font-medium tracking-[0.06em] text-ink-400 uppercase">
                    {event.location}
                  </p>
                  <p className="text-sm leading-[1.6] text-ink-400">{event.description}</p>
                  {event.time && (
                    <p className="mt-2 text-xs font-medium tracking-[0.04em] text-accent-dim">
                      {event.time}
                    </p>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
