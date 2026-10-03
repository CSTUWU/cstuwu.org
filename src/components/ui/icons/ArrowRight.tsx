type ArrowRightProps = {
  size?: number
  className?: string
}

/** Decorative directional arrow used by links and buttons. */
export function ArrowRight({ size = 14, className }: ArrowRightProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M2.5 8h11m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
