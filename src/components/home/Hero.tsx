import { gsap, drift } from '../../lib/motion'
import { useGsapSection } from '../../hooks/useGsapSection'
import { programme } from '../../content/programme'
import { paths } from '../../content/paths'
import { assetUrl } from '../../lib/assets'
import { LinkArrow } from '../ui/LinkArrow'

const GRID_LINE_COUNT = 5

/** Lower label triple: where it is. */
const META_LINES = [
  programme.universityName,
  'Faculty of Science & Technology',
  'Badulla, Sri Lanka',
] as const

/**
 * Depth layering: pixels of upward travel as the hero scrolls out.
 *
 * The ordering is the whole effect — the background rules barely shift, the
 * figure drifts, the copy drifts furthest, so the layers separate instead of
 * sliding as one slab. Equalise the numbers and the parallax disappears, which
 * is why these are a shared scale rather than per-call numbers. Pixel distances
 * rather than `parallax`'s percentages, because the layers are different heights
 * and only an absolute distance can order them.
 */
const DEPTH = {
  rules: -10,
  figure: -26,
  copy: -46,
} as const

/**
 * Scroll window for every hero layer.
 *
 * `parallax`'s default (`top bottom` → `bottom top`) starts measuring *before*
 * the section reaches the top of the viewport, so at scroll 0 the hero would
 * already be half-drifted and the copy block would sit tens of pixels above the
 * coordinate row beneath it. Anchoring to `top top` keeps the hero at rest
 * exactly where the layout put it, which is also what makes the geometry audit
 * meaningful — it measures at scroll 0.
 */
const SCROLL_WINDOW = { start: 'top top', end: 'bottom top' } as const

/**
 * Per-line mask.
 *
 * Safe at these sizes only: `leading-[1.5]` is far taller than Inter's ~1.21em
 * of ascent plus descent, so the line box already contains the ink and
 * `overflow: hidden` cannot shear a descender. The display headline cannot use
 * this — at `line-height: 0.95` the ink runs *past* its own line box, and
 * padding the mask to compensate would let the incoming text peek through the
 * mask's lower edge — so the h1 is masked as a whole instead.
 */
const MASK_LINE = 'block overflow-hidden'

export function Hero() {
  const root = useGsapSection<HTMLElement>((section, scope) => {
    /* ── One entrance timeline ───────────────────────────────────────────
       Three moments share a single clock so they read as one sequence rather
       than three loops: the copy masks open, the figure swings in on its
       perspective, and both settle before the scroll cue appears. */
    const entrance = gsap.timeline({ defaults: { ease: 'expo.out' } })

    /* ── 1. Text mask reveal ──────────────────────────────────────────────
       The small labels slide out of their own masks. The display headline
       shares one mask across all three lines — see MASK_LINE — so its lines
       rise together through a single clip edge with a slight rotational
       settle, which keeps the stack reading as one object. */
    entrance
      .fromTo(
        scope('[data-anim="meta-line"]'),
        { yPercent: 120 },
        { yPercent: 0, duration: 0.9, stagger: 0.06 },
        0.22,
      )
      .fromTo(
        scope('[data-anim="rule"]'),
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power4.inOut' },
        0.5,
      )
      .fromTo(
        scope('[data-anim="title-line"]'),
        { yPercent: 108, rotationZ: 2 },
        { yPercent: 0, rotationZ: 0, duration: 1.35, stagger: 0.11 },
        0.3,
      )

    /* ── 2. 3D image reveal ───────────────────────────────────────────────
       Three layers, so the photo arrives rather than appears:
         · the panel swings in on a Y-rotation. `perspective` on the figure
           turns that rotation into a real 3D arc — without it the panel would
           just squash flat, and `origin-left` keeps the edge nearest the
           headline anchored so the swing reads as a page turning towards you;
         · a shutter curtain wipes off to the left to uncover it;
         · the photo settles out of an overscan zoom, so the frame stays full
           while the image appears to push back into focus. */
    entrance
      .fromTo(
        scope('[data-anim="hero-panel"]'),
        { rotateY: -22, scale: 0.92, opacity: 0 },
        { rotateY: 0, scale: 1, opacity: 1, duration: 1.6 },
        0.35,
      )
      .fromTo(
        scope('[data-anim="hero-curtain"]'),
        { scaleX: 1 },
        { scaleX: 0, duration: 1.3, ease: 'power4.inOut' },
        0.5,
      )
      .fromTo(
        scope('[data-anim="hero-photo"]'),
        { scale: 1.24 },
        { scale: 1, duration: 2, ease: 'power3.out' },
        0.5,
      )
      .fromTo(
        scope('[data-anim="hero-caption"]'),
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        1.15,
      )

    /* ── Copy settles, then the scroll cue invites the next section ──────── */
    entrance
      .fromTo(
        scope('[data-anim="fact"]'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.08 },
        0.95,
      )
      .fromTo(
        scope('[data-anim="cta"]'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
        1.25,
      )
      .fromTo(
        scope('[data-anim="scroll-indicator"]'),
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        1.45,
      )

    /* A gentle bob on the cue. The travelling line inside it is a CSS
       keyframe, so it keeps running even when this is skipped. */
    gsap.to(scope('[data-anim="scroll-indicator"]'), {
      y: 8,
      duration: 1.2,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    })

    /* ── 3. Parallax depth ────────────────────────────────────────────────
       Scrubbed over the hero's own travel, each layer at its own rate. The
       rules are full-height columns whose only mark is a vertical border, so
       their drift is felt as separation rather than seen as movement.

       Both `copy` blocks — the main column and the coordinate row — take the
       same distance, or the left text edge of one would sit tens of pixels
       above the other by the time the hero left the viewport. */
    const copyBlocks = scope('[data-anim="copy"]')
    const figure = scope('[data-anim="hero-figure"]')[0]
    const rules = scope('[data-anim="grid-line"]')

    copyBlocks.forEach((block) => {
      drift(block, { trigger: section, distance: DEPTH.copy, scrub: 0.6, ...SCROLL_WINDOW })
    })
    if (figure) {
      drift(figure, { trigger: section, distance: DEPTH.figure, scrub: 0.6, ...SCROLL_WINDOW })
    }
    // Fanned out so the five rules separate from each other as well as from
    // the content, which is what stops the backdrop reading as a flat sheet.
    rules.forEach((rule, i) => {
      drift(rule, {
        trigger: section,
        distance: DEPTH.rules * (1 + i * 0.25),
        scrub: 0.6,
        ...SCROLL_WINDOW,
      })
    })
  })

  return (
    <section ref={root} className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-paper py-28 pb-14 max-lg:min-h-auto max-lg:py-24 max-lg:pb-12 max-sm:py-20 max-sm:pb-10">
      {/* Layer 0 — background rules. Deepest plane, least travel. */}
      <div className="pointer-events-none absolute inset-0 z-0 flex" aria-hidden="true">
        {Array.from({ length: GRID_LINE_COUNT }, (_, i) => (
          <span
            key={i}
            data-anim="grid-line"
            className="flex-1 border-r border-line-subtle will-change-transform last:border-r-0"
          />
        ))}
      </div>

      {/* Layer 1 — copy. The whole column drifts as one unit, so the heading,
          its figure and the facts row can never separate from each other. */}
      <div data-anim="copy" className="container relative z-1 grid gap-12 will-change-transform">
        {/* Metadata, line by line out of its own mask. */}
        <div className="flex max-w-md flex-col gap-1">
          {META_LINES.map((line) => (
            <span key={line} className={MASK_LINE}>
              <span
                data-anim="meta-line"
                className="block text-xs leading-[1.6] tracking-[0.04em] text-ink-300 will-change-transform"
              >
                {line}
              </span>
            </span>
          ))}
        </div>

        {/* Headline and figure, side by side from `lg` up.
            The wrapper clips the slide-up reveal, so it needs room for
            descenders: `h1` runs at line-height 0.95, tighter than Inter's
            natural ~1.21em ascent plus descent, so `overflow: hidden` would
            shear the tail off "Technology". `pb-5` clears the largest clamp
            step; the matching negative margin leaves the rhythm untouched. */}
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <div className="overflow-hidden pb-5 -mb-5">
              <h1 className="flex flex-col max-sm:text-[clamp(2.5rem,11vw,4rem)]">
                <span data-anim="title-line" className="block will-change-transform">
                  Computer
                </span>
                <span data-anim="title-line" className="block will-change-transform">
                  Science &amp;
                </span>
                <span
                  data-anim="title-line"
                  className="block text-accent will-change-transform"
                >
                  Technology
                </span>
              </h1>
            </div>
          </div>

          {/* The figure. `perspective` belongs here, on the panel's direct
              parent, so the panel's rotateY reads as depth rather than shear. */}
          <figure
            data-anim="hero-figure"
            className="perspective-[1400px] will-change-transform lg:col-span-5"
          >
            <div
              data-anim="hero-panel"
              className="on-dark relative aspect-video origin-left overflow-hidden bg-ink-900 will-change-transform"
            >
              <img
                data-anim="hero-photo"
                src={assetUrl(programme.heroImage)}
                alt={programme.heroImageAlt}
                width={1200}
                height={800}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover will-change-transform"
              />
              {/* Resting state is open, so with motion reduced the photo shows
                  rather than staying behind a closed shutter. */}
              <div
                data-anim="hero-curtain"
                className="absolute inset-0 origin-left scale-x-0 bg-ink-900 will-change-transform"
              />
            </div>

            <figcaption
              data-anim="hero-caption"
              className="mt-4 flex items-center gap-3 text-xs tracking-[0.06em] text-ink-400 uppercase will-change-transform"
            >
              <span className="h-px w-6 flex-none bg-accent" aria-hidden="true" />
              <span className="text-ink-300">Fig. 01</span>
              {programme.heroImageCaption}
            </figcaption>
          </figure>
        </div>

        {/* Facts and call to action */}
        <div className="flex items-end justify-between gap-8 border-t border-line pt-8 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-6">
          <dl className="flex flex-wrap gap-x-10 gap-y-4 max-[720px]:gap-x-8 max-[720px]:gap-y-4 max-[520px]:grid max-[520px]:grid-cols-2 max-[520px]:gap-4">
            <div data-anim="fact">
              <dt className="mb-1 text-xs font-normal tracking-[0.08em] text-ink-400 uppercase">
                Programme
              </dt>
              <dd className="text-base font-semibold tracking-[-0.02em] text-ink-900">
                {programme.awardShort}
              </dd>
            </div>
            <div data-anim="fact">
              <dt className="mb-1 text-xs font-normal tracking-[0.08em] text-ink-400 uppercase">
                Duration
              </dt>
              <dd className="text-base font-semibold tracking-[-0.02em] text-ink-900">
                4 Years
              </dd>
            </div>
            <div data-anim="fact">
              <dt className="mb-1 text-xs font-normal tracking-[0.08em] text-ink-400 uppercase">
                Structure
              </dt>
              <dd className="text-base font-semibold tracking-[-0.02em] text-ink-900">
                8 Semesters
              </dd>
            </div>
            <div data-anim="fact">
              <dt className="mb-1 text-xs font-normal tracking-[0.08em] text-ink-400 uppercase">
                Campus
              </dt>
              <dd className="text-base font-semibold tracking-[-0.02em] text-ink-900">
                Badulla
              </dd>
            </div>
          </dl>

          <LinkArrow
            to={paths.degree}
            anim="cta"
            className="border-b border-ink-900 py-3 whitespace-nowrap transition-[gap] duration-200 ease-out hover:gap-4"
          >
            Explore the Degree
          </LinkArrow>
        </div>
      </div>

      {/* Layer 2 — coordinate markers, with the scroll cue centred between
          them. All three live in the flow so the cue can never collide with
          the hero copy, and they share its drift so the text edge stays flush. */}
      <div
        data-anim="copy"
        className="container relative z-1 mt-12 grid grid-cols-[1fr_auto_1fr] items-end gap-6 text-xs tracking-[0.06em] text-ink-300 will-change-transform"
      >
        <span className="max-[520px]:hidden">6.9°N 81.1°E</span>

        <span
          data-anim="scroll-indicator"
          className="flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="relative h-12 w-px overflow-hidden bg-ink-300 after:absolute after:top-0 after:left-0 after:h-1/2 after:w-full after:bg-accent after:animate-scroll-line" />
          <span className="tracking-widest text-ink-400 uppercase">Scroll</span>
        </span>

        <span className="justify-self-end max-[520px]:hidden">
          EST. {programme.universityAbbrev}
        </span>
      </div>
    </section>
  )
}