import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routerBasename } from './lib/router'
import { SiteHeader } from './components/layout/SiteHeader'
import { SiteFooter } from './components/layout/SiteFooter'
import { ScrollToTop } from './components/ScrollToTop'
import { InvertCursor } from './components/InvertCursor'
import { SpaFallbackRedirect } from './components/SpaFallbackRedirect'
import { SampleNotice } from './components/SampleNotice'
import { Home } from './pages/Home'
import { SectionPlaceholder } from './pages/SectionPlaceholder'

export function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <ScrollToTop />
      <SpaFallbackRedirect />
      <SampleNotice />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<SectionPlaceholder />} />
        </Routes>
      </main>
      <SiteFooter />
      <InvertCursor />
    </BrowserRouter>
  )
}
