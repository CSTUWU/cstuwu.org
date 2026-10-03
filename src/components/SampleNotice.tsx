import { IS_PLACEHOLDER_CONTENT } from '../content/status'

/**
 * Site-wide banner shown while the copy is still placeholder material.
 * Renders nothing once `CONTENT_STATUS` is set to 'final'.
 */
export function SampleNotice() {
  if (!IS_PLACEHOLDER_CONTENT) return null

  return (
    <aside className="flex items-center justify-center gap-3 border-b border-line bg-paper-alt px-gutter py-3 text-center text-xs tracking-[0.02em] text-ink-500">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-400" aria-hidden="true" />
      <p>
        <strong className="font-semibold text-ink-700">Sample content.</strong> This site is a
        work in progress — figures, dates, names and news items are placeholders pending official
        programme documentation.
      </p>
    </aside>
  )
}
