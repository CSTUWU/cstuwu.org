import { Link } from 'react-router-dom'
import { programme } from '../../content/programme'
import { paths } from '../../content/paths'
import { BrandMark } from './BrandMark'

type BrandLockupProps = {
  /** Crest size in pixels. The footer uses a slightly larger mark. */
  size?: number
  /** Inverts the wordmark for dark surfaces. */
  inverted?: boolean
  /** Footer alignment: the crest should not push siblings away. */
  className?: string
}

const BRAND_NAME = `${programme.shortName} / ${programme.universityAbbrev}`
const BRAND_META = programme.name

/** Crest plus wordmark, linking home. Shared by the header and the footer. */
export function BrandLockup({ size = 32, inverted = false, className }: BrandLockupProps) {
  return (
    <Link
      to={paths.home}
      aria-label={`${programme.award} — home`}
      className={[
        'inline-flex items-center gap-3 no-underline',
        inverted ? '' : 'mr-auto',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <BrandMark size={size} className="shrink-0 rounded-lg shadow-sm" />
      <span className="flex flex-col leading-[1.15]">
        <span
          className={`text-sm font-semibold tracking-[-0.01em] ${
            inverted ? 'text-white' : 'text-ink-900'
          }`}
        >
          {BRAND_NAME}
        </span>
        <span className="text-xs tracking-[0.06em] text-ink-400 uppercase">{BRAND_META}</span>
      </span>
    </Link>
  )
}
