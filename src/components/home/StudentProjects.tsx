import { Link } from 'react-router-dom'
import { gsap, parallax } from '../../lib/motion'
import { useGsapSection } from '../../hooks/useGsapSection'
import { projects } from '../../content/projects'
import { paths } from '../../content/paths'
import { SectionHeading } from '../ui/Section'

export function StudentProjects() {
  const root = useGsapSection<HTMLElement>((_section, scope) => {
    const stage = scope('[data-pin="stage"]')[0] as HTMLElement | undefined
    const track = scope('[data-anim="track"]')[0] as HTMLElement | undefined
    if (!stage || !track) return

    /* Horizontal travel: everything past the first viewport. */
    const scrollAmount = () => Math.max(0, track.scrollWidth - window.innerWidth)

    /* Pin the stage, not the section. Pinning the section would also freeze the
       heading above the carousel and make the pinned box taller than the
       viewport, so the cards would be clipped. */
    gsap.to(track, {
      x: () => -scrollAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => `+=${scrollAmount()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })

    /* Progress bar tracks the same distance, with a lighter scrub for lag.
       Driven as a scale, so it needs its own tween rather than `parallax`. */
    const bar = scope('[data-anim="progress-bar"]')[0]
    if (bar) {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${scrollAmount()}`,
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        },
      )
    }

    /* Each card's artwork drifts within its frame. The card is a scope marker
       (`data-card`), not an animation target — only the artwork moves. */
    scope('[data-card]').forEach((card) => {
      const image = card.querySelector('[data-anim="art"]')
      if (!image) return
      parallax(image, { trigger: card, from: -8, to: 8, scrub: true })
    })
  })

  return (
    <section
      id="projects"
      ref={root}
      className="relative overflow-hidden border-t border-line bg-paper-alt"
    >
      <div className="container pt-section-y pb-10">
        <SectionHeading
          index="04"
          eyebrow="Research & Projects"
          title="Selected Work"
          className="mb-0"
        />
      </div>

      <div
        data-pin="stage"
        className="relative flex h-screen items-center overflow-hidden"
      >
        <div
          data-anim="track"
          className="flex items-center gap-8 pr-gutter pl-gutter will-change-transform"
        >
          {projects.map((project) => (
            <article
              key={project.index}
              data-card
              className="flex w-[clamp(280px,80vw,360px)] shrink-0 flex-col gap-6 lg:w-[clamp(320px,40vw,480px)]"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-ink-800">
                <div
                  data-anim="art"
                  className="on-dark flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--color-ink-800)_0%,var(--color-ink-900)_100%)] will-change-transform"
                >
                  <span className="text-5xl font-bold tracking-[-0.04em] text-ink-600">
                    {project.index}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink-900">
                  {project.name}
                </h3>
                <p className="text-sm leading-[1.65] text-ink-500">{project.summary}</p>
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium tracking-[0.06em] text-ink-400 uppercase">
                    {project.team}
                  </p>
                  <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                    {project.tech.map((tech) => (
                      <li
                        key={tech}
                        className="text-xs tracking-[0.02em] text-ink-400 after:ml-2 after:text-ink-200 after:content-['·'] last:after:content-none"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}

          {/* End card */}
          <Link
            to={paths.projects}
            className="flex w-[clamp(200px,20vw,300px)] shrink-0 items-center justify-center no-underline"
          >
            <span className="text-sm font-medium tracking-[0.08em] text-accent uppercase [writing-mode:vertical-rl]">
              View All Projects
            </span>
          </Link>
        </div>

        {/* Progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-line">
          <div
            data-anim="progress-bar"
            className="h-full origin-left bg-accent will-change-transform"
          />
        </div>
      </div>
    </section>
  )
}
