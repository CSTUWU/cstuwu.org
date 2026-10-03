type BrandMarkProps = {
  size?: number
  className?: string
}

/**
 * The programme crest: a rising sun, a blue stream and three green leaves.
 *
 * Colours come from the design tokens, so the crest follows the palette rather
 * than carrying its own hard-coded hex values.
 */
export function BrandMark({ size = 36, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Computer Science and Technology programme crest"
      className={className}
    >
      <rect width="48" height="48" rx="10" fill="var(--color-blue-900)" />
      <rect
        width="47"
        height="47"
        x="0.5"
        y="0.5"
        rx="9.5"
        fill="none"
        stroke="rgb(255 255 255 / 18%)"
      />

      {/* Rising sun — source of energy and knowledge */}
      <circle cx="24" cy="20" r="7.5" fill="var(--color-gold-500)" />
      <circle
        cx="24"
        cy="20"
        r="11"
        fill="none"
        stroke="var(--color-gold-500)"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <circle
        cx="24"
        cy="20"
        r="14.5"
        fill="none"
        stroke="var(--color-gold-500)"
        strokeOpacity="0.2"
        strokeWidth="1"
      />

      {/* Blue stream — water flowing down */}
      <path
        d="M9 31.5c3.5 0 3.5 3 7 3s3.5-3 7-3 3.5 3 7 3 3.5-3 7-3"
        fill="none"
        stroke="var(--color-blue-400)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.95"
      />

      {/* Three green leaves — agricultural resources and tea */}
      <path
        d="M24 41c-3.4-1.1-5-3.4-4.7-6.6 3.4-.2 5.2 1.9 4.7 6.6Z"
        fill="var(--color-green-600)"
      />
      <path
        d="M24 41c3.4-1.1 5-3.4 4.7-6.6-3.4-.2-5.2 1.9-4.7 6.6Z"
        fill="var(--color-green-700)"
      />
      <path
        d="M24 42v-9"
        stroke="var(--color-green-300)"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  )
}
