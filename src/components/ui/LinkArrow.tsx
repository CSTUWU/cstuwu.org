import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { RouteHref } from '../../content/paths'
import { ArrowRight } from './icons/ArrowRight'

type LinkArrowProps = {
  to: RouteHref
  children: ReactNode
  /** Extra classes for variants that restyle the link, e.g. a hero call to action. */
  className?: string
  /**
   * Name for the `data-anim` hook, when this link is an animation target.
   * See `hooks/useGsapSection.ts`.
   */
  anim?: string
}

/** Text link with a trailing arrow that nudges right on hover. */
export function LinkArrow({ to, children, className, anim }: LinkArrowProps) {
  return (
    <Link
      to={to}
      data-anim={anim}
      className={`link-arrow ${className ?? ''}`}
    >
      <span>{children}</span>
      <ArrowRight />
    </Link>
  )
}
