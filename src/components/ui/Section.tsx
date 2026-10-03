import type { ReactNode, Ref } from 'react'
import { Link } from 'react-router-dom'
import type { RouteHref } from '../../content/paths'
import { ArrowRight } from './icons/ArrowRight'

type SectionTone = 'default' | 'alt' | 'dark'

const TONE_CLASSES: Record<SectionTone, string | undefined> = {
  default: undefined,
  alt: 'bg-paper-alt',
  // `section-dark` re-points the accent ramp for the whole subtree.
  dark: 'section-dark',
}

type SectionProps = {
  id?: string
  tone?: SectionTone
  className?: string
  children: ReactNode
  ref?: Ref<HTMLElement>
}

/** A page section with the standard vertical rhythm and container. */
export function Section({ id, tone = 'default', className, children, ref }: SectionProps) {
  const classes = ['relative border-t border-line py-section-y', TONE_CLASSES[tone], className]
    .filter(Boolean)
    .join(' ')

  return (
    <section id={id} className={classes} ref={ref}>
      <div className="container">{children}</div>
    </section>
  )
}

type SectionAction = {
  to: RouteHref
  label: string
}

type SectionHeadingProps = {
  /** Two-digit ordinal shown beside the eyebrow, e.g. '03'. */
  index?: string
  eyebrow: string
  title: string
  intro?: string
  action?: SectionAction
  /** Full-width heading instead of side-by-side with the action. */
  stacked?: boolean
  /** Extra classes, e.g. to drop the bottom margin where spacing is managed
   *  by the surrounding layout. */
  className?: string
}

/** The eyebrow / title / intro / action block that opens most sections. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  action,
  stacked = false,
  className,
}: SectionHeadingProps) {
  const classes = [
    'flex flex-wrap items-end justify-between gap-x-8 gap-y-6',
    'mb-[clamp(3rem,5vw,4rem)]',
    stacked ? 'block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={classes}>
      <div className={stacked ? 'max-w-4xl' : 'max-w-[50ch]'}>
        <p className="eyebrow">
          {index && (
            <span className="mr-1 font-normal text-ink-300">{index}</span>
          )}
          {eyebrow}
        </p>
        <h2 className="mt-3">{title}</h2>
        {intro && (
          <p className="mt-4 leading-[1.65] text-base text-ink-500">{intro}</p>
        )}
      </div>
      {action && (
        <Link className="link-arrow" to={action.to}>
          {action.label}
          <ArrowRight />
        </Link>
      )}
    </header>
  )
}
