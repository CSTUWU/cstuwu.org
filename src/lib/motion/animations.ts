import { gsap } from './gsap'

/**
 * A ScrollTrigger start/end position.
 *
 * GSAP accepts either a literal such as `'top 70%'` or a function returning one,
 * re-evaluated whenever the trigger refreshes.
 */
export type ScrollTriggerPosition = string | (() => string)

/**
 * Shared scroll-animation presets.
 *
 * These exist because the same two tweens were copy-pasted across most of the
 * home sections with only the numbers changed. A component should describe
 * *what* is different (targets, axis, distance) and inherit the rest — the
 * easing, timing and trigger windows are design decisions that belong in one
 * place so the whole page stays visually consistent.
 */

export type ScrollTriggerWindow = {
  /** Element that defines the scroll position. Normally the section root. */
  trigger: Element
  /**
   * ScrollTrigger positions. A function is re-evaluated on refresh, which is
   * how measurements that depend on layout (track widths, viewport height) stay
   * correct after a resize.
   */
  start?: ScrollTriggerPosition
  end?: ScrollTriggerPosition
}

/** Defaults shared by every "reveal on scroll into view" animation. */
const REVEAL_TRIGGER = {
  start: 'top 70%',
  end: 'top 30%',
  toggleActions: 'play none none reverse',
} as const

/** Defaults shared by every scrub-linked parallax animation. */
const PARALLAX_TRIGGER = {
  start: 'top bottom',
  end: 'bottom top',
} as const

export type StaggerRevealOptions = ScrollTriggerWindow & {
  /** Merged over the default `from` state — use for extra properties. */
  from?: gsap.TweenVars
  /** Merged over the default `to` state — use to override timing. */
  to?: gsap.TweenVars
  stagger?: number
}

/**
 * Staggered entrance reveal for a collection of sibling elements.
 *
 * The default is a 40px rise with a fade, which is what every section on the
 * page was already doing.
 */
export function staggerReveal(
  targets: Element[],
  { trigger, from, to, stagger = 0.1, start, end }: StaggerRevealOptions,
) {
  if (targets.length === 0) return undefined

  return gsap.fromTo(
    targets,
    { y: 40, opacity: 0, ...from },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger,
      ...to,
      scrollTrigger: {
        ...REVEAL_TRIGGER,
        ...(start !== undefined && { start }),
        ...(end !== undefined && { end }),
        trigger,
      },
    },
  )
}

export type MaskRevealOptions = ScrollTriggerWindow & {
  /** Merged over the default `from` state — use for extra properties. */
  from?: gsap.TweenVars
  /** Merged over the default `to` state — use to override timing. */
  to?: gsap.TweenVars
  stagger?: number
}

/**
 * Line reveal: each line rises out from below an `overflow-hidden` wrapper,
 * arriving at its own position as the section scrolls in.
 *
 * Unlike `staggerReveal` this moves nothing but `yPercent` and does not fade.
 * Because the wrapper clips at its own bottom edge, the lines are covered by the
 * bottom of the block while they are low and are uncovered as they rise, which
 * reads as type being pulled up out of the page rather than as elements fading
 * into place. The hero uses the same treatment on its headline.
 *
 * Two consequences for the markup. The target must be a block-level line inside
 * a clipping wrapper, so `yPercent` resolves against the line's own height and
 * the rise is a predictable distance. And no descender may fall outside the
 * wrapper's box, or the clip shears its tail — uppercase-only text needs no
 * clearance, mixed case needs padding on the wrapper and a matching negative
 * margin.
 */
export function maskReveal(
  targets: Element[],
  { trigger, from, to, stagger = 0.09, start, end }: MaskRevealOptions,
) {
  if (targets.length === 0) return undefined

  return gsap.fromTo(
    targets,
    { yPercent: 118, ...from },
    {
      yPercent: 0,
      duration: 1.15,
      ease: 'power4.out',
      stagger,
      ...to,
      scrollTrigger: {
        ...REVEAL_TRIGGER,
        ...(start !== undefined && { start }),
        ...(end !== undefined && { end }),
        trigger,
      },
    },
  )
}

export type ParallaxOptions = ScrollTriggerWindow & {
  /** Starting vertical offset, in percent of the element's own height. */
  from?: number
  /** Ending vertical offset. Negative values drift upward. */
  to?: number
  /** Seconds of catch-up lag. Higher values feel heavier. */
  scrub?: number | boolean
}

export type DriftOptions = ScrollTriggerWindow & {
  /**
   * Total travel in pixels, from the element's resting position.
   * Negative values drift upward as the trigger passes through.
   */
  distance?: number
  /** Seconds of catch-up lag. Higher values feel heavier. */
  scrub?: number | boolean
}

/**
 * Scrub-linked vertical parallax.
 *
 * `from`/`to` are percentages of element height, so the effect scales with the
 * element rather than with a hard-coded pixel distance.
 */
export function parallax(
  targets: Element | Element[] | null | undefined,
  { trigger, from = 20, to = -10, scrub = 1, start, end }: ParallaxOptions,
) {
  if (!targets) return undefined

  return gsap.fromTo(
    targets,
    { yPercent: from },
    {
      yPercent: to,
      ease: 'none',
      scrollTrigger: {
        ...PARALLAX_TRIGGER,
        ...(start !== undefined && { start }),
        ...(end !== undefined && { end }),
        trigger,
        scrub,
      },
    },
  )
}

/**
 * Scrub-linked vertical drift measured in **pixels**.
 *
 * `parallax` moves a layer by a fraction of its own height, which is the right
 * choice for a photo that has to travel further than its frame. It is the wrong
 * choice for *depth layering*, where the point is that a foreground layer moves
 * more than the background one — and the layers are different heights, so a
 * shared percentage would not order them. A shared pixel distance does.
 */
export function drift(
  targets: Element | Element[] | null | undefined,
  { trigger, distance = -60, scrub = 0.6, start, end }: DriftOptions,
) {
  if (!targets) return undefined

  return gsap.fromTo(
    targets,
    { y: 0 },
    {
      y: distance,
      ease: 'none',
      scrollTrigger: {
        ...PARALLAX_TRIGGER,
        ...(start !== undefined && { start }),
        ...(end !== undefined && { end }),
        trigger,
        scrub,
      },
    },
  )
}
