import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from '../lib/motion/gsap'

/**
 * Resolves a selector to elements, scoped to the section root.
 *
 * Components name their animation targets with `data-anim="…"` attributes and
 * select them here, rather than plumbing a `useRef` per element. Attributes are
 * used instead of class names on purpose: styling utilities are free to change,
 * but an animation hook is a behavioural contract that must survive restyling.
 *
 * `data-pin="…"` marks an element ScrollTrigger pins rather than animates;
 * `data-card` (or similar) marks a repeated unit that is only ever used as a
 * scope for `querySelector`, never animated in its own right. Only `data-anim`
 * promises that GSAP writes a transform here.
 */
export type GsapScope = (selector: string) => Element[]

/**
 * Returned by a builder for teardown that `context.revert()` cannot know about —
 * event listeners, timers, observers. GSAP tweens and ScrollTriggers (including
 * pinning) are all recorded by the context and need no help.
 */
export type GsapTeardown = () => void

export type GsapSectionBuilder<T extends HTMLElement> = (
  root: T,
  scope: GsapScope,
) => void | GsapTeardown

/**
 * Central policy for scroll animation:
 *
 * - registers the plugin once (see `lib/motion/gsap.ts`)
 * - honours `prefers-reduced-motion` by skipping setup entirely
 * - runs every tween inside a `gsap.context` scoped to the section, so
 *   `ctx.revert()` reliably undoes transforms it created on unmount
 *
 * The builder runs once on mount. It is intentionally not a dependency:
 * animation setup is a mount-time side effect, and treating an inline arrow
 * function as reactive would tear down and rebuild every tween on each render.
 */
export function useGsapSection<T extends HTMLElement = HTMLElement>(
  build: GsapSectionBuilder<T>,
  { enabled = true }: { enabled?: boolean } = {},
): RefObject<T | null> {
  const ref = useRef<T>(null)

  // Hold the latest builder in a ref so the setup effect can stay keyed on
  // `enabled`. Updating it in an effect rather than during render keeps the
  // ref write out of the render phase; it is declared first so it has run
  // before the setup effect reads it.
  const buildRef = useRef(build)
  useEffect(() => {
    buildRef.current = build
  })

  useEffect(() => {
    const root = ref.current
    if (!enabled || !root) return
    if (prefersReducedMotion()) return

    let teardown: GsapTeardown | undefined

    const ctx = gsap.context(() => {
      const scope: GsapScope = (selector) => gsap.utils.toArray<Element>(selector, root)
      // Captured, not called. Invoking it here would run the teardown at setup
      // and destroy whatever the builder had just registered.
      teardown = buildRef.current(root, scope) || undefined
    }, root)

    return () => {
      // `revert()` undoes every tween and ScrollTrigger the builder created,
      // pinning included. The builder's own teardown runs afterwards for
      // anything outside GSAP's bookkeeping.
      ctx.revert()
      teardown?.()
    }
  }, [enabled])

  return ref
}

/** True when the user has asked the OS to minimise non-essential motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
