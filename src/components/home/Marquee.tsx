import { gsap, parallax } from '../../lib/motion'
import { useGsapSection } from '../../hooks/useGsapSection'

/** Seconds for the strip to travel its own width. */
const MARQUEE_DURATION = 20

const WORDS = [
  'Computer Science',
  'Software Engineering',
  'Data Structures',
  'Algorithms',
  'Machine Learning',
  'Networks',
  'Systems',
  'Research',
] as const

export function Marquee() {
  const root = useGsapSection<HTMLElement>((section, scope) => {
    /* Infinite horizontal scroll. The word list is rendered twice and the tween
       runs to -50%, so the wrap point is never visible. */
    gsap.to(scope('[data-anim="track"]'), {
      xPercent: -50,
      ease: 'none',
      duration: MARQUEE_DURATION,
      repeat: -1,
    })

    /* Slow vertical drift across the section */
    parallax(scope('[data-anim="drift"]'), { trigger: section, from: 0, to: -10 })
  })

  return (
    <section
      ref={root}
      aria-hidden="true"
      className="on-dark relative overflow-hidden border-t border-ink-800 bg-ink-950 py-8"
    >
      <div data-anim="drift" className="overflow-hidden will-change-transform">
        <div data-anim="track" className="flex items-center gap-8 whitespace-nowrap will-change-transform">
          {[...WORDS, ...WORDS].map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="flex shrink-0 items-center gap-8 text-2xl font-bold tracking-[-0.02em] text-white uppercase max-[720px]:text-xl"
            >
              {word}
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
