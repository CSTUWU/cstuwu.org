/**
 * Whether the site's copy is still placeholder material.
 *
 * Every value in `src/content` is sample content written to exercise the layout;
 * nothing there is an official UWU statement. Flipping this to 'final' hides
 * the site-wide notice.
 */
export const CONTENT_STATUS = 'placeholder' as const

export const IS_PLACEHOLDER_CONTENT = CONTENT_STATUS === 'placeholder'
