/**
 * Facts about the degree programme this site is about.
 *
 * The site covers the Computer Science and Technology *degree* at Uva Wellassa
 * University — its structure, staff, student work and news — rather than the
 * department that runs it. Names here are written programme-first for that
 * reason, and are referenced by the header, footer, hero and CTA.
 */
export const programme = {
  shortName: 'CST',
  /**
   * Display form, for the brand wordmark and the document title. Uses an
   * ampersand, which is how the site already sets the name in the hero and the
   * page title; `award` below carries the spelled-out form for prose.
   */
  name: 'Computer Science & Technology',
  /** The full award, for the copyright line. */
  award: 'B.Sc. (Hons) in Computer Science and Technology',
  /** Abbreviated award, for the hero's programme fact. */
  awardShort: 'B.Sc. (Hons)',

  universityName: 'Uva Wellassa University of Sri Lanka',
  universityShort: 'Uva Wellassa University',
  universityAbbrev: 'UWU',
  address: 'Badulla, 90000, Sri Lanka',
  email: 'cst@uwu.ac.lk',
  phone: '+94 71 000 0000',

  /**
   * The hero photograph. Kept as a separate, re-encoded copy rather than a
   * reference to the event photo of the same name: the hero is above the fold
   * on every page view, so it is worth its own ~170 KB asset instead of making
   * the visitor download the 890 KB original. Root-relative; rebased by
   * `lib/assets.ts`.
   */
  heroImage: '/images/hero/hackathon.jpg',
  heroImageAlt: 'Students working together at a laptop during the inter-university build hackathon.',
  /** Editorial caption under the hero figure. */
  heroImageCaption: 'Inter-University Build Hackathon',
} as const