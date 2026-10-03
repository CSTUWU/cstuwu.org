import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from '../lib/motion/gsap'
import { prefersReducedMotion } from '../hooks/useGsapSection'

/**
 * Seconds the disc takes to close on the pointer.
 *
 * Enough to feel like a physical object trailing the hand, not enough to read
 * as a second cursor left behind. `power3` front-loads the movement, so the
 * disc arrives quickly and then settles instead of crawling in at a constant
 * speed.
 */
const LAG = 0.32

/**
 * A disc that inverts whatever is under the pointer.
 *
 * This is the half of the cursor CSS cannot do. `cursor: url(...)` is painted
 * by the browser above every layer and cannot carry a blend mode, so the
 * inversion has to be real DOM: a white disc with `mix-blend-mode: difference`,
 * which against a greyscale backdrop is an exact `255 - value` flip.
 *
 * Two portal decisions are load-bearing:
 *
 * - It is portalled to `document.body`, not rendered in place. A blend mode
 *   only reaches the backdrop inside its nearest stacking context, so a
 *   `transform`, `filter`, `opacity` or `will-change` anywhere above the disc
 *   would trap the effect inside that subtree and invert nothing the reader
 *   cares about. `body` and `html` have neither.
 * - It lands after `#root` at a `z-index` above the sticky header, so it paints
 *   over the whole page. The disc also has to invert the header and the mobile
 *   menu, not slide under them.
 *
 * The triangle stays a CSS cursor, and the browser draws that above every
 * layer — which is why the disc lands behind it for free, with no z-index
 * arithmetic against a cursor the page cannot see.
 *
 * The disc does not move when the page scrolls under a stationary pointer,
 * which is exactly how the real cursor behaves.
 */
export function InvertCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // There is no cursor to invert on a touch screen, and a disc pinned under a
    // finger reads as a smudge. This is the feature query for "a mouse is the
    // only pointer" — a hybrid laptop that also has a touchscreen still passes.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const controller = new AbortController()
    const { signal } = controller

    // `xPercent`/`yPercent` centre the disc on the hotspot once, so the follow
    // only ever writes `x` and `y` and no frame reads layout.
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    // Reduced motion drops the lag, not the disc. It still tracks the pointer,
    // because tracking is direct manipulation rather than decoration; what goes
    // away is the trailing.
    const follow = prefersReducedMotion()
      ? (x: number, y: number) => {
          gsap.set(el, { x, y })
        }
      : (() => {
          const toX = gsap.quickTo(el, 'x', { duration: LAG, ease: 'power3' })
          const toY = gsap.quickTo(el, 'y', { duration: LAG, ease: 'power3' })
          return (x: number, y: number) => {
            toX(x)
            toY(y)
          }
        })()

    let placed = false
    let shown = false

    const track = (event: PointerEvent) => {
      if (placed) {
        follow(event.clientX, event.clientY)
      } else {
        // Without this the disc sweeps in from the top-left corner, across the
        // whole page, on the very first mouse move.
        gsap.set(el, { x: event.clientX, y: event.clientY })
        placed = true
      }
      if (!shown) {
        shown = true
        gsap.to(el, { autoAlpha: 1, duration: 0.2, overwrite: 'auto' })
      }
    }

    const hide = () => {
      if (!shown) return
      shown = false
      gsap.to(el, { autoAlpha: 0, duration: 0.2, overwrite: 'auto' })
    }

    window.addEventListener('pointermove', track, { passive: true, signal })
    // Leaving the document or losing focus must not strand a disc in the middle
    // of a page nobody is looking at.
    document.addEventListener('pointerleave', hide, { signal })
    window.addEventListener('blur', hide, { signal })

    return () => {
      controller.abort()
      // The follow and the fades are outside any `gsap.context` — this is app
      // chrome that outlives every section — so they need reverting by hand.
      gsap.killTweensOf(el)
    }
  }, [])

  return createPortal(
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[999] size-16 rounded-full bg-white opacity-0 mix-blend-difference will-change-transform"
    />,
    document.body,
  )
}
