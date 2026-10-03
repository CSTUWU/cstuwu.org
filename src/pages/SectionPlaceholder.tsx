import { Link, useLocation } from 'react-router-dom'
import { normalisePath, resolveRoute } from '../data/routes'
import { paths, type RouteHref } from '../content/paths'
import { usePageTitle } from '../hooks/usePageTitle'
import { Section } from '../components/ui/Section'
import { LinkArrow } from '../components/ui/LinkArrow'

/** Cross-links offered on the placeholder and 404 pages. */
const SUGGESTED: RouteHref[] = [
  paths.degree,
  paths.academics,
  paths.projects,
  paths.announcements,
  paths.events,
  paths.academicStaff,
]

const NOT_FOUND = {
  eyebrow: 'Error 404',
  title: 'This page could not be found',
  description:
    'The address you followed does not match any page on this site. It may have been moved, or the link may be mistyped.',
} as const

/**
 * Stands in for every page that is planned but not yet built, and doubles as
 * the 404 page for addresses that match nothing at all.
 */
export function SectionPlaceholder() {
  const { pathname } = useLocation()
  const meta = resolveRoute(pathname)
  const notFound = meta === null

  usePageTitle(notFound ? 'Page not found' : meta.title)

  const crumbs = meta?.breadcrumb ?? []
  const current = normalisePath(pathname)
  const suggestions = SUGGESTED.filter((to) => to !== current)

  return (
    <Section className="border-t-0 bg-[linear-gradient(180deg,var(--color-paper-alt),var(--color-paper)_60%)] py-[clamp(3.5rem,8vw,6rem)] pb-[clamp(4rem,9vw,7rem)]">      <div className="max-w-184">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs tracking-[0.06em] text-ink-400 uppercase [&>li+li]:before:mr-2 [&>li+li]:before:text-line-strong [&>li+li]:before:content-['/']">
            <li>
              <Link to={paths.home} className="text-accent no-underline hover:underline">
                Home
              </Link>
            </li>
            {crumbs.map((crumb, i) => (
              <li key={`${crumb}-${i}`}>
                <span aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
                  {crumb}
                </span>
              </li>
            ))}
            {notFound && (
              <li aria-current="page">
                <span>Not found</span>
              </li>
            )}
          </ol>
        </nav>

        <p className="eyebrow">{notFound ? NOT_FOUND.eyebrow : 'Coming soon'}</p>

        <h1 className="mt-4 text-[clamp(2rem,4.4vw,3rem)]">
          {notFound ? NOT_FOUND.title : meta.title}
        </h1>

        <p className="mt-5 leading-[1.7] text-[1.0625rem] text-ink-500">
          {notFound ? NOT_FOUND.description : meta.description}
        </p>

        {!notFound && (
          <p className="mt-4 rounded-e-sm rounded-s-none border-s-[3px] border-gold-500 bg-gold-400/10 py-3.5 ps-5 pe-4 text-[0.9375rem] text-ink-700">
            This section is part of the site build and is not published yet. The home page
            summarises what it will contain.
          </p>
        )}

        <div className="mt-9 flex flex-wrap gap-3">
          <Link to={paths.home} className="btn btn-primary">
            Back to home
          </Link>
          <Link to={paths.announcements} className="btn btn-outline">
            Latest announcements
          </Link>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-12 border-t border-line pt-8">
            <h2 className="text-xs font-medium tracking-[0.14em] text-ink-400 uppercase">
              Or visit
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
              {suggestions.map((to) => (
                <li key={to}>
                  <LinkArrow to={to}>{resolveRoute(to)?.title ?? to}</LinkArrow>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  )
}
