type ArrowUpRightProps = {
  size?: number
  className?: string
}

/**
 * Marks a link that leaves the site.
 *
 * Same Phosphor source as `ArrowRight`, so the two read as one set. Unlike the
 * right arrow it sits next to text rather than driving it, which is why it
 * keeps its own size instead of inheriting the line's.
 */
export function ArrowUpRight({ size = 12, className }: ArrowUpRightProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M200 64v104a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h88V64H88a8 8 0 0 1 0-16h104a8 8 0 0 1 8 8Z"
        fill="currentColor"
        opacity=".6"
      />
      <path
        d="M80 168a8 8 0 0 1-5.66-13.66L132.69 96 74.34 37.66a8 8 0 0 1 11.32-11.32l64 64a8 8 0 0 1 0 11.32l-64 64A8 8 0 0 1 80 168Z"
        fill="currentColor"
      />
    </svg>
  )
}
