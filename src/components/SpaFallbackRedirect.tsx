import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'cst:redirect'

function takeRedirect(): string | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    sessionStorage.removeItem(STORAGE_KEY)
    // Only follow same-site, non-protocol-relative paths.
    if (!stored.startsWith('/') || stored.startsWith('//')) return null
    return stored
  } catch {
    return null
  }
}

/**
 * GitHub Pages serves public/404.html for unknown paths. That file stashes the
 * requested URL in sessionStorage and reloads the root, where this component
 * hands the URL back to the router exactly once per page load.
 */
export function SpaFallbackRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const target = takeRedirect()
    if (target && target !== location.pathname) {
      navigate(target, { replace: true })
    }
  }, [navigate, location.pathname])

  return null
}
