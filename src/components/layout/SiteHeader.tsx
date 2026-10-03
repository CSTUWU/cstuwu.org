import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { paths, type RouteHref } from '../../content/paths'
import { BrandLockup } from './BrandLockup'

/** Distance scrolled before the header picks up a bottom rule. */
const SCROLL_THRESHOLD = 8

const NAV_ITEMS: { to: RouteHref; label: string }[] = [
  { to: paths.about, label: 'About' },
  { to: paths.academics, label: 'Academics' },
  { to: paths.projects, label: 'Research' },
  { to: paths.announcements, label: 'News' },
  { to: paths.studentLife, label: 'People' },
]

/**
 * Underline that grows from the left on hover, and stays put when active.
 * Applied to both nav variants so the two never drift apart.
 */
const navLinkBase = [
  'relative inline-block px-4 py-2',
  'text-xs font-medium tracking-[0.08em] uppercase no-underline',
  'transition-colors duration-200 ease-out',
  'after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-accent',
  'after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:ease-out',
  'hover:after:scale-x-100',
].join(' ')

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    navLinkBase,
    isActive
      ? 'font-semibold text-accent after:scale-x-100'
      : 'text-ink-500 hover:text-accent',
  ].join(' ')

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center justify-between border-b border-line-subtle py-4 text-md font-medium',
    'tracking-[-0.01em] no-underline',
    "after:text-sm after:text-ink-300 after:content-['→']",
    'after:transition-transform after:duration-200 after:ease-out hover:after:translate-x-1',
    isActive ? 'text-accent' : 'text-ink-900',
  ].join(' ')

export function SiteHeader() {
  const { pathname } = useLocation()

  /* The menu is open only for the route it was opened on. Navigating anywhere
     else — link, browser back, programmatic — therefore closes it without an
     effect to synchronise state on every route change. */
  const [menuOpenedFor, setMenuOpenedFor] = useState<string | null>(null)
  const menuOpen = menuOpenedFor === pathname

  const [scrolled, setScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-transparent bg-paper/92 backdrop-blur-lg transition-colors duration-200 ease-out ${
        scrolled ? 'border-line' : ''
      }`}
    >
      <div className="container flex min-h-15 items-center gap-8">
        <BrandLockup size={32} />

        <nav className="max-lg:hidden" aria-label="Primary">
          <ul className="flex items-center">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 hidden max-lg:block cursor-pointer border-0 bg-none p-2"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpenedFor(menuOpen ? null : pathname)}
        >
          <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span
            data-state={menuOpen ? 'open' : 'closed'}
            className="group grid w-5 gap-[5px] [&>span]:block [&>span]:h-[1.5px] [&>span]:bg-ink-900 [&>span]:transition-[transform,opacity] [&>span]:duration-200 [&>span]:ease-out"
            aria-hidden="true"
          >
            <span className="group-data-[state=open]:translate-y-[6.5px] group-data-[state=open]:rotate-45" />
            <span className="group-data-[state=open]:opacity-0" />
            <span className="group-data-[state=open]:translate-y-[-6.5px] group-data-[state=open]:-rotate-45" />
          </span>
        </button>
      </div>

      {/* Visibility is driven by the `hidden` attribute; a `max-lg:hidden` class
          here would hide the menu on exactly the screens it exists for. */}
      <div id="mobile-nav" hidden={!menuOpen} className="border-t border-line bg-paper">
        <ul className="container grid py-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={mobileLinkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
